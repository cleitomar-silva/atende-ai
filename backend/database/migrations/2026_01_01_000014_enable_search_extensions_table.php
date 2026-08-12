<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS unaccent');
        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');

        DB::statement("
            CREATE OR REPLACE FUNCTION f_unaccent(text)
            RETURNS text
            LANGUAGE sql
            IMMUTABLE
            PARALLEL SAFE
            AS \$func\$
                SELECT public.unaccent('public.unaccent', \$1)
            \$func\$
        ");

        DB::statement("CREATE INDEX IF NOT EXISTS idx_tickets_title_search ON tickets USING gin (f_unaccent(lower(title)) gin_trgm_ops)");
        DB::statement("CREATE INDEX IF NOT EXISTS idx_tickets_description_search ON tickets USING gin (f_unaccent(lower(description)) gin_trgm_ops)");
    }

    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS idx_tickets_description_search');
        DB::statement('DROP INDEX IF EXISTS idx_tickets_title_search');
        DB::statement('DROP FUNCTION IF EXISTS f_unaccent(text)');
        DB::statement('DROP EXTENSION IF EXISTS pg_trgm');
        DB::statement('DROP EXTENSION IF EXISTS unaccent');
    }
};