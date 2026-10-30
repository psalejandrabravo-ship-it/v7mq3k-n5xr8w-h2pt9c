/**
 * Cuento inicial — ¡Tripulación, juntos al tesoro!
 * Textos de narración (editables) y rutas de video locales.
 * Los videos deben estar en public/recursos/videos/
 */

export type StoryMoment = {
  id: number;
  text: string;
  /** Video principal (zona D) */
  videoD: string;
  /** Video secundario (zona C), solo momento 4 */
  videoC?: string;
};

export const storyMoments: StoryMoment[] = [
  {
    id: 1,
    text: "Había una vez un pirata que soñaba con encontrar un tesoro escondido en una isla. Siempre llevaba consigo un mapa que le mostraba el camino.",
    videoD: "/recursos/videos/momento-1.mp4",
  },
  {
    id: 2,
    text: "Una ráfaga de viento le quitó el mapa de las manos. Primero voló entero y después se rompió en seis pedazos. El pirata quedó triste.",
    videoD: "/recursos/videos/momento-2.mp4",
  },
  {
    id: 3,
    text: "El pirata corrió de un lado a otro buscando los pedazos, pero no los encontraba y se detuvo preocupado.",
    videoD: "/recursos/videos/momento-3.mp4",
  },
  {
    id: 4,
    text: "El pirata recordó que solo no podía buscar por toda la isla y pensó en su tripulación.",
    videoD: "/recursos/videos/momento-4-d.mp4",
    videoC: "/recursos/videos/momento-4-c.mp4",
  },
  {
    id: 5,
    text: "Llegó la tripulación. Juntos recogieron los fragmentos del mapa y se los entregaron al pirata.",
    videoD: "/recursos/videos/momento-5.mp4",
  },
  {
    id: 6,
    text: "Ahora el mapa está completo otra vez. ¡Es hora de seguir el camino hacia el tesoro, todos juntos!",
    videoD: "/recursos/videos/momento-6.mp4",
  },
];

/** Imagen de composición inicial antes de comenzar */
export const storyStartImage = "/recursos/cuento-pirata.png";

/** Compatibilidad: si alguien sigue usando storyParagraphs */
export const storyParagraphs: string[] | null = storyMoments.map((m) => m.text);
