<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CosmeticItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category',
        'slug',
        'name_key',
        'preview_path',
        'banana_cost',
    ];

    protected function casts(): array
    {
        return [
            'banana_cost' => 'integer',
        ];
    }

    public function children(): BelongsToMany
    {
        return $this->belongsToMany(ChildProfile::class, 'child_cosmetics')
            ->withTimestamps()
            ->withPivot('deleted_at')
            ->wherePivotNull('deleted_at');
    }
}
