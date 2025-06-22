<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('qr', function () {

    return response(
        QrCode::merge(public_path('images/choose_right.jpeg'), 0.2, true)
            ->size(400)
            ->style('dot', 0.9)
            ->format('svg')
            ->backgroundColor(255, 255, 255)
            ->errorCorrection('H')
            ->eyeColor(0, 1, 194, 211, 0, 0, 0)
            ->eyeColor(1, 1, 194, 211, 0, 0, 0)
            ->eyeColor(2, 1, 194, 211, 0, 0, 0)
            ->generate(request()->link),
        200
    )

        ->header('Content-Type', 'image/svg+xml')
        ->header('Content-Disposition', 'attachment; filename="qrcode.svg"');
})->name('qr');
