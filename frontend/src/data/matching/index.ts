export type MatchingMode = "letters" | "numbers" | "colors" | "shapes" | "animals";

export interface MatchPair {
  id: string;
  left: string;
  right: string;
  ttsText?: Record<string, string>;
}

const letterPairs: Record<string, MatchPair[]> = {
  en: [
    { id: "a", left: "A", right: "a", ttsText: { en: "ay" } },
    { id: "b", left: "B", right: "b", ttsText: { en: "bee" } },
    { id: "c", left: "C", right: "c", ttsText: { en: "see" } },
    { id: "d", left: "D", right: "d", ttsText: { en: "dee" } },
    { id: "e", left: "E", right: "e", ttsText: { en: "ee" } },
    { id: "f", left: "F", right: "f", ttsText: { en: "eff" } },
  ],
  es: [
    { id: "a", left: "A", right: "a", ttsText: { es: "a" } },
    { id: "b", left: "B", right: "b", ttsText: { es: "be" } },
    { id: "c", left: "C", right: "c", ttsText: { es: "ce" } },
    { id: "d", left: "D", right: "d", ttsText: { es: "de" } },
    { id: "e", left: "E", right: "e", ttsText: { es: "e" } },
    { id: "f", left: "F", right: "f", ttsText: { es: "efe" } },
  ],
  ru: [
    { id: "а", left: "А", right: "а", ttsText: { ru: "а" } },
    { id: "б", left: "Б", right: "б", ttsText: { ru: "бэ" } },
    { id: "в", left: "В", right: "в", ttsText: { ru: "вэ" } },
    { id: "г", left: "Г", right: "г", ttsText: { ru: "гэ" } },
    { id: "д", left: "Д", right: "д", ttsText: { ru: "дэ" } },
    { id: "е", left: "Е", right: "е", ttsText: { ru: "е" } },
  ],
};

const matchingData: Record<string, MatchPair[]> = {
  numbers: [
    { id: "1", left: "1", right: "uno", ttsText: { es: "uno", en: "one", ru: "один" } },
    { id: "2", left: "2", right: "dos", ttsText: { es: "dos", en: "two", ru: "два" } },
    { id: "3", left: "3", right: "tres", ttsText: { es: "tres", en: "three", ru: "три" } },
    { id: "4", left: "4", right: "cuatro", ttsText: { es: "cuatro", en: "four", ru: "четыре" } },
    { id: "5", left: "5", right: "cinco", ttsText: { es: "cinco", en: "five", ru: "пять" } },
    { id: "6", left: "6", right: "seis", ttsText: { es: "seis", en: "six", ru: "шесть" } },
  ],
  colors: [
    { id: "red", left: "🔴", right: "rojo", ttsText: { es: "rojo", en: "red", ru: "красный" } },
    { id: "blue", left: "🔵", right: "azul", ttsText: { es: "azul", en: "blue", ru: "синий" } },
    { id: "green", left: "🟢", right: "verde", ttsText: { es: "verde", en: "green", ru: "зелёный" } },
    { id: "yellow", left: "🟡", right: "amarillo", ttsText: { es: "amarillo", en: "yellow", ru: "жёлтый" } },
    { id: "purple", left: "🟣", right: "morado", ttsText: { es: "morado", en: "purple", ru: "фиолетовый" } },
    { id: "orange", left: "🟠", right: "naranja", ttsText: { es: "naranja", en: "orange", ru: "оранжевый" } },
  ],
  shapes: [
    { id: "circle", left: "⬤", right: "círculo", ttsText: { es: "círculo", en: "circle", ru: "круг" } },
    { id: "square", left: "⬛", right: "cuadrado", ttsText: { es: "cuadrado", en: "square", ru: "квадрат" } },
    { id: "triangle", left: "🔺", right: "triángulo", ttsText: { es: "triángulo", en: "triangle", ru: "треугольник" } },
    { id: "star", left: "⭐", right: "estrella", ttsText: { es: "estrella", en: "star", ru: "звезда" } },
    { id: "heart", left: "❤️", right: "corazón", ttsText: { es: "corazón", en: "heart", ru: "сердце" } },
    { id: "diamond", left: "💎", right: "diamante", ttsText: { es: "diamante", en: "diamond", ru: "ромб" } },
  ],
  animals: [
    { id: "cat", left: "🐱", right: "gato", ttsText: { es: "gato", en: "cat", ru: "кот" } },
    { id: "dog", left: "🐶", right: "perro", ttsText: { es: "perro", en: "dog", ru: "собака" } },
    { id: "bird", left: "🐦", right: "pájaro", ttsText: { es: "pájaro", en: "bird", ru: "птица" } },
    { id: "fish", left: "🐟", right: "pez", ttsText: { es: "pez", en: "fish", ru: "рыба" } },
    { id: "rabbit", left: "🐰", right: "conejo", ttsText: { es: "conejo", en: "rabbit", ru: "кролик" } },
    { id: "bear", left: "🐻", right: "oso", ttsText: { es: "oso", en: "bear", ru: "медведь" } },
  ],
};

export function getMatchPairs(mode: MatchingMode, language = "es", count = 6): MatchPair[] {
  if (mode === "letters") {
    const pairs = letterPairs[language] || letterPairs.en;
    return pairs.slice(0, count).sort(() => Math.random() - 0.5);
  }
  const pairs = matchingData[mode] || matchingData.colors;
  return pairs.slice(0, count).sort(() => Math.random() - 0.5);
}

export const MATCHING_MODES: MatchingMode[] = [
  "letters",
  "numbers",
  "colors",
  "shapes",
  "animals",
];
