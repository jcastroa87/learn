"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary:
    "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700",
  secondary:
    "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100",
  danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
  ghost: "text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm min-h-[44px] min-w-[44px]",
  md: "px-4 py-2.5 text-base min-h-[44px] min-w-[44px]",
  lg: "px-6 py-3 text-lg min-h-[44px] min-w-[44px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
