<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pekerjaan extends Model
{
    /** @use HasFactory<\Database\Factories\PekerjaanFactory> */
    use HasFactory;
    protected $fillable = [
        'position',
        'company',
        'location',
        'job_url',
        'salary',
        'job_type',
        'applied_at',
        'status_id',
        'user_id', // Don't forget user_id!
    ];

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
