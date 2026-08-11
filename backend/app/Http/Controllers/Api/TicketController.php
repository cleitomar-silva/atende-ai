<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Auditor;
use App\Http\Controllers\Controller;
use App\Models\Audit;
use App\Models\Classification;
use App\Models\Situation;
use App\Models\SituationTransition;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Models\TicketComment;
use App\Models\TicketLink;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class TicketController extends Controller
{
    private const MAX_ATTACHMENTS_BYTES = 15728640; // 15 MB por comentário/upload

    public function index(Request $request)
    {
        $companyId = $request->user()->company_id;
        $user = $request->user();

        $query = Ticket::with([
            'classification.group', 'classification.category',
            'responsibleSector', 'responsibleUser', 'requestingSector', 'requestingUser', 'situation',
        ])->where('company_id', $companyId);

        if (! $user->isAdmin() && ! $request->boolean('linkable')) {
            $sectorIds = $user->sectors()->pluck('sectors.id');

            $query->where(function ($q) use ($user, $sectorIds, $request) {
                $q->whereIn('responsible_sector_id', $sectorIds);

                if ($request->filled('mine')) {
                    $q->orWhere('responsible_user_id', $user->id)
                      ->orWhere('requesting_user_id', $user->id);
                }
            });
        } elseif ($request->filled('mine')) {
            $query->where(function ($q) use ($user) {
                $q->where('responsible_user_id', $user->id)
                  ->orWhere('requesting_user_id', $user->id);
            });
        }

        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('number', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('comments', fn ($c) => $c->where('content', 'like', "%{$search}%"));
            });
        }

        foreach (['requesting_sector_id', 'requesting_user_id', 'responsible_sector_id', 'responsible_user_id', 'classification_id', 'situation_id'] as $f) {
            if ($request->filled($f)) {
                $query->where($f, $request->{$f});
            }
        }

        if ($request->filled('opened_from')) {
            $query->where('created_at', '>=', $request->opened_from . ' 00:00:00');
        }
        if ($request->filled('opened_to')) {
            $query->where('created_at', '<=', $request->opened_to . ' 23:59:59');
        }
        if ($request->filled('commented_from')) {
            $query->whereHas('comments', fn ($c) => $c->where('created_at', '>=', $request->commented_from . ' 00:00:00'));
        }
        if ($request->filled('commented_to')) {
            $query->whereHas('comments', fn ($c) => $c->where('created_at', '<=', $request->commented_to . ' 23:59:59'));
        }
        if ($request->filled('group_id')) {
            $query->whereHas('classification', fn ($c) => $c->where('group_id', $request->group_id));
        }
        if ($request->filled('category_id')) {
            $query->whereHas('classification', fn ($c) => $c->where('category_id', $request->category_id));
        }

        $tickets = $query->orderByDesc('created_at')->paginate($request->integer('per_page', 15));

        if ($request->filled('mine')) {
            $tickets->getCollection()->each(function ($ticket) use ($user) {
                $role = 'solicitante';
                if ($ticket->responsible_user_id === $user->id) {
                    $role = 'responsável';
                }
                $ticket->setAttribute('my_role', $role);
            });
        }

        return response()->json(['tickets' => $tickets]);
    }

    public function show(Request $request, int $id)
    {
        $user = $request->user();
        $ticket = $this->ticket($request, $id);

        $ticket->load([
            'classification.group', 'classification.category', 'classification.sectors',
            'responsibleSector', 'responsibleUser.sectors', 'requestingSector',
            'requestingUser.sectors', 'situation',
            'comments.user.sectors', 'comments.attachments', 'attachments.user',
        ]);

        $ticket->setRelation('comments', $this->visibleComments($ticket, $user));

        $allowedIds = $this->allowedTransitionIds($ticket, $user);

        $available = Situation::where('company_id', $user->company_id)
            ->whereIn('id', $allowedIds)
            ->orderBy('name')->get();

        $history = Audit::where('entity', 'Ticket')
            ->where('entity_id', $ticket->id)
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Audit $a) => [
                'id' => $a->id,
                'action' => $a->action,
                'summary' => $a->summary,
                'before' => $a->before,
                'after' => $a->after,
                'user' => $a->user ? ['id' => $a->user->id, 'name' => $a->user->name] : null,
                'created_at' => $a->created_at,
            ]);

        $linkedTickets = $this->linkedTickets($request, $ticket);

        return response()->json([
            'ticket' => $ticket,
            'available_situations' => $available,
            'history' => $history,
            'linked_tickets' => $linkedTickets,
            'sla' => $this->slaInfo($ticket),
        ]);
    }

    public function linkTicket(Request $request, int $id)
    {
        $user = $request->user();
        $ticket = $this->ticket($request, $id);

        $request->validate([
            'linked_ticket_id' => 'required|integer',
        ]);

        $targetId = (int) $request->linked_ticket_id;

        if ($targetId === $ticket->id) {
            return response()->json(['message' => 'Não é possível vincular um chamado a si mesmo.'], 422);
        }

        $target = Ticket::where('company_id', $user->company_id)->find($targetId);

        if (! $target) {
            return response()->json(['message' => 'Chamado não encontrado.'], 422);
        }

        $already = TicketLink::where(function ($q) use ($ticket, $targetId) {
            $q->where('ticket_id', $ticket->id)->where('linked_ticket_id', $targetId)
              ->orWhere('ticket_id', $targetId)->where('linked_ticket_id', $ticket->id);
        })->first();

        if (! $already) {
            TicketLink::create([
                'ticket_id' => $ticket->id,
                'linked_ticket_id' => $targetId,
                'user_id' => $user->id,
            ]);

            Auditor::record('Ticket', 'link', $ticket->id, "Chamado #{$ticket->number} vinculado ao chamado #{$target->number}.", null, ['linked_ticket_id' => $targetId]);
        }

        return response()->json(['linked_tickets' => $this->linkedTickets($request, $ticket)]);
    }

    public function destroyLink(Request $request, int $id, int $linkedId)
    {
        $ticket = $this->ticket($request, $id);

        $link = TicketLink::where(function ($q) use ($ticket, $linkedId) {
            $q->where('ticket_id', $ticket->id)->where('linked_ticket_id', $linkedId)
              ->orWhere('ticket_id', $linkedId)->where('linked_ticket_id', $ticket->id);
        })->first();

        if (! $link) {
            return response()->json(['message' => 'Vínculo não encontrado.'], 404);
        }

        $linked = Ticket::find($link->ticket_id === $ticket->id ? $link->linked_ticket_id : $link->ticket_id);

        $link->delete();

        Auditor::record('Ticket', 'link_remove', $ticket->id, "Vínculo com o chamado #{$linked?->number} removido.", null);

        return response()->json(['linked_tickets' => $this->linkedTickets($request, $ticket)]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'classification_id' => 'required|integer',
            'responsible_sector_id' => 'required|integer',
            'requesting_sector_id' => 'nullable|integer',
            'responsible_user_id' => 'nullable|integer',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $classification = Classification::with('group', 'category')
            ->where('company_id', $user->company_id)
            ->findOrFail($request->classification_id);

        $requestingSectorId = $this->resolveRequestingSector($user, $request);

        if ($request->filled('responsible_user_id')) {
            $responsibleUser = User::where('company_id', $user->company_id)
                ->where('id', $request->responsible_user_id)->first();
            if ($responsibleUser) {
                // Validação: usuário precisa pertencer ao setor responsável
                if (! $responsibleUser->sectors()->where('sectors.id', $request->responsible_sector_id)->exists()
                    && ! $user->isAdmin()) {
                    return response()->json(['message' => 'O usuário responsável deve pertencer ao setor demandado.'], 422);
                }
            } else {
                return response()->json(['message' => 'Usuário responsável não encontrado.'], 422);
            }
        }

        $situacaoInicial = Situation::where('company_id', $user->company_id)
            ->where('name', 'Não iniciado')->first()
            ?? Situation::where('company_id', $user->company_id)->first();

        if (! $situacaoInicial) {
            return response()->json(['message' => 'Cadastre ao menos uma situação antes de abrir chamados.'], 422);
        }

        return DB::transaction(function () use ($request, $user, $classification, $requestingSectorId, $situacaoInicial) {
            $now = now();
            $prefix = (int) $now->format('Ym') * 10000;
            $lastOfMonth = DB::table('tickets')
                ->where('company_id', $user->company_id)
                ->whereBetween('created_at', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])
                ->max('number');

            $nextNumber = ($lastOfMonth !== null && $lastOfMonth >= $prefix && $lastOfMonth < $prefix + 10000)
                ? $lastOfMonth + 1
                : $prefix + 1;

            $ticket = Ticket::create([
                'company_id' => $user->company_id,
                'number' => $nextNumber,
                'classification_id' => $classification->id,
                'requesting_sector_id' => $requestingSectorId,
                'requesting_user_id' => $user->id,
                'responsible_sector_id' => $request->responsible_sector_id,
                'responsible_user_id' => $request->input('responsible_user_id'),
                'situation_id' => $situacaoInicial->id,
                'title' => $request->title,
                'description' => $request->description,
            ]);

            $this->attachUploads($ticket, $user, $request);

            DB::table('ticket_situation_history')->insert([
                'ticket_id' => $ticket->id,
                'situation_id' => $situacaoInicial->id,
                'user_id' => $user->id,
            ]);

            Auditor::record('Ticket', 'create', $ticket->id, "Chamado #{$ticket->number} aberto.", null, $ticket->toArray());

            return response()->json(['ticket' => $ticket->load('classification', 'situation')], 201);
        });
    }

    public function update(Request $request, int $id)
    {
        $user = $request->user();
        $ticket = $this->ticket($request, $id);

        $request->validate([
            'classification_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'responsible_user_id' => 'nullable|integer',
            'keep_existing_attachments' => 'boolean',
        ]);

        Classification::where('company_id', $user->company_id)->findOrFail($request->classification_id);

        if ($request->filled('responsible_user_id')) {
            $responsibleUser = User::where('company_id', $user->company_id)
                ->where('id', $request->responsible_user_id)->first();

            if (! $responsibleUser) {
                return response()->json(['message' => 'Usuário responsável não encontrado.'], 422);
            }

            if (! $responsibleUser->sectors()->where('sectors.id', $ticket->responsible_sector_id)->exists()
                && ! $user->isAdmin()) {
                return response()->json(['message' => 'O usuário responsável deve pertencer ao setor demandado.'], 422);
            }
        }

        $before = $this->snapshotTicket($ticket);
        $ticket->classification_id = $request->classification_id;
        $ticket->title = $request->title;
        $ticket->description = $request->description;
        $ticket->responsible_user_id = $request->input('responsible_user_id', $ticket->responsible_user_id);
        $ticket->save();

        if (! $request->boolean('keep_existing_attachments')) {
            foreach ($ticket->attachments as $att) {
                if ($att->ticket_comment_id) {
                    continue;
                }
                Storage::disk('public')->delete($att->path);
                $att->delete();
            }
        }

        $this->attachUploads($ticket, $user, $request);

        $changes = $this->describeChanges($before, $this->snapshotTicket($ticket->fresh()));

        $summary = empty($changes)
            ? "Chamado #{$ticket->number} atualizado."
            : "Chamado #{$ticket->number} atualizado: ".implode(', ', $changes).'.';

        Auditor::record('Ticket', 'update', $ticket->id, $summary, $before, $this->snapshotTicket($ticket->fresh()));

        $this->notifyRequester($ticket, "O chamado #{$ticket->number} foi atualizado.");

        $newResponsible = $request->filled('responsible_user_id') ? $ticket->fresh()->responsibleUser : null;
        if ($newResponsible && $newResponsible->id !== $before['responsible_user_id']) {
            $newResponsible->notify(new \App\Notifications\TicketNotification("Você foi atribuído como responsável pelo chamado #{$ticket->number}.", $ticket->id, $ticket->number));
        }

        return response()->json(['ticket' => $ticket->load('classification', 'situation', 'attachments')]);
    }

    public function destroy(Request $request, int $id)
    {
        $ticket = $this->ticket($request, $id);

        foreach ($ticket->attachments as $att) {
            Storage::disk('public')->delete($att->path);
            $att->delete();
        }

        Auditor::record('Ticket', 'delete', $ticket->id, "Chamado #{$ticket->number} excluído.", $ticket->toArray(), null);
        $ticket->comments()->delete();
        $ticket->delete();

        return response()->json(['message' => 'Chamado excluído.']);
    }

    public function addComment(Request $request, int $id)
    {
        $user = $request->user();
        $ticket = $this->ticket($request, $id);

        if (! $ticket->situation?->permitir_comentario) {
            return response()->json(['message' => "A situação \"{$ticket->situation?->name}\" não permite comentários."], 422);
        }

        $request->validate([
            'content' => 'nullable|string',
            'is_internal' => 'boolean',
        ]);

        $comment = TicketComment::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'content' => $request->input('content', ''),
            'is_internal' => $request->boolean('is_internal', false),
        ]);

        $this->attachUploads($ticket, $user, $request, $comment);

        Auditor::record('Ticket', 'comment', $ticket->id, "Comentário em chamado #{$ticket->number}.", null, ['comment_id' => $comment->id]);

        if (! $comment->is_internal) {
            $this->notifyRequester($ticket, $this->commentNotificationText($ticket, $request));
        }

        return response()->json(['comment' => $comment->load('user', 'attachments')], 201);
    }

    public function changeSituation(Request $request, int $id)
    {
        $user = $request->user();
        $ticket = $this->ticket($request, $id);

        $request->validate([
            'situation_id' => 'required|integer',
        ]);

        $newSituation = Situation::where('company_id', $user->company_id)
            ->findOrFail($request->situation_id);

        $current = $ticket->situation;

        $isRequester = $ticket->requesting_user_id === $user->id;
        $isResponsible = $ticket->responsible_user_id === $user->id;
        $isAdmin = $user->isAdmin();
        $isSectorMember = $ticket->responsibleSector->users()->where('users.id', $user->id)->exists();

        $transition = SituationTransition::where('company_id', $user->company_id)
            ->where('from_situation_id', $current->id)
            ->where('to_situation_id', $newSituation->id)
            ->first();

        if (! $transition) {
            return response()->json(['message' => "A transição de \"{$current->name}\" para \"{$newSituation->name}\" não está configurada."], 422);
        }

        $roles = $transition->roles ?? [];

        $can = in_array(SituationTransition::ROLE_ADMIN, $roles, true) && $isAdmin
            || in_array(SituationTransition::ROLE_RESPONSIBLE, $roles, true) && $isResponsible
            || in_array(SituationTransition::ROLE_SECTOR, $roles, true) && $isSectorMember
            || in_array(SituationTransition::ROLE_REQUESTER, $roles, true) && $isRequester;

        if (! $can) {
            return response()->json(['message' => 'Você não tem permissão para realizar esta transição de situação.'], 403);
        }

        $before = ['situation_id' => $ticket->situation_id];

        $ticket->situation_id = $newSituation->id;
        $slaInfo = null;
        if ($newSituation->name === 'Concluído') {
            $ticket->closed_at = now();

            $slaMinutes = $ticket->classification?->sla_minutes;
            if ($slaMinutes) {
                $usedMinutes = $this->slaUsedMinutes($ticket);
                $slaInfo = [
                    'used_minutes' => $usedMinutes,
                    'limit_minutes' => (int) $slaMinutes,
                    'delivered' => $usedMinutes <= (int) $slaMinutes,
                    'message' => $this->formatSlaMessage($usedMinutes, (int) $slaMinutes),
                ];
            }
        }
        $ticket->save();

        DB::table('ticket_situation_history')->insert([
            'ticket_id' => $ticket->id,
            'situation_id' => $newSituation->id,
            'user_id' => $user->id,
        ]);

        $situationSummary = "Situação alterada: \"{$current->name}\" → \"{$newSituation->name}\".";
        if ($slaInfo) {
            $situationSummary .= ' '.$slaInfo['message'];
        }

        Auditor::record('Ticket', 'situation', $ticket->id, $situationSummary, $before, $slaInfo ? ['situation_id' => $newSituation->id, 'sla' => $slaInfo] : ['situation_id' => $newSituation->id]);

        $notification = "A situação do chamado #{$ticket->number} mudou para \"{$newSituation->name}\".";
        if ($slaInfo) {
            $notification .= ' '.$slaInfo['message'];
        }
        $this->notifyRequester($ticket, $notification);

        return response()->json(['ticket' => $ticket->load('situation'), 'sla' => $slaInfo]);
    }

    public function downloadAttachment(Request $request, int $id, int $attachmentId)
    {
        $ticket = $this->ticket($request, $id);
        $attachment = $ticket->attachments()->findOrFail($attachmentId);

        return Storage::disk('public')->download($attachment->path, $attachment->original_name);
    }

    public function destroyAttachment(Request $request, int $id, int $attachmentId)
    {
        $ticket = $this->ticket($request, $id);
        $attachment = $ticket->attachments()->findOrFail($attachmentId);

        Storage::disk('public')->delete($attachment->path);
        $attachment->delete();

        Auditor::record('Ticket', 'unlink', $ticket->id, "Anexo \"{$attachment->original_name}\" removido.", ['attachment_id' => $attachmentId], null);

        return response()->json(['message' => 'Anexo excluído.']);
    }

    private function ticket(Request $request, int $id): Ticket
    {
        return Ticket::where('company_id', $request->user()->company_id)->findOrFail($id);
    }

    private function visibleComments(Ticket $ticket, User $user): \Illuminate\Support\Collection
    {
        $userSectorIds = $user->sectors()->pluck('sectors.id');

        return $ticket->comments->filter(function (TicketComment $comment) use ($userSectorIds) {
            if (! $comment->is_internal) {
                return true;
            }

            $authorSectorIds = $comment->user?->sectors?->pluck('id') ?? collect();

            return $userSectorIds->intersect($authorSectorIds)->isNotEmpty();
        })->values();
    }

    private function linkedTickets(Request $request, Ticket $ticket): \Illuminate\Support\Collection
    {
        $links = TicketLink::where('ticket_id', $ticket->id)
            ->orWhere('linked_ticket_id', $ticket->id)
            ->with('user:id,name')
            ->get();

        $ids = $links
            ->map(fn ($l) => $l->ticket_id === $ticket->id ? $l->linked_ticket_id : $l->ticket_id)
            ->filter(fn ($id) => $id !== $ticket->id)
            ->unique()
            ->values();

        $tickets = Ticket::where('company_id', $request->user()->company_id)
            ->whereIn('id', $ids)
            ->with('situation', 'classification')
            ->orderBy('number')
            ->get();

        return $tickets->map(function (Ticket $t) use ($links, $ticket) {
            $link = $links->first(function ($l) use ($t, $ticket) {
                return ($l->ticket_id === $ticket->id && $l->linked_ticket_id === $t->id)
                    || ($l->ticket_id === $t->id && $l->linked_ticket_id === $ticket->id);
            });

            $t->linked_at = $link?->created_at;
            $t->linked_by = $link && $link->user ? ['id' => $link->user->id, 'name' => $link->user->name] : null;

            return $t;
        });
    }

    private function allowedTransitionIds(Ticket $ticket, User $user): array
    {
        $isRequester = $ticket->requesting_user_id === $user->id;
        $isResponsible = $ticket->responsible_user_id === $user->id;
        $isAdmin = $user->isAdmin();
        $isSectorMember = $ticket->responsibleSector->users()->where('users.id', $user->id)->exists();

        return SituationTransition::where('company_id', $user->company_id)
            ->where('from_situation_id', $ticket->situation_id)
            ->get()
            ->filter(function (SituationTransition $transition) use ($isRequester, $isResponsible, $isAdmin, $isSectorMember) {
                $roles = $transition->roles ?? [];

                return in_array(SituationTransition::ROLE_ADMIN, $roles, true) && $isAdmin
                    || in_array(SituationTransition::ROLE_RESPONSIBLE, $roles, true) && $isResponsible
                    || in_array(SituationTransition::ROLE_SECTOR, $roles, true) && $isSectorMember
                    || in_array(SituationTransition::ROLE_REQUESTER, $roles, true) && $isRequester;
            })
            ->pluck('to_situation_id')
            ->unique()
            ->values()
            ->all();
    }

    private function resolveRequestingSector(User $user, Request $request): int
    {
        if ($request->filled('requesting_sector_id')) {
            return $request->requesting_sector_id;
        }

        $sectors = $user->sectors()->pluck('sectors.id');

        if ($sectors->count() === 1) {
            return $sectors->first();
        }

        if ($sectors->count() > 1) {
            throw ValidationException::withMessages(['setor solicitante é obrigatório, pois você pertence a mais de um setor.']);
        }

        return $request->responsible_sector_id;
    }

    private function attachUploads(Ticket $ticket, User $user, Request $request, ?TicketComment $comment = null): void
    {
        if (! $request->hasFile('attachments')) {
            return;
        }

        $files = $request->file('attachments');

        if (! is_array($files)) {
            $files = [$files];
        }

        $existingTotal = $comment
            ? $comment->attachments()->sum('size')
            : $ticket->attachments()->whereNull('ticket_comment_id')->sum('size');
        $incomingTotal = array_sum(array_map(fn ($f) => $f->getSize(), $files));

        if ($existingTotal + $incomingTotal > self::MAX_ATTACHMENTS_BYTES) {
            throw ValidationException::withMessages([
                'attachments' => ['O total de anexos não pode ultrapassar 15 MB.'],
            ]);
        }

        foreach ($files as $file) {
            if (! $file->isValid()) {
                throw ValidationException::withMessages([
                    'attachments' => ['O arquivo "'.$file->getClientOriginalName().'" não pôde ser recebido. Verifique o tamanho ou o formato do arquivo.'],
                ]);
            }

            $path = $file->store('tickets/'.$ticket->id, 'public');
            $att = TicketAttachment::create([
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'ticket_comment_id' => $comment?->id,
                'original_name' => $file->getClientOriginalName(),
                'path' => $path,
                'mime' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);

            Auditor::record('Ticket', 'attach', $ticket->id, "Anexo \"{$att->original_name}\" adicionado.", null, ['attachment_id' => $att->id]);
        }
    }

    private function snapshotTicket(Ticket $ticket): array
    {
        return [
            'classification_id' => $ticket->classification_id,
            'classification_name' => $ticket->classification?->name,
            'title' => $ticket->title,
            'description' => $ticket->description,
            'responsible_user_id' => $ticket->responsible_user_id,
            'responsible_user_name' => $ticket->responsibleUser?->name,
        ];
    }

    private function describeChanges(array $before, array $after): array
    {
        $changes = [];

        if ($before['classification_id'] !== $after['classification_id']) {
            $changes[] = "classificação de \"{$before['classification_name']}\" para \"{$after['classification_name']}\"";
        }

        if ($before['title'] !== $after['title']) {
            $changes[] = 'título de "'.mb_strimwidth($before['title'], 0, 48, '…').'" para "'.mb_strimwidth($after['title'], 0, 48, '…').'"';
        }

        if ($before['description'] !== $after['description']) {
            $changes[] = 'descrição';
        }

        if ($before['responsible_user_id'] !== $after['responsible_user_id']) {
            $from = $before['responsible_user_name'] ?? 'não atribuído';
            $to = $after['responsible_user_name'] ?? 'não atribuído';
            $changes[] = "responsável de \"{$from}\" para \"{$to}\"";
        }

        return $changes;
    }

    private function slaUsedMinutes(Ticket $ticket, ?Carbon $until = null): int
    {
        $until = $until ?: now();

        $history = DB::table('ticket_situation_history')
            ->where('ticket_id', $ticket->id)
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        if ($history->isEmpty()) {
            return 0;
        }

        $countsMap = Situation::where('company_id', $ticket->company_id)
            ->pluck('counts_sla', 'id');

        $total = 0;

        foreach ($history as $i => $entry) {
            if (! ($countsMap[$entry->situation_id] ?? false)) {
                continue;
            }

            $start = Carbon::parse($entry->created_at);
            $end = isset($history[$i + 1]) ? Carbon::parse($history[$i + 1]->created_at) : $until;

            if ($end->greaterThan($until)) {
                $end = $until;
            }

            if ($end->greaterThan($start)) {
                $total += (int) round($start->diffInMinutes($end));
            }
        }

        return $total;
    }

    private function slaInfo(Ticket $ticket): ?array
    {
        $slaMinutes = $ticket->classification?->sla_minutes;

        if (! $slaMinutes) {
            return null;
        }

        $until = $ticket->closed_at ?: now();
        $usedMinutes = $this->slaUsedMinutes($ticket, $until);

        return [
            'limit_minutes' => (int) $slaMinutes,
            'used_minutes' => $usedMinutes,
            'delivered' => $usedMinutes <= (int) $slaMinutes,
        ];
    }

    private function formatSlaTime(int $minutes): string
    {
        if ($minutes >= 1440) {
            return intdiv($minutes, 1440).'d '.intdiv($minutes % 1440, 60).'h';
        }

        if ($minutes >= 60) {
            $hours = intdiv($minutes, 60);
            $rest = $minutes % 60;

            return $rest ? $hours.'h '.$rest.'min' : $hours.'h';
        }

        return $minutes.'min';
    }

    private function formatSlaMessage(int $usedMinutes, int $limitMinutes): string
    {
        $used = $this->formatSlaTime($usedMinutes);
        $limit = $this->formatSlaTime($limitMinutes);

        if ($usedMinutes <= $limitMinutes) {
            return "Atendimento concluído dentro do SLA. Tempo de SLA utilizado: {$used} (limite de {$limit}).";
        }

        $exceeded = $this->formatSlaTime($usedMinutes - $limitMinutes);

        return "Atendimento concluído fora do SLA. Tempo de SLA utilizado: {$used}, excedendo o limite de {$limit} em {$exceeded}.";
    }

    private function notifyRequester(Ticket $ticket, string $message): void
    {
        $requester = $ticket->requestingUser;

        if ($requester) {
            $requester->notify(new \App\Notifications\TicketNotification($message, $ticket->id, $ticket->number));
        }
    }

    private function commentNotificationText(Ticket $ticket, Request $request): string
    {
        $content = trim((string) $request->input('content'));
        $files = $request->file('attachments');
        if (! is_array($files)) {
            $files = $files ? [$files] : [];
        }
        $attachCount = count(array_filter($files));

        $text = $content !== ''
            ? 'Novo comentário no chamado #'.$ticket->number.': "'.mb_substr($content, 0, 80).'..."'
            : 'Novo comentário no chamado #'.$ticket->number.'.';

        if ($attachCount > 0) {
            $text .= ' ('.$attachCount.' anexo'.($attachCount > 1 ? 's' : '').')';
        }

        return $text;
    }
}