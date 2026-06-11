"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { LotteryWheel } from "@/components/LotteryWheel";
import { SponsorFooter } from "@/components/SponsorFooter";
import { WinnerModal } from "@/components/WinnerModal";
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
    {/* header + wheel/panel + red band = exactly 100vh */}
    <div
      className="relative grid h-screen overflow-hidden bg-white"
      style={{ gridTemplateRows: `${CHROME_BAR_H} 1fr ${CHROME_BAR_H}` }}
    >
      {/* ── Row 1: Header ── */}
      <header className="flex shrink-0 flex-col justify-center bg-[#c00000] px-6 py-3">
        <h1 className="text-2xl font-extrabold tracking-wide text-white">抽獎輪盤</h1>
        <p className="text-xs text-white/75">活動抽獎使用，關閉畫面即重置</p>
      </header>

      {/* ── Row 2: Wheel + control panel ── */}
      <main className="flex h-full min-h-0 overflow-visible">

          {/* Left — white wheel area, 2/3 width */}
          <div className="flex h-full min-h-0 flex-[2] items-center justify-center overflow-visible bg-white">
            <LotteryWheel
              candidates={candidates}
              rotation={rotation}
              isSpinning={isSpinning}
              onSpin={handleSpin}
              prizeTitle={prizeTitle}
            />
          </div>

          {/* Right — control panel, 1/3 width */}
          <div className="flex h-full w-1/3 shrink-0 flex-col overflow-hidden bg-white px-8 py-8">
            <div className="flex min-h-0 flex-1 flex-col justify-center">
              {/* 項目名稱 */}
              <div className="mb-6">
                <label
                  htmlFor="prize-title"
                  className="mb-2 block text-lg font-bold text-[#c00000]"
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
                  className="w-full rounded-xl border-4 border-[#c00000] px-4 py-3 text-sm text-gray-700 transition focus:outline-none disabled:opacity-60"
                />
              </div>

              {/* 抽獎名單 */}
              <div className="mb-6">
                <label
                  htmlFor="names-input"
                  className="mb-2 block text-lg font-bold text-[#c00000]"
                >
                  抽獎名單
                </label>
                <textarea
                  id="names-input"
                  value={namesText}
                  onChange={(e) => setNamesText(e.target.value)}
                  disabled={isSpinning}
                  rows={7}
                  placeholder="輸入參與者姓名，以空格、換行或標點符號分隔…"
                  className="w-full resize-none rounded-xl border-4 border-[#c00000] px-4 py-3 text-sm text-gray-700 transition focus:outline-none disabled:opacity-60"
                />
              </div>

              {/* Reset + Sound */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetWinners}
                  disabled={isSpinning}
                  className="flex-1 rounded-xl bg-[#c00000] px-6 py-3 text-base font-bold text-white shadow-md transition hover:bg-[#a00000] active:bg-[#900000] disabled:opacity-50"
                >
                  重置名單
                </button>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="h-4 w-4 accent-[#c00000]"
                  />
                  慶祝音效
                </label>
              </div>

              {statusMessage && (
                <p className="mt-3 text-sm text-[#c00000]">{statusMessage}</p>
              )}
            </div>

            {/* Copyright — pinned to bottom */}
            <a
              href="https://introvista.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 pt-4 text-center text-xs text-gray-400 transition hover:text-gray-600"
            >
              © 2026 introvista x fore cons.
            </a>
          </div>
      </main>

      {/* ── Row 3: Red decorative band (same height as header) ── */}
      <div className="flex shrink-0 bg-[#c00000]">
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
