<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SessionConfig extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'child_profile_id',
        'time_limit_minutes',
        'sound_enabled',
    ];

    protected function casts(): array
    {
        return [
            'time_limit_minutes' => 'integer',
            'sound_enabled' => 'boolean',
        ];
    }

    public function childProfile(): BelongsTo
    {
        return $this->belongsTo(ChildProfile::class);
    }
}
