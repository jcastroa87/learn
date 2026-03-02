"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { getGridSize } from "@/data/puzzles";
import type { PuzzleDifficulty } from "@/data/puzzles";

interface PuzzlePiece {
  id: number;
  targetRow: number;
  targetCol: number;
  currentX: number;
  currentY: number;
  placed: boolean;
}

interface PuzzleCanvasProps {
  image: string;
  difficulty: PuzzleDifficulty;
  gridColor: string;
  canvasSize: number;
  onComplete: () => void;
  showHint: boolean;
}

const SNAP_THRESHOLD = 30;

export default function PuzzleCanvas({
  image,
  difficulty,
  gridColor,
  canvasSize,
  onComplete,
  showHint,
}: PuzzleCanvasProps) {
  const gridSize = getGridSize(difficulty);
  const cellSize = canvasSize / gridSize;
  const pieceSize = cellSize - 4;
  const containerRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const newPieces: PuzzlePiece[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const id = r * gridSize + c;
        newPieces.push({
          id,
          targetRow: r,
          targetCol: c,
          currentX: Math.random() * (canvasSize - cellSize),
          currentY: canvasSize + 20 + Math.random() * 120,
          placed: false,
        });
      }
    }
    // Shuffle positions
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmpX = newPieces[i].currentX;
      const tmpY = newPieces[i].currentY;
      newPieces[i].currentX = newPieces[j].currentX;
      newPieces[i].currentY = newPieces[j].currentY;
      newPieces[j].currentX = tmpX;
      newPieces[j].currentY = tmpY;
    }
    setPieces(newPieces);
  }, [image, difficulty, canvasSize, cellSize, gridSize]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, pieceId: number) => {
      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece || piece.placed) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      dragOffset.current = {
        x: e.clientX - rect.left - piece.currentX,
        y: e.clientY - rect.top - piece.currentY,
      };
      setDragging(pieceId);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pieces]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging === null) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left - dragOffset.current.x;
      const y = e.clientY - rect.top - dragOffset.current.y;

      setPieces((prev) =>
        prev.map((p) => (p.id === dragging ? { ...p, currentX: x, currentY: y } : p))
      );
    },
    [dragging]
  );

  const handlePointerUp = useCallback(() => {
    if (dragging === null) return;
    const piece = pieces.find((p) => p.id === dragging);
    if (!piece) {
      setDragging(null);
      return;
    }

    const targetX = piece.targetCol * cellSize;
    const targetY = piece.targetRow * cellSize;

    const dx = piece.currentX - targetX;
    const dy = piece.currentY - targetY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < SNAP_THRESHOLD) {
      const updated = pieces.map((p) =>
        p.id === dragging
          ? { ...p, currentX: targetX, currentY: targetY, placed: true }
          : p
      );
      setPieces(updated);

      if (updated.every((p) => p.placed)) {
        setTimeout(onComplete, 300);
      }
    }

    setDragging(null);
  }, [dragging, pieces, cellSize, onComplete]);

  return (
    <div
      ref={containerRef}
      className="relative touch-none"
      style={{ width: canvasSize, height: canvasSize + 160 }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Grid background */}
      <div
        className="absolute rounded-xl border-2 border-zinc-300"
        style={{
          width: canvasSize,
          height: canvasSize,
          backgroundColor: gridColor + "33",
        }}
      >
        {Array.from({ length: gridSize }).map((_, r) =>
          Array.from({ length: gridSize }).map((_, c) => (
            <div
              key={`${r}-${c}`}
              className="absolute border border-dashed border-zinc-300"
              style={{
                left: c * cellSize,
                top: r * cellSize,
                width: cellSize,
                height: cellSize,
              }}
            />
          ))
        )}

        {/* Hint overlay */}
        {showHint && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60">
            <span style={{ fontSize: canvasSize * 0.6 }}>{image}</span>
          </div>
        )}
      </div>

      {/* Pieces */}
      {pieces.map((piece) => (
        <div
          key={piece.id}
          onPointerDown={(e) => handlePointerDown(e, piece.id)}
          className={`absolute rounded-lg border-2 transition-shadow select-none ${
            piece.placed
              ? "border-green-400 bg-green-50 pointer-events-none"
              : dragging === piece.id
                ? "border-indigo-500 bg-white shadow-lg z-50"
                : "border-zinc-300 bg-white shadow-sm cursor-grab"
          }`}
          style={{
            left: piece.currentX,
            top: piece.currentY,
            width: pieceSize,
            height: pieceSize,
            touchAction: "none",
          }}
        >
          {/* Clipped emoji fragment */}
          <div
            style={{
              width: pieceSize,
              height: pieceSize,
              overflow: "hidden",
              position: "relative",
              borderRadius: 6,
            }}
          >
            <span
              style={{
                position: "absolute",
                fontSize: pieceSize * gridSize * 0.85,
                lineHeight: 1,
                left: -piece.targetCol * pieceSize,
                top: -piece.targetRow * pieceSize,
                width: pieceSize * gridSize,
                height: pieceSize * gridSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {image}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
