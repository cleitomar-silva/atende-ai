<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SituationTransition extends Model
{
    use HasFactory;

    public const ROLE_REQUESTER = 'requester';
    public const ROLE_RESPONSIBLE = 'responsible';
    public const ROLE_SECTOR = 'sector';
    public const ROLE_ADMIN = 'admin';

    public const ROLES = [
        self::ROLE_REQUESTER,
        self::ROLE_RESPONSIBLE,
        self::ROLE_SECTOR,
        self::ROLE_ADMIN,
    ];

    protected $fillable = ['company_id', 'from_situation_id', 'to_situation_id', 'roles'];

    protected $casts = [
        'roles' => 'array',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function fromSituation(): BelongsTo
    {
        return $this->belongsTo(Situation::class, 'from_situation_id');
    }

    public function toSituation(): BelongsTo
    {
        return $this->belongsTo(Situation::class, 'to_situation_id');
    }
}