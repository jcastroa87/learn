<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecordProgressRequest;
use App\Models\ChildProfile;
use App\Models\ProgressRecord;
use App\Services\BananaService;
use App\Services\ProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function __construct(
        private ProgressService $progressService,
        private BananaService $bananaService,
    ) {}

    public function index(Request $request, ChildProfile $child): JsonResponse
    {
        if ($request->user()->id !== $child->parent_id) {
            abort(403);
        }

        $query = $child->progressRecords();

        if ($request->has('module')) {
            $query->where('module_type', $request->input('module'));
        }

        $records = $query->orderByDesc('updated_at')
            ->paginate($request->input('per_page', 50));

        return response()->json($records->map(fn (ProgressRecord $r) => [
            'item_identifier' => $r->item_identifier,
            'status' => $r->status,
            'metadata' => $r->metadata,
            'updated_at' => $r->updated_at,
        ]));
    }

    public function summary(Request $request, ChildProfile $child): JsonResponse
    {
        if ($request->user()->id !== $child->parent_id) {
            abort(403);
        }

        $moduleTypes = [
            'letter_tracing', 'number_tracing', 'matching',
            'coloring', 'free_drawing', 'memory_cards',
            'puzzles', 'fill_the_gaps', 'sorting',
        ];

        $modules = [];
        foreach ($moduleTypes as $type) {
            $records = $child->progressRecords()->where('module_type', $type);
            $modules[$type] = [
                'attempted' => (clone $records)->where('status', 'attempted')->count(),
                'completed' => (clone $records)->where('status', 'completed')->count(),
                'total' => $records->count(),
            ];
        }

        return response()->json([
            'bananas' => $child->bananas,
            'modules' => $modules,
        ]);
    }

    public function store(RecordProgressRequest $request, ChildProfile $child): JsonResponse
    {
        $data = $request->validated();

        $record = $this->progressService->record(
            child: $child,
            moduleType: $data['module_type'],
            itemIdentifier: $data['item_identifier'],
            status: $data['status'],
            metadata: $data['metadata'] ?? [],
            durationSeconds: $data['duration_seconds'] ?? null,
        );

        $bananasAwarded = 0;
        if ($data['status'] === 'completed') {
            $bananasAwarded = $this->bananaService->award(
                $child,
                $data['module_type'],
                $record->metadata ?? [],
            );
        }

        return response()->json([
            'item_identifier' => $record->item_identifier,
            'status' => $record->status,
            'bananas_awarded' => $bananasAwarded,
            'new_banana_total' => $child->fresh()->bananas,
        ]);
    }
}
