<?php

namespace App\Services;

use App\Models\ChildProfile;
use App\Models\ProgressRecord;

class ProgressService
{
    public function record(
        ChildProfile $child,
        string $moduleType,
        string $itemIdentifier,
        string $status,
        array $metadata = [],
        ?int $durationSeconds = null
    ): ProgressRecord {
        $existing = $child->progressRecords()
            ->where('module_type', $moduleType)
            ->where('item_identifier', $itemIdentifier)
            ->first();

        if ($existing) {
            // Enforce state transition: no reverse transitions
            if ($existing->status === ProgressRecord::STATUS_COMPLETED && $status === ProgressRecord::STATUS_ATTEMPTED) {
                return $existing;
            }

            $existingMetadata = $existing->metadata ?? [];

            // Accumulate duration_seconds
            if ($durationSeconds !== null) {
                $existingDuration = $existingMetadata['duration_seconds'] ?? 0;
                $metadata['duration_seconds'] = $existingDuration + $durationSeconds;
            }

            $merged = array_merge($existingMetadata, $metadata);

            $existing->update([
                'status' => $status,
                'metadata' => $merged,
            ]);

            return $existing->fresh();
        }

        if ($durationSeconds !== null) {
            $metadata['duration_seconds'] = $durationSeconds;
        }

        return $child->progressRecords()->create([
            'module_type' => $moduleType,
            'item_identifier' => $itemIdentifier,
            'status' => $status,
            'metadata' => $metadata,
        ]);
    }
}
