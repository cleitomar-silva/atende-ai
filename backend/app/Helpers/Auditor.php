<?php

namespace App\Helpers;

use App\Models\Audit;
use Illuminate\Support\Facades\Auth;

class Auditor
{
    public static function record(string $entity, string $action, int $entityId, string $summary, ?array $before = null, ?array $after = null): Audit
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        return Audit::create([
            'company_id' => $user?->company_id,
            'user_id' => $user?->id,
            'entity' => $entity,
            'entity_id' => $entityId,
            'action' => $action,
            'summary' => $summary,
            'before' => $before,
            'after' => $after,
        ]);
    }
}