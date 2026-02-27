"use client";

import { useState, useCallback, useRef } from "react";
import { Stage, Layer, Path, Line } from "react-konva";
import type { ColorRegion } from "@/data/coloring";
import type { UndoAction } from "@/hooks/useUndoRedo";

export type ToolMode = "fill" | "brush" | "sticker";

interface ColoringCanvasProps {
  regions: ColorRegion[];
  canvasSize: number;
  activeColor: string;
  toolMode: ToolMode;
  brushSize: number;
  rainbow: boolean;
  onAction?: (action: UndoAction) => void;
  stageRef?: React.RefObject<ReturnType<typeof import("konva")["default"]["Stage"]> | null>;
}

const RAINBOW = ["#FF0000", "#FF7700", "#FFFF00", "#00FF00", "#0077FF", "#8800FF", "#FF00FF"];

export default function ColoringCanvas({
  regions,
  canvasSize,
  activeColor,
  toolMode,
  brushSize,
  rainbow,
  onAction,
  stageRef,
}: ColoringCanvasProps) {
  const [fills, setFills] = useState<Record<string, string>>({});
  const [strokes, setStrokes] = useState<{ points: number[]; color: string; width: number }[]>([]);
  const [currentStroke, setCurrentStroke] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const colorIdx = useRef(0);
  const scale = canvasSize / 100;

  const handleRegionTap = useCallback(
    (regionId: string) => {
      if (toolMode !== "fill") return;
      const prevColor = fills[regionId] || "#f5f5f5";
      setFills((prev) => ({ ...prev, [regionId]: activeColor }));
      onAction?.({ type: "fill", regionId, prevColor, newColor: activeColor });
    },
    [toolMode, activeColor, fills, onAction]
  );

  const handlePointerDown = useCallback(
    (e: { evt: { offsetX: number; offsetY: number } }) => {
      if (toolMode !== "brush") return;
      setIsDrawing(true);
      const { offsetX, offsetY } = e.evt;
      setCurrentStroke([offsetX, offsetY]);
    },
    [toolMode]
  );

  const handlePointerMove = useCallback(
    (e: { evt: { offsetX: number; offsetY: number } }) => {
      if (!isDrawing || toolMode !== "brush") return;
      const { offsetX, offsetY } = e.evt;
      setCurrentStroke((prev) => [...prev, offsetX, offsetY]);
      if (rainbow) colorIdx.current = (colorIdx.current + 1) % RAINBOW.length;
    },
    [isDrawing, toolMode, rainbow]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length >= 4) {
      const color = rainbow ? RAINBOW[colorIdx.current] : activeColor;
      setStrokes((prev) => [...prev, { points: currentStroke, color, width: brushSize }]);
      onAction?.({ type: "stroke", points: currentStroke, color, width: brushSize });
    }
    setCurrentStroke([]);
  }, [isDrawing, currentStroke, activeColor, brushSize, rainbow, onAction]);

  const currentColor = rainbow ? RAINBOW[colorIdx.current] : activeColor;

  return (
    <div className="no-select touch-none">
      <Stage
        ref={stageRef as never}
        width={canvasSize}
        height={canvasSize}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        {/* Template layer */}
        <Layer>
          {regions.map((region) => (
            <Path
              key={region.id}
              data={region.path}
              fill={fills[region.id] || region.defaultFill}
              stroke="#555"
              strokeWidth={1.5 / scale}
              scaleX={scale}
              scaleY={scale}
              onClick={() => handleRegionTap(region.id)}
              onTap={() => handleRegionTap(region.id)}
            />
          ))}
        </Layer>

        {/* Paint layer */}
        <Layer>
          {strokes.map((s, i) => (
            <Line
              key={i}
              points={s.points}
              stroke={s.color}
              strokeWidth={s.width}
              lineCap="round"
              lineJoin="round"
              tension={0.5}
            />
          ))}
          {currentStroke.length >= 4 && (
            <Line
              points={currentStroke}
              stroke={currentColor}
              strokeWidth={brushSize}
              lineCap="round"
              lineJoin="round"
              tension={0.5}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
