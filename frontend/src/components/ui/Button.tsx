"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary:
    "bg-gradient-to-b from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 active:from-green-600 active:to-green-700 btn-3d",
  secondary:
    "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 active:bg-gray-100 btn-3d",
  danger:
    "bg-gradient-to-b from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600 active:from-red-600 active:to-red-700 btn-3d",
  ghost:
    "text-gray-600 hover:bg-white/60 active:bg-white/80",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm min-h-[44px] min-w-[44px]",
  md: "px-5 py-3 text-base min-h-[44px] min-w-[44px]",
  lg: "px-7 py-4 text-lg min-h-[44px] min-w-[44px]",
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
      className={`inline-flex items-center justify-center rounded-2xl font-bold transition-all focus:outline-none focus:ring-3 focus:ring-indigo-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
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
