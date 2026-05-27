"use client";

type NamesListInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function NamesListInput({
  value,
  onChange,
  disabled = false,
}: NamesListInputProps) {
  return (
    <div className="w-full max-w-[min(90vw,420px)]" aria-label="抽獎名單輸入">
      <label
        htmlFor="names-input"
        className="mb-1 block text-xs font-semibold text-[var(--bni-red)]"
      >
        抽獎名單（空格或換行分隔）
      </label>
      <textarea
        id="names-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={2}
        placeholder="輸入參與者姓名，以空格或換行分隔…"
        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm leading-snug text-[var(--text)] placeholder:text-gray-400 focus:border-[var(--bni-red)] focus:outline-none focus:ring-2 focus:ring-[var(--bni-red)]/30 disabled:opacity-60"
      />
    </div>
  );
}
