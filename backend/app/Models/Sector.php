<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Sector extends Model
{
    use HasFactory;

    protected $fillable = ['company_id', 'name', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_sector');
    }

    public function classifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class, 'classification_sector');
    }
}
