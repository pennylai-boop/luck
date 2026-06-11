"use client";

import { useMemo } from "react";
import { MascotLeft, MascotRight } from "@/components/Mascot";
import type { ListEntry } from "@/lib/types";
import { segmentAngle } from "@/lib/wheelMath";

type LotteryWheelProps = {
  candidates: ListEntry[];
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
  prizeTitle?: string;
};

const WHEEL_RED   = "#c00000";
const WHEEL_PINK  = "#f5b8b8";
const WHEEL_WHITE = "#ffffff";
const WHEEL_EMPTY = "#e0e0e0";
const WHEEL_COLORS = [WHEEL_RED, WHEEL_PINK, WHEEL_WHITE];

function buildWheelGradient(count: number): string {
  if (count === 0) return `conic-gradient(${WHEEL_EMPTY} 0deg 360deg)`;
  const slice = segmentAngle(count);
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const start = i * slice;
    const end = (i + 1) * slice;
    const color = WHEEL_COLORS[i % 3];
    parts.push(`${color} ${start}deg ${end}deg`);
  }
  return `conic-gradient(from -90deg, ${parts.join(", ")})`;
}

export function LotteryWheel({
  candidates,
  rotation,
  isSpinning,
  onSpin,
  prizeTitle = "",
}: LotteryWheelProps) {
  const count = candidates.length;
  const canSpin = count > 0 && !isSpinning;
  const gradient = useMemo(() => buildWheelGradient(count), [count]);
  const slice = segmentAngle(count);
  const centerLabel = prizeTitle.trim() || "STAR";

  return (
    <section
      className="relative flex h-full w-full min-h-0 items-start justify-center lg:items-center"
      aria-label="幸運轉盤"
    >
      <div className="@container flex h-full w-full [container-type:size] items-start justify-center lg:items-center">
        <div className="relative aspect-square size-[min(82vw,calc(60dvh-8rem))] max-h-full max-w-full shrink-0 lg:size-[min(90cqw,90cqh)]">
          {/* Pointer — top center, same position on mobile and desktop */}
          <div
            className="absolute left-1/2 top-[11px] z-20 -translate-x-1/2"
            aria-hidden
          >
            <div className="h-0 w-0 rotate-180 border-x-[14px] border-b-[22px] border-x-transparent border-b-[#c9a227] drop-shadow-md" />
          </div>

          {/* Outer black border ring */}
          <div className="absolute inset-0 rounded-full border-[10px] border-[#111111] shadow-2xl">
            {/* Beige/cream decorative inner ring */}
            <div className="absolute inset-0 rounded-full bg-[#e8d9bc]">
              {/* Rotating segments — inset to reveal the beige ring */}
              <div
                className="absolute inset-[14px] rounded-full overflow-hidden"
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
                    // white segments get dark text; red/pink segments get white text
                    const labelColor = index % 3 === 2 ? "#c00000" : "#ffffff";
                    return (
                      <div
                        key={entry.id}
                        className="pointer-events-none absolute inset-0"
                        style={{ transform: `rotate(${angle}deg)` }}
                      >
                        <span
                          className="absolute left-1/2 top-[3%] max-h-[40%] -translate-x-1/2 overflow-hidden font-semibold leading-tight drop-shadow"
                          style={{
                            writingMode: "vertical-rl",
                            textOrientation: "upright",
                            fontSize: "clamp(0.55rem, 2.2cqw, 0.95rem)",
                            color: labelColor,
                          }}
                        >
                          {entry.label}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Center spin button — hidden while spinning to reveal rotating segments */}
              {!isSpinning && (
                <button
                  type="button"
                  onClick={onSpin}
                  disabled={!canSpin}
                  aria-label="開始抽獎"
                  className="absolute left-1/2 top-1/2 z-20 flex h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-full border-4 border-white bg-white text-center font-black text-[#c00000] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2),0_8px_10px_-6px_rgba(0,0,0,0.2)] transition hover:bg-[#fff8f8] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span
                    className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-2 tracking-wide"
                    style={{ fontSize: "clamp(1.2rem, 5.5cqw, 2.4rem)", fontWeight: 900 }}
                  >
                    {centerLabel}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Mascots — 1/2 of wheel size (wheel = min(90cqw,90cqh)) */}
          <div className="pointer-events-none absolute bottom-0 left-0 z-20 -translate-x-1/2 translate-y-1/2">
            <MascotLeft height="45cqmin" />
          </div>
          <div className="pointer-events-none absolute bottom-0 right-0 z-20 translate-x-1/2 translate-y-1/2">
            <MascotRight height="45cqmin" mirrored={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
