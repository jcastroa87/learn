export interface ColoringTemplate {
  id: string;
  category: "animals" | "vehicles" | "nature" | "food" | "fantasy";
  name: Record<string, string>;
  regions: ColorRegion[];
}

export interface ColorRegion {
  id: string;
  path: string; // SVG path data
  defaultFill: string;
}

// Simplified SVG templates — each region is a closed SVG path
const templates: ColoringTemplate[] = [
  // Animals
  { id: "cat-1", category: "animals", name: { es: "Gato", en: "Cat", ru: "Кот" }, regions: [
    { id: "body", path: "M30,70 Q30,40 50,35 Q70,40 70,70 Q50,80 30,70Z", defaultFill: "#f5f5f5" },
    { id: "head", path: "M35,40 Q35,20 50,15 Q65,20 65,40 Q50,45 35,40Z", defaultFill: "#f5f5f5" },
    { id: "ear-l", path: "M35,22 L30,8 L42,18Z", defaultFill: "#f5f5f5" },
    { id: "ear-r", path: "M65,22 L70,8 L58,18Z", defaultFill: "#f5f5f5" },
    { id: "tail", path: "M70,65 Q85,50 80,35 Q78,30 75,35 Q78,50 65,60Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "dog-1", category: "animals", name: { es: "Perro", en: "Dog", ru: "Собака" }, regions: [
    { id: "body", path: "M25,75 Q25,45 50,40 Q75,45 75,75 Q50,82 25,75Z", defaultFill: "#f5f5f5" },
    { id: "head", path: "M32,45 Q32,22 50,18 Q68,22 68,45 Q50,50 32,45Z", defaultFill: "#f5f5f5" },
    { id: "ear-l", path: "M32,30 Q22,25 20,40 Q25,45 32,38Z", defaultFill: "#f5f5f5" },
    { id: "ear-r", path: "M68,30 Q78,25 80,40 Q75,45 68,38Z", defaultFill: "#f5f5f5" },
    { id: "tail", path: "M75,60 Q88,45 85,55 Q82,65 75,68Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "fish-1", category: "animals", name: { es: "Pez", en: "Fish", ru: "Рыба" }, regions: [
    { id: "body", path: "M20,50 Q40,25 65,35 Q75,50 65,65 Q40,75 20,50Z", defaultFill: "#f5f5f5" },
    { id: "tail", path: "M65,50 L85,30 L85,70Z", defaultFill: "#f5f5f5" },
    { id: "fin-top", path: "M40,35 L50,15 L55,35Z", defaultFill: "#f5f5f5" },
    { id: "fin-bottom", path: "M40,65 L50,85 L55,65Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "bird-1", category: "animals", name: { es: "Pájaro", en: "Bird", ru: "Птица" }, regions: [
    { id: "body", path: "M30,55 Q40,35 55,40 Q65,50 55,65 Q40,70 30,55Z", defaultFill: "#f5f5f5" },
    { id: "head", path: "M55,40 Q60,28 70,30 Q75,38 65,45 Q58,45 55,40Z", defaultFill: "#f5f5f5" },
    { id: "wing", path: "M35,50 Q20,35 15,50 Q20,55 35,55Z", defaultFill: "#f5f5f5" },
    { id: "tail", path: "M30,58 L12,65 L15,55 L30,55Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "butterfly-1", category: "animals", name: { es: "Mariposa", en: "Butterfly", ru: "Бабочка" }, regions: [
    { id: "body", path: "M48,25 L50,75 L52,25Z", defaultFill: "#f5f5f5" },
    { id: "wing-tl", path: "M48,35 Q25,15 20,40 Q30,50 48,45Z", defaultFill: "#f5f5f5" },
    { id: "wing-tr", path: "M52,35 Q75,15 80,40 Q70,50 52,45Z", defaultFill: "#f5f5f5" },
    { id: "wing-bl", path: "M48,50 Q25,55 22,70 Q35,72 48,60Z", defaultFill: "#f5f5f5" },
    { id: "wing-br", path: "M52,50 Q75,55 78,70 Q65,72 52,60Z", defaultFill: "#f5f5f5" },
  ]},
  // Vehicles
  { id: "car-1", category: "vehicles", name: { es: "Coche", en: "Car", ru: "Машина" }, regions: [
    { id: "body", path: "M15,55 L15,70 L85,70 L85,55 L70,55 L65,35 L35,35 L30,55Z", defaultFill: "#f5f5f5" },
    { id: "window-l", path: "M35,38 L38,52 L48,52 L48,38Z", defaultFill: "#f5f5f5" },
    { id: "window-r", path: "M52,38 L52,52 L62,52 L65,38Z", defaultFill: "#f5f5f5" },
    { id: "wheel-l", path: "M28,70 A8,8 0 1,0 28,86 A8,8 0 1,0 28,70Z", defaultFill: "#f5f5f5" },
    { id: "wheel-r", path: "M72,70 A8,8 0 1,0 72,86 A8,8 0 1,0 72,70Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "truck-1", category: "vehicles", name: { es: "Camión", en: "Truck", ru: "Грузовик" }, regions: [
    { id: "cab", path: "M10,45 L10,70 L35,70 L35,35 L25,35 L10,45Z", defaultFill: "#f5f5f5" },
    { id: "cargo", path: "M38,30 L38,70 L90,70 L90,30Z", defaultFill: "#f5f5f5" },
    { id: "wheel-l", path: "M20,70 A7,7 0 1,0 20,84 A7,7 0 1,0 20,70Z", defaultFill: "#f5f5f5" },
    { id: "wheel-r", path: "M75,70 A7,7 0 1,0 75,84 A7,7 0 1,0 75,70Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "boat-1", category: "vehicles", name: { es: "Barco", en: "Boat", ru: "Лодка" }, regions: [
    { id: "hull", path: "M10,65 L20,80 L80,80 L90,65Z", defaultFill: "#f5f5f5" },
    { id: "cabin", path: "M35,40 L35,65 L65,65 L65,40Z", defaultFill: "#f5f5f5" },
    { id: "sail", path: "M50,10 L50,40 L75,40Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "plane-1", category: "vehicles", name: { es: "Avión", en: "Plane", ru: "Самолёт" }, regions: [
    { id: "body", path: "M10,50 Q30,42 80,45 Q90,50 80,55 Q30,58 10,50Z", defaultFill: "#f5f5f5" },
    { id: "wing-top", path: "M35,45 L55,20 L60,25 L45,45Z", defaultFill: "#f5f5f5" },
    { id: "wing-bottom", path: "M35,55 L55,80 L60,75 L45,55Z", defaultFill: "#f5f5f5" },
    { id: "tail", path: "M80,45 L90,30 L92,35 L85,45Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "rocket-1", category: "vehicles", name: { es: "Cohete", en: "Rocket", ru: "Ракета" }, regions: [
    { id: "body", path: "M42,80 L42,30 Q50,10 58,30 L58,80Z", defaultFill: "#f5f5f5" },
    { id: "fin-l", path: "M42,70 L28,85 L42,80Z", defaultFill: "#f5f5f5" },
    { id: "fin-r", path: "M58,70 L72,85 L58,80Z", defaultFill: "#f5f5f5" },
    { id: "window", path: "M45,40 A5,5 0 1,0 55,40 A5,5 0 1,0 45,40Z", defaultFill: "#f5f5f5" },
    { id: "flame", path: "M44,80 L50,95 L56,80Z", defaultFill: "#f5f5f5" },
  ]},
  // Nature
  { id: "flower-1", category: "nature", name: { es: "Flor", en: "Flower", ru: "Цветок" }, regions: [
    { id: "center", path: "M43,40 A7,7 0 1,0 57,40 A7,7 0 1,0 43,40Z", defaultFill: "#f5f5f5" },
    { id: "petal-t", path: "M47,33 Q50,18 53,33Z", defaultFill: "#f5f5f5" },
    { id: "petal-r", path: "M57,37 Q72,40 57,43Z", defaultFill: "#f5f5f5" },
    { id: "petal-b", path: "M47,47 Q50,62 53,47Z", defaultFill: "#f5f5f5" },
    { id: "petal-l", path: "M43,37 Q28,40 43,43Z", defaultFill: "#f5f5f5" },
    { id: "stem", path: "M48,55 L48,85 L52,85 L52,55Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "tree-1", category: "nature", name: { es: "Árbol", en: "Tree", ru: "Дерево" }, regions: [
    { id: "trunk", path: "M44,55 L44,90 L56,90 L56,55Z", defaultFill: "#f5f5f5" },
    { id: "crown", path: "M50,10 Q20,25 25,45 Q30,60 50,55 Q70,60 75,45 Q80,25 50,10Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "sun-1", category: "nature", name: { es: "Sol", en: "Sun", ru: "Солнце" }, regions: [
    { id: "center", path: "M35,35 A15,15 0 1,0 65,35 A15,15 0 1,0 35,35Z", defaultFill: "#f5f5f5" },
    { id: "ray1", path: "M48,15 L50,5 L52,15Z", defaultFill: "#f5f5f5" },
    { id: "ray2", path: "M62,22 L70,12 L65,25Z", defaultFill: "#f5f5f5" },
    { id: "ray3", path: "M68,35 L80,33 L68,38Z", defaultFill: "#f5f5f5" },
    { id: "ray4", path: "M62,48 L70,58 L65,45Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "mountain-1", category: "nature", name: { es: "Montaña", en: "Mountain", ru: "Гора" }, regions: [
    { id: "mountain", path: "M10,85 L50,15 L90,85Z", defaultFill: "#f5f5f5" },
    { id: "snow", path: "M50,15 L40,35 L45,30 L50,35 L55,30 L60,35Z", defaultFill: "#f5f5f5" },
    { id: "ground", path: "M0,85 L100,85 L100,95 L0,95Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "cloud-1", category: "nature", name: { es: "Nube", en: "Cloud", ru: "Облако" }, regions: [
    { id: "cloud", path: "M25,55 Q15,55 15,45 Q15,35 25,35 Q30,25 40,30 Q45,20 55,28 Q65,22 70,35 Q80,35 80,45 Q80,55 70,55Z", defaultFill: "#f5f5f5" },
    { id: "rain1", path: "M35,60 L33,72", defaultFill: "#f5f5f5" },
    { id: "rain2", path: "M50,60 L48,72", defaultFill: "#f5f5f5" },
    { id: "rain3", path: "M65,60 L63,72", defaultFill: "#f5f5f5" },
  ]},
  // Food
  { id: "apple-1", category: "food", name: { es: "Manzana", en: "Apple", ru: "Яблоко" }, regions: [
    { id: "fruit", path: "M50,25 Q25,30 20,55 Q20,80 50,85 Q80,80 80,55 Q75,30 50,25Z", defaultFill: "#f5f5f5" },
    { id: "stem", path: "M48,15 L48,28 L52,28 L52,15Z", defaultFill: "#f5f5f5" },
    { id: "leaf", path: "M52,20 Q62,12 58,22 Q55,25 52,22Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "cupcake-1", category: "food", name: { es: "Cupcake", en: "Cupcake", ru: "Кекс" }, regions: [
    { id: "frosting", path: "M25,45 Q30,25 50,20 Q70,25 75,45Z", defaultFill: "#f5f5f5" },
    { id: "base", path: "M28,45 L32,80 L68,80 L72,45Z", defaultFill: "#f5f5f5" },
    { id: "cherry", path: "M45,15 A7,7 0 1,0 55,15 A7,7 0 1,0 45,15Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "pizza-1", category: "food", name: { es: "Pizza", en: "Pizza", ru: "Пицца" }, regions: [
    { id: "slice", path: "M50,20 L20,80 L80,80Z", defaultFill: "#f5f5f5" },
    { id: "topping1", path: "M40,50 A5,5 0 1,0 50,50 A5,5 0 1,0 40,50Z", defaultFill: "#f5f5f5" },
    { id: "topping2", path: "M50,62 A5,5 0 1,0 60,62 A5,5 0 1,0 50,62Z", defaultFill: "#f5f5f5" },
    { id: "topping3", path: "M35,65 A4,4 0 1,0 43,65 A4,4 0 1,0 35,65Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "ice-cream-1", category: "food", name: { es: "Helado", en: "Ice cream", ru: "Мороженое" }, regions: [
    { id: "scoop1", path: "M35,35 A15,15 0 1,0 65,35 A15,15 0 1,0 35,35Z", defaultFill: "#f5f5f5" },
    { id: "scoop2", path: "M30,50 A12,12 0 1,0 54,50 A12,12 0 1,0 30,50Z", defaultFill: "#f5f5f5" },
    { id: "scoop3", path: "M46,50 A12,12 0 1,0 70,50 A12,12 0 1,0 46,50Z", defaultFill: "#f5f5f5" },
    { id: "cone", path: "M32,55 L50,90 L68,55Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "watermelon-1", category: "food", name: { es: "Sandía", en: "Watermelon", ru: "Арбуз" }, regions: [
    { id: "rind", path: "M15,60 Q50,10 85,60Z", defaultFill: "#f5f5f5" },
    { id: "flesh", path: "M20,58 Q50,18 80,58Z", defaultFill: "#f5f5f5" },
  ]},
  // Fantasy
  { id: "star-1", category: "fantasy", name: { es: "Estrella", en: "Star", ru: "Звезда" }, regions: [
    { id: "star", path: "M50,10 L60,38 L90,38 L66,55 L76,85 L50,66 L24,85 L34,55 L10,38 L40,38Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "crown-1", category: "fantasy", name: { es: "Corona", en: "Crown", ru: "Корона" }, regions: [
    { id: "crown", path: "M15,70 L15,35 L30,50 L50,20 L70,50 L85,35 L85,70Z", defaultFill: "#f5f5f5" },
    { id: "gem1", path: "M28,55 A5,5 0 1,0 38,55 A5,5 0 1,0 28,55Z", defaultFill: "#f5f5f5" },
    { id: "gem2", path: "M45,55 A5,5 0 1,0 55,55 A5,5 0 1,0 45,55Z", defaultFill: "#f5f5f5" },
    { id: "gem3", path: "M62,55 A5,5 0 1,0 72,55 A5,5 0 1,0 62,55Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "castle-1", category: "fantasy", name: { es: "Castillo", en: "Castle", ru: "Замок" }, regions: [
    { id: "wall", path: "M20,45 L20,85 L80,85 L80,45Z", defaultFill: "#f5f5f5" },
    { id: "tower-l", path: "M15,20 L15,45 L30,45 L30,20Z", defaultFill: "#f5f5f5" },
    { id: "tower-r", path: "M70,20 L70,45 L85,45 L85,20Z", defaultFill: "#f5f5f5" },
    { id: "door", path: "M40,85 L40,60 Q50,52 60,60 L60,85Z", defaultFill: "#f5f5f5" },
    { id: "flag", path: "M50,10 L50,30 L65,20Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "dragon-1", category: "fantasy", name: { es: "Dragón", en: "Dragon", ru: "Дракон" }, regions: [
    { id: "body", path: "M30,60 Q30,40 45,35 Q60,35 65,50 Q68,65 55,75 Q40,78 30,60Z", defaultFill: "#f5f5f5" },
    { id: "head", path: "M60,40 Q65,25 75,28 Q82,35 75,42 Q68,45 60,40Z", defaultFill: "#f5f5f5" },
    { id: "wing", path: "M40,38 Q30,15 55,25 Q65,30 50,38Z", defaultFill: "#f5f5f5" },
    { id: "tail", path: "M30,65 Q15,70 10,60 Q12,55 20,58 Q25,60 30,60Z", defaultFill: "#f5f5f5" },
  ]},
  { id: "unicorn-1", category: "fantasy", name: { es: "Unicornio", en: "Unicorn", ru: "Единорог" }, regions: [
    { id: "body", path: "M25,65 Q25,45 45,40 Q65,40 70,55 Q72,70 55,78 Q35,80 25,65Z", defaultFill: "#f5f5f5" },
    { id: "head", path: "M65,40 Q68,25 78,28 Q82,38 75,42 Q70,45 65,42Z", defaultFill: "#f5f5f5" },
    { id: "horn", path: "M72,25 L76,8 L78,25Z", defaultFill: "#f5f5f5" },
    { id: "mane", path: "M60,35 Q55,22 50,35 Q48,25 45,38Z", defaultFill: "#f5f5f5" },
    { id: "tail", path: "M25,62 Q12,55 15,68 Q18,75 25,70Z", defaultFill: "#f5f5f5" },
  ]},
];

export type ColoringCategory = ColoringTemplate["category"];

export const COLORING_CATEGORIES: ColoringCategory[] = [
  "animals", "vehicles", "nature", "food", "fantasy",
];

export function getTemplatesByCategory(category: ColoringCategory): ColoringTemplate[] {
  return templates.filter((t) => t.category === category);
}

export function getTemplateById(id: string): ColoringTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export default templates;
