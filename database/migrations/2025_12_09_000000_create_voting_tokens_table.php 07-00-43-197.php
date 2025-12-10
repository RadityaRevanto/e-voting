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
        Schema::create('voting_tokens', function (Blueprint $table) {
            $table->string('token', 255)->primary();
            $table->string('warga_nik', 16);
            $table->string('nonce', 255);
            $table->string('signature', 255);
            $table->timestamp('expires_at');
            $table->boolean('is_used')->default(false);
            $table->timestamps();
            
            // Foreign key to warga table
            $table->foreign('warga_nik')
                ->references('nik')
                ->on('warga')
                ->onDelete('cascade');
            
            // Index for faster queries
            $table->index(['warga_nik', 'is_used', 'expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voting_tokens');
    }
};
