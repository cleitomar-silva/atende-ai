<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'company_id', 'role', 'is_active'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_GESTOR = 'gestor';
    public const ROLE_COLABORADOR = 'colaborador';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function sectors(): BelongsToMany
    {
        return $this->belongsToMany(Sector::class, 'user_sector')->withTimestamps();
    }

    public function ticketsRequested()
    {
        return $this->hasMany(Ticket::class, 'requesting_user_id');
    }

    public function ticketsResponsible()
    {
        return $this->hasMany(Ticket::class, 'responsible_user_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isGestor(): bool
    {
        return $this->role === self::ROLE_GESTOR;
    }

    public function canManage(): bool
    {
        return $this->isAdmin() || $this->isGestor();
    }

    public function isBlocked(): bool
    {
        return ! $this->is_active || ($this->company && ! $this->company->is_active);
    }
}
