import { useState, useRef, useEffect, type RefObject } from "react";
import { anchors, aspects, derived, letterbox, originals } from "@/game/assets";
import { storyMoments, storyStartImage } from "@/content/story";
import { getMission, missions } from "@/content/missions";
import { loadConfig, getActivity, type Config } from "@/game/config";
import { learningVideo } from "@/content/video";
import { storyLayers } from "@/game/story-config";
import { Scene, type SceneRect } from "./scene";
import { Logo } from "./chrome";

export function CoverScene({
  logoSrc,
  headingRef,
  onStart,
  onContinue,
  onStory,
  onReset,
  onLogo,
  onConfig,
  onToggleFullscreen,
  fullscreenActive,
  hasProgress,
}: {
  logoSrc: string | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
  onContinue: () => void;
  onStory: () => void;
  onReset: () => void;
  onLogo: () => void;
  onConfig: () => void;
  onToggleFullscreen: () => void;
  fullscreenActive: boolean;
  hasProgress: boolean;
}) {
  return (
    <div className="relative h-full w-full">
      <Scene
        src={originals.cover}
        aspect={aspects.cover}
        letterbox={letterbox.cover}
        alt="Niñas y niños de la tripulación tiran juntos de una cuerda en la cubierta de un barco."
      >
        {(rect) => (
          <div
            className="absolute z-10 text-center"
            style={{
              left: rect.x + rect.w * 0.5 - 200,
              top: rect.y + rect.h * 0.08,
              width: 400,
            }}
          >
            <Logo src={logoSrc} variant="color" className="mx-auto h-14 w-48" />
            <h1 ref={headingRef} tabIndex={-1} className="mt-3 text-3xl font-extrabold text-white outline-none drop-shadow-lg md:text-4xl" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
              ¡Tripulación, juntos al tesoro!
            </h1>
          </div>
        )}
      </Scene>

      {/* Controles superiores */}
      <button
        type="button"
        className="absolute top-4 left-4 z-50 text-white/90 hover:text-white bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-base font-semibold"
        onClick={onConfig}
      >
        Configuración
      </button>
      <button
        type="button"
        className="absolute top-4 right-4 z-40 text-white/90 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-base font-semibold"
        onClick={onToggleFullscreen}
        aria-label={fullscreenActive ? "Salir de pantalla completa" : "Ampliar pantalla"}
      >
        {fullscreenActive ? "Salir" : "Ampliar"}
      </button>

      {/* Acción principal inferior */}
      <div className="absolute bottom-8 left-0 right-0 z-40 flex flex-col items-center gap-3">
        {hasProgress ? (
          <>
            <button
              type="button"
              className="text-white font-bold bg-white/25 backdrop-blur-md px-8 py-4 rounded-full text-xl hover:bg-white/35"
              onClick={onContinue}
            >
              Continuar aventura
            </button>
            <div className="flex gap-3">
              <button type="button" className="text-white/90 bg-black/30 backdrop-blur-sm px-5 py-2 rounded-full text-base" onClick={onStory}>
                Ver el cuento
              </button>
              <button type="button" className="text-white/90 bg-black/30 backdrop-blur-sm px-5 py-2 rounded-full text-base" onClick={onReset}>
                Reiniciar
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="text-white font-bold bg-white/25 backdrop-blur-md px-10 py-4 rounded-full text-xl hover:bg-white/35"
            onClick={onStart}
          >
            Comenzar aventura
          </button>
        )}
      </div>
    </div>
  );
}

