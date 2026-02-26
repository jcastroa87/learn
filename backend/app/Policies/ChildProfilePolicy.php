<?php

namespace App\Policies;

use App\Models\ChildProfile;
use App\Models\ParentUser;

class ChildProfilePolicy
{
    public function viewAny(ParentUser $parent): bool
    {
        return true;
    }

    public function view(ParentUser $parent, ChildProfile $child): bool
    {
        return $parent->id === $child->parent_id;
    }

    public function create(ParentUser $parent): bool
    {
        return $parent->childProfiles()->count() < 5;
    }

    public function update(ParentUser $parent, ChildProfile $child): bool
    {
        return $parent->id === $child->parent_id;
    }

    public function delete(ParentUser $parent, ChildProfile $child): bool
    {
        return $parent->id === $child->parent_id;
    }
}
