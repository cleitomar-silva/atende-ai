<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Auditor;
use App\Http\Controllers\Controller;
use App\Models\Audit;
use App\Models\Category;
use App\Models\Classification;
use App\Models\Company;
use App\Models\Group;
use App\Models\Sector;
use App\Models\Situation;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    private const SUPPORTED = [
        'Company' => Company::class,
        'Sector' => Sector::class,
        'User' => User::class,
        'Group' => Group::class,
        'Category' => Category::class,
        'Situation' => Situation::class,
        'Classification' => Classification::class,
        'Ticket' => Ticket::class,
    ];

    public function index(Request $request)
    {
        $query = Audit::with('user')->where('company_id', $request->user()->company_id);

        if ($request->filled('entity')) {
            $query->where('entity', $request->entity);
        }
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        $audits = $query->orderByDesc('created_at')->paginate($request->integer('per_page', 20));

        return response()->json(['audits' => $audits]);
    }

    public function undo(Request $request, int $id)
    {
        $user = $request->user();

        if (! $user->isAdmin()) {
            return response()->json(['message' => 'Somente administradores podem desfazer operações.'], 403);
        }

        $audit = Audit::where('company_id', $user->company_id)->findOrFail($id);

        if ($audit->is_reverted) {
            return response()->json(['message' => 'Esta operação já foi desfeita.'], 422);
        }

        $model = self::SUPPORTED[$audit->entity] ?? null;

        if (! $model) {
            return response()->json(['message' => 'Este tipo de operação não pode ser desfeita.'], 422);
        }

        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($audit, $model, $id) {
                switch ($audit->action) {
                    case 'create':
                        $this->undoCreate($audit, $model);
                        break;
                    case 'update':
                        $this->undoUpdate($audit, $model);
                        break;
                    case 'delete':
                        $this->undoDelete($audit, $model);
                        break;
                    default:
                        throw new \RuntimeException('Ação não desfazível.');
                }

                $audit->is_reverted = true;
                $audit->save();
            });
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        Auditor::record('Audit', 'update', $audit->id, 'Operação desfeita pelo administrador. #'.$id);

        return response()->json(['message' => 'Operação desfeita com sucesso.']);
    }

    public function notifications(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'notifications' => $user->notifications()->limit(20)->get(),
            'unread' => $user->unreadNotifications()->count(),
        ]);
    }

    public function markNotificationsRead(Request $request)
    {
        $user = $request->user();
        $user->unreadNotifications->each->markAsRead();

        return response()->json(['message' => 'Notificações marcadas como lidas.']);
    }

    private function undoCreate(Audit $audit, string $model): void
    {
        $row = $model::where('company_id', $audit->company_id)->find($audit->entity_id);

        if (! $row) {
            return; // já não existe
        }

        $inUse = $this->inUse($model, $row);
        if ($inUse) {
            throw new \RuntimeException('Não é possível desfazer: o registro está em uso.');
        }

        $row->delete();
    }

    private function undoUpdate(Audit $audit, string $model): void
    {
        $row = $model::where('company_id', $audit->company_id)->find($audit->entity_id);

        if (! $row) {
            throw new \RuntimeException('Registro não encontrado.');
        }

        if ($audit->before) {
            foreach ($audit->before as $field => $value) {
                if ($row->isFillable($field)) {
                    $row->{$field} = $value;
                }
            }
            $row->save();
        }
    }

private function undoDelete(Audit $audit, string $model): void
    {
        $data = $audit->before ?: [];

        if ($model === Company::class) {
            // Não restaura empresa excluída (regra de negócio: empresa é vínculo de tudo)
            throw new \RuntimeException('A exclusão de empresas não pode ser desfeita.');
        }

        $row = $model::withTrashed()->where('id', $audit->entity_id)->first();

        if ($row) {
            $row->restore();
        } elseif ($data) {
            $model::create(array_filter($data, fn ($v) => ! is_null($v)));
        }
    }

    private function inUse(string $model, $row): bool
    {
        if ($model === Sector::class) {
            return $row->users()->exists()
                || $row->classifications()->exists()
                || Ticket::where('requesting_sector_id', $row->id)->exists()
                || Ticket::where('responsible_sector_id', $row->id)->exists();
        }
        if ($model === User::class) {
            return Ticket::where('requesting_user_id', $row->id)->exists()
                || Ticket::where('responsible_user_id', $row->id)->exists();
        }
        if ($model === Category::class) {
            return Classification::where('category_id', $row->id)->exists();
        }
        if ($model === Group::class) {
            return Classification::where('group_id', $row->id)->exists();
        }
        if ($model === Situation::class) {
            return Ticket::where('situation_id', $row->id)->exists();
        }
        if ($model === Classification::class) {
            return Ticket::where('classification_id', $row->id)->exists();
        }

        return false;
    }
}