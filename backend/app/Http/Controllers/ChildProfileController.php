<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChildProfileRequest;
use App\Http\Requests\UpdateChildProfileRequest;
use App\Models\ChildProfile;
use App\Models\CosmeticItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChildProfileController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $children = $request->user()
            ->childProfiles()
            ->orderBy('created_at')
            ->get(['id', 'name', 'age', 'avatar', 'language', 'bananas']);

        return response()->json($children);
    }

    public function store(StoreChildProfileRequest $request): JsonResponse
    {
        $child = $request->user()->childProfiles()->create(
            $request->validated()
        );

        // Auto-populate with all free cosmetics (banana_cost = 0)
        $freeCosmetics = CosmeticItem::where('banana_cost', 0)->pluck('id');
        $child->cosmetics()->attach($freeCosmetics);

        // Auto-create session config with defaults
        $child->sessionConfig()->create([
            'time_limit_minutes' => 20,
            'sound_enabled' => true,
        ]);

        return response()->json($child->only([
            'id', 'name', 'age', 'avatar', 'language', 'bananas',
        ]), 201);
    }

    public function show(Request $request, ChildProfile $child): JsonResponse
    {
        if ($request->user()->id !== $child->parent_id) {
            abort(403);
        }

        return response()->json($child->only([
            'id', 'name', 'age', 'avatar', 'language', 'bananas',
        ]));
    }

    public function update(UpdateChildProfileRequest $request, ChildProfile $child): JsonResponse
    {
        $child->update($request->validated());

        return response()->json($child->fresh()->only([
            'id', 'name', 'age', 'avatar', 'language', 'bananas',
        ]));
    }

    public function destroy(Request $request, ChildProfile $child): JsonResponse
    {
        if ($request->user()->id !== $child->parent_id) {
            abort(403);
        }

        $child->delete();

        return response()->json(null);
    }
}
