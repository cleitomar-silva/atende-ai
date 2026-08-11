<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('situations', function (Blueprint $table) {
            $table->boolean('permitir_comentario')->default(true)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('situations', function (Blueprint $table) {
            $table->dropColumn('permitir_comentario');
        });
    }
};