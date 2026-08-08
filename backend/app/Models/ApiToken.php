<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApiToken extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'token', 'last_used_at', 'expires_at'];

    protected $casts = [
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function generateFor(User $user, ?int $expiresInHours = 24): self
    {
        return static::create([
            'user_id' => $user->id,
            'token' => bin2hex(random_bytes(32)),
            'expires_at' => $expiresInHours ? now()->addHours($expiresInHours) : null,
        ]);
    }
}
