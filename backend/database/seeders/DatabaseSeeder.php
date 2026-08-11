<?php

namespace Database\Seeders;

use App\Models\ApiToken;
use App\Models\Category;
use App\Models\Classification;
use App\Models\Company;
use App\Models\Group;
use App\Models\Sector;
use App\Models\Situation;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (Company::where('cnpj', '11222333000181')->exists()) {
            return;
        }

        $company = Company::create([
            'name' => 'Empresa Demonstração',
            'cnpj' => '11222333000181',
        ]);

        $suporte = Group::create(['company_id' => $company->id, 'name' => 'Suporte']);

        $incidente = Category::create(['company_id' => $company->id, 'name' => 'Incidente']);
        $melhoria = Category::create(['company_id' => $company->id, 'name' => 'Melhoria']);
        $requisicao = Category::create(['company_id' => $company->id, 'name' => 'Requisição']);

        $sectors = collect(['TI', 'Financeiro', 'RH'])
            ->map(fn ($name) => Sector::create(['company_id' => $company->id, 'name' => $name]));

        $defaultSituations = [
            'Não iniciado' => ['color' => '#64748b', 'counts_sla' => false, 'permitir_comentario' => true],
            'Em atendimento' => ['color' => '#0f62fe', 'counts_sla' => true, 'permitir_comentario' => true],
            'Concluído' => ['color' => '#16a34a', 'counts_sla' => false, 'permitir_comentario' => false],
            'Cancelado' => ['color' => '#dc2626', 'counts_sla' => false, 'permitir_comentario' => false],
        ];

        $situations = collect($defaultSituations)->map(fn ($config, $name) => Situation::create([
            'company_id' => $company->id,
            'name' => $name,
            'color' => $config['color'],
            'counts_sla' => $config['counts_sla'],
            'is_active' => true,
            'permitir_comentario' => $config['permitir_comentario'],
        ]));

        $this->createDefaultTransitions($company, $situations);

        $sectorIds = $sectors->pluck('id')->all();

        $ci = Classification::create([
            'company_id' => $company->id,
            'group_id' => $suporte->id,
            'category_id' => $incidente->id,
            'name' => 'Processos Internos',
            'sla_minutes' => 120,
        ]);
        $ci->sectors()->sync($sectorIds);

        $acesso = Classification::create([
            'company_id' => $company->id,
            'group_id' => $suporte->id,
            'category_id' => $requisicao->id,
            'name' => 'Acesso',
            'sla_minutes' => 60,
        ]);
        $acesso->sectors()->sync($sectorIds);

        $admin = User::create([
            'company_id' => $company->id,
            'name' => 'Administrador',
            'email' => 'admin@atendeai.com',
            'password' => 'password',
            'role' => User::ROLE_ADMIN,
        ]);
        $admin->sectors()->sync([$sectors->first()->id]);

        $colaborador = User::create([
            'company_id' => $company->id,
            'name' => 'Colaborador',
            'email' => 'colaborador@atendeai.com',
            'password' => 'password',
            'role' => User::ROLE_COLABORADOR,
        ]);
        $colaborador->sectors()->sync($sectors->pluck('id'));

        ApiToken::create([
            'user_id' => $admin->id,
            'token' => 'demo-admin-token',
            'expires_at' => now()->addYears(1),
        ]);
    }

    private function createDefaultTransitions(Company $company, $situations): void
    {
        $ids = $situations->pluck('id', 'name');

        $ROLE_REQUESTER = \App\Models\SituationTransition::ROLE_REQUESTER;
        $ROLE_RESPONSIBLE = \App\Models\SituationTransition::ROLE_RESPONSIBLE;

        $rules = [
            'Cancelado' => [
                'Em atendimento' => [$ROLE_RESPONSIBLE],
            ],
            'Concluído' => [
                'Em atendimento' => [$ROLE_RESPONSIBLE],
            ],
            'Em atendimento' => [
                'Cancelado' => [$ROLE_REQUESTER, $ROLE_RESPONSIBLE],
                'Concluído' => [$ROLE_RESPONSIBLE],
            ],
            'Não iniciado' => [
                'Cancelado' => [$ROLE_REQUESTER, $ROLE_RESPONSIBLE],
                'Em atendimento' => [$ROLE_RESPONSIBLE],
            ],
        ];

        foreach ($rules as $from => $destinations) {
            $fromId = $ids->get($from);
            if (! $fromId) {
                continue;
            }
            foreach ($destinations as $to => $roles) {
                $toId = $ids->get($to);
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
}