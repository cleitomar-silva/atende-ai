<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_email_unique');
            $table->foreignId('company_id')->nullable()->after('id')
                ->constrained('companies')->cascadeOnDelete();
            $table->string('role', 20)->default('colaborador')->after('email');
            $table->boolean('is_active')->default(true)->after('role');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index(['company_id', 'email']);
            $table->index(['company_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['company_id', 'email']);
            $table->dropIndex(['company_id', 'is_active']);
            $table->dropConstrainedForeignId('company_id');
            $table->dropColumn(['role', 'is_active']);
            $table->string('email')->unique();
        });
    }
};