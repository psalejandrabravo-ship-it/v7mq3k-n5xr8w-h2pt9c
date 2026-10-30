import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { storyParagraphs } from "@/content/story";
import { originals } from "@/game/assets";
import { deleteLogo, readLogo, validateLogoFile, writeLogo } from "@/game/logo-store";
import {
  clearProgress,
  emptySave,
  hasProgress,
  loadProgress,
  saveProgress,
  type Save,
  type ScreenName,
  TOTAL_MISSIONS,
} from "@/game/progress";
import { Dialog, Footer, FullscreenButton, ShellHeader, useFullscreen } from "./chrome";
import { MapScene } from "./map-scene";
import { ChestScene, CoverScene, MissionScene, StoryScene, VideoScene } from "./screens";

const FAIL_FS = "Puedes ampliar la ventana o utilizar el modo de pantalla completa de tu navegador.";

export function AdventureApp() {
  const shell = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const fs = useFullscreen(shell);
  const lock = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [save, setSave] = useState<Save>(emptySave);
  const [notice, setNotice] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [pending, setPending] = useState<{ from: number; to: number } | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoNote, setLogoNote] = useState<string | null>(null);
  const [logoOpen, setLogoOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [layers, setLayers] = useState(false);
  const [chestFx, setChestFx] = useState(false);
  const [busy, setBusy] = useState(false);
  const logoUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const loaded = loadProgress();
    setSave(loaded.save);
    setNotice(loaded.notice);
    setWarning(loaded.warning);
    setReady(true);
    readLogo()
      .then((record) => {
        if (!record) return;
        const url = URL.createObjectURL(record.blob);
        logoUrlRef.current = url;
        setLogoUrl(url);
      })
      .catch(() => {
        setLogoNote("No se pudo leer el logotipo guardado. Se muestra MIRARIM.");
      });
    return () => {
      if (logoUrlRef.current) URL.revokeObjectURL(logoUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    heading.current?.focus();
  }, [ready, save.screen, save.missionOrder]);

  useEffect(() => {
    if (!ready) return;
    const next = nextSources(save);
    for (const src of next) {
      const img = new Image();
      img.src = src;
    }
  }, [ready, save.screen, save.completed]);

  function persist(next: Save) {
    setSave(next);
    const warn = saveProgress(next);
    if (warn) setWarning(warn);
  }

  function go(screen: ScreenName) {
    if (screen === "chest" && save.completed < TOTAL_MISSIONS) return;
    if (screen === "video" && !(save.completed === TOTAL_MISSIONS && save.chestOpen)) return;
    if (screen === "mission") return;
    persist({ ...save, screen });
  }

  function openMission(order: number) {
    if (pending || lock.current) return;
    if (order !== save.completed + 1 || order < 1 || order > TOTAL_MISSIONS) return;
    persist({ ...save, screen: "mission", missionOrder: order });
  }

  function completeMission() {
    if (lock.current || busy) return;
    if (save.screen !== "mission") return;
    if (save.missionOrder !== save.completed + 1) return;
    lock.current = true;
    setBusy(true);
    const nextCount = save.completed + 1;
    persist({
      ...save,
      completed: nextCount,
      chestOpen: false,
      screen: "map",
      missionOrder: 1,
    });
    setPending({ from: save.completed, to: nextCount });
  }

  function finishMove() {
    setPending(null);
    lock.current = false;
    setBusy(false);
  }

  function openChest() {
    if (save.completed !== TOTAL_MISSIONS) return;
    persist({ ...save, screen: "chest" });
  }

  function revealChest() {
    if (save.completed !== TOTAL_MISSIONS || save.chestOpen || lock.current) return;
    lock.current = true;
    persist({ ...save, chestOpen: true, screen: "chest" });
    setChestFx(true);
    window.setTimeout(() => {
      lock.current = false;
      setChestFx(false);
    }, 1200);
  }

  function resetAdventure() {
    const warn = clearProgress();
    setSave(emptySave());
    setPending(null);
    setChestFx(false);
    lock.current = false;
    setBusy(false);
    setResetOpen(false);
    if (warn) setWarning(warn);
    setNotice(null);
  }

  async function onLogoFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const check = await validateLogoFile(file);
    if (!check.ok) {
      setLogoNote(check.message);
      return;
    }
    try {
      await writeLogo({ blob: file, type: file.type || "image/png" });
      if (logoUrlRef.current) URL.revokeObjectURL(logoUrlRef.current);
      const url = URL.createObjectURL(file);
      logoUrlRef.current = url;
      setLogoUrl(url);
      setLogoNote(null);
    } catch {
      setLogoNote("No se pudo guardar el logotipo en este navegador. Se mantiene un logotipo válido.");
    }
  }

  async function restoreLogo() {
    try {
      await deleteLogo();
      if (logoUrlRef.current) URL.revokeObjectURL(logoUrlRef.current);
      logoUrlRef.current = null;
      setLogoUrl(null);
      setLogoNote(null);
    } catch {
      setLogoNote("No se pudo restablecer el logotipo. El avance de la aventura sigue igual.");
    }
  }

  const countLabel = `Misiones completadas: ${save.completed} de ${TOTAL_MISSIONS}`;
  const progress = hasProgress(save);
  const title = headerTitle(save);
  const currentMission = save.completed + 1;
  const isImmersive = save.screen === "story" || save.screen === "cover" || save.screen === "map" || save.screen === "mission";

  return (
    <div ref={shell} className="relative flex h-dvh flex-col overflow-hidden bg-indigo text-ink">
      <p className="sr-only" aria-live="polite">
        {ready ? countLabel : "Preparando la aventura"}
        {save.chestOpen ? ". El cofre está abierto." : ""}
      </p>
      {!ready ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center text-foam">
          <img src="/recursos/derivados/logo-blanco.png" alt="MIRARIM" className="h-12 w-40 object-contain" />
          <p className="text-xl font-extrabold">Preparando la aventura…</p>
        </div>
      ) : (
        <>
          {!isImmersive && (
            <ShellHeader
              logoSrc={logoUrl}
              title={title}
              subtitle={save.screen === "map" ? countLabel : undefined}
              headingRef={heading}
              fullscreen={<FullscreenButton active={fs.active} onClick={() => void fs.toggle()} />}
            />
          )}
          {notice && !isImmersive ? (
            <p className="shrink-0 bg-sand px-4 py-2 text-center text-base font-bold text-ink" role="status">
              {notice}
              <button type="button" className="btn btn-text ml-2" onClick={() => setNotice(null)}>
                Entendido
              </button>
            </p>
          ) : null}
          {warning && !isImmersive ? (
            <p className="shrink-0 bg-gold/30 px-4 py-2 text-center text-base font-bold text-ink" role="status">
              {warning}
            </p>
          ) : null}
          {fs.message && !isImmersive ? (
            <p className="shrink-0 bg-foam px-4 py-2 text-center text-base font-bold text-sea" role="status">
              {fs.message === FAIL_FS ? fs.message : fs.message}
              <button type="button" className="btn btn-text ml-2" onClick={fs.dismiss}>
                Entendido
              </button>
            </p>
          ) : null}
          {save.screen === "story" && !(storyParagraphs && storyParagraphs.length > 0) ? (
            <p className="shrink-0 bg-sand px-4 py-2 text-center text-base font-bold text-sea">
              Espacio del cuento preparado. Contenido pendiente.
            </p>
          ) : null}
          <main className="min-h-0 flex-1">
            {save.screen === "cover" ? (
              <CoverScene
                logoSrc={logoUrl}
                headingRef={heading}
                onStart={() => go("story")}
                onContinue={() => go("map")}
                onStory={() => go("story")}
                onReset={() => setResetOpen(true)}
                onLogo={() => setLogoOpen(true)}
                onToggleFullscreen={() => void fs.toggle()}
                fullscreenActive={fs.active}
                hasProgress={progress}
              />
            ) : null}
            {save.screen === "story" ? (
              <StoryScene
                showLayers={layers}
                onGoCover={() => go("cover")}
                onGoMap={() => go("map")}
                onToggleFullscreen={() => void fs.toggle()}
                fullscreenActive={fs.active}
              />
            ) : null}
            {save.screen === "map" ? (
              <MapScene
                completed={save.completed}
                pending={pending}
                onFinishMove={finishMove}
                onOpenMission={openMission}
                onOpenChest={openChest}
                onStory={() => go("story")}
                onReset={() => setResetOpen(true)}
                onToggleFullscreen={() => void fs.toggle()}
                fullscreenActive={fs.active}
                currentMission={currentMission}
              />
            ) : null}
            {save.screen === "mission" ? (
              <MissionScene
                order={save.missionOrder}
                onComplete={completeMission}
                onMap={() => go("map")}
                onToggleFullscreen={() => void fs.toggle()}
                fullscreenActive={fs.active}
                busy={busy}
              />
            ) : null}
            {save.screen === "chest" ? <ChestScene open={save.chestOpen} justOpened={chestFx} /> : null}
            {save.screen === "video" ? <VideoScene /> : null}
          </main>
          {!isImmersive && (
            <Footer
              left={
                <LeftActions
                  save={save}
                  layers={layers}
                  onLayers={() => setLayers((value) => !value)}
                  onCover={() => go("cover")}
                  onStory={() => go("story")}
                  onMap={() => go("map")}
                  onReset={() => setResetOpen(true)}
                  onLogo={() => setLogoOpen(true)}
                />
              }
              right={
                <RightActions
                  save={save}
                  progress={progress}
                  pending={pending !== null}
                  busy={busy}
                  currentMission={currentMission}
                  onStart={() => go("story")}
                  onContinue={() => go("map")}
                  onStory={() => go("story")}
                  onReset={() => setResetOpen(true)}
                  onMission={() => openMission(currentMission)}
                  onComplete={completeMission}
                  onChest={openChest}
                  onOpenChest={revealChest}
                  onVideo={() => go("video")}
                  onCover={() => go("cover")}
                />
              }
            />
          )}
        </>
      )}
      <Dialog open={logoOpen} title="Personalizar logotipo" onClose={() => setLogoOpen(false)}>
        <div className="flex h-24 items-center justify-center rounded-2xl bg-cream">
          <img
            src={logoUrl ?? "/recursos/derivados/logo-color.png"}
            alt={logoUrl ? "Vista previa del logotipo personalizado" : "Vista previa de MIRARIM"}
            className="max-h-16 max-w-full object-contain"
          />
        </div>
        <p className="mt-3 text-base text-sea">El logotipo se guarda solo en este navegador.</p>
        {logoNote ? (
          <p className="mt-2 text-base font-bold text-coral-deep" role="status">
            {logoNote}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-primary" onClick={() => fileRef.current?.click()}>
            Adjuntar logotipo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => void onLogoFile(event)}
          />
          <button type="button" className="btn btn-quiet" onClick={() => void restoreLogo()} disabled={!logoUrl}>
            Restablecer MIRARIM
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => setLogoOpen(false)}>
            Cerrar
          </button>
        </div>
      </Dialog>
      <Dialog open={resetOpen} title="¿Reiniciar la aventura?" onClose={() => setResetOpen(false)}>
        <p className="text-lg">Se borrará el avance de las {TOTAL_MISSIONS} misiones y el cofre volverá a estar cerrado.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn btn-quiet" onClick={() => setResetOpen(false)}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={resetAdventure}>
            Reiniciar
          </button>
        </div>
      </Dialog>
    </div>
  );
}

