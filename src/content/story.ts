/**
 * Cuento inicial — ¡Tripulación, juntos al tesoro!
 * Textos de narración y URLs de video (Mirarim).
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
    videoD: "https://videos.mirarim.com/Videos%20en%20juegos/Videos%20Tripulacion/Momento%2001.mp4",
  },
  {
    id: 2,
    text: "De pronto, una ráfaga de viento le quitó el mapa de las manos. Mientras volaba, se rompió en cinco pedacitos. El pirata se quedó muy triste.",
    videoD: "https://videos.mirarim.com/Videos%20en%20juegos/Videos%20Tripulacion/Momento%2002.mp4",
  },
  {
    id: 3,
    text: "El pirata corrió de un lado a otro, buscando los pedacitos de su mapa. Miró por aquí y por allá, pero no logró encontrarlos. Entonces se detuvo, preocupado.",
    videoD: "https://videos.mirarim.com/Videos%20en%20juegos/Videos%20Tripulacion/Mas%20videos/Momento%2003.mp4",
  },
  {
    id: 4,
    text: "El pirata se quedó pensando. Él solo no podía buscar por toda la isla. Entonces tuvo una idea: ¡podía pedir ayuda a su tripulación!",
    videoD: "https://videos.mirarim.com/Videos%20en%20juegos/Videos%20Tripulacion/Mas%20videos/Momento%2004%20D.mp4",
    videoC: "https://videos.mirarim.com/Videos%20en%20juegos/Videos%20Tripulacion/Mas%20videos/Momento%2004%20C.mp4",
  },
  {
    id: 5,
    text: "Su tripulación llegó para ayudarlo. Entre todos recogieron los pedacitos del mapa y se los entregaron. ¡El pirata ya no estaba solo!",
    videoD: "https://videos.mirarim.com/Videos%20en%20juegos/Videos%20Tripulacion/Mas%20videos/Momento%2005.mp4",
  },
  {
    id: 6,
    text: "Con la ayuda de su tripulación, el pirata pudo volver a juntar su mapa. Ahora tenían un camino para seguir. ¿Quieren formar parte de la tripulación y buscar el tesoro juntos?",
    videoD: "https://videos.mirarim.com/Videos%20en%20juegos/Videos%20Tripulacion/Mas%20videos/Momento%2006.mp4",
  },
];

/** Imagen de composición inicial antes de comenzar */
export const storyStartImage = "/recursos/cuento_pirata.png";

/** Compatibilidad */
export const storyParagraphs: string[] | null = storyMoments.map((m) => m.text);
