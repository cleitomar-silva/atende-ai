<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateApi
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }

        $apiToken = ApiToken::with('user.company')->where('token', $token)->first();

        if (! $apiToken || ($apiToken->expires_at && $apiToken->expires_at->isPast())) {
            return response()->json(['message' => 'Sessão expirada. Faça login novamente.'], 401);
        }

        $user = $apiToken->user;

        if (! $user || $user->isBlocked()) {
            return response()->json(['message' => 'Usuário bloqueado ou empresa desativada.'], 403);
        }

        $apiToken->forceFill(['last_used_at' => now()])->save();

        Auth::setUser($user);

        return $next($request);
    }
}