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

    // Status Tracker
    Route::get('status', [StatusController::class, 'index'])->name('status.index');
    Route::get('status/create', [StatusController::class, 'create'])->name('status.create');
    Route::post('status', [StatusController::class, 'store'])->name('status.store');
    Route::delete('status/{id}', [StatusController::class, 'destroy'])->name('status.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
