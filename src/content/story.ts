/**
 * Cuento inicial — ¡Tripulación, juntos al tesoro!
 * Textos de narración y URLs directas de video (Grok Imagine).
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
    videoD: "https://assets.grok.com/users/47885d9f-3cbb-4e29-ba84-f0b2ff3065d1/generated/ecd1cc59-0d70-4e15-aa9d-71d6ad13337b/generated_video.mp4?cache=1",
  },
  {
    id: 2,
    text: "Una ráfaga de viento le quitó el mapa de las manos. Primero voló entero y después se rompió en seis pedazos. El pirata quedó triste.",
    videoD: "https://assets.grok.com/users/47885d9f-3cbb-4e29-ba84-f0b2ff3065d1/generated/c57c78c1-5a11-4672-83a1-aac200a9c4ef/generated_video.mp4?cache=1",
  },
  {
    id: 3,
    text: "El pirata corrió de un lado a otro buscando los pedazos, pero no los encontraba y se detuvo preocupado.",
    videoD: "https://assets.grok.com/users/47885d9f-3cbb-4e29-ba84-f0b2ff3065d1/generated/7b80b622-4a93-45c7-b589-83e43ec4b023/generated_video.mp4?cache=1",
  },
  {
    id: 4,
    text: "El pirata recordó que solo no podía buscar por toda la isla y pensó en su tripulación.",
    videoD: "https://assets.grok.com/users/47885d9f-3cbb-4e29-ba84-f0b2ff3065d1/generated/c6330ca7-fc85-4ff5-98cf-d9a2afb6b3f9/generated_video.mp4?cache=1",
    videoC: "https://assets.grok.com/users/47885d9f-3cbb-4e29-ba84-f0b2ff3065d1/generated/a4c100ec-39c9-4df5-9175-fda22bddc39f/generated_video.mp4?cache=1",
  },
  {
    id: 5,
    text: "Llegó la tripulación. Ellos lo ayudarán a recorrer la isla y encontrar los fragmentos del mapa. Con su ayuda podrá lograrlo.",
    videoD: "https://assets.grok.com/users/47885d9f-3cbb-4e29-ba84-f0b2ff3065d1/generated/842e0e11-85a9-4006-9445-a885a20bf4f5/generated_video.mp4?cache=1",
  },
  {
    id: 6,
    text: "Ahora el mapa está completo otra vez. ¡Es hora de seguir el camino hacia el tesoro, todos juntos!",
    videoD: "https://assets.grok.com/users/47885d9f-3cbb-4e29-ba84-f0b2ff3065d1/generated/b682b896-8b34-429f-b101-49c493c6e547/generated_video.mp4?cache=1",
  },
];

/** Imagen de composición inicial antes de comenzar */
export const storyStartImage = "/recursos/cuento_pirata.png";

/** Compatibilidad */
export const storyParagraphs: string[] | null = storyMoments.map((m) => m.text);
