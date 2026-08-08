<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Audit extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'user_id', 'entity', 'entity_id',
        'action', 'summary', 'before', 'after', 'is_reverted',
    ];

    protected $casts = [
        'before' => 'array',
        'after' => 'array',
        'is_reverted' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
