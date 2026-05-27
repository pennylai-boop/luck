"use client";

import { useMemo } from "react";
import type { ListEntry } from "@/lib/types";
import { segmentAngle } from "@/lib/wheelMath";

type LotteryWheelProps = {
  candidates: ListEntry[];
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
};

function buildWheelGradient(count: number): string {
  if (count === 0) return "conic-gradient(#e5e5e5 0deg 360deg)";
  const slice = segmentAngle(count);
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const start = i * slice;
    const end = (i + 1) * slice;
    const color = i % 2 === 0 ? "var(--bni-cream)" : "#ffffff";
    parts.push(`${color} ${start}deg ${end}deg`);
  }
  return `conic-gradient(from -90deg, ${parts.join(", ")})`;
}

export function LotteryWheel({
  candidates,
  rotation,
  isSpinning,
  onSpin,
}: LotteryWheelProps) {
  const count = candidates.length;
  const canSpin = count > 0 && !isSpinning;
  const gradient = useMemo(() => buildWheelGradient(count), [count]);
  const slice = segmentAngle(count);

  return (
    <section
      className="flex flex-col items-center"
      aria-label="幸運轉盤"
    >
      <div className="relative w-full max-w-[min(90vw,420px)]">
        {/* Pointer */}
        <div
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
          aria-hidden
        >
          <div
            className="h-0 w-0 border-x-[14px] border-b-[22px] border-x-transparent border-b-[var(--bni-gold)] drop-shadow-md"
            style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))" }}
          />
        </div>

        <div className="relative mx-auto aspect-square w-full rounded-full border-[6px] border-[var(--bni-red)] bg-white p-1 shadow-lg">
          <div
            className="relative h-full w-full rounded-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 5s cubic-bezier(0.15, 0.85, 0.2, 1)"
                : "none",
              background: gradient,
            }}
          >
            {count === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-100">
                <p className="px-6 text-center text-sm text-gray-500">
                  請在下方輸入抽獎名單
                </p>
              </div>
            ) : (
              candidates.map((entry, index) => {
                const angle = -90 + index * slice + slice / 2;
                return (
                  <div
                    key={entry.id}
                    className="pointer-events-none absolute left-1/2 top-1/2 w-[42%] origin-left -translate-y-1/2"
                    style={{
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    <span
                      className="block truncate text-center font-semibold leading-tight text-[var(--text)]"
                      style={{
                        fontSize: "clamp(0.6rem, 1.8vmin, 0.85rem)",
                        transform: "rotate(90deg)",
                        transformOrigin: "center left",
                      }}
                    >
                      {entry.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={onSpin}
            disabled={!canSpin}
            aria-label="開始抽獎"
            className="absolute left-1/2 top-1/2 z-10 flex h-[28%] w-[28%] min-h-[72px] min-w-[72px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white bg-[var(--bni-red)] text-center text-sm font-bold text-white shadow-lg transition hover:bg-[var(--bni-red-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSpinning ? "抽獎中…" : "開始抽獎"}
          </button>
        </div>
      </div>

      {count > 0 && (
        <p className="mt-4 text-sm text-gray-600">
          尚可抽選：<span className="font-semibold text-[var(--bni-red)]">{count}</span> 人
        </p>
      )}
    </section>
  );
}
