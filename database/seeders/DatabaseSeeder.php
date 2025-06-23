<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'first_name' => 'Admin',
            'email' => 'it@strivedu.com',
            'mobile' => '99161629',
        ]);
        User::factory()->create([
            'first_name' => 'student',
            'email' => 'it@strivedu.com',
            'mobile' => '65772444',
        ]);
        if (!env('production')) {
            User::factory(10)->create();
        }
    }
}
