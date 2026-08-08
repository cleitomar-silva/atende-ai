<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Auditor;
use App\Http\Controllers\Controller;
use App\Models\Classification;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $groups = Group::where('company_id', $request->user()->company_id)->orderBy('name')->get();

        return response()->json(['groups' => $groups]);
    }

    public function store(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $request->validate(['name' => 'required|string|max:255']);

        if (Group::where('company_id', $request->user()->company_id)->where('name', $request->name)->exists()) {
            return response()->json(['message' => 'Já existe um grupo com este nome.'], 422);
        }

        $group = Group::create([
            'company_id' => $request->user()->company_id,
            'name' => $request->name,
            'is_active' => true,
        ]);

        Auditor::record('Group', 'create', $group->id, "Grupo \"{$group->name}\" criado.", null, $group->toArray());

        return response()->json(['group' => $group], 201);
    }

    public function update(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $group = Group::where('company_id', $request->user()->company_id)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        if (Group::where('company_id', $request->user()->company_id)->where('name', $request->name)->where('id', '!=', $group->id)->exists()) {
            return response()->json(['message' => 'Já existe um grupo com este nome.'], 422);
        }

        $before = $group->only(['name', 'is_active']);
        $group->name = $request->name;
        $group->is_active = $request->boolean('is_active', $group->is_active);
        $group->save();
        $after = $group->only(['name', 'is_active']);

        Auditor::record('Group', 'update', $group->id, "Grupo \"{$group->name}\" atualizado.", $before, $after);

        return response()->json(['group' => $group]);
    }

    public function destroy(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $group = Group::where('company_id', $request->user()->company_id)->findOrFail($id);

        if (Classification::where('group_id', $group->id)->exists()) {
            return response()->json(['message' => 'Este grupo possui classificações vinculadas e não pode ser excluído.'], 422);
        }

        Auditor::record('Group', 'delete', $group->id, "Grupo \"{$group->name}\" excluído.", $group->toArray(), null);
        $group->delete();

        return response()->json(['message' => 'Grupo excluído.']);
    }
}