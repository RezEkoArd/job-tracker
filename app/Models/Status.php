<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Status extends Model
{
    /** @use HasFactory<\Database\Factories\StatusFactory> */
    use HasFactory;
    protected $guarded = [];

    public function pekerjaans() : HasMany
    {
        return $this->hasMany(Pekerjaan::class, 'pekerjaan_id');
    }
}
