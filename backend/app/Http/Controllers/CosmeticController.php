<?php

namespace App\Http\Controllers;

use App\Models\ChildProfile;
use App\Models\CosmeticItem;
use App\Services\BananaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CosmeticController extends Controller
{
    public function __construct(private BananaService $bananaService) {}

    public function index(Request $request): JsonResponse
    {
        $query = CosmeticItem::query();

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        $perPage = min((int) $request->query('per_page', 20), 50);
        $items = $query->orderBy('banana_cost')->paginate($perPage);

        return response()->json([
            'data' => $items->map(fn (CosmeticItem $item) => [
                'id' => $item->id,
                'slug' => $item->slug,
                'category' => $item->category,
                'name_key' => $item->name_key,
                'preview_url' => $item->preview_url,
                'banana_cost' => $item->banana_cost,
            ]),
            'meta' => [
                'current_page' => $items->currentPage(),
                'total' => $items->total(),
                'per_page' => $items->perPage(),
            ],
        ]);
    }

    public function childCosmetics(Request $request, ChildProfile $child): JsonResponse
    {
        $this->authorize('view', $child);

        $perPage = min((int) $request->query('per_page', 50), 100);
        $items = $child->cosmetics()->paginate($perPage);

        return response()->json([
            'data' => $items->map(fn (CosmeticItem $item) => [
                'id' => $item->id,
                'slug' => $item->slug,
                'category' => $item->category,
                'name_key' => $item->name_key,
                'preview_url' => $item->preview_url,
                'unlocked_at' => $item->pivot->created_at?->toISOString(),
            ]),
            'meta' => [
                'current_page' => $items->currentPage(),
                'total' => $items->total(),
                'per_page' => $items->perPage(),
            ],
        ]);
    }

    public function purchase(ChildProfile $child, CosmeticItem $cosmetic): JsonResponse
    {
        $this->authorize('update', $child);

        if ($child->cosmetics()->where('cosmetic_item_id', $cosmetic->id)->exists()) {
            return response()->json(['error' => 'Already owned'], 422);
        }

        if (!$this->bananaService->deduct($child, $cosmetic->banana_cost)) {
            return response()->json(['error' => 'Insufficient bananas'], 400);
        }

        $child->cosmetics()->attach($cosmetic->id);

        return response()->json([
            'cosmetic_id' => $cosmetic->id,
            'new_banana_total' => $child->fresh()->bananas,
        ]);
    }
}
