<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
// database/migrations/2025_12_04_033601_create_paslon_table.php
public function up(): void
{
    Schema::create('paslon', function (Blueprint $table) {
        $table->id();
        $table->integer('user_id');
        $table->string('nama_ketua', length:100);
        $table->integer('umur_ketua')->nullable();
        $table->string('jurusan_ketua', length:50)->nullable();
        $table->string('nama_wakil_ketua', length:100);
        $table->integer('umur_wakil_ketua')->nullable();
        $table->string('jurusan_wakil_ketua', length:50)->nullable();
        $table->string('foto_paslon')->nullable();
        $table->text('visi')->nullable();
        $table->text('misi')->nullable();
        $table->timestamps();

        $table->foreign('user_id')
        ->references('id')
        ->on('users')
        ->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paslon');
    }
};
