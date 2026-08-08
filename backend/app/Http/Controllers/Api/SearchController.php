<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate(['q' => 'required|string|max:255']);

        $search = $request->q;
        $user = $request->user();

        $tickets = Ticket::with('situation', 'classification', 'requestingSector', 'responsibleSector')
            ->where('company_id', $user->company_id)
            ->where(function ($query) use ($search) {
                $query->where('number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('comments', fn ($c) => $c->where('content', 'like', "%{$search}%"));
            })
            ->orderByDesc('created_at')
            ->limit(25)
            ->get();

        $results = $tickets->map(fn ($t) => [
            'id' => $t->id,
            'number' => $t->number,
            'title' => $t->title,
            'created_at' => $t->created_at,
            'status' => $t->situation?->name,
            'situation_color' => $t->situation?->color,
            'requesting_sector' => $t->requestingSector?->name,
            'responsible_sector' => $t->responsibleSector?->name,
        ]);

        return response()->json(['results' => $results]);
    }
}