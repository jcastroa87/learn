"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

const Stage = dynamic(() => import("react-konva").then((m) => m.Stage), { ssr: false });
const Layer = dynamic(() => import("react-konva").then((m) => m.Layer), { ssr: false });
const Circle = dynamic(() => import("react-konva").then((m) => m.Circle), { ssr: false });
const Line = dynamic(() => import("react-konva").then((m) => m.Line), { ssr: false });
const Text = dynamic(() => import("react-konva").then((m) => m.Text), { ssr: false });

interface TracingCanvasProps {
  waypoints: { x: number; y: number }[];
  letter: string;
  canvasSize: number;
  onComplete: () => void;
  threshold?: number;
  completionTarget?: number;
}

const RAINBOW_COLORS = [
  "#FF0000", "#FF7700", "#FFFF00", "#00FF00",
  "#0077FF", "#8800FF", "#FF00FF",
];

export default function TracingCanvas({
  waypoints,
  letter,
  canvasSize,
  onComplete,
  threshold = 35,
  completionTarget = 0.85,
}: TracingCanvasProps) {
  const [tracePoints, setTracePoints] = useState<number[]>([]);
  const [visitedWaypoints, setVisitedWaypoints] = useState<Set<number>>(new Set());
  const [isDrawing, setIsDrawing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const colorIndexRef = useRef(0);

  const scale = canvasSize / 100;

  const scaledWaypoints = waypoints.map((wp) => ({
    x: wp.x * scale,
    y: wp.y * scale,
  }));

  const checkWaypointProximity = useCallback(
    (px: number, py: number) => {
      const newVisited = new Set(visitedWaypoints);
      scaledWaypoints.forEach((wp, i) => {
        const dist = Math.sqrt((px - wp.x) ** 2 + (py - wp.y) ** 2);
        if (dist <= threshold) {
          newVisited.add(i);
        }
      });

      if (newVisited.size !== visitedWaypoints.size) {
        setVisitedWaypoints(newVisited);
        const progress = newVisited.size / waypoints.length;
        if (progress >= completionTarget && !completed) {
          setCompleted(true);
          onComplete();
        }
      }
    },
    [scaledWaypoints, visitedWaypoints, waypoints.length, completionTarget, completed, onComplete, threshold]
  );

  const handlePointerDown = useCallback(
    (e: { evt: { offsetX: number; offsetY: number } }) => {
      if (completed) return;
      setIsDrawing(true);
      const { offsetX, offsetY } = e.evt;
      setTracePoints([offsetX, offsetY]);
      checkWaypointProximity(offsetX, offsetY);
    },
    [completed, checkWaypointProximity]
  );

  const handlePointerMove = useCallback(
    (e: { evt: { offsetX: number; offsetY: number } }) => {
      if (!isDrawing || completed) return;
      const { offsetX, offsetY } = e.evt;
      setTracePoints((prev) => [...prev, offsetX, offsetY]);
      checkWaypointProximity(offsetX, offsetY);
      colorIndexRef.current = (colorIndexRef.current + 1) % RAINBOW_COLORS.length;
    },
    [isDrawing, completed, checkWaypointProximity]
  );

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const reset = useCallback(() => {
    setTracePoints([]);
    setVisitedWaypoints(new Set());
    setCompleted(false);
  }, []);

  // Reset when letter changes
  useEffect(() => {
    reset();
  }, [letter, reset]);

  const guidePathPoints = scaledWaypoints.flatMap((wp) => [wp.x, wp.y]);

  return (
    <div className="no-select touch-none">
      <Stage
        width={canvasSize}
        height={canvasSize}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        <Layer>
          {/* Letter display */}
          <Text
            text={letter}
            x={canvasSize / 2}
            y={canvasSize / 2}
            fontSize={canvasSize * 0.6}
            fill="#e5e7eb"
            fontFamily="sans-serif"
            fontStyle="bold"
            align="center"
            verticalAlign="middle"
            offsetX={canvasSize * 0.15}
            offsetY={canvasSize * 0.3}
          />

          {/* Guide path */}
          {guidePathPoints.length >= 4 && (
            <Line
              points={guidePathPoints}
              stroke="#d4d4d8"
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
              dash={[10, 8]}
            />
          )}

          {/* Waypoint dots */}
          {scaledWaypoints.map((wp, i) => (
            <Circle
              key={i}
              x={wp.x}
              y={wp.y}
              radius={visitedWaypoints.has(i) ? 6 : 8}
              fill={visitedWaypoints.has(i) ? "#10b981" : "#a1a1aa"}
              opacity={visitedWaypoints.has(i) ? 1 : 0.5}
            />
          ))}

          {/* User trace (rainbow) */}
          {tracePoints.length >= 4 && (
            <Line
              points={tracePoints}
              stroke={RAINBOW_COLORS[colorIndexRef.current]}
              strokeWidth={8}
              lineCap="round"
              lineJoin="round"
              tension={0.5}
              globalCompositeOperation="source-over"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
