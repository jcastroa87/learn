export interface ABCPuzzle {
  letter: string;
  image: string;
  word: string;
  distractors: string[];
}

const PUZZLES_EN: ABCPuzzle[] = [
  { letter: "A", image: "🍎", word: "Apple", distractors: ["B", "C", "D"] },
  { letter: "B", image: "🐻", word: "Bear", distractors: ["A", "D", "G"] },
  { letter: "C", image: "🐱", word: "Cat", distractors: ["B", "D", "G"] },
  { letter: "D", image: "🐶", word: "Dog", distractors: ["B", "F", "P"] },
  { letter: "E", image: "🐘", word: "Elephant", distractors: ["A", "F", "B"] },
  { letter: "F", image: "🐸", word: "Frog", distractors: ["P", "E", "T"] },
  { letter: "G", image: "🦒", word: "Giraffe", distractors: ["C", "J", "Q"] },
  { letter: "H", image: "🐴", word: "Horse", distractors: ["N", "M", "K"] },
  { letter: "I", image: "🍦", word: "Ice cream", distractors: ["L", "T", "E"] },
  { letter: "J", image: "🪼", word: "Jellyfish", distractors: ["G", "I", "Y"] },
  { letter: "K", image: "🪁", word: "Kite", distractors: ["H", "X", "R"] },
  { letter: "L", image: "🦁", word: "Lion", distractors: ["I", "T", "J"] },
  { letter: "M", image: "🐒", word: "Monkey", distractors: ["N", "W", "H"] },
  { letter: "N", image: "🥜", word: "Nut", distractors: ["M", "H", "U"] },
  { letter: "O", image: "🐙", word: "Octopus", distractors: ["Q", "D", "C"] },
  { letter: "P", image: "🐧", word: "Penguin", distractors: ["B", "D", "R"] },
  { letter: "Q", image: "👸", word: "Queen", distractors: ["O", "G", "D"] },
  { letter: "R", image: "🐰", word: "Rabbit", distractors: ["P", "B", "K"] },
  { letter: "S", image: "⭐", word: "Star", distractors: ["Z", "C", "X"] },
  { letter: "T", image: "🐢", word: "Turtle", distractors: ["L", "I", "F"] },
  { letter: "U", image: "☂️", word: "Umbrella", distractors: ["V", "N", "A"] },
  { letter: "V", image: "🌋", word: "Volcano", distractors: ["U", "W", "Y"] },
  { letter: "W", image: "🐋", word: "Whale", distractors: ["M", "V", "N"] },
  { letter: "X", image: "🎸", word: "Xylophone", distractors: ["Z", "S", "K"] },
  { letter: "Y", image: "🪀", word: "Yo-yo", distractors: ["V", "J", "I"] },
  { letter: "Z", image: "🦓", word: "Zebra", distractors: ["S", "X", "N"] },
];

const PUZZLES_ES: ABCPuzzle[] = [
  { letter: "A", image: "✈️", word: "Avión", distractors: ["B", "C", "D"] },
  { letter: "B", image: "🐋", word: "Ballena", distractors: ["A", "D", "G"] },
  { letter: "C", image: "🏠", word: "Casa", distractors: ["B", "D", "G"] },
  { letter: "D", image: "🐬", word: "Delfín", distractors: ["B", "F", "P"] },
  { letter: "E", image: "⭐", word: "Estrella", distractors: ["A", "F", "B"] },
  { letter: "F", image: "🌸", word: "Flor", distractors: ["P", "E", "T"] },
  { letter: "G", image: "🐱", word: "Gato", distractors: ["C", "J", "Q"] },
  { letter: "H", image: "🍦", word: "Helado", distractors: ["N", "M", "K"] },
  { letter: "I", image: "🏝️", word: "Isla", distractors: ["L", "T", "E"] },
  { letter: "J", image: "🦒", word: "Jirafa", distractors: ["G", "I", "Y"] },
  { letter: "K", image: "🥝", word: "Kiwi", distractors: ["H", "X", "R"] },
  { letter: "L", image: "🦁", word: "León", distractors: ["I", "T", "J"] },
  { letter: "M", image: "🐒", word: "Mono", distractors: ["N", "W", "H"] },
  { letter: "N", image: "☁️", word: "Nube", distractors: ["M", "H", "U"] },
  { letter: "O", image: "🐻", word: "Oso", distractors: ["Q", "D", "C"] },
  { letter: "P", image: "🐧", word: "Pingüino", distractors: ["B", "D", "R"] },
  { letter: "Q", image: "🧀", word: "Queso", distractors: ["O", "G", "D"] },
  { letter: "R", image: "🌹", word: "Rosa", distractors: ["P", "B", "K"] },
  { letter: "S", image: "☀️", word: "Sol", distractors: ["Z", "C", "X"] },
  { letter: "T", image: "🐢", word: "Tortuga", distractors: ["L", "I", "F"] },
  { letter: "U", image: "🍇", word: "Uva", distractors: ["V", "N", "A"] },
  { letter: "V", image: "🐄", word: "Vaca", distractors: ["U", "W", "Y"] },
  { letter: "W", image: "🧇", word: "Waffle", distractors: ["M", "V", "N"] },
  { letter: "X", image: "🎸", word: "Xilófono", distractors: ["Z", "S", "K"] },
  { letter: "Y", image: "🛥️", word: "Yate", distractors: ["V", "J", "I"] },
  { letter: "Z", image: "🥕", word: "Zanahoria", distractors: ["S", "X", "N"] },
];

