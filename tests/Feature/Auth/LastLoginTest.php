<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('logging in records last_login_at without touching updated_at', function () {
    $user = User::factory()->create();
    $originalUpdatedAt = $user->updated_at;

    $this->travel(5)->minutes();

    $response = $this->post('/login', [
        'mobile' => (string) $user->mobile,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $user->refresh();
    expect($user->last_login_at)->not->toBeNull();
    expect($user->updated_at->equalTo($originalUpdatedAt))->toBeTrue();
});

test('registering stamps last_login_at via auto-login', function () {
    $this->post('/register', [
        'first_name' => 'Test',
        'mobile' => '96555555',
    ]);

    $user = User::where('mobile', '96555555')->first();
    expect($user)->not->toBeNull();
    expect($user->last_login_at)->not->toBeNull();
});
