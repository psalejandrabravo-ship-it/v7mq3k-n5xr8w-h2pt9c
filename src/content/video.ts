/**
 * DÓNDE INCORPORAR EL VIDEO DE APRENDIZAJE
 * Cuando exista el archivo local, asigna `src` (por ejemplo "/recursos/video/aprendizaje.mp4")
 * y, si hay subtítulos, `captions` apuntando a un .vtt.
 * null muestra el espacio reservado, sin reproductor.
 * No uses un servicio externo sin aprobación.
 */
export type LearningVideo = {
  src: string;
  captions?: string;
};

export const learningVideo: LearningVideo | null = null;
