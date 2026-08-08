<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Auditor;
use App\Http\Controllers\Controller;
use App\Models\Situation;
use App\Models\SituationTransition;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SituationController extends Controller
{
    public function index(Request $request)
    {
        $situations = Situation::with('transitions.toSituation')
            ->where('company_id', $request->user()->company_id)
            ->orderBy('name')
            ->get();

        return response()->json(['situations' => $situations]);
    }

    public function store(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:9',
            'counts_sla' => 'boolean',
        ]);

        if (Situation::where('company_id', $request->user()->company_id)->where('name', $request->name)->exists()) {
            return response()->json(['message' => 'Já existe uma situação com este nome.'], 422);
        }

        $situation = Situation::create([
            'company_id' => $request->user()->company_id,
            'name' => $request->name,
            'color' => $request->color,
            'counts_sla' => $request->boolean('counts_sla', true),
            'is_active' => true,
        ]);

        $this->syncTransitions($request, $situation);

        Auditor::record('Situation', 'create', $situation->id, "Situação \"{$situation->name}\" criada.", null, $situation->fresh(['transitions.toSituation'])->toArray());

        return response()->json(['situation' => $situation->load('transitions.toSituation')], 201);
    }

    public function update(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $situation = Situation::where('company_id', $request->user()->company_id)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:9',
            'counts_sla' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if (Situation::where('company_id', $request->user()->company_id)->where('name', $request->name)->where('id', '!=', $situation->id)->exists()) {
            return response()->json(['message' => 'Já existe uma situação com este nome.'], 422);
        }

        $before = $situation->load('transitions.toSituation')->only(['name', 'color', 'counts_sla', 'is_active', 'transitions']);
        $situation->name = $request->name;
        $situation->color = $request->color;
        $situation->counts_sla = $request->boolean('counts_sla', $situation->counts_sla);
        $situation->is_active = $request->boolean('is_active', $situation->is_active);
        $situation->save();

        $this->syncTransitions($request, $situation);

        $after = $situation->load('transitions.toSituation')->only(['name', 'color', 'counts_sla', 'is_active', 'transitions']);

        Auditor::record('Situation', 'update', $situation->id, "Situação \"{$situation->name}\" atualizada.", $before, $after);

        return response()->json(['situation' => $situation->load('transitions.toSituation')]);
    }

    public function destroy(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $situation = Situation::where('company_id', $request->user()->company_id)->findOrFail($id);

        if (Ticket::where('situation_id', $situation->id)->exists()) {
            return response()->json(['message' => 'Esta situação possui chamados vinculados e não pode ser excluída.'], 422);
        }

        Auditor::record('Situation', 'delete', $situation->id, "Situação \"{$situation->name}\" excluída.", $situation->toArray(), null);
        $situation->delete();

        return response()->json(['message' => 'Situação excluída.']);
    }

    private function syncTransitions(Request $request, Situation $situation): void
    {
        if (! $request->has('transitions')) {
            return;
        }

        $validIds = Situation::where('company_id', $situation->company_id)
            ->where('id', '!=', $situation->id)
            ->pluck('id')
            ->all();

        $incoming = $request->input('transitions', []);

        $normalized = [];
        foreach (is_array($incoming) ? $incoming : [] as $item) {
            $toId = (int) ($item['to_situation_id'] ?? 0);
            $roles = $item['roles'] ?? [];

            if (! in_array($toId, $validIds, true)) {
                throw ValidationException::withMessages(['transitions' => ['Destino de transição inválido.']]);
            }

            $roles = array_values(array_intersect(SituationTransition::ROLES, (array) $roles));

            if (empty($roles) || array_key_exists($toId, $normalized)) {
                throw ValidationException::withMessages(['transitions' => ['Cada transição precisa de ao menos um perfil com acesso e destino único.']]);
            }

            $normalized[$toId] = $roles;
        }

        $situation->transitions()->delete();

        foreach ($normalized as $toId => $roles) {
            SituationTransition::create([
                'company_id' => $situation->company_id,
                'from_situation_id' => $situation->id,
                'to_situation_id' => $toId,
                'roles' => $roles,
            ]);
        }
    }
}