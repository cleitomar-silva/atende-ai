<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('number');
            $table->foreignId('classification_id')->constrained('classifications')->restrictOnDelete();
            $table->foreignId('requesting_sector_id')->constrained('sectors');
            $table->foreignId('requesting_user_id')->constrained('users');
            $table->foreignId('responsible_sector_id')->constrained('sectors');
            $table->foreignId('responsible_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('situation_id')->constrained('situations')->restrictOnDelete();
            $table->string('title');
            $table->text('description');
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->unique(['company_id', 'number']);
        });

        Schema::create('ticket_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->boolean('is_internal')->default(false);
            $table->timestamps();
        });

        Schema::create('ticket_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('original_name');
            $table->string('path');
            $table->string('mime')->nullable();
            $table->unsignedBigInteger('size');
            $table->timestamps();
        });

        Schema::create('ticket_situation_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->cascadeOnDelete();
            $table->foreignId('situation_id')->constrained('situations')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_situation_history');
        Schema::dropIfExists('ticket_attachments');
        Schema::dropIfExists('ticket_comments');
        Schema::dropIfExists('tickets');
    }
};