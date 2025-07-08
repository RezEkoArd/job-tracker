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
        Schema::create('pekerjaans', function (Blueprint $table) {
            $table->id();
            $table->string('position');
            $table->string('company');
            $table->string('location')->nullable();
            $table->text('job_url')->nullable();
            $table->string('salary')->nullable(); // e.g., Full-time, Part-time, Contract
            $table->string('job_type')->nullable(); // e.g., Full-time, Part-time, Contract
            $table->date('applied_at');
            $table->foreignId('user_id')
                ->constrained('users');
            $table->foreignId('status_id')
                ->constrained('statuses')
                ->onDelete('cascade');
            $table->text('deadline')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pekerjaans');
    }
};
