export interface ABCPuzzle {
  letter: string;
  image: string;
  word: Record<string, string>;
  distractors: string[];
}

export const ABC_PUZZLES: ABCPuzzle[] = [
  { letter: "A", image: "🍎", word: { en: "Apple", es: "Apple", ru: "Apple" }, distractors: ["B", "C", "D"] },
  { letter: "B", image: "🐻", word: { en: "Bear", es: "Bear", ru: "Bear" }, distractors: ["A", "D", "G"] },
  { letter: "C", image: "🐱", word: { en: "Cat", es: "Cat", ru: "Cat" }, distractors: ["B", "D", "G"] },
  { letter: "D", image: "🐶", word: { en: "Dog", es: "Dog", ru: "Dog" }, distractors: ["B", "F", "P"] },
  { letter: "E", image: "🐘", word: { en: "Elephant", es: "Elephant", ru: "Elephant" }, distractors: ["A", "F", "B"] },
  { letter: "F", image: "🐸", word: { en: "Frog", es: "Frog", ru: "Frog" }, distractors: ["P", "E", "T"] },
  { letter: "G", image: "🦒", word: { en: "Giraffe", es: "Giraffe", ru: "Giraffe" }, distractors: ["C", "J", "Q"] },
  { letter: "H", image: "🐴", word: { en: "Horse", es: "Horse", ru: "Horse" }, distractors: ["N", "M", "K"] },
  { letter: "I", image: "🍦", word: { en: "Ice cream", es: "Ice cream", ru: "Ice cream" }, distractors: ["L", "T", "E"] },
  { letter: "J", image: "🪼", word: { en: "Jellyfish", es: "Jellyfish", ru: "Jellyfish" }, distractors: ["G", "I", "Y"] },
  { letter: "K", image: "🪁", word: { en: "Kite", es: "Kite", ru: "Kite" }, distractors: ["H", "X", "R"] },
  { letter: "L", image: "🦁", word: { en: "Lion", es: "Lion", ru: "Lion" }, distractors: ["I", "T", "J"] },
  { letter: "M", image: "🐒", word: { en: "Monkey", es: "Monkey", ru: "Monkey" }, distractors: ["N", "W", "H"] },
  { letter: "N", image: "🥜", word: { en: "Nut", es: "Nut", ru: "Nut" }, distractors: ["M", "H", "U"] },
  { letter: "O", image: "🐙", word: { en: "Octopus", es: "Octopus", ru: "Octopus" }, distractors: ["Q", "D", "C"] },
  { letter: "P", image: "🐧", word: { en: "Penguin", es: "Penguin", ru: "Penguin" }, distractors: ["B", "D", "R"] },
  { letter: "Q", image: "👸", word: { en: "Queen", es: "Queen", ru: "Queen" }, distractors: ["O", "G", "D"] },
  { letter: "R", image: "🐰", word: { en: "Rabbit", es: "Rabbit", ru: "Rabbit" }, distractors: ["P", "B", "K"] },
  { letter: "S", image: "⭐", word: { en: "Star", es: "Star", ru: "Star" }, distractors: ["Z", "C", "X"] },
  { letter: "T", image: "🐢", word: { en: "Turtle", es: "Turtle", ru: "Turtle" }, distractors: ["L", "I", "F"] },
  { letter: "U", image: "☂️", word: { en: "Umbrella", es: "Umbrella", ru: "Umbrella" }, distractors: ["V", "N", "A"] },
  { letter: "V", image: "🌋", word: { en: "Volcano", es: "Volcano", ru: "Volcano" }, distractors: ["U", "W", "Y"] },
  { letter: "W", image: "🐋", word: { en: "Whale", es: "Whale", ru: "Whale" }, distractors: ["M", "V", "N"] },
  { letter: "X", image: "🎸", word: { en: "Xylophone", es: "Xylophone", ru: "Xylophone" }, distractors: ["Z", "S", "K"] },
  { letter: "Y", image: "🪀", word: { en: "Yo-yo", es: "Yo-yo", ru: "Yo-yo" }, distractors: ["V", "J", "I"] },
  { letter: "Z", image: "🦓", word: { en: "Zebra", es: "Zebra", ru: "Zebra" }, distractors: ["S", "X", "N"] },
];

export function getPuzzleByLetter(letter: string): ABCPuzzle | undefined {
  return ABC_PUZZLES.find((p) => p.letter === letter);
}

export function getShuffledOptions(puzzle: ABCPuzzle): string[] {
  const options = [puzzle.letter, ...puzzle.distractors];
  return options.sort(() => Math.random() - 0.5);
}
