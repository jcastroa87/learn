import type { LetterWaypoint } from "./es";
import spanishLetters from "./es";

// English: 26 letters (A-Z, no Ñ)
const englishLetters: LetterWaypoint[] = spanishLetters.filter(
  (l) => l.letter !== "Ñ"
);

export default englishLetters;
