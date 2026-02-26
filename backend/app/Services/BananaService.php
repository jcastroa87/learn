<?php

namespace App\Services;

use App\Models\ChildProfile;

class BananaService
{
    private const AWARDS = [
        'letter_tracing' => 3,
        'number_tracing' => 3,
        'matching' => 5,
        'coloring' => 5,
        'free_drawing' => 5,
        'memory_cards' => 5,
        'puzzles' => 5,
        'fill_the_gaps' => 5,
        'sorting' => 5,
    ];

    private const PUZZLE_DIFFICULTY_AWARDS = [
        'easy' => 5,
        'medium' => 8,
        'hard' => 12,
    ];

    private const BONUS = 3;

    public function award(ChildProfile $child, string $moduleType, array $metadata = []): int
    {
        $base = self::AWARDS[$moduleType] ?? 5;

        // Puzzle difficulty override
        if ($moduleType === 'puzzles' && isset($metadata['difficulty'])) {
            $base = self::PUZZLE_DIFFICULTY_AWARDS[$metadata['difficulty']] ?? $base;
        }

        $bonus = 0;

        // Perfect bonus for matching, memory_cards, sorting (zero errors)
        if (in_array($moduleType, ['matching', 'memory_cards', 'sorting'])) {
            $errors = $metadata['errors'] ?? $metadata['error_count'] ?? null;
            if ($errors === 0) {
                $bonus = self::BONUS;
            }
        }

        // Memory cards minimum taps bonus
        if ($moduleType === 'memory_cards' && isset($metadata['minimum_taps']) && $metadata['minimum_taps'] === true) {
            $bonus = self::BONUS;
        }

        $total = $base + $bonus;
        $child->increment('bananas', $total);

        return $total;
    }

    public function deduct(ChildProfile $child, int $amount): bool
    {
        if ($child->bananas < $amount) {
            return false;
        }

        $child->decrement('bananas', $amount);
        return true;
    }

    public function awardArtwork(ChildProfile $child): int
    {
        $amount = 5;
        $child->increment('bananas', $amount);
        return $amount;
    }
}
