export interface MemoryItem {
  content: string;
  ttsText?: Record<string, string>;
}

export interface MemoryMode {
  id: string;
  label: string;
  icon: string;
  items: MemoryItem[];
}

export const MEMORY_MODES: MemoryMode[] = [
  {
    id: "letters",
    label: "Letters",
    icon: "🔤",
    items: [
      { content: "A", ttsText: { es: "A", en: "A", ru: "А" } },
      { content: "B", ttsText: { es: "B", en: "B", ru: "Б" } },
      { content: "C", ttsText: { es: "C", en: "C", ru: "В" } },
      { content: "D", ttsText: { es: "D", en: "D", ru: "Г" } },
      { content: "E", ttsText: { es: "E", en: "E", ru: "Д" } },
      { content: "F", ttsText: { es: "F", en: "F", ru: "Е" } },
      { content: "G", ttsText: { es: "G", en: "G", ru: "Ж" } },
      { content: "H", ttsText: { es: "H", en: "H", ru: "З" } },
    ],
  },
  {
    id: "numbers",
    label: "Numbers",
    icon: "🔢",
    items: [
      { content: "1", ttsText: { es: "uno", en: "one", ru: "один" } },
      { content: "2", ttsText: { es: "dos", en: "two", ru: "два" } },
      { content: "3", ttsText: { es: "tres", en: "three", ru: "три" } },
      { content: "4", ttsText: { es: "cuatro", en: "four", ru: "четыре" } },
      { content: "5", ttsText: { es: "cinco", en: "five", ru: "пять" } },
      { content: "6", ttsText: { es: "seis", en: "six", ru: "шесть" } },
      { content: "7", ttsText: { es: "siete", en: "seven", ru: "семь" } },
      { content: "8", ttsText: { es: "ocho", en: "eight", ru: "восемь" } },
    ],
  },
  {
    id: "animals",
    label: "Animals",
    icon: "🐾",
    items: [
      { content: "🐶", ttsText: { es: "perro", en: "dog", ru: "собака" } },
      { content: "🐱", ttsText: { es: "gato", en: "cat", ru: "кошка" } },
      { content: "🐰", ttsText: { es: "conejo", en: "rabbit", ru: "кролик" } },
      { content: "🐻", ttsText: { es: "oso", en: "bear", ru: "медведь" } },
      { content: "🐸", ttsText: { es: "rana", en: "frog", ru: "лягушка" } },
      { content: "🦁", ttsText: { es: "león", en: "lion", ru: "лев" } },
      { content: "🐘", ttsText: { es: "elefante", en: "elephant", ru: "слон" } },
      { content: "🦋", ttsText: { es: "mariposa", en: "butterfly", ru: "бабочка" } },
    ],
  },
  {
    id: "colors",
    label: "Colors",
    icon: "🎨",
    items: [
      { content: "🔴", ttsText: { es: "rojo", en: "red", ru: "красный" } },
      { content: "🟢", ttsText: { es: "verde", en: "green", ru: "зелёный" } },
      { content: "🔵", ttsText: { es: "azul", en: "blue", ru: "синий" } },
      { content: "🟡", ttsText: { es: "amarillo", en: "yellow", ru: "жёлтый" } },
      { content: "🟠", ttsText: { es: "naranja", en: "orange", ru: "оранжевый" } },
      { content: "🟣", ttsText: { es: "morado", en: "purple", ru: "фиолетовый" } },
      { content: "⚪", ttsText: { es: "blanco", en: "white", ru: "белый" } },
      { content: "⚫", ttsText: { es: "negro", en: "black", ru: "чёрный" } },
    ],
  },
  {
    id: "shapes",
    label: "Shapes",
    icon: "⭐",
    items: [
      { content: "⭐", ttsText: { es: "estrella", en: "star", ru: "звезда" } },
      { content: "❤️", ttsText: { es: "corazón", en: "heart", ru: "сердце" } },
      { content: "🔷", ttsText: { es: "diamante", en: "diamond", ru: "ромб" } },
      { content: "⬛", ttsText: { es: "cuadrado", en: "square", ru: "квадрат" } },
      { content: "🔺", ttsText: { es: "triángulo", en: "triangle", ru: "треугольник" } },
      { content: "⬜", ttsText: { es: "rectángulo", en: "rectangle", ru: "прямоугольник" } },
      { content: "🔘", ttsText: { es: "círculo", en: "circle", ru: "круг" } },
      { content: "💠", ttsText: { es: "rombo", en: "rhombus", ru: "алмаз" } },
    ],
  },
];
