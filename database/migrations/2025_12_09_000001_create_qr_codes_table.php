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
        Schema::create('qr_codes', function (Blueprint $table) {
            $table->id();
            $table->string('token', 255);
            $table->text('qr_data'); // encrypted QR code data
            $table->string('qr_signature', 255);
            $table->timestamp('generated_at');
            $table->timestamp('scanned_at')->nullable();
            $table->timestamps();
            
            $table->foreign('token')
                ->references('token')
                ->on('voting_tokens')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_codes');
    }
};
