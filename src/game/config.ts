import { missions, type Mission } from "@/content/missions";

export const CONFIG_KEY = "mirarim-tripulacion-config";

export type ActivityTexts = Mission["activity"];

export type Config = {
  includeActivities: boolean;
  activities: Record<number, ActivityTexts>;
  /** Data URLs de imágenes de ejemplo personalizadas por misión */
  exampleImages: Record<number, string | null>;
};

function defaultActivities(): Record<number, ActivityTexts> {
  const map: Record<number, ActivityTexts> = {};
  for (const m of missions) {
    map[m.order] = { ...m.activity };
  }
  return map;
}

export function defaultConfig(): Config {
  return {
    includeActivities: true,
    activities: defaultActivities(),
    exampleImages: {},
  };
}

export function loadConfig(): Config {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw) as Partial<Config>;
    const base = defaultConfig();
    return {
      includeActivities: typeof parsed.includeActivities === "boolean" ? parsed.includeActivities : base.includeActivities,
      activities: { ...base.activities, ...(parsed.activities ?? {}) },
      exampleImages: { ...(parsed.exampleImages ?? {}) },
    };
  } catch {
    return defaultConfig();
  }
}

export function saveConfig(config: Config): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignore (posible cuota excedida)
  }
}

export function getActivity(order: number, config: Config): ActivityTexts {
  return config.activities[order] ?? missions.find((m) => m.order === order)!.activity;
}

export function getExampleImage(order: number, config: Config): { src: string; alt: string } {
  const mission = missions.find((m) => m.order === order);
  const custom = config.exampleImages[order];
  if (custom) {
    return { src: custom, alt: mission?.exampleAlt ?? "Ejemplo de la actividad presencial" };
  }
  return {
    src: mission?.exampleImage ?? "",
    alt: mission?.exampleAlt ?? "Ejemplo de la actividad presencial",
  };
}
