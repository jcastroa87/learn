<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProgressRecord extends Model
{
    use SoftDeletes;

    public const STATUS_ATTEMPTED = 'attempted';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'child_profile_id',
        'module_type',
        'item_identifier',
        'status',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    public function childProfile(): BelongsTo
    {
        return $this->belongsTo(ChildProfile::class);
    }
}
