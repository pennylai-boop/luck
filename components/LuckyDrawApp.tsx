"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { LotteryWheel } from "@/components/LotteryWheel";
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
      <div className="flex h-[1080px] flex-col overflow-hidden">
        <header className="shrink-0 border-b border-[var(--bni-red)]/20 bg-white px-4 py-4 shadow-sm">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
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
            <p className="mx-auto mt-2 max-w-6xl text-center text-sm text-[var(--bni-red-dark)]">
              {statusMessage}
            </p>
          )}
        </header>

        <main className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col pl-4 pt-2 pr-4 pb-4">
          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-stretch lg:gap-6">
            <div className="flex items-start justify-start self-start">
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
              className="text-xs text-[var(--text-muted)] transition hover:text-[var(--text)]"
            >
              © 2026 introvista
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