const PUZZLES_RU: ABCPuzzle[] = [
  { letter: "А", image: "🍉", word: "Арбуз", distractors: ["Б", "В", "Г"] },
  { letter: "Б", image: "🦋", word: "Бабочка", distractors: ["А", "Г", "Д"] },
  { letter: "В", image: "🐺", word: "Волк", distractors: ["Б", "Д", "Е"] },
  { letter: "Г", image: "🍄", word: "Гриб", distractors: ["В", "Д", "Ж"] },
  { letter: "Д", image: "🏠", word: "Дом", distractors: ["Б", "Г", "П"] },
  { letter: "Е", image: "🦝", word: "Енот", distractors: ["А", "Ё", "И"] },
  { letter: "Ё", image: "🦔", word: "Ёжик", distractors: ["Е", "Ж", "И"] },
  { letter: "Ж", image: "🦒", word: "Жираф", distractors: ["З", "И", "Ш"] },
  { letter: "З", image: "🐰", word: "Заяц", distractors: ["Ж", "И", "Э"] },
  { letter: "И", image: "🦃", word: "Индюк", distractors: ["Й", "Л", "Н"] },
  { letter: "Й", image: "🫙", word: "Йогурт", distractors: ["И", "К", "Л"] },
  { letter: "К", image: "🐈", word: "Кот", distractors: ["Х", "Ж", "Р"] },
  { letter: "Л", image: "🌙", word: "Луна", distractors: ["И", "М", "Н"] },
  { letter: "М", image: "🧸", word: "Мишка", distractors: ["Н", "Л", "И"] },
  { letter: "Н", image: "✂️", word: "Ножницы", distractors: ["М", "П", "И"] },
  { letter: "О", image: "🐵", word: "Обезьяна", distractors: ["С", "Д", "Р"] },
  { letter: "П", image: "🍕", word: "Пицца", distractors: ["Б", "Д", "Р"] },
  { letter: "Р", image: "🐟", word: "Рыба", distractors: ["П", "Б", "К"] },
  { letter: "С", image: "☀️", word: "Солнце", distractors: ["З", "Ц", "Ш"] },
  { letter: "Т", image: "🐯", word: "Тигр", distractors: ["Л", "Г", "Ф"] },
  { letter: "У", image: "🦆", word: "Утка", distractors: ["Ц", "Н", "А"] },
  { letter: "Ф", image: "🍊", word: "Фрукт", distractors: ["Т", "Х", "П"] },
  { letter: "Х", image: "🍞", word: "Хлеб", distractors: ["Ж", "К", "Ф"] },
  { letter: "Ц", image: "🌸", word: "Цветок", distractors: ["С", "Ч", "Щ"] },
  { letter: "Ч", image: "⏰", word: "Часы", distractors: ["Ц", "Ш", "Щ"] },
  { letter: "Ш", image: "🎈", word: "Шарик", distractors: ["Щ", "Ж", "Ч"] },
  { letter: "Щ", image: "🐶", word: "Щенок", distractors: ["Ш", "Ч", "Ц"] },
  { letter: "Э", image: "🍦", word: "Эскимо", distractors: ["Е", "З", "Ю"] },
  { letter: "Ю", image: "🪀", word: "Юла", distractors: ["Я", "У", "Э"] },
  { letter: "Я", image: "🍎", word: "Яблоко", distractors: ["Ю", "А", "Э"] },
];

const puzzlesByLanguage: Record<string, ABCPuzzle[]> = {
  en: PUZZLES_EN,
  es: PUZZLES_ES,
  ru: PUZZLES_RU,
};

export function getABCPuzzles(language: string): ABCPuzzle[] {
  return puzzlesByLanguage[language] || PUZZLES_EN;
}

export function getPuzzleByLetter(letter: string, language: string): ABCPuzzle | undefined {
  return getABCPuzzles(language).find((p) => p.letter === letter);
}

export function getShuffledOptions(puzzle: ABCPuzzle): string[] {
  const options = [puzzle.letter, ...puzzle.distractors];
  return options.sort(() => Math.random() - 0.5);
}
