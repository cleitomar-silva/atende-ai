<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Audit;
use App\Models\Ticket;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function overview(Request $request)
    {
        $user = $request->user();
        $companyId = $user->company_id;

        $query = Ticket::with('classification.group', 'classification.category', 'situation', 'responsibleSector')
            ->where('company_id', $companyId);

        // Relatório: setor responsável pertence ao usuário (ou todos os setores da empresa p/ admin)
        if (! $user->isAdmin()) {
            $sectorIds = $user->sectors()->pluck('sectors.id');
            $query->where('responsible_sector_id', '>', 0)->whereIn('responsible_sector_id', $sectorIds);
        }

        $this->applyFilters($request, $query);

        $tickets = $query->get();

        $bySituation = $tickets->groupBy(function ($t) {
            return $t->situation?->name ?? 'Sem situação';
        })->map->count();

        $byCategory = $tickets->groupBy(function ($t) {
            return $t->classification?->category?->name ?? 'Sem categoria';
        })->map->count();

        $byGroup = $tickets->groupBy(function ($t) {
            return $t->classification?->group?->name ?? 'Sem grupo';
        })->map->count();

        $total = $tickets->count();
        $open = $tickets->whereNull('closed_at')->count();
        $closed = $total - $open;

        return response()->json([
            'total' => $total,
            'open' => $open,
            'closed' => $closed,
            'overdue' => $this->overdueCount($tickets),
            'by_situation' => $bySituation,
            'by_category' => $byCategory,
            'by_group' => $byGroup,
            'tickets' => $this->serializeTickets($tickets),
        ]);
    }

    private function applyFilters(Request $request, $query)
    {
        if ($request->filled('opened_from')) {
            $query->where('created_at', '>=', $request->opened_from.' 00:00:00');
        }
        if ($request->filled('opened_to')) {
            $query->where('created_at', '<=', $request->opened_to.' 23:59:59');
        }
        if ($request->filled('commented_from')) {
            $query->whereHas('comments', fn ($c) => $c->where('created_at', '>=', $request->commented_from.' 00:00:00'));
        }
        if ($request->filled('commented_to')) {
            $query->whereHas('comments', fn ($c) => $c->where('created_at', '<=', $request->commented_to.' 23:59:59'));
        }
        if ($request->filled('sector_requester_id')) {
            $query->where('requesting_sector_id', $request->sector_requester_id);
        }
        if ($request->filled('situation_id')) {
            $query->where('situation_id', $request->situation_id);
        }
        if ($request->filled('category_id')) {
            $query->whereHas('classification', fn ($c) => $c->where('category_id', $request->category_id));
        }
        if ($request->filled('group_id')) {
            $query->whereHas('classification', fn ($c) => $c->where('group_id', $request->group_id));
        }
        if ($request->filled('responsible_sector_id') && $request->user()->isAdmin()) {
            $query->where('responsible_sector_id', $request->responsible_sector_id);
        }
    }

    private function overdueCount($tickets): int
    {
        $count = 0;
        foreach ($tickets as $t) {
            if (! $t->closed_at && $t->classification && $t->classification->sla_minutes > 0) {
                $deadline = $t->created_at->addMinutes($t->classification->sla_minutes);
                if ($deadline->lt(now())) {
                    $count++;
                }
            }
        }

        return $count;
    }

    private function serializeTickets($tickets): array
    {
        return $tickets->map(function ($t) {
            return [
                'id' => $t->id,
                'number' => $t->number,
                'title' => $t->title,
                'created_at' => $t->created_at,
                'status' => $t->situation?->name,
                'situation_color' => $t->situation?->color,
                'group' => $t->classification?->group?->name,
                'category' => $t->classification?->category?->name,
                'responsible_sector' => $t->responsibleSector?->name,
                'requesting_user' => $t->requestingUser?->name,
            ];
        })->values()->all();
    }
}