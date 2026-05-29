"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { LotteryWheel } from "@/components/LotteryWheel";
import { NamesListInput } from "@/components/NamesListInput";
import { PrizePanel } from "@/components/PrizePanel";
import { SponsorFooter } from "@/components/SponsorFooter";
import { WinnerModal } from "@/components/WinnerModal";
import { parseLines, toListEntries } from "@/lib/parseLines";
import type { ListEntry } from "@/lib/types";
import { computeStopRotation, pickRandomIndex } from "@/lib/wheelMath";

const SPIN_MS = 5000;

export function LuckyDrawApp() {
  const [prizeTitle, setPrizeTitle] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
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

  const allEntries = useMemo(
    () => toListEntries(parseLines(namesText)),
    [namesText]
  );

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
      if (candidates.length === 0) {
        setStatusMessage("無可抽選對象，請新增名單或重置得獎紀錄。");
      }
      return;
    }

    clearSpinTimer();
    const winnerIndex = pickRandomIndex(candidates.length);
    const winner = candidates[winnerIndex];
    pendingWinnerRef.current = winner;

    const nextRotation = computeStopRotation(
      winnerIndex,
      candidates.length,
      rotation
    );

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
    setStatusMessage("已重置得獎紀錄，可重新抽獎。");
  }, [clearSpinTimer]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <div className="bg-[var(--bg)]">
      <div className="relative mx-auto flex h-[1080px] w-full max-w-[1920px] flex-col overflow-hidden">
        <header className="shrink-0 border-b border-[var(--bni-red)]/20 bg-white py-4 pl-2 pr-4 shadow-sm">
          <div className="mx-auto flex w-full max-w-[1920px] flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[var(--bni-red)]">
                BNI Lucky Draw
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                商務例會抽獎 · 僅本次瀏覽有效，關閉分頁即重置
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="h-4 w-4 accent-[var(--bni-red)]"
                />
                慶祝音效
              </label>
              <button
                type="button"
                onClick={resetWinners}
                disabled={isSpinning}
                className="rounded-lg border border-[var(--bni-red)] px-4 py-2 text-sm font-medium text-[var(--bni-red)] transition hover:bg-[var(--bni-cream)] disabled:opacity-50"
              >
                重置得獎紀錄
              </button>
            </div>
          </div>
          {statusMessage && (
            <p className="mx-auto mt-2 w-full max-w-[1920px] text-center text-sm text-[var(--bni-red-dark)]">
              {statusMessage}
            </p>
          )}
        </header>

        {/* 抽獎項目：左側浮動，位於 Ko-fi 按鈕上方 */}
        <div
          className="fixed left-4 z-40 w-[380px] max-w-[calc(100vw-2rem)]"
          style={{
            bottom: "var(--float-prize-bottom)",
            maxHeight: "calc(100vh - var(--float-prize-bottom) - 1rem)",
          }}
        >
          <div className="max-h-[inherit] overflow-y-auto rounded-2xl shadow-xl">
            <PrizePanel
              title={prizeTitle}
              imageDataUrl={imageDataUrl}
              namesText={namesText}
              onTitleChange={setPrizeTitle}
              onImageChange={setImageDataUrl}
              onNamesChange={setNamesText}
              disabled={isSpinning}
            />
          </div>
        </div>

        <main className="mx-auto flex w-full max-w-[1920px] min-h-0 flex-1 flex-col pl-2 pt-2 pr-4 pb-4">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="@container flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-center">
              <LotteryWheel
                candidates={candidates}
                rotation={rotation}
                isSpinning={isSpinning}
                onSpin={handleSpin}
              />
            </div>
          </div>
          <p className="mt-2 shrink-0 text-center">
            <a
              href="https://introvista.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] transition hover:text-[var(--text)]"
              aria-label="Copyright 2026 introvista x fore cons."
            >
              <span aria-hidden className="text-sm leading-none">
                ©
              </span>
              <span>2026 introvista x fore cons.</span>
            </a>
          </p>
        </main>
      </div>

      <SponsorFooter />

      <WinnerModal
        open={modalOpen}
        winnerName={lastWinner?.label ?? ""}
        prizeTitle={prizeTitle}
        soundEnabled={soundEnabled}
        onClose={closeModal}
      />

    </div>
  );
}
