"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type GenieFrom = "bottom" | "top" | "left" | "right";

type GenieOrigin = {
  x: number;
  y: number;
  sx: number;
  sy: number;
  from: GenieFrom;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function viewSize() {
  const viewport = window.visualViewport;
  return {
    width: viewport?.width ?? window.innerWidth,
    height: viewport?.height ?? window.innerHeight,
  };
}

function destRect(naturalW: number, naturalH: number, hasCaption: boolean) {
  const { width: vw, height: vh } = viewSize();
  const maxW = Math.min(vw * 0.96, vw - 32);
  const maxH = vh - 48 - 20 - (hasCaption ? 40 : 0);
  const ratio = naturalW / Math.max(naturalH, 1);
  let width = maxW;
  let height = width / ratio;
  if (height > maxH) {
    height = maxH;
    width = height * ratio;
  }
  return {
    left: (vw - width) / 2,
    top: 48 + (maxH - height) / 2,
    width,
    height,
  };
}

function flipOrigin(first: DOMRect, last: { left: number; top: number; width: number; height: number }): GenieOrigin {
  const firstCx = first.left + first.width / 2;
  const firstCy = first.top + first.height / 2;
  const lastCx = last.left + last.width / 2;
  const lastCy = last.top + last.height / 2;
  const x = firstCx - lastCx;
  const y = firstCy - lastCy;
  const sx = Math.min(1.2, Math.max(0.04, first.width / Math.max(last.width, 1)));
  const sy = Math.min(1.2, Math.max(0.04, first.height / Math.max(last.height, 1)));
  const from: GenieFrom =
    Math.abs(x) > Math.abs(y) * 1.25 ? (x < 0 ? "left" : "right") : y < 0 ? "top" : "bottom";
  return { x, y, sx, sy, from };
}

function sourceSize(trigger: HTMLButtonElement, fallback: DOMRect) {
  const probe = trigger.querySelector("img");
  if (probe && probe.naturalWidth > 0 && probe.naturalHeight > 0) {
    return { width: probe.naturalWidth, height: probe.naturalHeight };
  }
  return { width: fallback.width || 800, height: fallback.height || 500 };
}

export function ImageLightbox({
  src,
  alt,
  caption,
  children,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  children: ReactNode;
  className?: string;
}) {
  const labelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"in" | "open" | "out">("open");
  const [origin, setOrigin] = useState<GenieOrigin | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const finishClose = useCallback(() => {
    setOpen(false);
    setPhase("open");
    setOrigin(null);
    triggerRef.current?.focus();
  }, []);

  const close = useCallback(() => {
    if (!open) return;
    if (prefersReducedMotion()) {
      finishClose();
      return;
    }
    const trigger = triggerRef.current?.getBoundingClientRect();
    const stage = stageRef.current?.getBoundingClientRect();
    if (trigger && stage) {
      setOrigin(flipOrigin(trigger, stage));
    }
    setPhase("out");
  }, [finishClose, open]);

  const openLightbox = useCallback(() => {
    const node = triggerRef.current;
    const trigger = node?.getBoundingClientRect();
    if (!node || !trigger) return;
    if (prefersReducedMotion()) {
      setOrigin(null);
      setPhase("open");
      setOpen(true);
      return;
    }
    const size = sourceSize(node, trigger);
    setOrigin(flipOrigin(trigger, destRect(size.width, size.height, Boolean(caption))));
    setPhase("in");
    setOpen(true);
  }, [caption]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open || phase === "out") return;
    closeRef.current?.focus();
  }, [open, phase]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, open]);

  useEffect(() => {
    if (phase !== "out") return;
    const timeout = window.setTimeout(finishClose, 520);
    return () => window.clearTimeout(timeout);
  }, [finishClose, phase]);

  function onBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) close();
  }

  function onDialogKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    event.preventDefault();
    closeRef.current?.focus();
  }

  function onGenieEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (phase === "in") setPhase("open");
    if (phase === "out") finishClose();
  }

  const veilOpen = open && phase !== "out";
  const genieStyle = origin
    ? ({
        "--genie-x": `${origin.x}px`,
        "--genie-y": `${origin.y}px`,
        "--genie-sx": origin.sx,
        "--genie-sy": origin.sy,
      } as CSSProperties)
    : undefined;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`cursor-zoom-in border-0 bg-transparent p-0 ${className}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={caption ? `View ${caption}` : `View ${alt}`}
        onClick={openLightbox}
      >
        {children}
      </button>
      {mounted && open
        ? createPortal(
            <div
              className={`lightbox-shell${caption ? " has-caption" : ""}`}
              onClick={onBackdrop}
            >
              <div className={`lightbox-veil ${veilOpen ? "is-open" : ""}`} />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={caption ? labelId : undefined}
                aria-label={caption ? undefined : alt}
                className="lightbox-stage"
                onKeyDown={onDialogKey}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  ref={closeRef}
                  type="button"
                  className={`lightbox-close ${veilOpen ? "is-open" : ""}`}
                  aria-label="Close image"
                  onClick={(event) => {
                    event.stopPropagation();
                    close();
                  }}
                >
                  ×
                </button>
                <div
                  ref={stageRef}
                  className={[
                    "lightbox-genie",
                    origin ? `genie-from-${origin.from}` : "",
                    phase === "in" ? "is-genie-in" : "",
                    phase === "open" ? "is-open" : "",
                    phase === "out" ? "is-genie-out" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={genieStyle}
                  onAnimationEnd={onGenieEnd}
                >
                  <div className="lightbox-frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className="lightbox-image" />
                  </div>
                </div>
                {caption ? (
                  <p id={labelId} className={`lightbox-caption ${phase === "open" || phase === "in" ? "is-open" : ""}`}>
                    {caption}
                  </p>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
