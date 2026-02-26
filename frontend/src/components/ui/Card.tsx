"use client";

import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

const paddings = {
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export default function Card({
  padding = "md",
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-zinc-100 shadow-sm ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
