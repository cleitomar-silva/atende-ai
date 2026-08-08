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
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class TicketController extends Controller
{
    private const MAX_ATTACHMENTS_BYTES = 52428800; // 50 MB

    public function index(Request $request)
    {
        $companyId = $request->user()->company_id;
        $user = $request->user();

        $query = Ticket::with([
            'classification.group', 'classification.category',
            'responsibleSector', 'responsibleUser', 'requestingSector', 'requestingUser', 'situation',
        ])->where('company_id', $companyId);

        if (! $user->isAdmin()) {
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
            'comments.user', 'attachments.user',
        ]);

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

        return response()->json([
            'ticket' => $ticket,
            'available_situations' => $available,
            'history' => $history,
        ]);
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
            $nextNumber = DB::table('tickets')->where('company_id', $user->company_id)->max('number') + 1;

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

        $request->validate([
            'content' => 'required|string',
            'is_internal' => 'boolean',
        ]);

        $comment = TicketComment::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'content' => $request->content,
            'is_internal' => $request->boolean('is_internal', false),
        ]);

        Auditor::record('Ticket', 'comment', $ticket->id, "Comentário em chamado #{$ticket->number}.", null, ['comment_id' => $comment->id]);

        $this->notifyRequester($ticket, "Novo comentário no chamado #{$ticket->number}: \"".mb_substr($request->content, 0, 80).'..."');

        return response()->json(['comment' => $comment->load('user')], 201);
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
        if ($newSituation->name === 'Concluído') {
            $ticket->closed_at = now();
        }
        $ticket->save();

        DB::table('ticket_situation_history')->insert([
            'ticket_id' => $ticket->id,
            'situation_id' => $newSituation->id,
            'user_id' => $user->id,
        ]);

        Auditor::record('Ticket', 'situation', $ticket->id, "Situação alterada: \"{$current->name}\" → \"{$newSituation->name}\".", $before, ['situation_id' => $newSituation->id]);

        $this->notifyRequester($ticket, "A situação do chamado #{$ticket->number} mudou para \"{$newSituation->name}\".");

        return response()->json(['ticket' => $ticket->load('situation')]);
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

    private function attachUploads(Ticket $ticket, User $user, Request $request): void
    {
        if (! $request->hasFile('attachments')) {
            return;
        }

        $files = $request->file('attachments');

        if (! is_array($files)) {
            $files = [$files];
        }

        $existingTotal = $ticket->attachments()->sum('size');
        $incomingTotal = array_sum(array_map(fn ($f) => $f->getSize(), $files));

        if ($existingTotal + $incomingTotal > self::MAX_ATTACHMENTS_BYTES) {
            throw ValidationException::withMessages([
                'attachments' => ['O total de anexos não pode ultrapassar 50 MB.'],
            ]);
        }

        foreach ($files as $file) {
            $path = $file->store('tickets/'.$ticket->id, 'public');
            $att = TicketAttachment::create([
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
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

    private function notifyRequester(Ticket $ticket, string $message): void
    {
        $requester = $ticket->requestingUser;

        if ($requester) {
            $requester->notify(new \App\Notifications\TicketNotification($message, $ticket->id, $ticket->number));
        }
    }
}