<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // public function up(): void
    // {
    //     // Untuk PostgreSQL, kita perlu mengubah enum menggunakan raw SQL
    //     // Karena enum tidak bisa langsung diubah, kita drop dan create ulang
    //     DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
    //     DB::statement("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'super_admin', 'paslon'))");
        
    //     // Update existing admin@evoting.com menjadi super_admin
    //     DB::table('users')
    //         ->where('email', 'admin@evoting.com')
    //         ->update(['role' => 'super_admin']);
    // }
    public function up(): void
    {
        // 1️⃣ Drop constraint lama
        DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");

        // 2️⃣ Normalisasi data lama (WAJIB)
        DB::table('users')
            ->whereNotIn('role', ['admin', 'paslon', 'voter', 'super_admin'])
            ->update(['role' => 'admin']);

        // 3️⃣ Update user tertentu
        DB::table('users')
            ->where('email', 'admin@evoting.com')
            ->update(['role' => 'super_admin']);

        // 4️⃣ Pasang constraint baru
        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (role IN ('admin', 'super_admin', 'paslon', 'voter'))
        ");
    }

    /**
     * Reverse the migrations.
     */
    // public function down(): void
    // {
    //     // Kembalikan ke enum sebelumnya
    //     DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
    //     DB::statement("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'paslon'))");
        
    //     // Kembalikan super_admin menjadi admin
    //     DB::table('users')
    //         ->where('role', 'super_admin')
    //         ->update(['role' => 'admin']);
    // }
    public function down(): void
    {
        // 1️⃣ Drop constraint baru
        DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");

        // 2️⃣ Kembalikan super_admin menjadi admin
        DB::table('users')
            ->where('role', 'super_admin')
            ->update(['role' => 'admin']);

        // 3️⃣ Pasang kembali constraint lama
        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (role IN ('admin', 'paslon', 'voter'))
        ");
    }

};
