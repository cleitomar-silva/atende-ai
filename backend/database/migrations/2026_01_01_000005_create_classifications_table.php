<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('group_id')->constrained('groups')->restrictOnDelete();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->string('name');
            $table->integer('sla_minutes')->default(0);
            $table->text('default_description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('classification_sector', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classification_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sector_id')->constrained()->cascadeOnDelete();
            $table->unique(['classification_id', 'sector_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classification_sector');
        Schema::dropIfExists('classifications');
    }
};