export interface RecipeStep {
  instruction: Record<string, string>;
  items: string[];
  targetZone: string;
  completionEmoji: string;
}

export interface Recipe {
  id: string;
  name: Record<string, string>;
  icon: string;
  color: string;
  steps: RecipeStep[];
  result: string;
}

export const RECIPES: Recipe[] = [
  {
    id: "pizza",
    name: { en: "Pizza", es: "Pizza", ru: "Пицца" },
    icon: "🍕",
    color: "from-red-400 to-orange-500",
    result: "🍕",
    steps: [
      {
        instruction: { en: "Add the dough!", es: "¡Agrega la masa!", ru: "Добавь тесто!" },
        items: ["🫓", "🥐", "🍞"],
        targetZone: "plate",
        completionEmoji: "🫓",
      },
      {
        instruction: { en: "Add tomato sauce!", es: "¡Agrega salsa de tomate!", ru: "Добавь томатный соус!" },
        items: ["🍅", "🥛", "🍯"],
        targetZone: "plate",
        completionEmoji: "🍅",
      },
      {
        instruction: { en: "Add cheese!", es: "¡Agrega queso!", ru: "Добавь сыр!" },
        items: ["🧀", "🧈", "🥚"],
        targetZone: "plate",
        completionEmoji: "🧀",
      },
      {
        instruction: { en: "Add toppings!", es: "¡Agrega ingredientes!", ru: "Добавь начинку!" },
        items: ["🫑", "🍄", "🌶️"],
        targetZone: "plate",
        completionEmoji: "🫑",
      },
    ],
  },
  {
    id: "salad",
    name: { en: "Salad", es: "Ensalada", ru: "Салат" },
    icon: "🥗",
    color: "from-green-400 to-emerald-500",
    result: "🥗",
    steps: [
      {
        instruction: { en: "Add lettuce!", es: "¡Agrega lechuga!", ru: "Добавь салат!" },
        items: ["🥬", "🧅", "🍠"],
        targetZone: "bowl",
        completionEmoji: "🥬",
      },
      {
        instruction: { en: "Add tomatoes!", es: "¡Agrega tomates!", ru: "Добавь помидоры!" },
        items: ["🍅", "🍎", "🫐"],
        targetZone: "bowl",
        completionEmoji: "🍅",
      },
      {
        instruction: { en: "Add cucumber!", es: "¡Agrega pepino!", ru: "Добавь огурец!" },
        items: ["🥒", "🥕", "🌽"],
        targetZone: "bowl",
        completionEmoji: "🥒",
      },
    ],
  },
  {
    id: "smoothie",
    name: { en: "Smoothie", es: "Batido", ru: "Смузи" },
    icon: "🥤",
    color: "from-purple-400 to-pink-500",
    result: "🥤",
    steps: [
      {
        instruction: { en: "Add banana!", es: "¡Agrega plátano!", ru: "Добавь банан!" },
        items: ["🍌", "🥕", "🌶️"],
        targetZone: "blender",
        completionEmoji: "🍌",
      },
      {
        instruction: { en: "Add strawberries!", es: "¡Agrega fresas!", ru: "Добавь клубнику!" },
        items: ["🍓", "🍒", "🫐"],
        targetZone: "blender",
        completionEmoji: "🍓",
      },
      {
        instruction: { en: "Add milk!", es: "¡Agrega leche!", ru: "Добавь молоко!" },
        items: ["🥛", "🧃", "🍺"],
        targetZone: "blender",
        completionEmoji: "🥛",
      },
    ],
  },
  {
    id: "sandwich",
    name: { en: "Sandwich", es: "Sándwich", ru: "Бутерброд" },
    icon: "🥪",
    color: "from-amber-400 to-yellow-500",
    result: "🥪",
    steps: [
      {
        instruction: { en: "Add bread!", es: "¡Agrega pan!", ru: "Добавь хлеб!" },
        items: ["🍞", "🥐", "🫓"],
        targetZone: "plate",
        completionEmoji: "🍞",
      },
      {
        instruction: { en: "Add ham!", es: "¡Agrega jamón!", ru: "Добавь ветчину!" },
        items: ["🥩", "🍗", "🥓"],
        targetZone: "plate",
        completionEmoji: "🥩",
      },
      {
        instruction: { en: "Add lettuce!", es: "¡Agrega lechuga!", ru: "Добавь салат!" },
        items: ["🥬", "🥒", "🌽"],
        targetZone: "plate",
        completionEmoji: "🥬",
      },
    ],
  },
];

export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}
