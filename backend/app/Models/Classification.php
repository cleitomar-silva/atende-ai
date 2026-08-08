<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Classification extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'group_id', 'category_id', 'name',
        'sla_minutes', 'default_description', 'is_active',
    ];

    protected $casts = [
        'sla_minutes' => 'integer',
        'is_active' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function sectors(): BelongsToMany
    {
        return $this->belongsToMany(Sector::class, 'classification_sector');
    }
}
