import { type RefObject } from "react";
import { anchors, aspects, derived, letterbox, originals } from "@/game/assets";
import { storyParagraphs } from "@/content/story";
import { missionSlot } from "@/content/missions";
import { learningVideo } from "@/content/video";
import { storyLayers } from "@/game/story-config";
import { Scene, type SceneRect } from "./scene";
import { Logo } from "./chrome";

export function CoverScene({
  logoSrc,
  headingRef,
}: {
  logoSrc: string | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <Scene
      src={originals.cover}
      aspect={aspects.cover}
      letterbox={letterbox.cover}
      alt="Niñas y niños de la tripulación tiran juntos de una cuerda en la cubierta de un barco."
    >
      {(rect) => (
        <div
          className="absolute z-10 rounded-3xl bg-foam/95 px-5 py-4 text-center shadow-lg"
          style={{
            left: rect.x + rect.w * 0.08,
            top: rect.y + rect.h * 0.06,
            width: Math.min(rect.w * 0.84, 640),
          }}
        >
          <Logo src={logoSrc} variant="color" className="mx-auto h-16 w-56" />
          <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-extrabold text-indigo outline-none md:text-4xl">
            ¡Tripulación, juntos al tesoro!
          </h1>
        </div>
      )}
    </Scene>
  );
}

export function StoryScene({ showLayers }: { showLayers: boolean }) {
  const paragraphs = storyParagraphs;
  return (
    <Scene src={originals.story} aspect={aspects.story} letterbox={letterbox.story} alt="">
      {(rect) => (
        <>
          {showLayers
            ? storyLayers.map((layer) => (
                <img
                  key={layer.id}
                  src={layer.file}
                  alt=""
                  className="absolute max-w-none"
                  style={{
                    left: rect.x + layer.x * rect.w,
                    top: rect.y + layer.y * rect.h,
                    width: layer.w * rect.w,
                    height: layer.h * rect.h,
                    zIndex: layer.z,
                  }}
                />
              ))
            : null}
          {paragraphs && paragraphs.length > 0 ? (
            <div
              className="absolute z-10 overflow-auto rounded-3xl bg-foam/95 p-4 text-lg text-ink shadow-lg"
              style={{
                left: rect.x + rect.w * 0.06,
                top: rect.y + rect.h * 0.72,
                width: rect.w * 0.88,
                height: rect.h * 0.25,
              }}
            >
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}
        </>
      )}
    </Scene>
  );
}

export function MissionScene({ order }: { order: number }) {
  const slot = missionSlot(order);
  return (
    <Scene src={originals.beach} aspect={aspects.beach} letterbox={letterbox.beach} alt="">
      {(rect) =>
        slot.instructions ? (
          <div
            className="absolute z-10 overflow-auto rounded-3xl bg-foam/95 p-4 text-lg text-ink shadow-lg"
            style={{
              left: rect.x + rect.w * 0.08,
              top: rect.y + rect.h * 0.72,
              width: rect.w * 0.84,
              height: rect.h * 0.24,
            }}
          >
            {slot.instructions}
          </div>
        ) : (
          <p
            className="absolute z-10 -translate-x-1/2 rounded-full bg-foam/92 px-4 py-2 text-center text-base font-bold text-sea shadow"
            style={{ left: rect.x + rect.w / 2, top: rect.y + 12 }}
          >
            Contenido de esta misión pendiente.
          </p>
        )
      }
    </Scene>
  );
}

export function ChestScene({ open, justOpened }: { open: boolean; justOpened: boolean }) {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const showFx = open && justOpened && !reduced;
  return (
    <Scene src={originals.beach} aspect={aspects.beach} letterbox={letterbox.beach} alt="">
      {(rect) => (
        <>
          <Glow rect={rect} open={open} animate={showFx} staticGlow={open && !showFx} />
          {showFx ? <Motes rect={rect} /> : null}
          <ChestSprite rect={rect} src={derived.chestClosed} anchor={anchors.chestClosed} visible={!open} pop={false} />
          <ChestSprite rect={rect} src={derived.chestOpen} anchor={anchors.chestOpen} visible={open} pop={showFx} />
        </>
      )}
    </Scene>
  );
}

function ChestSprite({
  rect,
  src,
  anchor,
  visible,
  pop,
}: {
  rect: SceneRect;
  src: string;
  anchor: { x: number; y: number };
  visible: boolean;
  pop: boolean;
}) {
  const width = Math.min(rect.w * 0.3, rect.h * 0.46);
  const atX = 0.5;
  const atY = 0.62;
  return (
    <img
      src={src}
      alt={visible ? (src === derived.chestOpen ? "Cofre abierto" : "Cofre cerrado") : ""}
      aria-hidden={visible ? undefined : true}
      className={`pointer-events-none absolute z-10 max-w-none ${pop ? "chest-pop" : ""}`}
      style={{
        left: rect.x + atX * rect.w,
        top: rect.y + atY * rect.h,
        width,
        transform: `translate(${-anchor.x * 100}%, ${-anchor.y * 100}%)`,
        opacity: visible ? 1 : 0,
        transition: "opacity 480ms ease",
      }}
    />
  );
}

function Glow({
  rect,
  open,
  animate,
  staticGlow,
}: {
  rect: SceneRect;
  open: boolean;
  animate: boolean;
  staticGlow: boolean;
}) {
  if (!open) return null;
  const size = Math.min(rect.w * 0.42, rect.h * 0.55);
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 rounded-full ${animate ? "chest-glow" : ""}`}
      style={{
        left: rect.x + rect.w * 0.5 - size / 2,
        top: rect.y + rect.h * 0.46 - size / 2,
        width: size,
        height: size,
        opacity: staticGlow ? 0.72 : undefined,
        background: "radial-gradient(circle, rgb(228 178 60 / 0.9) 0%, rgb(224 122 95 / 0.35) 42%, transparent 70%)",
      }}
    />
  );
}

function Motes({ rect }: { rect: SceneRect }) {
  const spots = [
    { x: -30, y: 8 },
    { x: 24, y: -6 },
    { x: -8, y: -18 },
    { x: 40, y: 16 },
    { x: -48, y: 20 },
    { x: 8, y: 24 },
    { x: -16, y: -4 },
    { x: 28, y: -22 },
  ];
  return (
    <>
      {spots.map((spot, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="chest-mote pointer-events-none absolute z-20 size-2 rounded-full bg-gold"
          style={{
            left: rect.x + rect.w * 0.5 + spot.x,
            top: rect.y + rect.h * 0.48 + spot.y,
            animationDelay: `${index * 40}ms`,
          }}
        />
      ))}
    </>
  );
}

export function VideoScene() {
  return (
    <div className="flex h-full items-center justify-center bg-indigo p-4">
      <div className="w-full max-w-4xl">
        {learningVideo ? (
          <video className="aspect-video w-full rounded-3xl bg-ink" controls preload="metadata">
            <source src={learningVideo.src} />
            {learningVideo.captions ? <track kind="captions" src={learningVideo.captions} srcLang="es" label="Español" default /> : null}
          </video>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-3xl bg-sea px-6 text-center text-xl font-extrabold text-foam">
            Aquí se incorporará el video de aprendizaje.
          </div>
        )}
      </div>
    </div>
  );
}
