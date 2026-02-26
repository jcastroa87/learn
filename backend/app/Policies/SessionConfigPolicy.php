<?php

namespace App\Policies;

use App\Models\ParentUser;
use App\Models\SessionConfig;

class SessionConfigPolicy
{
    public function view(ParentUser $parent, SessionConfig $config): bool
    {
        return $parent->id === $config->childProfile->parent_id;
    }

    public function update(ParentUser $parent, SessionConfig $config): bool
    {
        return $parent->id === $config->childProfile->parent_id;
    }
}
