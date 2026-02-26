export interface SortingItem {
  id: string;
  content: string;
  ttsText: Record<string, string>;
  correctBin: string;
}

export interface SortingRound {
  id: string;
  category: string;
  name: Record<string, string>;
  bins: { id: string; label: Record<string, string>; icon: string }[];
  items: SortingItem[];
}

export const SORTING_CATEGORIES = ["animals", "colors", "food"] as const;
export type SortingCategory = (typeof SORTING_CATEGORIES)[number];

export const SORTING_ROUNDS: SortingRound[] = [
  // Animals by habitat
  {
    id: "animals-habitat-1",
    category: "animals",
    name: { es: "Animales por hábitat", en: "Animals by habitat", ru: "Животные по среде обитания" },
    bins: [
      { id: "farm", label: { es: "Granja", en: "Farm", ru: "Ферма" }, icon: "🏡" },
      { id: "ocean", label: { es: "Océano", en: "Ocean", ru: "Океан" }, icon: "🌊" },
    ],
    items: [
      { id: "cow", content: "🐄", ttsText: { es: "vaca", en: "cow", ru: "корова" }, correctBin: "farm" },
      { id: "fish", content: "🐟", ttsText: { es: "pez", en: "fish", ru: "рыба" }, correctBin: "ocean" },
      { id: "pig", content: "🐷", ttsText: { es: "cerdo", en: "pig", ru: "свинья" }, correctBin: "farm" },
      { id: "whale", content: "🐳", ttsText: { es: "ballena", en: "whale", ru: "кит" }, correctBin: "ocean" },
      { id: "chicken", content: "🐔", ttsText: { es: "gallina", en: "chicken", ru: "курица" }, correctBin: "farm" },
      { id: "octopus", content: "🐙", ttsText: { es: "pulpo", en: "octopus", ru: "осьминог" }, correctBin: "ocean" },
    ],
  },
  {
    id: "animals-habitat-2",
    category: "animals",
    name: { es: "Selva y bosque", en: "Jungle and forest", ru: "Джунгли и лес" },
    bins: [
      { id: "jungle", label: { es: "Selva", en: "Jungle", ru: "Джунгли" }, icon: "🌴" },
      { id: "forest", label: { es: "Bosque", en: "Forest", ru: "Лес" }, icon: "🌲" },
    ],
    items: [
      { id: "monkey", content: "🐒", ttsText: { es: "mono", en: "monkey", ru: "обезьяна" }, correctBin: "jungle" },
      { id: "bear", content: "🐻", ttsText: { es: "oso", en: "bear", ru: "медведь" }, correctBin: "forest" },
      { id: "parrot", content: "🦜", ttsText: { es: "loro", en: "parrot", ru: "попугай" }, correctBin: "jungle" },
      { id: "deer", content: "🦌", ttsText: { es: "ciervo", en: "deer", ru: "олень" }, correctBin: "forest" },
      { id: "snake", content: "🐍", ttsText: { es: "serpiente", en: "snake", ru: "змея" }, correctBin: "jungle" },
      { id: "owl", content: "🦉", ttsText: { es: "búho", en: "owl", ru: "сова" }, correctBin: "forest" },
    ],
  },
  {
    id: "animals-habitat-3",
    category: "animals",
    name: { es: "Cielo y tierra", en: "Sky and ground", ru: "Небо и земля" },
    bins: [
      { id: "sky", label: { es: "Cielo", en: "Sky", ru: "Небо" }, icon: "☁️" },
      { id: "ground", label: { es: "Tierra", en: "Ground", ru: "Земля" }, icon: "🌍" },
    ],
    items: [
      { id: "eagle", content: "🦅", ttsText: { es: "águila", en: "eagle", ru: "орёл" }, correctBin: "sky" },
      { id: "rabbit", content: "🐰", ttsText: { es: "conejo", en: "rabbit", ru: "кролик" }, correctBin: "ground" },
      { id: "butterfly", content: "🦋", ttsText: { es: "mariposa", en: "butterfly", ru: "бабочка" }, correctBin: "sky" },
      { id: "turtle", content: "🐢", ttsText: { es: "tortuga", en: "turtle", ru: "черепаха" }, correctBin: "ground" },
      { id: "bat", content: "🦇", ttsText: { es: "murciélago", en: "bat", ru: "летучая мышь" }, correctBin: "sky" },
      { id: "hedgehog", content: "🦔", ttsText: { es: "erizo", en: "hedgehog", ru: "ёж" }, correctBin: "ground" },
    ],
  },

  // Objects by color
  {
    id: "colors-warm-cool-1",
    category: "colors",
    name: { es: "Colores cálidos y fríos", en: "Warm and cool colors", ru: "Тёплые и холодные цвета" },
    bins: [
      { id: "warm", label: { es: "Cálido", en: "Warm", ru: "Тёплый" }, icon: "🔥" },
      { id: "cool", label: { es: "Frío", en: "Cool", ru: "Холодный" }, icon: "❄️" },
    ],
    items: [
      { id: "tomato", content: "🍅", ttsText: { es: "tomate", en: "tomato", ru: "помидор" }, correctBin: "warm" },
      { id: "blueberry", content: "🫐", ttsText: { es: "arándano", en: "blueberry", ru: "черника" }, correctBin: "cool" },
      { id: "banana", content: "🍌", ttsText: { es: "plátano", en: "banana", ru: "банан" }, correctBin: "warm" },
      { id: "grapes", content: "🍇", ttsText: { es: "uvas", en: "grapes", ru: "виноград" }, correctBin: "cool" },
      { id: "orange", content: "🍊", ttsText: { es: "naranja", en: "orange", ru: "апельсин" }, correctBin: "warm" },
      { id: "ice", content: "🧊", ttsText: { es: "hielo", en: "ice", ru: "лёд" }, correctBin: "cool" },
    ],
  },
  {
    id: "colors-warm-cool-2",
    category: "colors",
    name: { es: "Más colores", en: "More colors", ru: "Больше цветов" },
    bins: [
      { id: "warm", label: { es: "Cálido", en: "Warm", ru: "Тёплый" }, icon: "🔥" },
      { id: "cool", label: { es: "Frío", en: "Cool", ru: "Холодный" }, icon: "❄️" },
    ],
    items: [
      { id: "sun", content: "☀️", ttsText: { es: "sol", en: "sun", ru: "солнце" }, correctBin: "warm" },
      { id: "snowflake", content: "❄️", ttsText: { es: "copo de nieve", en: "snowflake", ru: "снежинка" }, correctBin: "cool" },
      { id: "fire", content: "🔥", ttsText: { es: "fuego", en: "fire", ru: "огонь" }, correctBin: "warm" },
      { id: "water", content: "💧", ttsText: { es: "agua", en: "water", ru: "вода" }, correctBin: "cool" },
      { id: "pepper", content: "🌶️", ttsText: { es: "chile", en: "pepper", ru: "перец" }, correctBin: "warm" },
      { id: "mint", content: "🍃", ttsText: { es: "menta", en: "mint", ru: "мята" }, correctBin: "cool" },
    ],
  },
  {
    id: "colors-warm-cool-3",
    category: "colors",
    name: { es: "Objetos por color", en: "Objects by color", ru: "Предметы по цвету" },
    bins: [
      { id: "red", label: { es: "Rojo", en: "Red", ru: "Красный" }, icon: "🔴" },
      { id: "green", label: { es: "Verde", en: "Green", ru: "Зелёный" }, icon: "🟢" },
    ],
    items: [
      { id: "strawberry", content: "🍓", ttsText: { es: "fresa", en: "strawberry", ru: "клубника" }, correctBin: "red" },
      { id: "broccoli", content: "🥦", ttsText: { es: "brócoli", en: "broccoli", ru: "брокколи" }, correctBin: "green" },
      { id: "cherry", content: "🍒", ttsText: { es: "cereza", en: "cherry", ru: "вишня" }, correctBin: "red" },
      { id: "cactus", content: "🌵", ttsText: { es: "cactus", en: "cactus", ru: "кактус" }, correctBin: "green" },
      { id: "heart", content: "❤️", ttsText: { es: "corazón", en: "heart", ru: "сердце" }, correctBin: "red" },
      { id: "leaf", content: "🍀", ttsText: { es: "trébol", en: "clover", ru: "клевер" }, correctBin: "green" },
    ],
  },

  // Food by type
  {
    id: "food-type-1",
    category: "food",
    name: { es: "Frutas y verduras", en: "Fruits and vegetables", ru: "Фрукты и овощи" },
    bins: [
      { id: "fruit", label: { es: "Fruta", en: "Fruit", ru: "Фрукт" }, icon: "🍎" },
      { id: "vegetable", label: { es: "Verdura", en: "Vegetable", ru: "Овощ" }, icon: "🥦" },
    ],
    items: [
      { id: "apple", content: "🍎", ttsText: { es: "manzana", en: "apple", ru: "яблоко" }, correctBin: "fruit" },
      { id: "carrot", content: "🥕", ttsText: { es: "zanahoria", en: "carrot", ru: "морковь" }, correctBin: "vegetable" },
      { id: "grape", content: "🍇", ttsText: { es: "uva", en: "grape", ru: "виноград" }, correctBin: "fruit" },
      { id: "corn", content: "🌽", ttsText: { es: "maíz", en: "corn", ru: "кукуруза" }, correctBin: "vegetable" },
      { id: "pear", content: "🍐", ttsText: { es: "pera", en: "pear", ru: "груша" }, correctBin: "fruit" },
      { id: "potato", content: "🥔", ttsText: { es: "patata", en: "potato", ru: "картофель" }, correctBin: "vegetable" },
    ],
  },
  {
    id: "food-type-2",
    category: "food",
    name: { es: "Dulce y salado", en: "Sweet and salty", ru: "Сладкое и солёное" },
    bins: [
      { id: "sweet", label: { es: "Dulce", en: "Sweet", ru: "Сладкое" }, icon: "🍬" },
      { id: "salty", label: { es: "Salado", en: "Salty", ru: "Солёное" }, icon: "🧂" },
    ],
    items: [
      { id: "candy", content: "🍬", ttsText: { es: "caramelo", en: "candy", ru: "конфета" }, correctBin: "sweet" },
      { id: "pretzel", content: "🥨", ttsText: { es: "pretzel", en: "pretzel", ru: "крендель" }, correctBin: "salty" },
      { id: "ice_cream", content: "🍦", ttsText: { es: "helado", en: "ice cream", ru: "мороженое" }, correctBin: "sweet" },
      { id: "fries", content: "🍟", ttsText: { es: "patatas fritas", en: "fries", ru: "картошка фри" }, correctBin: "salty" },
      { id: "chocolate", content: "🍫", ttsText: { es: "chocolate", en: "chocolate", ru: "шоколад" }, correctBin: "sweet" },
      { id: "pizza_sort", content: "🍕", ttsText: { es: "pizza", en: "pizza", ru: "пицца" }, correctBin: "salty" },
    ],
  },
  {
    id: "food-type-3",
    category: "food",
    name: { es: "Bebidas y comida", en: "Drinks and food", ru: "Напитки и еда" },
    bins: [
      { id: "drink", label: { es: "Bebida", en: "Drink", ru: "Напиток" }, icon: "🥤" },
      { id: "food", label: { es: "Comida", en: "Food", ru: "Еда" }, icon: "🍽️" },
    ],
    items: [
      { id: "juice", content: "🧃", ttsText: { es: "jugo", en: "juice", ru: "сок" }, correctBin: "drink" },
      { id: "burger", content: "🍔", ttsText: { es: "hamburguesa", en: "burger", ru: "бургер" }, correctBin: "food" },
      { id: "milk", content: "🥛", ttsText: { es: "leche", en: "milk", ru: "молоко" }, correctBin: "drink" },
      { id: "hot_dog", content: "🌭", ttsText: { es: "perrito caliente", en: "hot dog", ru: "хот-дог" }, correctBin: "food" },
      { id: "tea", content: "🍵", ttsText: { es: "té", en: "tea", ru: "чай" }, correctBin: "drink" },
      { id: "taco", content: "🌮", ttsText: { es: "taco", en: "taco", ru: "тако" }, correctBin: "food" },
    ],
  },
];

export function getRoundsByCategory(category: string): SortingRound[] {
  return SORTING_ROUNDS.filter((r) => r.category === category);
}
