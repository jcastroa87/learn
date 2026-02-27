"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";

interface Point {
  x: number;
  y: number;
}

interface TracingCanvasProps {
  strokes: Point[][];
  letter: string;
  canvasSize: number;
  onComplete: () => void;
  threshold?: number;
  completionTarget?: number;
}

const RAINBOW_COLORS = [
  "#FF6B6B", "#FF9F43", "#FECA57", "#48DBFB",
  "#0ABDE3", "#A29BFE", "#FF6BCB",
];

export default function TracingCanvas({
  strokes,
  letter,
  canvasSize,
  onComplete,
  threshold = 30,
  completionTarget = 0.8,
}: TracingCanvasProps) {
  const [traceLines, setTraceLines] = useState<number[][]>([]);
  const [currentLine, setCurrentLine] = useState<number[]>([]);
  const [visitedWaypoints, setVisitedWaypoints] = useState<Set<string>>(new Set());
  const [isDrawing, setIsDrawing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const colorIndexRef = useRef(0);

  const scale = canvasSize / 100;

  // Flatten all waypoints across all strokes for proximity checking
  const allWaypoints = useMemo(() => {
    const points: { x: number; y: number; key: string }[] = [];
    strokes.forEach((stroke, si) => {
      stroke.forEach((wp, wi) => {
        points.push({
          x: wp.x * scale,
          y: wp.y * scale,
          key: `${si}-${wi}`,
        });
      });
    });
    return points;
  }, [strokes, scale]);

  const totalWaypoints = allWaypoints.length;

  const checkWaypointProximity = useCallback(
    (px: number, py: number) => {
      setVisitedWaypoints((prev) => {
        const updated = new Set(prev);
        let changed = false;
        for (const wp of allWaypoints) {
          if (updated.has(wp.key)) continue;
          const dist = Math.sqrt((px - wp.x) ** 2 + (py - wp.y) ** 2);
          if (dist <= threshold) {
            updated.add(wp.key);
            changed = true;
          }
        }
        if (!changed) return prev;

        const progress = updated.size / totalWaypoints;
        if (progress >= completionTarget && !completed) {
          setCompleted(true);
          setTimeout(onComplete, 200);
        }
        return updated;
      });
    },
    [allWaypoints, threshold, totalWaypoints, completionTarget, completed, onComplete]
  );

  const handlePointerDown = useCallback(
    (e: { evt: PointerEvent }) => {
      if (completed) return;
      setIsDrawing(true);
      const stage = (e as unknown as { target: { getStage: () => { getPointerPosition: () => Point | null } } }).target.getStage();
      const pos = stage.getPointerPosition();
      if (!pos) return;
      setCurrentLine([pos.x, pos.y]);
      checkWaypointProximity(pos.x, pos.y);
    },
    [completed, checkWaypointProximity]
  );

  const handlePointerMove = useCallback(
    (e: { evt: PointerEvent }) => {
      if (!isDrawing || completed) return;
      const stage = (e as unknown as { target: { getStage: () => { getPointerPosition: () => Point | null } } }).target.getStage();
      const pos = stage.getPointerPosition();
      if (!pos) return;
      setCurrentLine((prev) => [...prev, pos.x, pos.y]);
      checkWaypointProximity(pos.x, pos.y);
      colorIndexRef.current = (colorIndexRef.current + 1) % RAINBOW_COLORS.length;
    },
    [isDrawing, completed, checkWaypointProximity]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentLine.length >= 4) {
      setTraceLines((prev) => [...prev, currentLine]);
    }
    setCurrentLine([]);
  }, [isDrawing, currentLine]);

  const reset = useCallback(() => {
    setTraceLines([]);
    setCurrentLine([]);
    setVisitedWaypoints(new Set());
    setCompleted(false);
  }, []);

  // Reset when letter changes
  useEffect(() => {
    reset();
  }, [letter, reset]);

  return (
    <div className="no-select touch-none">
      <Stage
        width={canvasSize}
        height={canvasSize}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        <Layer>
          {/* Ghost letter */}
          <Text
            text={letter}
            x={0}
            y={0}
            width={canvasSize}
            height={canvasSize}
            fontSize={canvasSize * 0.7}
            fill="#f0f0f0"
            fontFamily="Arial, sans-serif"
            fontStyle="bold"
            align="center"
            verticalAlign="middle"
          />

          {/* Guide path — one dashed line per stroke */}
          {strokes.map((stroke, si) => {
            const pts = stroke.flatMap((wp) => [wp.x * scale, wp.y * scale]);
            return pts.length >= 4 ? (
              <Line
                key={`guide-${si}`}
                points={pts}
                stroke="#c4c4cc"
                strokeWidth={canvasSize * 0.06}
                lineCap="round"
                lineJoin="round"
                opacity={0.4}
              />
            ) : null;
          })}

          {/* Narrower center guide line */}
          {strokes.map((stroke, si) => {
            const pts = stroke.flatMap((wp) => [wp.x * scale, wp.y * scale]);
            return pts.length >= 4 ? (
              <Line
                key={`center-${si}`}
                points={pts}
                stroke="#d4d4d8"
                strokeWidth={3}
                lineCap="round"
                lineJoin="round"
                dash={[8, 6]}
              />
            ) : null;
          })}

          {/* Waypoint dots */}
          {allWaypoints.map((wp) => (
            <Circle
              key={wp.key}
              x={wp.x}
              y={wp.y}
              radius={visitedWaypoints.has(wp.key) ? 5 : 7}
              fill={visitedWaypoints.has(wp.key) ? "#10b981" : "#a1a1aa"}
              opacity={visitedWaypoints.has(wp.key) ? 1 : 0.4}
            />
          ))}

          {/* Completed trace lines */}
          {traceLines.map((line, i) => (
            <Line
              key={`trace-${i}`}
              points={line}
              stroke={RAINBOW_COLORS[i % RAINBOW_COLORS.length]}
              strokeWidth={8}
              lineCap="round"
              lineJoin="round"
              tension={0.3}
            />
          ))}

          {/* Current trace line */}
          {currentLine.length >= 4 && (
            <Line
              points={currentLine}
              stroke={RAINBOW_COLORS[colorIndexRef.current]}
              strokeWidth={8}
              lineCap="round"
              lineJoin="round"
              tension={0.3}
            />
          )}

          {/* Completion overlay */}
          {completed && (
            <Text
              text="⭐"
              x={0}
              y={0}
              width={canvasSize}
              height={canvasSize}
              fontSize={canvasSize * 0.3}
              align="center"
              verticalAlign="middle"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
