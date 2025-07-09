<?php

namespace Database\Seeders;

use App\Models\Status;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Status::insert([
            ['name' => 'Applied'],
            ['name' => 'Interview'],
            ['name' => 'Offer'],
            ['name' => 'Rejected'],
        ]);
    }
}