export function StoryScene({
  showLayers,
  onGoCover,
  onGoMap,
  onToggleFullscreen,
  fullscreenActive,
}: {
  showLayers: boolean;
  onGoCover: () => void;
  onGoMap: () => void;
  onToggleFullscreen: () => void;
  fullscreenActive: boolean;
}) {
  const [started, setStarted] = useState(false);
  const [momentIndex, setMomentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoDRef = useRef<HTMLVideoElement>(null);
  const videoCRef = useRef<HTMLVideoElement>(null);

  const moment = storyMoments[momentIndex];
  const isLast = momentIndex === storyMoments.length - 1;

  useEffect(() => {
    if (!started || !playing) return;
    const d = videoDRef.current;
    const c = videoCRef.current;
    if (d) {
      d.currentTime = 0;
      void d.play().catch(() => {});
    }
    if (c) {
      c.currentTime = 0;
      void c.play().catch(() => {});
    }
  }, [started, playing, momentIndex]);

  function startStory() {
    setStarted(true);
    setPlaying(true);
    setMomentIndex(0);
  }

  function next() {
    if (isLast) return;
    setMomentIndex((i) => i + 1);
    setPlaying(true);
  }

  function prev() {
    if (momentIndex === 0) return;
    setMomentIndex((i) => i - 1);
    setPlaying(true);
  }

  function repeat() {
    setPlaying(true);
    const d = videoDRef.current;
    const c = videoCRef.current;
    if (d) {
      d.currentTime = 0;
      void d.play().catch(() => {});
    }
    if (c) {
      c.currentTime = 0;
      void c.play().catch(() => {});
    }
  }

  return (
    <div className="relative h-full w-full">
      <Scene src={originals.story} aspect={aspects.story} letterbox={letterbox.story} alt="">
        {(rect) => (
          <>
            {showLayers
              ? storyLayers.map((layer) => (
                  <img
                    key={layer.id}
                    src={layer.file}
                    alt=""
                    className="absolute max-w-none pointer-events-none"
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

            {!started ? (
              <>
                <img
                  src={originals.story}
                  alt="Escenario completo del cuento"
                  className="absolute max-w-none object-cover"
                  style={{
                    left: rect.x,
                    top: rect.y,
                    width: rect.w,
                    height: rect.h,
                    zIndex: 5,
                  }}
                />
                <img
                  src={derived.pirate}
                  alt="Pirata en zona D"
                  className="absolute max-w-none pointer-events-none"
                  style={{
                    left: rect.x + rect.w * 0.62,
                    top: rect.y + rect.h * 0.58,
                    width: rect.w * 0.22,
                    zIndex: 6,
                  }}
                />
                <button
                  type="button"
                  className="absolute z-30 rounded-full bg-white/15 backdrop-blur-md px-8 py-4 text-2xl font-extrabold text-white shadow-lg border border-white/20"
                  style={{
                    left: rect.x + rect.w * 0.5 - 140,
                    top: rect.y + rect.h * 0.82,
                  }}
                  onClick={startStory}
                >
                  Comenzar cuento
                </button>
              </>
            ) : (
              <>
                <video
                  ref={videoDRef}
                  src={moment.videoD}
                  muted
                  playsInline
                  className="absolute max-w-none object-cover pointer-events-none"
                  style={{
                    left: rect.x + rect.w * 0.5,
                    top: rect.y + rect.h * 0.5,
                    width: rect.w * 0.5,
                    height: rect.h * 0.5,
                    zIndex: 6,
                  }}
                  onEnded={() => setPlaying(false)}
                />

                {moment.videoC ? (
                  <video
                    ref={videoCRef}
                    src={moment.videoC}
                    muted
                    playsInline
                    className="absolute max-w-none object-cover pointer-events-none"
                    style={{
                      left: rect.x,
                      top: rect.y + rect.h * 0.5,
                      width: rect.w * 0.5,
                      height: rect.h * 0.5,
                      zIndex: 6,
                    }}
                  />
                ) : null}

                <div
                  className="absolute z-10 p-6 text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                  style={{
                    left: rect.x + rect.w * 0.03,
                    top: rect.y + rect.h * 0.03,
                    width: rect.w * 0.48,
                    maxHeight: rect.h * 0.38,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 70%, transparent 100%)",
                    borderRadius: "1rem",
                    textShadow: "0 2px 6px rgba(0,0,0,0.6)",
                  }}
                >
                  <p>{moment.text}</p>
                </div>
              </>
            )}
          </>
        )}
      </Scene>

      <button
        type="button"
        className="absolute top-4 left-4 z-40 text-white/90 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-base font-semibold"
        onClick={onGoCover}
      >
        Volver al inicio
      </button>
      <button
        type="button"
        className="absolute top-4 right-4 z-40 text-white/90 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-base font-semibold"
        onClick={onToggleFullscreen}
        aria-label={fullscreenActive ? "Salir de pantalla completa" : "Ampliar pantalla"}
      >
        {fullscreenActive ? "Salir" : "Ampliar"}
      </button>

      {started && (
        <div className="absolute bottom-6 left-0 right-0 z-40 flex items-center justify-between px-6">
          <button
            type="button"
            className="text-white/90 hover:text-white bg-black/30 backdrop-blur-sm px-5 py-3 rounded-full text-lg font-semibold"
            onClick={repeat}
          >
            Repetir
          </button>
          {!isLast ? (
            <button
              type="button"
              className="text-white font-bold bg-white/25 backdrop-blur-md px-7 py-3 rounded-full text-lg hover:bg-white/35"
              onClick={next}
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              className="text-white font-bold bg-white/25 backdrop-blur-md px-7 py-3 rounded-full text-lg hover:bg-white/35"
              onClick={onGoMap}
            >
              Ir al mapa
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function MissionScene({
  order,
  onComplete,
  onMap,
  onToggleFullscreen,
  fullscreenActive,
  busy,
}: {
  order: number;
  onComplete: () => void;
  onMap: () => void;
  onToggleFullscreen: () => void;
  fullscreenActive: boolean;
  busy: boolean;
}) {
  const mission = getMission(order);
  const [config] = useState<Config>(() => loadConfig());
  const activity = getActivity(order, config);
  const includeActivities = config.includeActivities;

  const [selected, setSelected] = useState<number | null>(null);
  const [showWrong, setShowWrong] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  function choose(index: number) {
    if (solved || busy) return;
    setSelected(index);
    if (index === mission.correctIndex) {
      setSolved(true);
      setShowWrong(false);
    } else {
      setShowWrong(true);
    }
  }

  function retry() {
    setSelected(null);
    setShowWrong(false);
  }

  const illustration = solved ? mission.solutionImage : mission.situationImage;
  const illustrationAlt = solved ? mission.solutionAlt : mission.situationAlt;

  return (
    <div className="relative h-full w-full flex flex-col bg-black">
      {/* Fondo completo sin letterbox */}
      <img
        src={originals.beach}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Controles discretos */}
      <div className="absolute top-3 left-3 right-3 z-50 flex justify-between">
        <button
          type="button"
          className="text-white/90 hover:text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold"
          onClick={onMap}
        >
          Volver al mapa
        </button>
        <button
          type="button"
          className="text-white/90 hover:text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold"
          onClick={onToggleFullscreen}
          aria-label={fullscreenActive ? "Salir de pantalla completa" : "Ampliar pantalla"}
        >
          {fullscreenActive ? "Salir" : "Ampliar"}
        </button>
      </div>

      {/* Zona de textos */}
      <div className="relative z-20 flex-shrink-0 pt-12 px-4 pb-2 text-white" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>
        <h2 className="text-xl md:text-2xl font-extrabold mb-1">
          Misión {mission.order} — {mission.title}
        </h2>
        {!solved && (
          <>
            <p className="text-base md:text-lg mb-1">{mission.situation}</p>
            <p className="text-lg md:text-xl font-bold mb-2">{mission.question}</p>
            <div className="flex flex-col md:flex-row gap-2">
              {mission.alternatives.map((alt, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex-1 text-left bg-white/15 hover:bg-white/25 px-3 py-2 rounded-xl text-sm md:text-base font-semibold border border-white/20"
                  onClick={() => choose(i)}
                  disabled={busy}
                >
                  <span className="font-bold mr-1">{String.fromCharCode(65 + i)}.</span>
                  {alt}
                </button>
              ))}
            </div>
          </>
        )}
        {solved && (
          <p className="text-base md:text-lg font-medium">{mission.teaching}</p>
        )}
      </div>

      {/* Ilustración en zona propia */}
      <div className="relative flex-1 min-h-0 flex items-end justify-center pb-4">
        <img
          src={illustration}
          alt={illustrationAlt}
          className="max-w-[90%] max-h-full object-contain"
        />
      </div>

      {/* Retroalimentación incorrecta */}
      {showWrong && !solved && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 bg-black/60 backdrop-blur-md text-white px-6 py-4 rounded-2xl text-center max-w-lg">
          <p className="mb-3 text-lg">{mission.wrongFeedback}</p>
          <button
            type="button"
            className="bg-white/25 hover:bg-white/35 px-6 py-2 rounded-full font-semibold"
            onClick={retry}
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Botones tras resolver */}
      {solved && (
        <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center gap-3">
          {includeActivities ? (
            <button
              type="button"
              className="text-white font-bold bg-white/25 backdrop-blur-md px-6 py-3 rounded-full text-lg hover:bg-white/35"
              onClick={() => setShowActivity(true)}
            >
              Ver misión del grupo
            </button>
          ) : (
            <button
              type="button"
              className="text-white font-bold bg-white/25 backdrop-blur-md px-6 py-3 rounded-full text-lg hover:bg-white/35 disabled:opacity-50"
              disabled={busy}
              onClick={onComplete}
            >
              Continuar al mapa
            </button>
          )}
        </div>
      )}

      {/* Ventana principal de actividad (simplificada) */}
      {showActivity && includeActivities && !showDetails && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white text-ink rounded-3xl max-w-md w-full p-5 shadow-xl">
            <h3 className="text-xl font-extrabold mb-1">Misión para el grupo</h3>
            <p className="font-semibold text-lg mb-2">{activity.name}</p>
            <p className="text-base mb-2">{activity.briefInstruction || activity.instruction}</p>
            <p className="text-sm text-ink/70 mb-4">Participa solo el grupo encargado de esta misión.</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 text-sm text-indigo font-medium"
                onClick={() => setShowDetails(true)}
              >
                <span aria-hidden="true">ℹ️</span> Ver detalles
              </button>
              <button
                type="button"
                className="bg-indigo text-white font-bold py-2.5 rounded-full disabled:opacity-50"
                disabled={busy}
                onClick={() => {
                  setShowActivity(false);
                  onComplete();
                }}
              >
                Misión completada
              </button>
              <button
                type="button"
                className="py-2 rounded-full border border-ink/20"
                onClick={() => setShowActivity(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vista secundaria de detalles */}
      {showActivity && showDetails && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-white text-ink rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-5 shadow-xl">
            <h3 className="text-xl font-extrabold mb-3">Detalles de la actividad</h3>
            {activity.materials && <p className="mb-1 text-sm"><strong>Materiales:</strong> {activity.materials}</p>}
            {activity.preparation && <p className="mb-1 text-sm"><strong>Preparación:</strong> {activity.preparation}</p>}
            {activity.instruction && <p className="mb-1 text-sm"><strong>Consigna completa:</strong> {activity.instruction}</p>}
            {activity.guidance && <p className="mb-1 text-sm"><strong>Orientación:</strong> {activity.guidance}</p>}
            {activity.closingQuestion && <p className="mb-1 text-sm"><strong>Pregunta de cierre:</strong> {activity.closingQuestion}</p>}
            {activity.completionCriteria && <p className="mb-3 text-sm"><strong>Criterio de finalización:</strong> {activity.completionCriteria}</p>}
            <button
              type="button"
              className="w-full py-2 rounded-full border border-ink/20"
              onClick={() => setShowDetails(false)}
            >
              Volver a la instrucción
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ChestScene({ 
  open, 
  justOpened,
  onOpen,
  canOpen,
  onMap,
}: { 
  open: boolean; 
  justOpened: boolean;
  onOpen?: () => void;
  canOpen?: boolean;
  onMap?: () => void;
}) {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const showFx = open && justOpened && !reduced;
  return (
    <div className="relative h-full w-full">
      <Scene src={originals.beach} aspect={aspects.beach} letterbox={letterbox.beach} alt="">
        {(rect) => (
          <>
            <Glow rect={rect} open={open} animate={showFx} staticGlow={open && !showFx} />
            {showFx ? <Motes rect={rect} /> : null}
            <button
              type="button"
              className="absolute z-20 focus:outline-none focus:ring-4 focus:ring-white/50 rounded-lg"
              style={{
                left: rect.x + rect.w * 0.485,
                top: rect.y + rect.h * 0.45,
                width: rect.w * 0.48,
                height: rect.h * 0.5,
              }}
              onClick={canOpen ? onOpen : undefined}
              disabled={!canOpen}
              aria-label="Abrir el cofre del tesoro"
            >
              <ChestSprite rect={{ x: 0, y: 0, w: rect.w * 0.48, h: rect.h * 0.5 }} src={derived.chestClosed} anchor={anchors.chestClosed} visible={!open} pop={false} />
              <ChestSprite rect={{ x: 0, y: 0, w: rect.w * 0.48, h: rect.h * 0.5 }} src={derived.chestOpen} anchor={anchors.chestOpen} visible={open} pop={showFx} />
            </button>
          </>
        )}
      </Scene>
      <button
        type="button"
        className="absolute top-4 left-4 z-40 text-white/90 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-base font-semibold"
        onClick={onMap}
      >
        Volver al mapa
      </button>
      {canOpen && !open && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 text-white/80 text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
          Presiona el cofre para abrirlo
        </div>
      )}
    </div>
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
  const width = Math.min(rect.w * 0.55, rect.h * 0.72);
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

const FINAL_VIDEO = "https://videos.mirarim.com/Videos%20en%20juegos/Videos%20Tripulacion/Mas%20videos/download_20261031_151848_0000.mp4";

export function VideoScene({
  onSkip,
  onReset,
  onMap,
}: {
  onSkip?: () => void;
  onReset?: () => void;
  onMap?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const play = async () => {
      try {
        await v.play();
      } catch {
        setBlocked(true);
      }
    };
    void play();
  }, []);

  return (
    <div className="relative h-full w-full bg-black flex flex-col">
      <video
        ref={videoRef}
        src={FINAL_VIDEO}
        className="flex-1 w-full object-contain"
        playsInline
        onEnded={onSkip}
      />
      {blocked && (
        <button
          type="button"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 text-white px-6 py-3 rounded-full font-bold"
          onClick={() => {
            void videoRef.current?.play().then(() => setBlocked(false)).catch(() => {});
          }}
        >
          Reproducir video
        </button>
      )}
      <div className="flex-shrink-0 flex justify-center gap-2 p-3 bg-black/40">
        <button type="button" className="text-white bg-white/15 px-4 py-2 rounded-full text-sm" onClick={onSkip}>
          Saltar video
        </button>
        <button type="button" className="text-white bg-white/15 px-4 py-2 rounded-full text-sm" onClick={onReset}>
          Reiniciar juego
        </button>
        <button type="button" className="text-white bg-white/15 px-4 py-2 rounded-full text-sm" onClick={onMap}>
          Volver al mapa
        </button>
      </div>
    </div>
  );
}

export function ConfigScene({
  onClose,
  onLogo,
}: {
  onClose: () => void;
  onLogo: () => void;
}) {
  const [config, setConfig] = useState<Config>(() => loadConfig());
  const [openOrder, setOpenOrder] = useState<number | null>(null);

  function updateActivity(order: number, field: keyof Config["activities"][number], value: string) {
    setConfig((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [order]: { ...prev.activities[order], [field]: value },
      },
    }));
  }

  function save() {
    try {
      localStorage.setItem("mirarim-tripulacion-config", JSON.stringify(config));
    } catch {}
    onClose();
  }

  function restore(order: number) {
    const original = missions.find((m) => m.order === order)?.activity;
    if (!original) return;
    setConfig((prev) => ({
      ...prev,
      activities: { ...prev.activities, [order]: { ...original } },
    }));
  }

  return (
    <div className="fixed inset-0 z-[100] bg-cream text-ink flex flex-col p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-extrabold">Configuración</h2>
        <button type="button" className="btn btn-quiet" onClick={onClose}>
          Cerrar
        </button>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-bold mb-2">Logotipo</h3>
        <p className="text-sm mb-2">Personaliza el logotipo que aparece en la portada y el mapa.</p>
        <button type="button" className="btn btn-primary" onClick={onLogo}>
          Personalizar logotipo
        </button>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold mb-2">Actividades presenciales</h3>
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={config.includeActivities}
            onChange={(e) => setConfig({ ...config, includeActivities: e.target.checked })}
          />
          Incluir actividades presenciales
        </label>

        {missions.map((m) => {
          const act = config.activities[m.order];
          const open = openOrder === m.order;
          return (
            <div key={m.order} className="mb-3 border border-ink/15 rounded-2xl overflow-hidden">
              <button
                type="button"
                className="w-full text-left px-4 py-3 font-semibold bg-white/50"
                onClick={() => setOpenOrder(open ? null : m.order)}
              >
                Misión {m.order}: {act.name}
              </button>
              {open && (
                <div className="p-4 space-y-3 bg-white">
                  <label className="block text-sm font-medium">
                    Instrucción breve que verá el grupo
                    <textarea
                      className="mt-1 w-full border rounded-lg p-2 text-sm"
                      rows={2}
                      value={act.briefInstruction}
                      onChange={(e) => updateActivity(m.order, "briefInstruction", e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Nombre
                    <input
                      className="mt-1 w-full border rounded-lg p-2 text-sm"
                      value={act.name}
                      onChange={(e) => updateActivity(m.order, "name", e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Materiales
                    <textarea
                      className="mt-1 w-full border rounded-lg p-2 text-sm"
                      rows={2}
                      value={act.materials}
                      onChange={(e) => updateActivity(m.order, "materials", e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Preparación
                    <textarea
                      className="mt-1 w-full border rounded-lg p-2 text-sm"
                      rows={2}
                      value={act.preparation}
                      onChange={(e) => updateActivity(m.order, "preparation", e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Consigna completa
                    <textarea
                      className="mt-1 w-full border rounded-lg p-2 text-sm"
                      rows={3}
                      value={act.instruction}
                      onChange={(e) => updateActivity(m.order, "instruction", e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Orientación
                    <textarea
                      className="mt-1 w-full border rounded-lg p-2 text-sm"
                      rows={2}
                      value={act.guidance}
                      onChange={(e) => updateActivity(m.order, "guidance", e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Pregunta de cierre
                    <textarea
                      className="mt-1 w-full border rounded-lg p-2 text-sm"
                      rows={2}
                      value={act.closingQuestion}
                      onChange={(e) => updateActivity(m.order, "closingQuestion", e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Criterio de finalización
                    <textarea
                      className="mt-1 w-full border rounded-lg p-2 text-sm"
                      rows={2}
                      value={act.completionCriteria}
                      onChange={(e) => updateActivity(m.order, "completionCriteria", e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="text-sm text-coral-deep underline"
                    onClick={() => restore(m.order)}
                  >
                    Restaurar valores originales
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <div className="mt-4 flex gap-2">
        <button type="button" className="btn btn-primary" onClick={save}>
          Guardar
        </button>
        <button type="button" className="btn btn-quiet" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
