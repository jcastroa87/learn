"use client";

import { useEffect, useState, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
}

interface CelebrationOverlayProps {
  show: boolean;
  message?: string;
  onDone?: () => void;
  duration?: number;
}

const CONFETTI_COLORS = [
  "#FF6B6B", "#FF9F43", "#FECA57", "#48DBFB",
  "#0ABDE3", "#A29BFE", "#FF6BCB", "#34D399",
  "#818CF8", "#FB923C",
];

const STARS = ["⭐", "🌟", "✨"];

export default function CelebrationOverlay({
  show,
  message = "",
  onDone,
  duration = 2500,
}: CelebrationOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);

  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 0.5,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }
    return newParticles;
  }, []);

  useEffect(() => {
    if (show) {
      setParticles(generateParticles());
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, duration);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [show, duration, onDone, generateParticles]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Confetti particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `confetti-fall ${1.5 + Math.random()}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}

      {/* Central stars burst */}
      {STARS.map((star, i) => (
        <div
          key={`star-${i}`}
          className="absolute text-5xl"
          style={{
            animation: `star-burst 1s ease-out ${i * 0.15}s forwards`,
            top: `${40 + (i - 1) * 10}%`,
            left: `${40 + (i - 1) * 10}%`,
          }}
        >
          {star}
        </div>
      ))}

      {/* Message */}
      {message && (
        <div className="animate-bounce-in">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl px-8 py-5 shadow-2xl border-2 border-yellow-300">
            <p className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
