"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { LotteryWheel } from "@/components/LotteryWheel";
import { SponsorFooter } from "@/components/SponsorFooter";
import { WinnerModal } from "@/components/WinnerModal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { parseLines, toListEntries } from "@/lib/parseLines";
import type { ListEntry } from "@/lib/types";
import { computeStopRotation, pickRandomIndex } from "@/lib/wheelMath";

const SPIN_MS = 5000;
const CHROME_BAR_H = "72px";

export function LuckyDrawApp() {
  const [prizeTitle, setPrizeTitle] = useState("");
  const [namesText, setNamesText] = useState("");
  const [wonIds, setWonIds] = useState<Set<string>>(() => new Set());
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [lastWinner, setLastWinner] = useState<ListEntry | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const pendingWinnerRef = useRef<ListEntry | null>(null);
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const allEntries = useMemo(() => toListEntries(parseLines(namesText)), [namesText]);
  const candidates = useMemo(
    () => allEntries.filter((e) => !wonIds.has(e.id)),
    [allEntries, wonIds]
  );

  const clearSpinTimer = useCallback(() => {
    if (spinTimerRef.current) {
      clearTimeout(spinTimerRef.current);
      spinTimerRef.current = null;
    }
  }, []);

  const finishSpin = useCallback(() => {
    const winner = pendingWinnerRef.current;
    pendingWinnerRef.current = null;
    setIsSpinning(false);
    if (winner) {
      setWonIds((prev) => new Set(prev).add(winner.id));
      setLastWinner(winner);
      setModalOpen(true);
      setStatusMessage(null);
    }
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning || candidates.length === 0) {
      if (candidates.length === 0) setStatusMessage("無可抽選對象，請新增名單或重置。");
      return;
    }
    clearSpinTimer();
    const winnerIndex = pickRandomIndex(candidates.length);
    const winner = candidates[winnerIndex];
    pendingWinnerRef.current = winner;
    const nextRotation = computeStopRotation(winnerIndex, candidates.length, rotation);
    setIsSpinning(true);
    setStatusMessage(null);
    setRotation(nextRotation);
    spinTimerRef.current = setTimeout(finishSpin, SPIN_MS);
  }, [isSpinning, candidates, rotation, clearSpinTimer, finishSpin]);

  const resetWinners = useCallback(() => {
    clearSpinTimer();
    pendingWinnerRef.current = null;
    setWonIds(new Set());
    setModalOpen(false);
    setLastWinner(null);
    setIsSpinning(false);
    setStatusMessage(null);
  }, [clearSpinTimer]);

  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
    {/* Mobile: vertical stack · Desktop: header + wheel/panel + red band = 100vh */}
    <div
      className="relative flex h-dvh flex-col overflow-hidden bg-white lg:grid lg:h-screen"
      style={{ gridTemplateRows: `${CHROME_BAR_H} 1fr ${CHROME_BAR_H}` }}
    >
      {/* ── Header ── */}
      <header className="flex shrink-0 flex-col justify-center bg-[#c00000] px-6 py-3">
        <h1 className="text-2xl font-extrabold tracking-wide text-white">抽獎輪盤</h1>
        <p className="text-xs text-white/75">活動抽獎使用，關閉畫面即重置</p>
      </header>

      {/* ── Wheel + control panel ── */}
      <main className="flex min-h-0 flex-1 flex-col overflow-visible lg:h-full lg:flex-row">
        {/* Wheel area — white */}
        <div className="relative flex min-h-0 flex-1 items-start justify-center overflow-visible bg-white px-2 pt-2 pb-8 lg:h-full lg:items-center lg:flex-[2] lg:px-0 lg:py-0">
          <LotteryWheel
            candidates={candidates}
            rotation={rotation}
            isSpinning={isSpinning}
            onSpin={handleSpin}
            prizeTitle={prizeTitle}
          />
        </div>

        {/* Control panel — red on mobile, white sidebar on desktop */}
        <div className="relative -mt-4 flex h-[40dvh] w-full shrink-0 flex-col overflow-y-auto bg-[#c00000] px-4 pb-3 pt-8 lg:mt-0 lg:h-full lg:w-1/3 lg:overflow-hidden lg:bg-white lg:px-8 lg:py-8">
          {candidates.length > 0 && (
            <p className="mb-1 text-center text-xs text-white lg:hidden">
              尚可抽選：
              <span className="font-semibold">{candidates.length}</span> 項
            </p>
          )}

          <div className="flex min-h-0 flex-1 flex-col justify-center lg:justify-center">
            <div className="mb-2 lg:mb-6">
              <label
                htmlFor="prize-title"
                className="mb-1 block text-base font-bold text-white lg:mb-2 lg:text-lg lg:text-[#c00000]"
              >
                項目名稱
              </label>
              <input
                id="prize-title"
                type="text"
                value={prizeTitle}
                onChange={(e) => setPrizeTitle(e.target.value)}
                disabled={isSpinning}
                placeholder="輸入抽獎項目名稱"
                className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm text-gray-700 transition focus:outline-none disabled:opacity-60 lg:border-4 lg:border-[#c00000] lg:px-4 lg:py-3"
              />
            </div>

            <div className="mb-2 lg:mb-6">
              <label
                htmlFor="names-input"
                className="mb-1 block text-base font-bold text-white lg:mb-2 lg:text-lg lg:text-[#c00000]"
              >
                抽獎名單
              </label>
              <textarea
                id="names-input"
                value={namesText}
                onChange={(e) => setNamesText(e.target.value)}
                disabled={isSpinning}
                rows={isDesktop ? 7 : 2}
                placeholder="輸入參與者姓名，以空格、換行或標點符號分隔…"
                className="w-full resize-none rounded-xl border-0 bg-white px-3 py-2 text-sm text-gray-700 transition focus:outline-none disabled:opacity-60 lg:border-4 lg:border-[#c00000] lg:px-4 lg:py-3"
              />
            </div>

            <div className="flex flex-row items-center justify-center gap-3 lg:justify-start">
              <button
                type="button"
                onClick={resetWinners}
                disabled={isSpinning}
                className="rounded-xl bg-white px-6 py-1.5 text-sm font-bold text-[#c00000] shadow-md transition hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 lg:flex-1 lg:px-6 lg:py-3 lg:text-base lg:bg-[#c00000] lg:text-white lg:hover:bg-[#a00000] lg:active:bg-[#900000]"
              >
                重置名單
              </button>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-white lg:text-sm lg:text-gray-600">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="h-3.5 w-3.5 accent-white lg:h-4 lg:w-4 lg:accent-[#c00000]"
                />
                慶祝音效
              </label>
            </div>

            {statusMessage && (
              <p className="mt-1 text-xs text-white/90 lg:mt-3 lg:text-sm lg:text-[#c00000]">{statusMessage}</p>
            )}
          </div>

          <a
            href="https://introvista.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 pt-4 text-center text-xs text-gray-400 transition hover:text-gray-600 lg:block"
          >
            © 2026 introvista x fore cons.
          </a>
        </div>
      </main>

      {/* Red band — desktop only */}
      <div className="hidden shrink-0 bg-[#c00000] lg:flex">
        <div className="relative flex-[2]">
          {candidates.length > 0 && (
            <p className="pointer-events-none absolute top-2 left-1/2 z-10 -translate-x-1/2 text-sm text-white">
              尚可抽選：
              <span className="font-semibold">{candidates.length}</span> 項
            </p>
          )}
        </div>
        <div className="w-1/3 shrink-0" aria-hidden />
      </div>

      <WinnerModal
        open={modalOpen}
        winnerName={lastWinner?.label ?? ""}
        prizeTitle={prizeTitle}
        soundEnabled={soundEnabled}
        onClose={closeModal}
      />
    </div>

    <SponsorFooter />
    </>
  );
}
