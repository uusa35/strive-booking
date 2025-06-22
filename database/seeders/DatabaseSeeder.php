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
            'first_name' => 'Test User',
            'email' => 'admin@strivedu.com',
        ]);
        User::factory()->create([
            'first_name' => 'student',
            'email' => 'test@gmail.com',
        ]);
        User::factory(10)->create();
    }
}
