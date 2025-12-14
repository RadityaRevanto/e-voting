<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('login_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('ip_address', 45); // Support IPv4 dan IPv6
            $table->text('user_agent')->nullable(); // Browser/device info
            $table->string('device_name', 255)->nullable(); // Nama device dari request
            $table->timestamp('login_at'); // Waktu login
            $table->string('status', 20)->default('success'); // success, failed
            $table->text('failure_reason')->nullable(); // Alasan jika login gagal
            $table->timestamps();

            // Index untuk query cepat
            $table->index('user_id');
            $table->index('ip_address');
            $table->index('login_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('login_logs');
    }
};
