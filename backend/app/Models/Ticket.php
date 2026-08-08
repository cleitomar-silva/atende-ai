<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'number', 'classification_id', 'requesting_sector_id',
        'requesting_user_id', 'responsible_sector_id', 'responsible_user_id',
        'situation_id', 'title', 'description', 'closed_at',
    ];

    protected $casts = [
        'number' => 'integer',
        'closed_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function classification(): BelongsTo
    {
        return $this->belongsTo(Classification::class);
    }

    public function requestingSector(): BelongsTo
    {
        return $this->belongsTo(Sector::class, 'requesting_sector_id');
    }

    public function requestingUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requesting_user_id');
    }

    public function responsibleSector(): BelongsTo
    {
        return $this->belongsTo(Sector::class, 'responsible_sector_id');
    }

    public function responsibleUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsible_user_id');
    }

    public function situation(): BelongsTo
    {
        return $this->belongsTo(Situation::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(TicketAttachment::class);
    }
}
