import assert from "node:assert/strict";
import test from "node:test";
import { emptySave, sanitize } from "./progress.ts";

test("sin datos válidos vuelve a un estado seguro", () => {
  const broken = sanitize({ version: 1, completed: 4.5, chestOpen: true });
  assert.equal(broken.save.completed, 0);
  assert.equal(broken.save.chestOpen, false);
  assert.ok(broken.notice);
});

test("el cofre no queda abierto si faltan misiones", () => {
  const result = sanitize({ version: 1, completed: 3, chestOpen: true, screen: "chest" });
  assert.equal(result.save.completed, 3);
  assert.equal(result.save.chestOpen, false);
  assert.equal(result.save.screen, "map");
});

test("solo admite la misión siguiente", () => {
  const result = sanitize({ version: 1, completed: 2, chestOpen: false, screen: "mission", missionOrder: 4 });
  assert.equal(result.save.screen, "map");
  const ok = sanitize({ version: 1, completed: 2, chestOpen: false, screen: "mission", missionOrder: 3 });
  assert.equal(ok.save.screen, "mission");
  assert.equal(ok.save.missionOrder, 3);
});

test("el video exige las seis misiones y el cofre abierto", () => {
  const early = sanitize({ version: 1, completed: 6, chestOpen: false, screen: "video" });
  assert.equal(early.save.screen, "chest");
  const ready = sanitize({ version: 1, completed: 6, chestOpen: true, screen: "video" });
  assert.equal(ready.save.screen, "video");
  assert.deepEqual(emptySave().screen, "cover");
});
