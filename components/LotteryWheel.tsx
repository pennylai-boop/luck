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

const WHEEL_A = "#f5f0e6";
const WHEEL_B = "#ffffff";
const WHEEL_EMPTY = "#e8e8e8";

function buildWheelGradient(count: number): string {
  if (count === 0) return `conic-gradient(${WHEEL_EMPTY} 0deg 360deg)`;
  const slice = segmentAngle(count);
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const start = i * slice;
    const end = (i + 1) * slice;
    const color = i % 2 === 0 ? WHEEL_A : WHEEL_B;
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
      className="flex h-full w-full min-h-0 flex-col items-center justify-center"
      aria-label="幸運轉盤"
    >
      <div className="@container flex min-h-0 w-full flex-1 items-center justify-center">
        <div
          className="relative aspect-square w-[min(100cqw,100cqh)] shrink-0"
        >
        {/* Pointer */}
        <div
          className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
          aria-hidden
        >
          <div className="h-0 w-0 border-x-[14px] border-b-[22px] border-x-transparent border-b-[#c9a227] drop-shadow-md" />
        </div>

        <div className="absolute inset-0 rounded-full border-[6px] border-[#c00000] bg-white p-1 shadow-lg">
          <div
            className="absolute inset-1 overflow-hidden rounded-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 5s cubic-bezier(0.15, 0.85, 0.2, 1)"
                : "none",
              background: gradient,
            }}
          >
            {count > 0 &&
              candidates.map((entry, index) => {
                const angle = -90 + index * slice + slice / 2;
                return (
                  <div
                    key={entry.id}
                    className="pointer-events-none absolute inset-0"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <span
                      className="absolute left-1/2 top-[2%] max-h-[44%] -translate-x-1/2 overflow-hidden font-semibold leading-tight text-[#1a1a1a]"
                      style={{
                        writingMode: "vertical-rl",
                        textOrientation: "upright",
                        fontSize: "clamp(0.55rem, 2.8cqw, 1rem)",
                      }}
                    >
                      {entry.label}
                    </span>
                  </div>
                );
              })
            }
          </div>

          <button
            type="button"
            onClick={onSpin}
            disabled={!canSpin}
            aria-label="開始抽獎"
            className="absolute left-1/2 top-1/2 z-10 flex h-[28%] w-[28%] min-h-[72px] min-w-[72px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white bg-[#c00000] text-center text-sm font-bold text-white shadow-lg transition hover:bg-[#900000] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSpinning ? "抽獎中…" : "開始抽獎"}
          </button>
        </div>
        </div>
      </div>

      {count > 0 && (
        <p className="mt-2 shrink-0 text-sm text-gray-600">
          尚可抽選：
          <span className="font-semibold text-[#c00000]">{count}</span> 項
        </p>
      )}
    </section>
  );
}
