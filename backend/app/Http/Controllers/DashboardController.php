<?php

namespace App\Http\Controllers;

use App\Models\ChildProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function show(Request $request, ChildProfile $child): JsonResponse
    {
        if ($request->user()->id !== $child->parent_id) {
            abort(403);
        }

        $moduleTypes = [
            'letter_tracing', 'number_tracing', 'matching',
            'coloring', 'free_drawing', 'memory_cards',
            'puzzles', 'fill_the_gaps', 'sorting',
        ];

        $progressSummary = [];
        foreach ($moduleTypes as $type) {
            $records = $child->progressRecords()->where('module_type', $type);
            $progressSummary[$type] = [
                'attempted' => (clone $records)->where('status', 'attempted')->count(),
                'completed' => (clone $records)->where('status', 'completed')->count(),
                'total' => $records->count(),
            ];
        }

        $recentActivity = $child->progressRecords()
            ->orderByDesc('created_at')
            ->limit(20)
            ->get()
            ->map(fn ($r) => [
                'module_type' => $r->module_type,
                'item_identifier' => $r->item_identifier,
                'status' => $r->status,
                'created_at' => $r->created_at,
            ]);

        // Daily activity (last 7 days)
        $startDate = Carbon::now()->subDays(6)->startOfDay();
        $dailyRecords = $child->progressRecords()
            ->where('created_at', '>=', $startDate)
            ->get();

        $dailyActivity = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dayRecords = $dailyRecords->filter(
                fn ($r) => $r->created_at->format('Y-m-d') === $date
            );

            $modules = [];
            foreach ($dayRecords->groupBy('module_type') as $type => $records) {
                $totalSeconds = $records->sum(fn ($r) => ($r->metadata['duration_seconds'] ?? 0));
                $modules[$type] = [
                    'count' => $records->count(),
                    'minutes' => (int) round($totalSeconds / 60),
                ];
            }

            $dailyActivity[] = [
                'date' => $date,
                'modules' => $modules,
            ];
        }

        // Time spent
        $todayRecords = $child->progressRecords()
            ->whereDate('created_at', Carbon::today())
            ->get();
        $todaySeconds = $todayRecords->sum(fn ($r) => ($r->metadata['duration_seconds'] ?? 0));

        $weekRecords = $child->progressRecords()
            ->where('created_at', '>=', Carbon::now()->startOfWeek())
            ->get();
        $weekSeconds = $weekRecords->sum(fn ($r) => ($r->metadata['duration_seconds'] ?? 0));

        return response()->json([
            'child' => $child->only(['name', 'age', 'avatar', 'language', 'bananas']),
            'progress_summary' => $progressSummary,
            'recent_activity' => $recentActivity,
            'daily_activity' => $dailyActivity,
            'time_spent' => [
                'today_minutes' => (int) round($todaySeconds / 60),
                'week_minutes' => (int) round($weekSeconds / 60),
            ],
        ]);
    }
}
