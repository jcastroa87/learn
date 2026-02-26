"use client";

interface LetterPickerProps {
  letters: string[];
  activeLetter: string;
  completedLetters: Set<string>;
  attemptedLetters: Set<string>;
  onSelect: (letter: string) => void;
}

export default function LetterPicker({
  letters,
  activeLetter,
  completedLetters,
  attemptedLetters,
  onSelect,
}: LetterPickerProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto py-2 px-1 no-scrollbar">
      {letters.map((letter) => {
        const isActive = letter === activeLetter;
        const isCompleted = completedLetters.has(letter);
        const isAttempted = attemptedLetters.has(letter);

        let bgColor = "bg-zinc-100 text-zinc-600";
        if (isCompleted) bgColor = "bg-emerald-500 text-white";
        else if (isAttempted) bgColor = "bg-amber-200 text-amber-800";
        if (isActive) bgColor += " ring-2 ring-emerald-400 scale-110";

        return (
          <button
            key={letter}
            onClick={() => onSelect(letter)}
            className={`w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all shrink-0 min-h-[44px] min-w-[44px] ${bgColor}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
