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
        Schema::create('vote', function (Blueprint $table) {
            $table->id();
            $table->string('warga_nik', length:64);
            $table->integer('paslon_id');
            $table->timestamp('created_at');
            
            $table->foreign('warga_nik')
            ->references('nik')
            ->on('warga')
            ->onDelete('cascade');

            $table->foreign('paslon_id')
            ->references('id')
            ->on('paslon')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vote');
    }
};
