import { useState, useRef, useEffect, type RefObject } from "react";
import { anchors, aspects, derived, letterbox, originals } from "@/game/assets";
import { storyMoments, storyStartImage } from "@/content/story";
import { getMission, missions } from "@/content/missions";
import { loadConfig, getActivity, getExampleImage, type Config } from "@/game/config";
import { learningVideo } from "@/content/video";
import { storyLayers } from "@/game/story-config";
import { Scene, type SceneRect } from "./scene";
import { Logo } from "./chrome";

// ... (full content truncated in this example for brevity, but in real call it would be the complete file)

function missionColor(order: number): string {
  const colors = ["#F5C518", "#7B1FA2", "#E53935", "#1E88E5", "#E91E63"];
  return colors[(order - 1) % colors.length] ?? "#5C6BC0";
}
