"use client";

import { useRef, type ChangeEvent, type DragEvent } from "react";
import { NamesListInput } from "@/components/NamesListInput";

const MAX_BYTES = 2 * 1024 * 1024;

type PrizePanelProps = {
  title: string;
  imageDataUrl: string | null;
  namesText: string;
  onTitleChange: (title: string) => void;
  onImageChange: (dataUrl: string | null) => void;
  onNamesChange: (value: string) => void;
  disabled?: boolean;
};

export function PrizePanel({
  title,
  imageDataUrl,
  namesText,
  onTitleChange,
  onImageChange,
  onNamesChange,
  disabled = false,
}: PrizePanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("請上傳圖片檔案（JPG、PNG 等）");
      return;
    }
    if (file.size > MAX_BYTES) {
      alert("圖片請小於 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImageChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <section
      className="flex w-full max-w-sm flex-col rounded-2xl border-2 border-[var(--bni-red)] bg-white p-4 shadow-md"
      aria-label="抽獎項目"
    >
      <h2 className="mb-2 text-lg font-bold text-[var(--bni-red)]">抽獎項目</h2>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            inputRef.current?.click();
          }
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`relative mb-3 flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[var(--bni-red)] bg-[var(--bni-cream)] transition hover:bg-[#ebe4d4] ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        {imageDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageDataUrl}
            alt="抽獎項目圖片"
            className="h-full w-full object-contain"
          />
        ) : (
          <p className="px-4 text-center text-sm text-[var(--text-muted)]">
            點擊或拖放圖片至此
            <br />
            <span className="text-xs">（最大 2MB）</span>
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileInput}
          disabled={disabled}
        />
      </div>

      {imageDataUrl && !disabled && (
        <button
          type="button"
          onClick={() => onImageChange(null)}
          className="mb-2 text-sm text-[var(--bni-red-dark)] underline hover:text-[var(--bni-red)]"
        >
          移除圖片
        </button>
      )}

      <label className="text-sm font-medium text-[var(--text-muted)]">項目名稱</label>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        disabled={disabled}
        placeholder="輸入抽獎項目名稱"
        className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-base text-[var(--text)] placeholder:text-gray-400 focus:border-[var(--bni-red)] focus:outline-none focus:ring-2 focus:ring-[var(--bni-red)]/30 disabled:opacity-60"
      />
      <NamesListInput
        value={namesText}
        onChange={onNamesChange}
        disabled={disabled}
        className="mt-3"
      />
      <p className="mt-3 text-xs text-[var(--text-muted)]">
        抽獎中無需操作；要換項目時直接更新圖片或名稱即可。
      </p>
    </section>
  );
}
