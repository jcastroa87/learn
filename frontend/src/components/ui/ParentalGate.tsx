"use client";

import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";

interface ParentalGateProps {
  onPass: () => void;
  onCancel: () => void;
}

function generateProblem(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 20) + 10;
  const b = Math.floor(Math.random() * 10) + 5;
  const isAdd = Math.random() > 0.5;
  if (isAdd) {
    return { question: `${a} + ${b} = ?`, answer: a + b };
  }
  return { question: `${a} - ${b} = ?`, answer: a - b };
}

export default function ParentalGate({ onPass, onCancel }: ParentalGateProps) {
  const [problem] = useState(generateProblem);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = useCallback(() => {
    if (parseInt(input, 10) === problem.answer) {
      onPass();
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 1500);
    }
  }, [input, problem.answer, onPass]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 p-8 animate-slide-up">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔒</div>
          <h2 className="text-xl font-extrabold text-gray-800">
            Parents Only
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Solve this to continue
          </p>
        </div>

        <div className="text-center mb-6">
          <p className="text-3xl font-extrabold text-indigo-600">
            {problem.question}
          </p>
        </div>

        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className={`w-full rounded-2xl border-3 px-4 py-4 text-2xl text-center font-bold focus:outline-none focus:ring-3 transition-all ${
            error
              ? "border-red-400 bg-red-50 focus:ring-red-300 animate-wiggle"
              : "border-gray-200 focus:ring-indigo-300 focus:border-indigo-400"
          }`}
          autoFocus
          inputMode="numeric"
        />

        {error && (
          <p className="text-red-500 text-sm font-bold text-center mt-2">
            Try again!
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            className="flex-1"
          >
            Check
          </Button>
        </div>
      </div>
    </div>
  );
}
