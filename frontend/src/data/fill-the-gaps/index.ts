export interface SceneObject {
  id: string;
  content: string;
  ttsText: Record<string, string>;
  targetX: number;
  targetY: number;
}

export interface Scene {
  id: string;
  theme: string;
  name: Record<string, string>;
  background: string;
  backgroundColor: string;
  objects: SceneObject[];
}

export const SCENE_THEMES = ["farm", "ocean", "space", "kitchen"] as const;
export type SceneTheme = (typeof SCENE_THEMES)[number];

export const SCENES: Scene[] = [
  // Farm
  {
    id: "farm-1",
    theme: "farm",
    name: { es: "Granja 1", en: "Farm 1", ru: "Ферма 1" },
    background: "🌾",
    backgroundColor: "#90EE90",
    objects: [
      { id: "cow", content: "🐄", ttsText: { es: "vaca", en: "cow", ru: "корова" }, targetX: 15, targetY: 30 },
      { id: "pig", content: "🐷", ttsText: { es: "cerdo", en: "pig", ru: "свинья" }, targetX: 45, targetY: 50 },
      { id: "chicken", content: "🐔", ttsText: { es: "gallina", en: "chicken", ru: "курица" }, targetX: 75, targetY: 35 },
      { id: "horse", content: "🐴", ttsText: { es: "caballo", en: "horse", ru: "лошадь" }, targetX: 30, targetY: 70 },
      { id: "sheep", content: "🐑", ttsText: { es: "oveja", en: "sheep", ru: "овца" }, targetX: 60, targetY: 65 },
    ],
  },
  {
    id: "farm-2",
    theme: "farm",
    name: { es: "Granja 2", en: "Farm 2", ru: "Ферма 2" },
    background: "🏡",
    backgroundColor: "#98FB98",
    objects: [
      { id: "duck", content: "🦆", ttsText: { es: "pato", en: "duck", ru: "утка" }, targetX: 20, targetY: 40 },
      { id: "rabbit", content: "🐰", ttsText: { es: "conejo", en: "rabbit", ru: "кролик" }, targetX: 50, targetY: 25 },
      { id: "cat", content: "🐱", ttsText: { es: "gato", en: "cat", ru: "кошка" }, targetX: 70, targetY: 55 },
      { id: "dog", content: "🐶", ttsText: { es: "perro", en: "dog", ru: "собака" }, targetX: 35, targetY: 65 },
    ],
  },

  // Ocean
  {
    id: "ocean-1",
    theme: "ocean",
    name: { es: "Océano 1", en: "Ocean 1", ru: "Океан 1" },
    background: "🌊",
    backgroundColor: "#87CEEB",
    objects: [
      { id: "fish", content: "🐟", ttsText: { es: "pez", en: "fish", ru: "рыба" }, targetX: 20, targetY: 35 },
      { id: "whale", content: "🐳", ttsText: { es: "ballena", en: "whale", ru: "кит" }, targetX: 55, targetY: 45 },
      { id: "octopus", content: "🐙", ttsText: { es: "pulpo", en: "octopus", ru: "осьминог" }, targetX: 75, targetY: 70 },
      { id: "turtle", content: "🐢", ttsText: { es: "tortuga", en: "turtle", ru: "черепаха" }, targetX: 35, targetY: 60 },
      { id: "crab", content: "🦀", ttsText: { es: "cangrejo", en: "crab", ru: "краб" }, targetX: 60, targetY: 25 },
    ],
  },
  {
    id: "ocean-2",
    theme: "ocean",
    name: { es: "Océano 2", en: "Ocean 2", ru: "Океан 2" },
    background: "🏖️",
    backgroundColor: "#ADD8E6",
    objects: [
      { id: "dolphin", content: "🐬", ttsText: { es: "delfín", en: "dolphin", ru: "дельфин" }, targetX: 25, targetY: 30 },
      { id: "starfish", content: "⭐", ttsText: { es: "estrella", en: "starfish", ru: "морская звезда" }, targetX: 50, targetY: 70 },
      { id: "seahorse", content: "🦑", ttsText: { es: "calamar", en: "squid", ru: "кальмар" }, targetX: 70, targetY: 45 },
      { id: "shell", content: "🐚", ttsText: { es: "concha", en: "shell", ru: "ракушка" }, targetX: 40, targetY: 55 },
    ],
  },

  // Space
  {
    id: "space-1",
    theme: "space",
    name: { es: "Espacio 1", en: "Space 1", ru: "Космос 1" },
    background: "🌌",
    backgroundColor: "#191970",
    objects: [
      { id: "rocket", content: "🚀", ttsText: { es: "cohete", en: "rocket", ru: "ракета" }, targetX: 25, targetY: 30 },
      { id: "star", content: "⭐", ttsText: { es: "estrella", en: "star", ru: "звезда" }, targetX: 60, targetY: 20 },
      { id: "moon", content: "🌙", ttsText: { es: "luna", en: "moon", ru: "луна" }, targetX: 75, targetY: 45 },
      { id: "planet", content: "🪐", ttsText: { es: "planeta", en: "planet", ru: "планета" }, targetX: 40, targetY: 60 },
      { id: "alien", content: "👽", ttsText: { es: "alien", en: "alien", ru: "пришелец" }, targetX: 15, targetY: 70 },
    ],
  },
  {
    id: "space-2",
    theme: "space",
    name: { es: "Espacio 2", en: "Space 2", ru: "Космос 2" },
    background: "🌠",
    backgroundColor: "#2F2F4F",
    objects: [
      { id: "satellite", content: "🛰️", ttsText: { es: "satélite", en: "satellite", ru: "спутник" }, targetX: 30, targetY: 25 },
      { id: "ufo", content: "🛸", ttsText: { es: "ovni", en: "UFO", ru: "НЛО" }, targetX: 65, targetY: 40 },
      { id: "comet", content: "☄️", ttsText: { es: "cometa", en: "comet", ru: "комета" }, targetX: 45, targetY: 65 },
      { id: "astronaut", content: "👨‍🚀", ttsText: { es: "astronauta", en: "astronaut", ru: "космонавт" }, targetX: 20, targetY: 50 },
    ],
  },

  // Kitchen
  {
    id: "kitchen-1",
    theme: "kitchen",
    name: { es: "Cocina 1", en: "Kitchen 1", ru: "Кухня 1" },
    background: "🍳",
    backgroundColor: "#FFF8DC",
    objects: [
      { id: "apple", content: "🍎", ttsText: { es: "manzana", en: "apple", ru: "яблоко" }, targetX: 20, targetY: 35 },
      { id: "bread", content: "🍞", ttsText: { es: "pan", en: "bread", ru: "хлеб" }, targetX: 50, targetY: 30 },
      { id: "cheese", content: "🧀", ttsText: { es: "queso", en: "cheese", ru: "сыр" }, targetX: 75, targetY: 45 },
      { id: "milk", content: "🥛", ttsText: { es: "leche", en: "milk", ru: "молоко" }, targetX: 35, targetY: 65 },
      { id: "egg", content: "🥚", ttsText: { es: "huevo", en: "egg", ru: "яйцо" }, targetX: 60, targetY: 60 },
    ],
  },
  {
    id: "kitchen-2",
    theme: "kitchen",
    name: { es: "Cocina 2", en: "Kitchen 2", ru: "Кухня 2" },
    background: "🥘",
    backgroundColor: "#FAEBD7",
    objects: [
      { id: "carrot", content: "🥕", ttsText: { es: "zanahoria", en: "carrot", ru: "морковь" }, targetX: 25, targetY: 40 },
      { id: "tomato", content: "🍅", ttsText: { es: "tomate", en: "tomato", ru: "помидор" }, targetX: 55, targetY: 30 },
      { id: "banana", content: "🍌", ttsText: { es: "plátano", en: "banana", ru: "банан" }, targetX: 70, targetY: 55 },
      { id: "cake", content: "🍰", ttsText: { es: "pastel", en: "cake", ru: "торт" }, targetX: 40, targetY: 70 },
    ],
  },
];

export function getScenesByTheme(theme: string): Scene[] {
  return SCENES.filter((s) => s.theme === theme);
}

export function getSceneById(id: string): Scene | undefined {
  return SCENES.find((s) => s.id === id);
}
