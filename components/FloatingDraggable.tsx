"use client";

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

type FloatingDraggableProps = {
  children: ReactNode;
  className?: string;
  defaultLeft?: number;
  defaultBottom?: string;
  width?: number;
};

function isDragBlocked(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      "input, textarea, button, a, label, [role='button'], [contenteditable='true']"
    )
  );
}

export function FloatingDraggable({
  children,
  className = "",
  defaultLeft = 16,
  defaultBottom = "var(--float-prize-bottom)",
  width = 380,
}: FloatingDraggableProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const clampPosition = useCallback((x: number, y: number) => {
    const el = elRef.current;
    const w = el?.offsetWidth ?? width;
    const h = el?.offsetHeight ?? 400;
    const maxX = Math.max(0, window.innerWidth - w);
    const maxY = Math.max(0, window.innerHeight - h);
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY),
    };
  }, [width]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (isDragBlocked(e.target)) return;

    const el = elRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.left,
      origY: rect.top,
    };
    setPos({ x: rect.left, y: rect.top });
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos(
      clampPosition(
        dragRef.current.origX + dx,
        dragRef.current.origY + dy
      )
    );
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const positioned = pos !== null;

  return (
    <div
      ref={elRef}
      className={`fixed z-40 touch-none select-none ${className}`}
      style={
        positioned
          ? {
              left: pos.x,
              top: pos.y,
              width,
              maxWidth: "calc(100vw - 2rem)",
              maxHeight: "calc(100vh - 1rem)",
            }
          : {
              left: defaultLeft,
              bottom: defaultBottom,
              width,
              maxWidth: "calc(100vw - 2rem)",
              maxHeight: "calc(100vh - var(--float-prize-bottom) - 1rem)",
            }
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="max-h-[inherit] cursor-grab overflow-y-auto rounded-2xl shadow-xl active:cursor-grabbing [&_button]:cursor-pointer [&_input]:cursor-text [&_textarea]:cursor-text">
        {children}
      </div>
    </div>
  );
}
