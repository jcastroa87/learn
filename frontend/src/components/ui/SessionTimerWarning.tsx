"use client";

interface SessionTimerWarningProps {
  timeDisplay: string;
}

export default function SessionTimerWarning({
  timeDisplay,
}: SessionTimerWarningProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <div className="absolute inset-0 border-[6px] border-red-400 rounded-lg animate-pulse" />
      <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg pointer-events-auto">
        {timeDisplay}
      </div>
    </div>
  );
}
