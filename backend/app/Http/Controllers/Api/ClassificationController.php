<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Auditor;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Classification;
use App\Models\Group;
use App\Models\Ticket;
use Illuminate\Http\Request;

class ClassificationController extends Controller
{
    public function index(Request $request)
    {
        $classifications = Classification::where('company_id', $request->user()->company_id)
            ->with(['group', 'category', 'sectors'])
            ->orderBy('name')
            ->get();

        return response()->json(['classifications' => $classifications]);
    }

    private function validateData(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'group_id' => 'required|integer',
            'category_id' => 'required|integer',
            'sector_ids' => 'required|array|min:1',
            'sector_ids.*' => 'integer',
            'sla_minutes' => 'nullable|integer|min:0',
            'default_description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
    }

    public function store(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $this->validateData($request);
        $companyId = $request->user()->company_id;

        Group::where('company_id', $companyId)->where('id', $request->group_id)->firstOrFail();
        Category::where('company_id', $companyId)->where('id', $request->category_id)->firstOrFail();

        $sectors = $request->sector_ids;
        $exists = Classification::where('company_id', $companyId)
            ->where('name', $request->name)
            ->whereHas('sectors', fn ($q) => $q->whereIn('classification_sector.sector_id', $sectors), '=', count($sectors))
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Já existe uma classificação com este nome para estes setores.'], 422);
        }

        $classification = Classification::create([
            'company_id' => $companyId,
            'group_id' => $request->group_id,
            'category_id' => $request->category_id,
            'name' => $request->name,
            'sla_minutes' => $request->integer('sla_minutes', 0),
            'default_description' => $request->input('default_description'),
            'is_active' => true,
        ]);

        $classification->sectors()->sync($sectors);

        Auditor::record('Classification', 'create', $classification->id, "Classificação \"{$classification->name}\" criada.", null, $classification->toArray());

        return response()->json(['classification' => $classification->load('group', 'category', 'sectors')], 201);
    }

    public function update(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $classification = Classification::where('company_id', $request->user()->company_id)->findOrFail($id);

        $this->validateData($request);
        $companyId = $request->user()->company_id;

        $sectors = $request->sector_ids;
        $exists = Classification::where('company_id', $companyId)
            ->where('name', $request->name)
            ->where('id', '!=', $classification->id)
            ->whereHas('sectors', fn ($q) => $q->whereIn('classification_sector.sector_id', $sectors), '=', count($sectors))
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Já existe uma classificação com este nome para estes setores.'], 422);
        }

        $before = $classification->only(['name', 'group_id', 'category_id', 'sla_minutes', 'default_description', 'is_active']);
        $classification->group_id = $request->group_id;
        $classification->category_id = $request->category_id;
        $classification->name = $request->name;
        $classification->sla_minutes = $request->integer('sla_minutes', 0);
        $classification->default_description = $request->input('default_description');
        $classification->is_active = $request->boolean('is_active', $classification->is_active);
        $classification->save();
        $classification->sectors()->sync($sectors);
        $after = $classification->fresh()->only(['name', 'group_id', 'category_id', 'sla_minutes', 'default_description', 'is_active']);

        Auditor::record('Classification', 'update', $classification->id, "Classificação \"{$classification->name}\" atualizada.", $before, $after);

        return response()->json(['classification' => $classification->load('group', 'category', 'sectors')]);
    }

    public function destroy(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $classification = Classification::where('company_id', $request->user()->company_id)->findOrFail($id);

        if (Ticket::where('classification_id', $classification->id)->exists()) {
            return response()->json(['message' => 'Esta classificação possui chamados vinculados. Desative-a via edição.'], 422);
        }

        Auditor::record('Classification', 'delete', $classification->id, "Classificação \"{$classification->name}\" excluída.", $classification->toArray(), null);
        $classification->sectors()->detach();
        $classification->delete();

        return response()->json(['message' => 'Classificação excluída.']);
    }
}