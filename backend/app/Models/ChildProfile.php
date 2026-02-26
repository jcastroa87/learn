<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChildProfile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'parent_id',
        'name',
        'age',
        'avatar',
        'language',
        'bananas',
    ];

    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'bananas' => 'integer',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ParentUser::class, 'parent_id');
    }

    public function progressRecords(): HasMany
    {
        return $this->hasMany(ProgressRecord::class);
    }

    public function artworks(): HasMany
    {
        return $this->hasMany(Artwork::class);
    }

    public function cosmetics(): BelongsToMany
    {
        return $this->belongsToMany(CosmeticItem::class, 'child_cosmetics')
            ->withTimestamps()
            ->withPivot('deleted_at')
            ->wherePivotNull('deleted_at');
    }

    public function sessionConfig(): HasOne
    {
        return $this->hasOne(SessionConfig::class);
    }
}
