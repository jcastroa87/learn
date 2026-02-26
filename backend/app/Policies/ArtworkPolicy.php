<?php

namespace App\Policies;

use App\Models\Artwork;
use App\Models\ChildProfile;
use App\Models\ParentUser;

class ArtworkPolicy
{
    public function viewAny(ParentUser $parent, ChildProfile $child): bool
    {
        return $parent->id === $child->parent_id;
    }

    public function view(ParentUser $parent, Artwork $artwork): bool
    {
        return $parent->id === $artwork->childProfile->parent_id;
    }

    public function create(ParentUser $parent, ChildProfile $child): bool
    {
        return $parent->id === $child->parent_id;
    }

    public function delete(ParentUser $parent, Artwork $artwork): bool
    {
        return $parent->id === $artwork->childProfile->parent_id;
    }
}
