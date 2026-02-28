"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const COLORS = ["#818cf8", "#f472b6", "#fb923c", "#34d399"];

export default function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]}`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <path
          fill="none"
          stroke="url(#spinner-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          d="M4 12a8 8 0 018-8"
        />
        <defs>
          <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS[0]} />
            <stop offset="33%" stopColor={COLORS[1]} />
            <stop offset="66%" stopColor={COLORS[2]} />
            <stop offset="100%" stopColor={COLORS[3]} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
