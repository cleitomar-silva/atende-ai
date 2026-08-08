<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Auditor;
use App\Http\Controllers\Controller;
use App\Models\Sector;
use App\Models\Ticket;
use Illuminate\Http\Request;

class SectorController extends Controller
{
    private function list(Request $request)
    {
        return Sector::where('company_id', $request->user()->company_id)
            ->orderBy('name');
    }

    public function index(Request $request)
    {
        $sectors = $this->list($request)->get();

        return response()->json(['sectors' => $sectors]);
    }

    public function store(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $exists = Sector::where('company_id', $request->user()->company_id)
            ->where('name', $request->name)->exists();

        if ($exists) {
            return response()->json(['message' => 'Já existe um setor com este nome nesta empresa.'], 422);
        }

        $sector = Sector::create([
            'company_id' => $request->user()->company_id,
            'name' => $request->name,
            'is_active' => true,
        ]);

        Auditor::record('Sector', 'create', $sector->id, "Setor \"{$sector->name}\" criado.", null, $sector->toArray());

        return response()->json(['sector' => $sector], 201);
    }

    public function update(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $sector = $this->list($request)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $exists = Sector::where('company_id', $request->user()->company_id)
            ->where('name', $request->name)->where('id', '!=', $sector->id)->exists();

        if ($exists) {
            return response()->json(['message' => 'Já existe um setor com este nome nesta empresa.'], 422);
        }

        $before = $sector->only(['name', 'is_active']);
        $sector->name = $request->name;
        $sector->is_active = $request->boolean('is_active', $sector->is_active);
        $sector->save();
        $after = $sector->only(['name', 'is_active']);

        Auditor::record('Sector', 'update', $sector->id, "Setor \"{$sector->name}\" atualizado.", $before, $after);

        return response()->json(['sector' => $sector]);
    }

    public function destroy(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $sector = $this->list($request)->findOrFail($id);

        if ($sector->users()->exists() || $sector->classifications()->exists()) {
            return response()->json(['message' => 'Este setor está vinculado a usuários ou classificações e não pode ser excluído.'], 422);
        }

        if (Ticket::where('requesting_sector_id', $sector->id)->exists()
            || Ticket::where('responsible_sector_id', $sector->id)->exists()) {
            return response()->json(['message' => 'Este setor possui chamados vinculados e não pode ser excluído.'], 422);
        }

        $sector->delete();

        Auditor::record('Sector', 'delete', $sector->id, "Setor \"{$sector->name}\" excluído.", $sector->toArray(), null);

        return response()->json(['message' => 'Setor excluído.']);
    }
}