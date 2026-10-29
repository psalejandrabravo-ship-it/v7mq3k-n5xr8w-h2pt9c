import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export type SceneRect = { x: number; y: number; w: number; h: number };

type SceneProps = {
  src: string;
  aspect: number;
  letterbox: string;
  alt: string;
  children?: (rect: SceneRect) => ReactNode;
};

export function Scene({ src, aspect, letterbox, alt, children }: SceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<SceneRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [failed, setFailed] = useState(false);

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      if (width <= 0 || height <= 0) return;
      const containerAspect = width / height;
      let w: number;
      let h: number;
      if (containerAspect > aspect) {
        h = height;
        w = height * aspect;
      } else {
        w = width;
        h = width / aspect;
      }
      setRect({ x: (width - w) / 2, y: (height - h) / 2, w, h });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [aspect]);

  return (
    <div ref={host} className="relative h-full min-h-0 w-full overflow-hidden" style={{ background: letterbox }}>
      {failed ? (
        <p className="absolute inset-x-4 top-4 z-30 rounded-2xl bg-foam px-4 py-3 text-center text-lg font-bold text-ink" role="status">
          No se pudo mostrar la imagen. Puedes seguir con los botones de abajo.
        </p>
      ) : null}
      {!failed && rect.w > 0 ? (
        <img
          src={src}
          alt={alt}
          className="absolute max-w-none"
          style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
          onError={() => setFailed(true)}
        />
      ) : null}
      {rect.w > 0 && children?.(rect)}
    </div>
  );
}
