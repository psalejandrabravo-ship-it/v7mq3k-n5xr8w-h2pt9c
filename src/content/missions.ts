/**
 * DÓNDE INCORPORAR CADA MISIÓN
 * Ahora son 5 misiones.
 */
export type MissionSlot = {
  order: number;
  title: string;
  instructions: string | null;
};

export const missionSlots: MissionSlot[] = [1, 2, 3, 4, 5].map((order) => ({
  order,
  title: `Misión ${order}`,
  instructions: null,
}));

export function missionSlot(order: number): MissionSlot {
  return missionSlots.find((m) => m.order === order) ?? missionSlots[0];
}
