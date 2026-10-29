/**
 * Capas del cuento sobre 111238.jpg (1920×1080).
 * Cada archivo es un cuadrante de 960×540 del mismo encuadre.
 * Por defecto permanecen ocultas: todavía no hay secuencia narrativa.
 */

export type StoryLayer = {
  id: "A" | "B" | "C" | "D";
  file: string;
  /** Origen normalizado dentro del rectángulo real de la imagen. */
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
};

export const storyLayers: StoryLayer[] = [
  { id: "A", file: "/recursos/originales/111191.jpg", x: 0, y: 0, w: 0.5, h: 0.5, z: 1 },
  { id: "B", file: "/recursos/originales/111192.jpg", x: 0.5, y: 0, w: 0.5, h: 0.5, z: 2 },
  { id: "C", file: "/recursos/originales/111193.jpg", x: 0, y: 0.5, w: 0.5, h: 0.5, z: 3 },
  { id: "D", file: "/recursos/originales/111194.jpg", x: 0.5, y: 0.5, w: 0.5, h: 0.5, z: 4 },
];
