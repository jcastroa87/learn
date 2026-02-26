<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Artwork extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'child_profile_id',
        'activity_type',
        'file_path',
        'file_size',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
        ];
    }

    public function childProfile(): BelongsTo
    {
        return $this->belongsTo(ChildProfile::class);
    }
}
