<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserExportController;
use App\Models\User;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

Route::post('locale', function (\Illuminate\Http\Request $request) {
    $request->validate(['locale' => 'required|in:en,ar']);
    $request->session()->put('locale', $request->locale);
    return back();
})->name('locale.set');

Route::get('/', function () {
    if (app()->environment('development')) {
        return Inertia::render('comming-soon');
    } else {
        return Inertia::render('welcome');
    }
})->name('home');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['adminAccess'])->group(function () {
        Route::get('dashboard', function () {
            $elements = User::where('id', '!=', 1)->orderByDesc('id')->get();
            return Inertia::render('dashboard', compact('elements'));
        })->name('dashboard');
        Route::get('dashboard/export', UserExportController::class)->name('dashboard.export');
        Route::resource('user', UserController::class)->only('show');
    });
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
