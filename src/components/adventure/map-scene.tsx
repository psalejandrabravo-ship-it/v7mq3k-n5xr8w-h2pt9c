import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { anchors, aspects, derived, letterbox } from "@/game/assets";
import {
  MAP_VIEW,
  chestPoint,
  fullTrail,
  legPoints,
  pirateRests,
  pointOnPolyline,
  stops,
  trailPathD,
  type Pt,
} from "@/game/map-config";
import { TOTAL_MISSIONS } from "@/game/progress";
import { Scene, type SceneRect } from "./scene";

type MapSceneProps = {
  completed: number;
  pending: { from: number; to: number } | null;
  onFinishMove: () => void;
  onOpenMission: (order: number) => void;
  onOpenChest: () => void;
  onStory: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
  fullscreenActive: boolean;
  currentMission: number;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MapScene({
  completed,
  pending,
  onFinishMove,
  onOpenMission,
  onOpenChest,
  onStory,
  onReset,
  onToggleFullscreen,
  fullscreenActive,
  currentMission,
}: MapSceneProps) {
  const [pose, setPose] = useState<Pt>(pirateRests[Math.min(completed, pirateRests.length - 1)]);
  const moving = pending !== null;
  const finishRef = useRef(onFinishMove);
  finishRef.current = onFinishMove;

  useEffect(() => {
    if (!pending) {
      setPose(pirateRests[Math.min(completed, pirateRests.length - 1)]);
      return;
    }
    const samples = legPoints(pending.from);
    if (prefersReducedMotion() || samples.length < 2) {
      setPose(pirateRests[pending.to] ?? samples[samples.length - 1]);
      finishRef.current();
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1500;
    const step = (now: number) => {
      const u = Math.min(1, (now - start) / duration);
      const eased = u < 0.5 ? 2 * u * u : 1 - ((-2 * u + 2) ** 2) / 2;
      setPose(pointOnPolyline(samples, eased));
      if (u < 1) frame = requestAnimationFrame(step);
      else finishRef.current();
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [pending, completed]);

  const trail = fullTrail();
  const dots = trail.filter((_, index) => index % 5 === 0);

  return (
    <div className="relative h-full w-full">
      <Scene src="/recursos/originales/111247.jpg" aspect={aspects.map} letterbox={letterbox.map} alt="Mapa de la isla, visto desde arriba.">
        {(rect) => (
          <>
            <svg
              className="absolute"
              style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
              viewBox={`0 0 ${MAP_VIEW.w} ${MAP_VIEW.h}`}
              aria-hidden="true"
            >
              <path d={trailPathD(trail)} fill="none" stroke="#e4b23c" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
              {dots.map((dot, index) => (
                <circle key={index} cx={dot.x * MAP_VIEW.w} cy={dot.y * MAP_VIEW.h} r="5" fill="#fffaf3" stroke="#c45d45" strokeWidth="2" />
              ))}
            </svg>
            <Pirate rect={rect} at={pose} />
            {stops.map((stop) => (
              <Stop
                key={stop.order}
                rect={rect}
                at={stop.at}
                order={stop.order}
                completed={completed}
                locked={moving}
                onOpen={() => onOpenMission(stop.order)}
              />
            ))}
            <ChestMark rect={rect} enabled={completed === TOTAL_MISSIONS && !moving} onOpen={onOpenChest} />
          </>
        )}
      </Scene>

      {/* Controles superiores periféricos */}
      <button
        type="button"
        className="absolute top-4 left-4 z-40 text-white/90 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-base font-semibold"
        onClick={onStory}
      >
        Ver el cuento
      </button>
      <button
        type="button"
        className="absolute top-4 right-4 z-40 text-white/90 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-base font-semibold"
        onClick={onToggleFullscreen}
        aria-label={fullscreenActive ? "Salir de pantalla completa" : "Ampliar pantalla"}
      >
        {fullscreenActive ? "Salir" : "Ampliar"}
      </button>

      {/* Acciones inferiores, alejadas de las paradas */}
      <div className="absolute bottom-6 left-6 z-40 flex gap-3">
        <button
          type="button"
          className="text-white/90 hover:text-white bg-black/30 backdrop-blur-sm px-5 py-2 rounded-full text-base"
          onClick={onReset}
        >
          Reiniciar
        </button>
      </div>
      <div className="absolute bottom-6 right-6 z-40">
        {completed >= TOTAL_MISSIONS ? (
          <button
            type="button"
            className="text-white font-bold bg-white/25 backdrop-blur-md px-6 py-3 rounded-full text-lg hover:bg-white/35"
            onClick={onOpenChest}
          >
            Ir al cofre
          </button>
        ) : (
          <button
            type="button"
            className="text-white font-bold bg-white/25 backdrop-blur-md px-6 py-3 rounded-full text-lg hover:bg-white/35"
            onClick={() => onOpenMission(currentMission)}
          >
            Ir a la misión {currentMission}
          </button>
        )}
      </div>
    </div>
  );
}

function Pirate({ rect, at }: { rect: SceneRect; at: Pt }) {
  const width = rect.w * 0.075;
  return (
    <img
      src={derived.pirate}
      alt=""
      className="pointer-events-none absolute z-10 max-w-none"
      style={{
        left: rect.x + at.x * rect.w,
        top: rect.y + at.y * rect.h,
        width,
        transform: `translate(${-anchors.pirate.x * 100}%, ${-anchors.pirate.y * 100}%)`,
      }}
    />
  );
}

function Stop({
  rect,
  at,
  order,
  completed,
  locked,
  onOpen,
}: {
  rect: SceneRect;
  at: Pt;
  order: number;
  completed: number;
  locked: boolean;
  onOpen: () => void;
}) {
  const state = order <= completed ? "done" : order === completed + 1 ? "available" : "blocked";
  const label =
    state === "done" ? `Misión ${order}, completada` : state === "available" ? `Misión ${order}, disponible` : `Misión ${order}, bloqueada`;
  const className =
    "absolute z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-base font-bold " +
    (state === "available"
      ? "border-gold/80 bg-white/20 backdrop-blur-sm text-white"
      : state === "done"
        ? "border-coral/70 bg-white/15 backdrop-blur-sm text-white"
        : "border-white/40 bg-black/20 backdrop-blur-sm text-white/70");
  const style = { left: rect.x + at.x * rect.w, top: rect.y + at.y * rect.h };
  const inner = (
    <>
      <span aria-hidden="true">{order}</span>
      {state === "done" ? <MarkX /> : null}
      {state === "blocked" ? <Lock className="absolute -right-1 -top-1 size-3.5 rounded-full bg-black/40 p-0.5 text-white" aria-hidden="true" /> : null}
      {state === "available" ? <span className="sr-only">Ahora</span> : null}
    </>
  );
  if (state === "available") {
    return (
      <button type="button" className={className} style={style} aria-label={label} disabled={locked} onClick={onOpen}>
        {inner}
      </button>
    );
  }
  return (
    <span className={className} style={style} role="img" aria-label={label}>
      {inner}
    </span>
  );
}

function MarkX() {
  return (
    <svg viewBox="0 0 48 48" className="pointer-events-none absolute inset-0" aria-hidden="true">
      <path d="M12 12 L36 36 M36 12 L12 36" stroke="#ff6b6b" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ChestMark({ rect, enabled, onOpen }: { rect: SceneRect; enabled: boolean; onOpen: () => void }) {
  const style = {
    left: rect.x + chestPoint.x * rect.w,
    top: rect.y + chestPoint.y * rect.h,
  };
  const className =
    "absolute z-20 flex h-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 px-3 text-sm font-bold " +
    (enabled ? "border-gold/80 bg-white/20 backdrop-blur-sm text-white" : "border-white/40 bg-black/20 backdrop-blur-sm text-white/70");
  const body = <span aria-hidden="true">Cofre</span>;
  if (enabled) {
    return (
      <button type="button" className={className} style={style} aria-label="Cofre del tesoro, disponible" onClick={onOpen}>
        {body}
      </button>
    );
  }
  return (
    <span className={className} style={style} role="img" aria-label="Cofre del tesoro, bloqueado">
      {body}
      <Lock className="absolute -right-1 -top-1 size-3.5 rounded-full bg-black/40 p-0.5 text-white" aria-hidden="true" />
    </span>
  );
}
