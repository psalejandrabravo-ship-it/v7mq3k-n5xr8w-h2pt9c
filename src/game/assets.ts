/** Rutas públicas. Los originales no se modifican. La interfaz usa derivados con fondo transparente. */

export const originals = {
  logoColor: "/recursos/originales/84070.png",
  logoDark: "/recursos/originales/84071.png",
  logoWhite: "/recursos/originales/84072.png",
  cover: "/recursos/originales/111237.jpg",
  story: "/recursos/originales/111238.jpg",
  layerA: "/recursos/originales/111191.jpg",
  layerB: "/recursos/originales/111192.jpg",
  layerC: "/recursos/originales/111193.jpg",
  layerD: "/recursos/originales/111194.jpg",
  map: "/recursos/originales/111247.jpg",
  beach: "/recursos/originales/111239.jpg",
  chestClosed: "/recursos/originales/111242.png",
  chestOpen: "/recursos/originales/111243.png",
  pirate: "/recursos/originales/111231.png",
} as const;

export const derived = {
  logoColor: "/recursos/derivados/logo-color.png",
  logoDark: "/recursos/derivados/logo-oscuro.png",
  logoWhite: "/recursos/derivados/logo-blanco.png",
  chestClosed: "/recursos/derivados/cofre-cerrado.png",
  chestOpen: "/recursos/derivados/cofre-abierto.png",
  pirate: "/recursos/derivados/pirata.png",
} as const;

export const aspects = {
  cover: 1712 / 1152,
  story: 1920 / 1080,
  map: 1168 / 784,
  beach: 1168 / 784,
} as const;

/** Color de los bordes reales de cada archivo, para el sobrante de object-fit contain. */
export const letterbox = {
  cover: "#6365af",
  story: "#141c41",
  beach: "#333064",
  map: "#5a4c66",
} as const;

/**
 * Anclas medidas sobre el contenido opaco (no el centro del lienzo).
 * El cofre abierto apoya la base unos 16 px más abajo que el cerrado en un lienzo de 300 px.
 */
export const anchors = {
  pirate: { x: 146.5 / 300, y: 286 / 300 },
  chestClosed: { x: 148 / 300, y: 252 / 300 },
  chestOpen: { x: 147 / 300, y: 270 / 300 },
} as const;
