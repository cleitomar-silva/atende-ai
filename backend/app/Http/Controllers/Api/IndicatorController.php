<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Category;
use App\Models\Situation;
use App\Models\Ticket;
use Illuminate\Http\Request;

class IndicatorController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $companyId = $user->company_id;

        // Setores do usuário
        $userSectors = $user->sectors()->with('users')->get();
        $selectedSectors = $request->input('sector_id', []);
        $selectedSectors = is_array($selectedSectors) ? $selectedSectors : [$selectedSectors];
        $selectedSectors = array_filter(array_map('intval', $selectedSectors));
        $sectorIds = $selectedSectors ?: $userSectors->pluck('id');

        $query = Ticket::with('classification.group', 'classification.category', 'situation', 'responsibleSector', 'responsibleUser')
            ->where('company_id', $companyId)
            ->whereIn('responsible_sector_id', $sectorIds);

        if ($request->filled('month')) {
            $query->whereYear('created_at', $request->integer('year', now()->year))
                ->whereMonth('created_at', $request->integer('month'));
        } elseif ($request->filled('year')) {
            $query->whereYear('created_at', $request->integer('year'));
        }

        if ($request->filled('group_id')) {
            $query->whereHas('classification', fn ($c) => $c->where('group_id', $request->group_id));
        }
        if ($request->filled('category_id')) {
            $query->whereHas('classification', fn ($c) => $c->where('category_id', $request->category_id));
        }

        $tickets = $query->get();

        // Tabela 1: Grupo x Categoria
        $tabela1 = $this->buildCrossTable($tickets, 'classification.group.name', 'classification.category.name');

        // Tabela 2: Responsável x Categoria
        $tabela2 = $this->buildCrossTable($tickets, 'responsibleUser.name', 'classification.category.name');

        // Kanban por situação
        $situations = Situation::where('company_id', $companyId)->orderBy('name')->get();
        $kanban = $situations->map(function ($situation) use ($tickets) {
            return [
                'situation' => $situation,
                'tickets' => $tickets->where('situation_id', $situation->id)->values()->map(fn ($t) => [
                    'id' => $t->id,
                    'number' => $t->number,
                    'title' => $t->title,
                    'created_at' => $t->created_at,
                    'responsible_user' => $t->responsibleUser?->name,
                ]),
            ];
        })->values();

        return response()->json([
            'tabela1' => $tabela1,
            'tabela2' => $tabela2,
            'kanban' => $kanban,
            'total' => $tickets->count(),
            'filters' => [
                'relevant_sectors' => $userSectors,
                'months' => range(1, 12),
                'groups' => Group::where('company_id', $companyId)->orderBy('name')->get(),
                'categories' => Category::where('company_id', $companyId)->orderBy('name')->get(),
            ],
        ]);
    }

    private function buildCrossTable($tickets, $rowAccessor, $colAccessor): array
    {
        $rows = [];
        $cats = collect();

        foreach ($tickets as $ticket) {
            $row = data_get($ticket, $rowAccessor) ?? 'Sem informação';
            $col = data_get($ticket, $colAccessor) ?? 'Sem categoria';
            $cats->push($col);
            $rows[$row][$col] = ($rows[$row][$col] ?? 0) + 1;
        }

        $cats = $cats->unique()->values();

        $table = ['columns' => $cats->all(), 'rows' => []];
        $colTotals = array_fill_keys($cats->all(), 0);

        foreach ($rows as $rowName => $cols) {
            $line = ['name' => $rowName, 'counts' => []];
            $rowTotal = 0;
            foreach ($cats as $cat) {
                $value = $cols[$cat] ?? 0;
                $line['counts'][] = $value;
                $rowTotal += $value;
                $colTotals[$cat] += $value;
            }
            $line['total'] = $rowTotal;
            $table['rows'][] = $line;
        }

        $table['col_totals'] = array_values($colTotals);

        return $table;
    }
}