"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import FlipCard from "./FlipCard";

export type MemoryDifficulty = "easy" | "medium" | "hard";

interface MemoryCard {
  id: number;
  pairId: number;
  content: string;
  ttsText?: string;
}

interface MemoryCardGridProps {
  items: { content: string; ttsText?: string }[];
  difficulty: MemoryDifficulty;
  onMatch: (ttsText?: string) => void;
  onMismatch: () => void;
  onComplete: (tapCount: number) => void;
}

function getDimensions(difficulty: MemoryDifficulty): { cols: number; pairs: number } {
  switch (difficulty) {
    case "easy":
      return { cols: 3, pairs: 3 };
    case "medium":
      return { cols: 4, pairs: 6 };
    case "hard":
      return { cols: 4, pairs: 8 };
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryCardGrid({
  items,
  difficulty,
  onMatch,
  onMismatch,
  onComplete,
}: MemoryCardGridProps) {
  const { cols, pairs } = getDimensions(difficulty);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [faceUp, setFaceUp] = useState<Set<number>>(new Set());
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const animating = useRef(false);

  useEffect(() => {
    const picked = shuffle(items).slice(0, pairs);
    const deck: MemoryCard[] = [];
    picked.forEach((item, idx) => {
      deck.push({ id: idx * 2, pairId: idx, content: item.content, ttsText: item.ttsText });
      deck.push({ id: idx * 2 + 1, pairId: idx, content: item.content, ttsText: item.ttsText });
    });
    setCards(shuffle(deck));
    setFaceUp(new Set());
    setMatched(new Set());
    setSelected([]);
    setTapCount(0);
  }, [items, pairs]);

  const handleTap = useCallback(
    (cardId: number) => {
      if (animating.current) return;
      if (faceUp.has(cardId) || matched.has(cardId)) return;
      if (selected.length >= 2) return;

      const newSelected = [...selected, cardId];
      setSelected(newSelected);
      setFaceUp((prev) => new Set([...prev, cardId]));
      setTapCount((prev) => prev + 1);

      if (newSelected.length === 2) {
        animating.current = true;
        const [first, second] = newSelected;
        const card1 = cards.find((c) => c.id === first);
        const card2 = cards.find((c) => c.id === second);

        if (card1 && card2 && card1.pairId === card2.pairId) {
          const newMatched = new Set([...matched, first, second]);
          setMatched(newMatched);
          setSelected([]);
          onMatch(card1.ttsText);
          animating.current = false;

          if (newMatched.size === cards.length) {
            setTimeout(() => onComplete(tapCount + 1), 400);
          }
        } else {
          onMismatch();
          setTimeout(() => {
            setFaceUp((prev) => {
              const next = new Set(prev);
              next.delete(first);
              next.delete(second);
              return next;
            });
            setSelected([]);
            animating.current = false;
          }, 1000);
        }
      }
    },
    [selected, faceUp, matched, cards, tapCount, onMatch, onMismatch, onComplete]
  );

  const rows = Math.ceil(cards.length / cols);

  return (
    <div
      className="grid gap-2 w-full max-w-md mx-auto"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {cards.map((card) => (
        <FlipCard
          key={card.id}
          content={card.content}
          faceUp={faceUp.has(card.id)}
          matched={matched.has(card.id)}
          selected={selected.includes(card.id)}
          onClick={() => handleTap(card.id)}
        />
      ))}
    </div>
  );
}
