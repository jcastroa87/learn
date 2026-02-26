<?php

namespace App\Http\Controllers;

use App\Models\ChildProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionConfigController extends Controller
{
    public function show(Request $request, ChildProfile $child): JsonResponse
    {
        if ($request->user()->id !== $child->parent_id) {
            abort(403);
        }

        $config = $child->sessionConfig;

        if (! $config) {
            $config = $child->sessionConfig()->create([
                'time_limit_minutes' => 20,
                'sound_enabled' => true,
            ]);
        }

        return response()->json($config->only([
            'time_limit_minutes', 'sound_enabled',
        ]));
    }

    public function update(Request $request, ChildProfile $child): JsonResponse
    {
        if ($request->user()->id !== $child->parent_id) {
            abort(403);
        }

        $validated = $request->validate([
            'time_limit_minutes' => ['sometimes', 'integer', 'min:5', 'max:120'],
            'sound_enabled' => ['sometimes', 'boolean'],
        ]);

        $config = $child->sessionConfig;

        if (! $config) {
            $config = $child->sessionConfig()->create(array_merge([
                'time_limit_minutes' => 20,
                'sound_enabled' => true,
            ], $validated));
        } else {
            $config->update($validated);
        }

        return response()->json($config->fresh()->only([
            'time_limit_minutes', 'sound_enabled',
        ]));
    }
}
