<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('entity');
            $table->unsignedBigInteger('entity_id');
            $table->string('action'); // create | update | delete | comment | attach
            $table->text('summary');
            $table->json('before')->nullable();
            $table->json('after')->nullable();
            $table->boolean('is_reverted')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audits');
    }
};