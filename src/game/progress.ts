export const SAVE_KEY = "mirarim-tripulacion-avance";
export const SAVE_VERSION = 1 as const;
export const TOTAL_MISSIONS = 5;

export type ScreenName = "cover" | "story" | "map" | "mission" | "chest" | "video";

export type Save = {
  version: typeof SAVE_VERSION;
  completed: number;
  chestOpen: boolean;
  screen: ScreenName;
  missionOrder: number;
};

export function emptySave(): Save {
  return {
    version: SAVE_VERSION,
    completed: 0,
    chestOpen: false,
    screen: "cover",
    missionOrder: 1,
  };
}

export function hasProgress(save: Save): boolean {
  return save.completed > 0 || save.chestOpen;
}

const SCREENS: ScreenName[] = ["cover", "story", "map", "mission", "chest", "video"];

export function sanitize(raw: unknown): { save: Save; notice: string | null } {
  const empty = emptySave();
  if (!raw || typeof raw !== "object") {
    return { save: empty, notice: "El avance guardado no se pudo leer. Se empezó de nuevo." };
  }
  const o = raw as Record<string, unknown>;
  if (o.version !== SAVE_VERSION) {
    return { save: empty, notice: "El avance guardado no se pudo leer. Se empezó de nuevo." };
  }
  const completed = o.completed;
  if (typeof completed !== "number" || !Number.isInteger(completed) || completed < 0 || completed > TOTAL_MISSIONS) {
    return { save: empty, notice: "El avance guardado no se pudo leer. Se empezó de nuevo." };
  }
  let notice: string | null = null;
  let chestOpen = o.chestOpen === true;
  if (chestOpen && completed < TOTAL_MISSIONS) {
    chestOpen = false;
    notice = `El cofre estaba abierto sin las ${TOTAL_MISSIONS} misiones. Se dejó cerrado.`;
  }
  let screen: ScreenName = SCREENS.includes(o.screen as ScreenName) ? (o.screen as ScreenName) : completed > 0 ? "map" : "cover";
  let missionOrder = typeof o.missionOrder === "number" ? o.missionOrder : 1;
  if (screen === "mission") {
    if (missionOrder !== completed + 1 || missionOrder < 1 || missionOrder > TOTAL_MISSIONS) {
      screen = "map";
      missionOrder = 1;
    }
  } else {
    missionOrder = 1;
  }
  if (screen === "chest" && completed < TOTAL_MISSIONS) screen = "map";
  if (screen === "video" && !(completed === TOTAL_MISSIONS && chestOpen)) screen = completed === TOTAL_MISSIONS ? "chest" : "map";
  return {
    save: { version: SAVE_VERSION, completed, chestOpen, screen, missionOrder },
    notice,
  };
}

let memory: Save | null = null;
let memoryOnly = false;

export function loadProgress(): { save: Save; notice: string | null; warning: string | null } {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { save: memory ?? emptySave(), notice: null, warning: null };
    const result = sanitize(JSON.parse(raw));
    memory = result.save;
    return { ...result, warning: null };
  } catch {
    memoryOnly = true;
    return {
      save: memory ?? emptySave(),
      notice: null,
      warning: "El avance de esta sesión podría no conservarse en este navegador.",
    };
  }
}

export function saveProgress(save: Save): string | null {
  memory = save;
  if (memoryOnly) return "El avance de esta sesión podría no conservarse en este navegador.";
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    return null;
  } catch {
    memoryOnly = true;
    return "El avance de esta sesión podría no conservarse en este navegador.";
  }
}

export function clearProgress(): string | null {
  return saveProgress(emptySave());
}
