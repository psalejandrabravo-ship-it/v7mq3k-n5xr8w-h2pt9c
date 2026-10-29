/**
 * DÓNDE INCORPORAR CADA MISIÓN
 * El orden y el título visible están fijados. Cuando exista la actividad,
 * completa `instructions` (y, más adelante, los objetos de esa misión).
 * null mantiene el escenario visible y la nota de contenido pendiente.
 */
export type MissionSlot = {
  order: number;
  title: string;
  instructions: string | null;
};

export const missionSlots: MissionSlot[] = [1, 2, 3, 4, 5, 6].map((order) => ({
  order,
  title: `Misión ${order}`,
  instructions: null,
}));

export function missionSlot(order: number): MissionSlot {
  return missionSlots.find((m) => m.order === order) ?? missionSlots[0];
}
