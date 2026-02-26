"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { UndoAction } from "@/hooks/useUndoRedo";

const Stage = dynamic(() => import("react-konva").then((m) => m.Stage), { ssr: false });
const Layer = dynamic(() => import("react-konva").then((m) => m.Layer), { ssr: false });
const Rect = dynamic(() => import("react-konva").then((m) => m.Rect), { ssr: false });
const Line = dynamic(() => import("react-konva").then((m) => m.Line), { ssr: false });

export type DrawingTool = "brush" | "eraser";

interface DrawingCanvasProps {
  canvasSize: number;
  activeColor: string;
  tool: DrawingTool;
  brushSize: number;
  rainbow: boolean;
  backgroundColor: string;
  onAction?: (action: UndoAction) => void;
  stageRef?: React.RefObject<ReturnType<typeof import("konva")["default"]["Stage"]> | null>;
}

const RAINBOW = ["#FF0000", "#FF7700", "#FFFF00", "#00FF00", "#0077FF", "#8800FF", "#FF00FF"];

export default function DrawingCanvas({
  canvasSize,
  activeColor,
  tool,
  brushSize,
  rainbow,
  backgroundColor,
  onAction,
  stageRef,
}: DrawingCanvasProps) {
  const [strokes, setStrokes] = useState<{ points: number[]; color: string; width: number; eraser: boolean }[]>([]);
  const [currentStroke, setCurrentStroke] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const colorIdx = useRef(0);

  const handlePointerDown = useCallback(
    (e: { evt: { offsetX: number; offsetY: number } }) => {
      setIsDrawing(true);
      const { offsetX, offsetY } = e.evt;
      setCurrentStroke([offsetX, offsetY]);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: { evt: { offsetX: number; offsetY: number } }) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = e.evt;
      setCurrentStroke((prev) => [...prev, offsetX, offsetY]);
      if (rainbow) colorIdx.current = (colorIdx.current + 1) % RAINBOW.length;
    },
    [isDrawing, rainbow]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length >= 4) {
      const isEraser = tool === "eraser";
      const color = isEraser ? backgroundColor : rainbow ? RAINBOW[colorIdx.current] : activeColor;
      const width = isEraser ? brushSize * 3 : brushSize;
      setStrokes((prev) => [...prev, { points: currentStroke, color, width, eraser: isEraser }]);
      onAction?.({ type: "stroke", points: currentStroke, color, width });
    }
    setCurrentStroke([]);
  }, [isDrawing, currentStroke, activeColor, brushSize, rainbow, tool, backgroundColor, onAction]);

  const currentColor = tool === "eraser"
    ? backgroundColor
    : rainbow
      ? RAINBOW[colorIdx.current]
      : activeColor;

  const currentWidth = tool === "eraser" ? brushSize * 3 : brushSize;

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
        {/* Background layer */}
        <Layer>
          <Rect x={0} y={0} width={canvasSize} height={canvasSize} fill={backgroundColor} />
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
              globalCompositeOperation={s.eraser ? "destination-out" : "source-over"}
            />
          ))}
          {currentStroke.length >= 4 && (
            <Line
              points={currentStroke}
              stroke={currentColor}
              strokeWidth={currentWidth}
              lineCap="round"
              lineJoin="round"
              tension={0.5}
              globalCompositeOperation={tool === "eraser" ? "destination-out" : "source-over"}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
