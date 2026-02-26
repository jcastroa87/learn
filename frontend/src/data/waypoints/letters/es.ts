// Spanish alphabet (27 letters): A-Z + Ñ
// Each letter has waypoints as percentages (0-100) of canvas dimensions
// Format: { letter, waypoints: [{ x, y }] } — path for finger tracing

export interface LetterWaypoint {
  letter: string;
  waypoints: { x: number; y: number }[];
}

const spanishLetters: LetterWaypoint[] = [
  { letter: "A", waypoints: [{ x: 50, y: 90 }, { x: 30, y: 10 }, { x: 50, y: 10 }, { x: 70, y: 90 }, { x: 35, y: 55 }, { x: 65, y: 55 }] },
  { letter: "B", waypoints: [{ x: 30, y: 90 }, { x: 30, y: 10 }, { x: 60, y: 10 }, { x: 70, y: 25 }, { x: 60, y: 50 }, { x: 30, y: 50 }, { x: 65, y: 50 }, { x: 75, y: 70 }, { x: 60, y: 90 }, { x: 30, y: 90 }] },
  { letter: "C", waypoints: [{ x: 70, y: 20 }, { x: 50, y: 10 }, { x: 30, y: 30 }, { x: 25, y: 50 }, { x: 30, y: 70 }, { x: 50, y: 90 }, { x: 70, y: 80 }] },
  { letter: "D", waypoints: [{ x: 30, y: 90 }, { x: 30, y: 10 }, { x: 55, y: 10 }, { x: 75, y: 30 }, { x: 75, y: 70 }, { x: 55, y: 90 }, { x: 30, y: 90 }] },
  { letter: "E", waypoints: [{ x: 70, y: 10 }, { x: 30, y: 10 }, { x: 30, y: 50 }, { x: 60, y: 50 }, { x: 30, y: 50 }, { x: 30, y: 90 }, { x: 70, y: 90 }] },
  { letter: "F", waypoints: [{ x: 70, y: 10 }, { x: 30, y: 10 }, { x: 30, y: 50 }, { x: 60, y: 50 }, { x: 30, y: 50 }, { x: 30, y: 90 }] },
  { letter: "G", waypoints: [{ x: 70, y: 20 }, { x: 50, y: 10 }, { x: 30, y: 30 }, { x: 25, y: 50 }, { x: 30, y: 70 }, { x: 50, y: 90 }, { x: 70, y: 75 }, { x: 70, y: 50 }, { x: 50, y: 50 }] },
  { letter: "H", waypoints: [{ x: 30, y: 10 }, { x: 30, y: 90 }, { x: 30, y: 50 }, { x: 70, y: 50 }, { x: 70, y: 10 }, { x: 70, y: 90 }] },
  { letter: "I", waypoints: [{ x: 35, y: 10 }, { x: 65, y: 10 }, { x: 50, y: 10 }, { x: 50, y: 90 }, { x: 35, y: 90 }, { x: 65, y: 90 }] },
  { letter: "J", waypoints: [{ x: 40, y: 10 }, { x: 70, y: 10 }, { x: 60, y: 10 }, { x: 60, y: 70 }, { x: 50, y: 85 }, { x: 35, y: 80 }] },
  { letter: "K", waypoints: [{ x: 30, y: 10 }, { x: 30, y: 90 }, { x: 30, y: 50 }, { x: 70, y: 10 }, { x: 30, y: 50 }, { x: 70, y: 90 }] },
  { letter: "L", waypoints: [{ x: 30, y: 10 }, { x: 30, y: 90 }, { x: 70, y: 90 }] },
  { letter: "M", waypoints: [{ x: 20, y: 90 }, { x: 20, y: 10 }, { x: 50, y: 50 }, { x: 80, y: 10 }, { x: 80, y: 90 }] },
  { letter: "N", waypoints: [{ x: 30, y: 90 }, { x: 30, y: 10 }, { x: 70, y: 90 }, { x: 70, y: 10 }] },
  { letter: "Ñ", waypoints: [{ x: 30, y: 90 }, { x: 30, y: 20 }, { x: 70, y: 90 }, { x: 70, y: 20 }, { x: 35, y: 8 }, { x: 50, y: 3 }, { x: 65, y: 8 }] },
  { letter: "O", waypoints: [{ x: 50, y: 10 }, { x: 30, y: 25 }, { x: 25, y: 50 }, { x: 30, y: 75 }, { x: 50, y: 90 }, { x: 70, y: 75 }, { x: 75, y: 50 }, { x: 70, y: 25 }, { x: 50, y: 10 }] },
  { letter: "P", waypoints: [{ x: 30, y: 90 }, { x: 30, y: 10 }, { x: 60, y: 10 }, { x: 70, y: 25 }, { x: 70, y: 40 }, { x: 60, y: 50 }, { x: 30, y: 50 }] },
  { letter: "Q", waypoints: [{ x: 50, y: 10 }, { x: 30, y: 25 }, { x: 25, y: 50 }, { x: 30, y: 75 }, { x: 50, y: 90 }, { x: 70, y: 75 }, { x: 75, y: 50 }, { x: 70, y: 25 }, { x: 50, y: 10 }, { x: 60, y: 80 }, { x: 75, y: 95 }] },
  { letter: "R", waypoints: [{ x: 30, y: 90 }, { x: 30, y: 10 }, { x: 60, y: 10 }, { x: 70, y: 25 }, { x: 60, y: 50 }, { x: 30, y: 50 }, { x: 70, y: 90 }] },
  { letter: "S", waypoints: [{ x: 65, y: 15 }, { x: 50, y: 10 }, { x: 35, y: 20 }, { x: 35, y: 35 }, { x: 50, y: 50 }, { x: 65, y: 65 }, { x: 65, y: 80 }, { x: 50, y: 90 }, { x: 35, y: 85 }] },
  { letter: "T", waypoints: [{ x: 20, y: 10 }, { x: 80, y: 10 }, { x: 50, y: 10 }, { x: 50, y: 90 }] },
  { letter: "U", waypoints: [{ x: 30, y: 10 }, { x: 30, y: 70 }, { x: 40, y: 85 }, { x: 50, y: 90 }, { x: 60, y: 85 }, { x: 70, y: 70 }, { x: 70, y: 10 }] },
  { letter: "V", waypoints: [{ x: 25, y: 10 }, { x: 50, y: 90 }, { x: 75, y: 10 }] },
  { letter: "W", waypoints: [{ x: 15, y: 10 }, { x: 30, y: 90 }, { x: 50, y: 40 }, { x: 70, y: 90 }, { x: 85, y: 10 }] },
  { letter: "X", waypoints: [{ x: 25, y: 10 }, { x: 75, y: 90 }, { x: 50, y: 50 }, { x: 75, y: 10 }, { x: 25, y: 90 }] },
  { letter: "Y", waypoints: [{ x: 25, y: 10 }, { x: 50, y: 50 }, { x: 75, y: 10 }, { x: 50, y: 50 }, { x: 50, y: 90 }] },
  { letter: "Z", waypoints: [{ x: 25, y: 10 }, { x: 75, y: 10 }, { x: 25, y: 90 }, { x: 75, y: 90 }] },
];

export default spanishLetters;
