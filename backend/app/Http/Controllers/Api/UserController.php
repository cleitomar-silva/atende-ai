<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Auditor;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Sector;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    private function list(Request $request)
    {
        return User::with('sectors')->where('company_id', $request->user()->company_id);
    }

    public function index(Request $request)
    {
        $query = $this->list($request);

        if ($request->filled('search')) {
            $query->where('name', 'ilike', "%{$request->search}%");
        }

        if ($request->filled('sector_id')) {
            $query->whereHas('sectors', fn ($q) => $q->where('sectors.id', $request->sector_id));
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->boolean('status'));
        }

        $users = $query->with('sectors')->orderBy('name')->get();

        return response()->json(['users' => $users]);
    }

    public function store(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
            'sector_ids' => 'required|array|min:1',
            'sector_ids.*' => 'integer',
            'role' => 'required|in:'.implode(',', [User::ROLE_ADMIN, User::ROLE_GESTOR, User::ROLE_COLABORADOR]),
        ]);

        if (User::where('company_id', $request->user()->company_id)->where('email', $request->email)->exists()) {
            return response()->json(['message' => 'Já existe um usuário com este e-mail nesta empresa.'], 422);
        }

        $sectors = Sector::where('company_id', $request->user()->company_id)
            ->whereIn('id', $request->sector_ids)->pluck('id');

        if (! $sectors->count()) {
            return response()->json(['message' => 'Selecione pelo menos um setor válido.'], 422);
        }

        $user = User::create([
            'company_id' => $request->user()->company_id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'is_active' => true,
        ]);

        $user->sectors()->sync($sectors);

        Auditor::record('User', 'create', $user->id, "Usuário \"{$user->name}\" criado.", null, $user->toArray());

        return response()->json(['user' => $user->load('sectors')], 201);
    }

    public function update(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $user = $this->list($request)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'nullable|string|min:6',
            'sector_ids' => 'required|array|min:1',
            'sector_ids.*' => 'integer',
            'role' => 'required|in:admin,gestor,colaborador',
            'is_active' => 'boolean',
        ]);

        $dup = User::where('company_id', $request->user()->company_id)
            ->where('email', $request->email)->where('id', '!=', $user->id)->exists();

        if ($dup) {
            return response()->json(['message' => 'E-mail já utilizado por outro usuário desta empresa.'], 422);
        }

        $sectors = Sector::where('company_id', $request->user()->company_id)
            ->whereIn('id', $request->sector_ids)->pluck('id');

        $before = $user->only(['name', 'email', 'role', 'is_active']);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->is_active = $request->boolean('is_active', $user->is_active);

        if ($request->filled('password')) {
            $user->password = $request->password;
        }

        $user->save();
        $user->sectors()->sync($sectors);
        $after = $user->fresh()->only(['name', 'email', 'role', 'is_active']);

        Auditor::record('User', 'update', $user->id, "Usuário \"{$user->name}\" atualizado.", $before, $after);

        return response()->json(['user' => $user->load('sectors')]);
    }

    public function destroy(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        if ($id === $request->user()->id) {
            return response()->json(['message' => 'Você não pode excluir o próprio usuário.'], 422);
        }

        $user = $this->list($request)->findOrFail($id);

        $hasTickets = User::where('id', $user->id)
            ->where(function ($q) {
                $q->whereHas('ticketsRequested')
                  ->orWhereHas('ticketsResponsible');
            })->exists();

        if ($hasTickets) {
            return response()->json(['message' => 'Este usuário possui chamados vinculados. Desative-o via edição.'], 422);
        }

        $user->sectors()->detach();
        $user->delete();

        Auditor::record('User', 'delete', $id, "Usuário \"{$user->name}\" excluído.", $user->toArray(), null);

        return response()->json(['message' => 'Usuário excluído.']);
    }
}