<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Cnpj;
use App\Http\Controllers\Controller;
use App\Models\ApiToken;
use App\Models\Category;
use App\Models\Classification;
use App\Models\Company;
use App\Models\Group;
use App\Models\Sector;
use App\Models\Situation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::with('company', 'sectors')->where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['E-mail ou senha inválidos.'],
            ]);
        }

        if (! $user->company || ! $user->company->is_active) {
            return response()->json(['message' => 'A empresa deste usuário está desativada. Contate o administrador.'], 403);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Usuário desativado. Contate o administrador.'], 403);
        }

        $token = ApiToken::generateFor($user);

        return response()->json([
            'token' => $token->token,
            'user' => $this->serializeUser($user),
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'cnpj' => 'required|string',
            'sector_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $cnpj = Cnpj::onlyDigits($request->cnpj);

        if (! Cnpj::validate($cnpj)) {
            return response()->json(['message' => 'CNPJ inválido.'], 422);
        }

        if (Company::where('cnpj', $cnpj)->exists()) {
            return response()->json(['message' => 'Já existe uma empresa cadastrada com este CNPJ.'], 422);
        }

        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'Já existe um usuário cadastrado com este e-mail.'], 422);
        }

        $company = Company::create([
            'name' => $request->company_name,
            'cnpj' => $cnpj,
            'is_active' => true,
        ]);

        $sector = Sector::create([
            'company_id' => $company->id,
            'name' => $request->sector_name,
            'is_active' => true,
        ]);

        $user = User::create([
            'company_id' => $company->id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => User::ROLE_ADMIN,
            'is_active' => true,
        ]);

        $user->sectors()->attach($sector->id);

        $this->createDefaultFor($company);

        $token = ApiToken::create(['user_id' => $user->id, 'token' => bin2hex(random_bytes(32))]);

        $user->load('company', 'sectors');

        return response()->json([
            'token' => $token->token,
            'user' => $this->serializeUser($user),
        ], 201);
    }

    public function registerCompany(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'cnpj' => 'required|string',
        ]);

        $cnpj = Cnpj::onlyDigits($request->cnpj);

        if (! Cnpj::validate($cnpj)) {
            return response()->json(['message' => 'CNPJ inválido.'], 422);
        }

        if (Company::where('cnpj', $cnpj)->exists()) {
            return response()->json(['message' => 'Já existe uma empresa com este CNPJ.'], 422);
        }

        $company = Company::create([
            'name' => $request->company_name,
            'cnpj' => $cnpj,
            'is_active' => true,
        ]);

        return response()->json(['company' => $company], 201);
    }

    public function registerSector(Request $request)
    {
        $request->validate([
            'company_id' => 'required|integer',
            'name' => 'required|string|max:255',
        ]);

        if (Sector::where('company_id', $request->company_id)->where('name', $request->name)->exists()) {
            return response()->json(['message' => 'Já existe um setor com este nome.'], 422);
        }

        $sector = Sector::create([
            'company_id' => $request->company_id,
            'name' => $request->name,
            'is_active' => true,
        ]);

        return response()->json(['sector' => $sector], 201);
    }

    public function registerUser(Request $request)
    {
        $request->validate([
            'company_id' => 'required|integer',
            'sector_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'Já existe um usuário cadastrado com este e-mail.'], 422);
        }

        $sector = Sector::where('company_id', $request->company_id)->findOrFail($request->sector_id);

        $user = User::create([
            'company_id' => $request->company_id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => User::ROLE_ADMIN,
            'is_active' => true,
        ]);

        $user->sectors()->attach($sector->id);

        $company = Company::find($request->company_id);
        $this->createDefaultFor($company);

        $apiToken = ApiToken::create([
            'user_id' => $user->id,
            'token' => bin2hex(random_bytes(32)),
        ]);

        $user->load('company', 'sectors');

        return response()->json([
            'token' => $apiToken->token,
            'user' => $this->serializeUser($user),
        ], 201);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('company', 'sectors');

        return response()->json(['user' => $this->serializeUser($user)]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();

        if ($token) {
            ApiToken::where('token', $token)->delete();
        }

        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'nullable|string|min:6',
        ]);

        $emailInUse = User::where('email', $request->email)
            ->where('id', '!=', $user->id)
            ->exists();

        if ($emailInUse) {
            return response()->json(['message' => 'E-mail já utilizado por outro usuário.'], 422);
        }

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = $request->password;
        }

        $user->save();
        $user->load('company', 'sectors');

        \App\Helpers\Auditor::record('User', 'update', $user->id, 'Perfil atualizado.');

        return response()->json(['user' => $this->serializeUser($user)]);
    }

    private function createDefaultFor(Company $company): void
    {
        $suporte = Group::create(['company_id' => $company->id, 'name' => 'Suporte', 'is_active' => true]);

        $incidente = Category::create(['company_id' => $company->id, 'name' => 'Incidente', 'is_active' => true]);
        $melhoria = Category::create(['company_id' => $company->id, 'name' => 'Melhoria', 'is_active' => true]);
        $requisicao = Category::create(['company_id' => $company->id, 'name' => 'Requisição', 'is_active' => true]);

        $defaultColors = [
            'Não iniciado' => '#64748b',
            'Em atendimento' => '#0f62fe',
            'Aguardando validação' => '#f59e0b',
            'Concluído' => '#16a34a',
            'Cancelar' => '#dc2626',
        ];

        foreach ($defaultColors as $name => $color) {
            Situation::create([
                'company_id' => $company->id,
                'name' => $name,
                'color' => $color,
                'counts_sla' => true,
                'is_active' => true,
            ]);
        }

        $this->createDefaultTransitions($company);

        $sectors = $company->sectors()->pluck('id')->all();

        $ci = Classification::create([
            'company_id' => $company->id,
            'group_id' => $suporte->id,
            'category_id' => $incidente->id,
            'name' => 'Processos Internos',
            'sla_minutes' => 120,
            'default_description' => null,
            'is_active' => true,
        ]);
        $ci->sectors()->sync($sectors);

        $acesso = Classification::create([
            'company_id' => $company->id,
            'group_id' => $suporte->id,
            'category_id' => $requisicao->id,
            'name' => 'Acesso',
            'sla_minutes' => 60,
            'default_description' => null,
            'is_active' => true,
        ]);
        $acesso->sectors()->sync($sectors);
    }

    private function createDefaultTransitions(Company $company): void
    {
        $situations = Situation::where('company_id', $company->id)->pluck('id', 'name');

        $ROLE_REQUESTER = \App\Models\SituationTransition::ROLE_REQUESTER;
        $ROLE_RESPONSIBLE = \App\Models\SituationTransition::ROLE_RESPONSIBLE;

        $rules = [
            'Não iniciado' => [
                'Em atendimento' => [$ROLE_RESPONSIBLE],
                'Concluído' => [$ROLE_REQUESTER, $ROLE_RESPONSIBLE],
                'Cancelar' => [$ROLE_REQUESTER, $ROLE_RESPONSIBLE],
            ],
            'Em atendimento' => [
                'Aguardando validação' => [$ROLE_RESPONSIBLE],
                'Concluído' => [$ROLE_REQUESTER, $ROLE_RESPONSIBLE],
                'Cancelar' => [$ROLE_REQUESTER, $ROLE_RESPONSIBLE],
            ],
            'Aguardando validação' => [
                'Em atendimento' => [$ROLE_REQUESTER],
                'Concluído' => [$ROLE_REQUESTER, $ROLE_RESPONSIBLE],
                'Cancelar' => [$ROLE_REQUESTER, $ROLE_RESPONSIBLE],
            ],
        ];

        foreach ($rules as $from => $destinations) {
            $fromId = $situations->get($from);
            if (! $fromId) {
                continue;
            }
            foreach ($destinations as $to => $roles) {
                $toId = $situations->get($to);
                if (! $toId) {
                    continue;
                }
                \App\Models\SituationTransition::create([
                    'company_id' => $company->id,
                    'from_situation_id' => $fromId,
                    'to_situation_id' => $toId,
                    'roles' => $roles,
                ]);
            }
        }
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active,
            'company' => $user->company ? [
                'id' => $user->company->id,
                'name' => $user->company->name,
                'cnpj' => $user->company->cnpj,
                'is_active' => $user->company->is_active,
            ] : null,
            'sectors' => $user->sectors->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
            ])->values(),
        ];
    }
}