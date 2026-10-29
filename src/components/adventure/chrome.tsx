import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { derived } from "@/game/assets";

export function Logo({
  src,
  variant,
  className,
}: {
  src: string | null;
  variant: "color" | "white";
  className: string;
}) {
  const official = variant === "white" ? derived.logoWhite : derived.logoColor;
  return (
    <img
      src={src ?? official}
      alt={src ? "Logotipo personalizado" : "MIRARIM"}
      className={`object-contain object-left ${className}`}
    />
  );
}

export function ShellHeader({
  logoSrc,
  title,
  subtitle,
  headingRef,
  fullscreen,
}: {
  logoSrc: string | null;
  title: string;
  subtitle?: string;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  fullscreen: ReactNode;
}) {
  return (
    <header className="grid h-16 shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-indigo px-4 text-foam">
      <Logo src={logoSrc} variant="white" className="h-12 w-40" />
      <div className="min-w-0 text-center">
        {title ? (
          <h1 ref={headingRef} tabIndex={-1} className="truncate text-xl font-extrabold outline-none md:text-3xl">
            {title}
          </h1>
        ) : null}
        {subtitle ? <p className="truncate text-base font-bold text-sand">{subtitle}</p> : null}
      </div>
      {fullscreen}
    </header>
  );
}

export function Footer({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line bg-cream px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">{left}</div>
      <div className="flex flex-wrap items-center justify-end gap-2">{right}</div>
    </footer>
  );
}

export function useFullscreen(target: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setActive(document.fullscreenElement === target.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, [target]);

  async function toggle() {
    setMessage(null);
    const el = target.current;
    if (!el || typeof el.requestFullscreen !== "function") {
      setMessage("Puedes ampliar la ventana o utilizar el modo de pantalla completa de tu navegador.");
      return;
    }
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      setMessage("Puedes ampliar la ventana o utilizar el modo de pantalla completa de tu navegador.");
    }
  }

  return { active, message, toggle, dismiss: () => setMessage(null) };
}

export function FullscreenButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  const label = active ? "Salir de pantalla completa" : "Ampliar pantalla";
  return (
    <button type="button" className="btn btn-header" onClick={onClick} aria-pressed={active}>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{active ? "Salir" : "Ampliar"}</span>
    </button>
  );
}

export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const id = window.setTimeout(() => panel.current?.focus(), 0);
    return () => {
      window.clearTimeout(id);
      const back = opener.current;
      if (back?.isConnected) back.focus();
    };
  }, [open]);

  if (!open) return null;

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panel.current) return;
    const items = [...panel.current.querySelectorAll<HTMLElement>("button, [href], input, select, textarea")].filter(
      (el) => !el.hasAttribute("disabled"),
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-indigo/55 p-4">
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="max-h-full w-full max-w-lg overflow-auto rounded-3xl bg-foam p-6 text-ink shadow-2xl outline-none"
        onKeyDown={onKeyDown}
      >
        <h2 id={titleId} className="text-2xl font-extrabold text-indigo">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
