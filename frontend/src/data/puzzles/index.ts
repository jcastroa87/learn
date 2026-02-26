export type PuzzleDifficulty = "easy" | "medium" | "hard";

export interface PuzzleTemplate {
  id: string;
  category: string;
  name: Record<string, string>;
  image: string; // emoji representation
  difficulty: PuzzleDifficulty[];
  gridColor: string;
}

export const PUZZLE_CATEGORIES = ["animals", "vehicles", "food", "nature"] as const;
export type PuzzleCategory = (typeof PUZZLE_CATEGORIES)[number];

export const PUZZLE_TEMPLATES: PuzzleTemplate[] = [
  // Animals
  { id: "puzzle-cat", category: "animals", name: { es: "Gato", en: "Cat", ru: "Кошка" }, image: "🐱", difficulty: ["easy", "medium", "hard"], gridColor: "#FFE4B5" },
  { id: "puzzle-dog", category: "animals", name: { es: "Perro", en: "Dog", ru: "Собака" }, image: "🐶", difficulty: ["easy", "medium", "hard"], gridColor: "#D2B48C" },
  { id: "puzzle-elephant", category: "animals", name: { es: "Elefante", en: "Elephant", ru: "Слон" }, image: "🐘", difficulty: ["easy", "medium", "hard"], gridColor: "#B0C4DE" },

  // Vehicles
  { id: "puzzle-car", category: "vehicles", name: { es: "Coche", en: "Car", ru: "Машина" }, image: "🚗", difficulty: ["easy", "medium", "hard"], gridColor: "#FFB4A2" },
  { id: "puzzle-airplane", category: "vehicles", name: { es: "Avión", en: "Airplane", ru: "Самолёт" }, image: "✈️", difficulty: ["easy", "medium", "hard"], gridColor: "#87CEEB" },
  { id: "puzzle-boat", category: "vehicles", name: { es: "Barco", en: "Boat", ru: "Лодка" }, image: "⛵", difficulty: ["easy", "medium", "hard"], gridColor: "#ADD8E6" },

  // Food
  { id: "puzzle-pizza", category: "food", name: { es: "Pizza", en: "Pizza", ru: "Пицца" }, image: "🍕", difficulty: ["easy", "medium", "hard"], gridColor: "#FFD700" },
  { id: "puzzle-apple", category: "food", name: { es: "Manzana", en: "Apple", ru: "Яблоко" }, image: "🍎", difficulty: ["easy", "medium", "hard"], gridColor: "#FF6347" },
  { id: "puzzle-cake", category: "food", name: { es: "Pastel", en: "Cake", ru: "Торт" }, image: "🎂", difficulty: ["easy", "medium", "hard"], gridColor: "#FFB6C1" },

  // Nature
  { id: "puzzle-sun", category: "nature", name: { es: "Sol", en: "Sun", ru: "Солнце" }, image: "☀️", difficulty: ["easy", "medium", "hard"], gridColor: "#FFF44F" },
  { id: "puzzle-flower", category: "nature", name: { es: "Flor", en: "Flower", ru: "Цветок" }, image: "🌸", difficulty: ["easy", "medium", "hard"], gridColor: "#FFB7C5" },
  { id: "puzzle-tree", category: "nature", name: { es: "Árbol", en: "Tree", ru: "Дерево" }, image: "🌳", difficulty: ["easy", "medium", "hard"], gridColor: "#90EE90" },
];

export function getPuzzlesByCategory(category: string): PuzzleTemplate[] {
  return PUZZLE_TEMPLATES.filter((p) => p.category === category);
}

export function getPuzzleById(id: string): PuzzleTemplate | undefined {
  return PUZZLE_TEMPLATES.find((p) => p.id === id);
}

export function getPieceCount(difficulty: PuzzleDifficulty): number {
  switch (difficulty) {
    case "easy": return 4;
    case "medium": return 9;
    case "hard": return 16;
  }
}

export function getGridSize(difficulty: PuzzleDifficulty): number {
  switch (difficulty) {
    case "easy": return 2;
    case "medium": return 3;
    case "hard": return 4;
  }
}
