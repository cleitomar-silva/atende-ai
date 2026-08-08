<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Auditor;
use App\Helpers\Cnpj;
use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function show(Request $request)
    {
        $company = $request->user()->company;

        return response()->json(['company' => $company]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        if (! $user->isAdmin()) {
            return response()->json(['message' => 'Somente administradores podem editar a empresa.'], 403);
        }

        $company = $user->company;

        $request->validate([
            'name' => 'required|string|max:255',
            'cnpj' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $cnpj = Cnpj::onlyDigits($request->cnpj);

        if (! Cnpj::validate($cnpj)) {
            return response()->json(['message' => 'CNPJ inválido.'], 422);
        }

        $dup = Company::where('cnpj', $cnpj)->where('id', '!=', $company->id)->exists();
        if ($dup) {
            return response()->json(['message' => 'Já existe outra empresa com este CNPJ.'], 422);
        }

        $before = $company->only(['name', 'cnpj', 'is_active']);
        $company->name = $request->name;
        $company->cnpj = $cnpj;
        $company->is_active = $request->boolean('is_active', $company->is_active);
        $company->save();
        $after = $company->only(['name', 'cnpj', 'is_active']);

        Auditor::record('Company', 'update', $company->id, 'Empresa atualizada.', $before, $after);

        return response()->json(['company' => $company]);
    }
}