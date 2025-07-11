<?php

use App\Http\Controllers\PekerjaanController;
use App\Http\Controllers\StatusController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Jobs Tracker
    Route::get('pekerjaan', [PekerjaanController::class, 'index']) -> name('pekerjaan.index');
    Route::get('pekerjaan/create', [PekerjaanController::class, 'create'])->name('pekerjaan.create');
    Route::post('pekerjaan', [PekerjaanController::class, 'store'])->name('pekerjaan.store');
    Route::delete('pekerjaan/{id}', [PekerjaanController::class, 'destroy'])->name('pekerjaan.destroy');
    Route::get('pekerjaan/{id}/edit', [PekerjaanController::class, 'edit'])->name('pekerjaan.edit');
    Route::put('pekerjaan/{id}/update', [PekerjaanController::class, 'update'])->name('pekerjaan.update');

    // Status Tracker
    Route::get('status', [StatusController::class, 'index'])->name('status.index');
    Route::get('status/create', [StatusController::class, 'create'])->name('status.create');
    Route::post('status', [StatusController::class, 'store'])->name('status.store');
    Route::delete('status/{id}', [StatusController::class, 'destroy'])->name('status.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
