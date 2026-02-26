"use client";

import { useState, useCallback, useRef } from "react";
import type { SceneObject } from "@/data/fill-the-gaps";

interface SceneRendererProps {
  backgroundColor: string;
  backgroundEmoji: string;
  objects: SceneObject[];
  canvasSize: number;
  onCorrectPlace: (obj: SceneObject) => void;
  onWrongPlace: () => void;
  onComplete: () => void;
}

const SNAP_THRESHOLD = 30;

export default function SceneRenderer({
  backgroundColor,
  backgroundEmoji,
  objects,
  canvasSize,
  onCorrectPlace,
  onWrongPlace,
  onComplete,
}: SceneRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Set<string>>(new Set());
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [bouncing, setBouncing] = useState<string | null>(null);

  // Initialize scrambled positions for unplaced items (below scene)
  const getInitialPosition = (idx: number) => ({
    x: 10 + (idx % 5) * (canvasSize / 5),
    y: canvasSize + 20 + Math.floor(idx / 5) * 60,
  });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, objId: string) => {
      if (placed.has(objId) || bouncing) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentPos = positions[objId] || getInitialPosition(objects.findIndex((o) => o.id === objId));
      dragOffset.current = {
        x: e.clientX - rect.left - currentPos.x,
        y: e.clientY - rect.top - currentPos.y,
      };
      setDragging(objId);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [placed, positions, objects, bouncing]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left - dragOffset.current.x;
      const y = e.clientY - rect.top - dragOffset.current.y;
      setPositions((prev) => ({ ...prev, [dragging]: { x, y } }));
    },
    [dragging]
  );

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    const obj = objects.find((o) => o.id === dragging);
    if (!obj) {
      setDragging(null);
      return;
    }

    const pos = positions[dragging];
    if (!pos) {
      setDragging(null);
      return;
    }

    const targetX = (obj.targetX / 100) * canvasSize;
    const targetY = (obj.targetY / 100) * canvasSize;
    const dx = pos.x - targetX;
    const dy = pos.y - targetY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < SNAP_THRESHOLD) {
      setPositions((prev) => ({ ...prev, [dragging]: { x: targetX, y: targetY } }));
      const newPlaced = new Set([...placed, dragging]);
      setPlaced(newPlaced);
      onCorrectPlace(obj);

      if (newPlaced.size === objects.length) {
        setTimeout(onComplete, 400);
      }
    } else {
      // Bounce back
      setBouncing(dragging);
      const idx = objects.findIndex((o) => o.id === dragging);
      const initial = getInitialPosition(idx);
      setPositions((prev) => ({ ...prev, [dragging!]: initial }));
      onWrongPlace();
      setTimeout(() => setBouncing(null), 300);
    }

    setDragging(null);
  }, [dragging, positions, objects, placed, canvasSize, onCorrectPlace, onWrongPlace, onComplete]);

  return (
    <div
      ref={containerRef}
      className="relative touch-none"
      style={{ width: canvasSize, height: canvasSize + 100 }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Scene background */}
      <div
        className="absolute rounded-xl"
        style={{
          width: canvasSize,
          height: canvasSize,
          backgroundColor,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-20"
          style={{ fontSize: canvasSize * 0.4 }}
        >
          {backgroundEmoji}
        </div>

        {/* Target silhouettes */}
        {objects.map((obj) => (
          <div
            key={`target-${obj.id}`}
            className={`absolute flex items-center justify-center rounded-lg ${
              placed.has(obj.id) ? "opacity-0" : "opacity-40"
            }`}
            style={{
              left: (obj.targetX / 100) * canvasSize - 20,
              top: (obj.targetY / 100) * canvasSize - 20,
              width: 44,
              height: 44,
              fontSize: 28,
              border: "2px dashed rgba(0,0,0,0.3)",
            }}
          >
            {obj.content}
          </div>
        ))}
      </div>

      {/* Draggable objects */}
      {objects.map((obj, idx) => {
        const pos = positions[obj.id] || getInitialPosition(idx);
        const isPlaced = placed.has(obj.id);

        return (
          <div
            key={obj.id}
            onPointerDown={(e) => handlePointerDown(e, obj.id)}
            className={`absolute flex items-center justify-center rounded-lg select-none transition-transform ${
              isPlaced
                ? "pointer-events-none"
                : dragging === obj.id
                  ? "z-50 scale-110 shadow-lg"
                  : bouncing === obj.id
                    ? "transition-all duration-300"
                    : "cursor-grab shadow-sm"
            }`}
            style={{
              left: pos.x,
              top: pos.y,
              width: 44,
              height: 44,
              fontSize: 28,
              touchAction: "none",
              backgroundColor: isPlaced ? "transparent" : "white",
              border: isPlaced ? "none" : "2px solid #ddd",
            }}
          >
            {obj.content}
          </div>
        );
      })}
    </div>
  );
}