function headerTitle(save: Save): string {
  if (save.screen === "story") return "El cuento";
  if (save.screen === "map") return "Mapa de la aventura";
  if (save.screen === "mission") return `Misión ${save.missionOrder}`;
  if (save.screen === "chest") return "El cofre del tesoro";
  if (save.screen === "video") return "Lo que aprendimos juntos";
  return "";
}

function nextSources(save: Save): string[] {
  if (save.screen === "cover") return [originals.story, originals.map];
  if (save.screen === "story") return [originals.map];
  if (save.screen === "map") return [originals.beach];
  if (save.screen === "mission") return [originals.map];
  if (save.screen === "chest") return [originals.beach];
  return [];
}

function LeftActions({
  save,
  layers,
  onLayers,
  onCover,
  onStory,
  onMap,
  onReset,
  onLogo,
}: {
  save: Save;
  layers: boolean;
  onLayers: () => void;
  onCover: () => void;
  onStory: () => void;
  onMap: () => void;
  onReset: () => void;
  onLogo: () => void;
}) {
  if (save.screen === "cover" || save.screen === "story" || save.screen === "map" || save.screen === "mission") {
    return null;
  }
  return (
    <button type="button" className="btn btn-quiet" onClick={onMap}>
      Volver al mapa
    </button>
  );
}

function RightActions({
  save,
  progress,
  pending,
  busy,
  currentMission,
  onStart,
  onContinue,
  onStory,
  onReset,
  onMission,
  onComplete,
  onChest,
  onOpenChest,
  onVideo,
  onCover,
}: {
  save: Save;
  progress: boolean;
  pending: boolean;
  busy: boolean;
  currentMission: number;
  onStart: () => void;
  onContinue: () => void;
  onStory: () => void;
  onReset: () => void;
  onMission: () => void;
  onComplete: () => void;
  onChest: () => void;
  onOpenChest: () => void;
  onVideo: () => void;
  onCover: () => void;
}) {
  if (save.screen === "cover" || save.screen === "story" || save.screen === "map" || save.screen === "mission") {
    return null;
  }
  if (save.screen === "chest") {
    return save.chestOpen ? (
      <button type="button" className="btn btn-primary" onClick={onVideo}>
        Ver lo que aprendimos
      </button>
    ) : (
      <button type="button" className="btn btn-primary" onClick={onOpenChest}>
        Abrir el cofre
      </button>
    );
  }
  return (
    <button type="button" className="btn btn-quiet" onClick={onCover}>
      Volver al inicio
    </button>
  );
}
