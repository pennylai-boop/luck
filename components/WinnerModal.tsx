"use client";

import { useEffect, useRef } from "react";
import { fireCelebration } from "@/lib/confetti";

type WinnerModalProps = {
  open: boolean;
  winnerName: string;
  prizeTitle: string;
  soundEnabled: boolean;
  onClose: () => void;
};

export function WinnerModal({
  open,
  winnerName,
  prizeTitle,
  soundEnabled,
  onClose,
}: WinnerModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const celebratedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      celebratedRef.current = false;
      return;
    }
    if (celebratedRef.current) return;
    celebratedRef.current = true;

    fireCelebration();

    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        playFallbackChime();
      });
    }

    closeRef.current?.focus();
  }, [open, soundEnabled]);

  function playFallbackChime() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-title"
    >
      <div className="animate-[modalIn_0.35s_ease-out] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="h-1.5 bg-[var(--bni-red)]" />
        <div className="p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--bni-red)]">
            恭喜得獎
          </p>
          <h2 id="winner-title" className="mt-2 text-3xl font-bold text-[var(--text)]">
            {winnerName}
          </h2>
          {prizeTitle ? (
            <p className="mt-3 text-gray-600">
              項目：<span className="font-semibold text-[var(--text)]">{prizeTitle}</span>
            </p>
          ) : null}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="mt-8 w-full rounded-xl bg-[var(--bni-red)] py-3 text-lg font-semibold text-white transition hover:bg-[var(--bni-red-dark)]"
          >
            繼續抽獎
          </button>
        </div>
      </div>
      {/* Optional: add public/sounds/win.mp3 for celebration audio */}
      <audio ref={audioRef} src="/sounds/win.mp3" preload="auto" />
    </div>
  );
}
