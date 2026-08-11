<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Situation extends Model
{
    use HasFactory;

    protected $fillable = ['company_id', 'name', 'color', 'counts_sla', 'is_active', 'permitir_comentario'];

    protected $casts = [
        'counts_sla' => 'boolean',
        'is_active' => 'boolean',
        'permitir_comentario' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function transitions(): HasMany
    {
        return $this->hasMany(SituationTransition::class, 'from_situation_id');
    }
}
