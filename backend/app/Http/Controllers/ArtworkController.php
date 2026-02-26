<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArtworkRequest;
use App\Models\Artwork;
use App\Models\ChildProfile;
use App\Services\BananaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArtworkController extends Controller
{
    public function __construct(private BananaService $bananaService) {}

    public function index(Request $request, ChildProfile $child): JsonResponse
    {
        $this->authorize('viewAny', [Artwork::class, $child]);

        $perPage = min((int) $request->query('per_page', 20), 50);

        $artworks = $child->artworks()
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json([
            'data' => $artworks->map(fn (Artwork $a) => [
                'id' => $a->id,
                'activity_type' => $a->activity_type,
                'thumbnail_url' => Storage::url($a->file_path),
                'created_at' => $a->created_at->toISOString(),
            ]),
            'meta' => [
                'current_page' => $artworks->currentPage(),
                'total' => $artworks->total(),
                'per_page' => $artworks->perPage(),
            ],
        ]);
    }

    public function store(StoreArtworkRequest $request, ChildProfile $child): JsonResponse
    {
        $file = $request->file('file');
        $path = $file->store("artworks/{$child->id}", 'public');

        $artwork = $child->artworks()->create([
            'activity_type' => $request->input('activity_type'),
            'file_path' => $path,
            'file_size' => $file->getSize(),
        ]);

        $bananas = $this->bananaService->awardArtwork($child);

        return response()->json([
            'id' => $artwork->id,
            'file_url' => Storage::url($path),
            'bananas_awarded' => $bananas,
            'new_banana_total' => $child->fresh()->bananas,
        ], 201);
    }

    public function show(ChildProfile $child, Artwork $artwork): JsonResponse
    {
        $this->authorize('view', $artwork);

        return response()->json([
            'id' => $artwork->id,
            'activity_type' => $artwork->activity_type,
            'file_url' => Storage::url($artwork->file_path),
            'created_at' => $artwork->created_at->toISOString(),
        ]);
    }

    public function destroy(ChildProfile $child, Artwork $artwork): JsonResponse
    {
        $this->authorize('delete', $artwork);

        $artwork->delete();

        return response()->json(null);
    }
}
