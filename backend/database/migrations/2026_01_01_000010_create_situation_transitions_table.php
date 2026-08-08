<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('situation_transitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_situation_id')->constrained('situations')->cascadeOnDelete();
            $table->foreignId('to_situation_id')->constrained('situations')->cascadeOnDelete();
            $table->json('roles');
            $table->timestamps();
            $table->unique(['company_id', 'from_situation_id', 'to_situation_id'], 'situation_transition_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('situation_transitions');
    }
};