import { missions, type Mission } from "@/content/missions";

export const CONFIG_KEY = "mirarim-tripulacion-config";

export type ActivityTexts = Mission["activity"];

export type Config = {
  includeActivities: boolean;
  activities: Record<number, ActivityTexts>;
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
    };
  } catch {
    return defaultConfig();
  }
}

export function saveConfig(config: Config): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function getActivity(order: number, config: Config): ActivityTexts {
  return config.activities[order] ?? missions.find((m) => m.order === order)!.activity;
}
