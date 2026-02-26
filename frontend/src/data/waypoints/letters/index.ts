import type { LetterWaypoint } from "./es";
import esLetters from "./es";
import enLetters from "./en";
import ruLetters from "./ru";
import type { Language } from "@/types";

export type { LetterWaypoint };

const lettersByLanguage: Record<Language, LetterWaypoint[]> = {
  es: esLetters,
  en: enLetters,
  ru: ruLetters,
};

export function getLetters(language: Language): LetterWaypoint[] {
  return lettersByLanguage[language] || enLetters;
}
