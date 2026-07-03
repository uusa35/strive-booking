<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Auth\Events\Login;

class UpdateLastLoginAt
{
    /**
     * Stamp the user's last login time on every successful login
     * (Auth::attempt, Auth::login and remember-me logins all fire this event).
     */
    public function handle(Login $event): void
    {
        try {
            // Base-query update: must not bump updated_at or fire model events.
            User::whereKey($event->user->getAuthIdentifier())
                ->toBase()
                ->update(['last_login_at' => now()]);
        } catch (\Throwable) {
            // A missed stamp must never block login.
        }
    }
}
