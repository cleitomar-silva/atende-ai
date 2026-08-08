<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Auditor;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Classification;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::where('company_id', $request->user()->company_id)->orderBy('name')->get();

        return response()->json(['categories' => $categories]);
    }

    public function store(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $request->validate(['name' => 'required|string|max:255']);

        if (Category::where('company_id', $request->user()->company_id)->where('name', $request->name)->exists()) {
            return response()->json(['message' => 'Já existe uma categoria com este nome.'], 422);
        }

        $category = Category::create([
            'company_id' => $request->user()->company_id,
            'name' => $request->name,
            'is_active' => true,
        ]);

        Auditor::record('Category', 'create', $category->id, "Categoria \"{$category->name}\" criada.", null, $category->toArray());

        return response()->json(['category' => $category], 201);
    }

    public function update(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $category = Category::where('company_id', $request->user()->company_id)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        if (Category::where('company_id', $request->user()->company_id)->where('name', $request->name)->where('id', '!=', $category->id)->exists()) {
            return response()->json(['message' => 'Já existe uma categoria com este nome.'], 422);
        }

        $before = $category->only(['name', 'is_active']);
        $category->name = $request->name;
        $category->is_active = $request->boolean('is_active', $category->is_active);
        $category->save();
        $after = $category->only(['name', 'is_active']);

        Auditor::record('Category', 'update', $category->id, "Categoria \"{$category->name}\" atualizada.", $before, $after);

        return response()->json(['category' => $category]);
    }

    public function destroy(Request $request, int $id)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Acesso restrito a administradores.'], 403);
        }

        $category = Category::where('company_id', $request->user()->company_id)->findOrFail($id);

        if (Classification::where('category_id', $category->id)->exists()) {
            return response()->json(['message' => 'Esta categoria possui classificações vinculadas e não pode ser excluída.'], 422);
        }

        Auditor::record('Category', 'delete', $category->id, "Categoria \"{$category->name}\" excluída.", $category->toArray(), null);
        $category->delete();

        return response()->json(['message' => 'Categoria excluída.']);
    }
}