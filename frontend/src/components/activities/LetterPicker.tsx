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
    <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
      {letters.map((letter) => {
        const isActive = letter === activeLetter;
        const isCompleted = completedLetters.has(letter);
        const isAttempted = attemptedLetters.has(letter);

        let style =
          "bg-white text-gray-500 border-2 border-gray-200 shadow-sm";
        if (isCompleted)
          style =
            "bg-gradient-to-b from-green-400 to-green-500 text-white border-2 border-green-400 shadow-md shadow-green-500/30";
        else if (isAttempted)
          style =
            "bg-gradient-to-b from-amber-300 to-amber-400 text-white border-2 border-amber-400 shadow-md shadow-amber-400/30";
        if (isActive)
          style += " ring-3 ring-indigo-400 ring-offset-2 scale-110";

        return (
          <button
            key={letter}
            onClick={() => onSelect(letter)}
            className={`w-11 h-11 rounded-xl font-bold text-sm flex items-center justify-center transition-all shrink-0 min-h-[44px] min-w-[44px] ${style}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
