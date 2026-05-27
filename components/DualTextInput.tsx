"use client";

type DualTextInputProps = {
  itemsText: string;
  namesText: string;
  onItemsChange: (value: string) => void;
  onNamesChange: (value: string) => void;
  disabled?: boolean;
};

export function DualTextInput({
  itemsText,
  namesText,
  onItemsChange,
  onNamesChange,
  disabled = false,
}: DualTextInputProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2" aria-label="文字輸入區">
      <div>
        <label
          htmlFor="items-input"
          className="mb-1 block text-sm font-semibold text-[var(--bni-red)]"
        >
          抽獎項目（空格或換行分隔）
        </label>
        <textarea
          id="items-input"
          value={itemsText}
          onChange={(e) => onItemsChange(e.target.value)}
          disabled={disabled}
          placeholder="每行或空格分隔多個項目名稱…"
          className="min-h-[120px] w-full resize-y rounded-lg border border-gray-300 p-3 text-sm focus:border-[var(--bni-red)] focus:outline-none focus:ring-2 focus:ring-[var(--bni-red)]/30 disabled:opacity-60"
        />
      </div>
      <div>
        <label
          htmlFor="names-input"
          className="mb-1 block text-sm font-semibold text-[var(--bni-red)]"
        >
          抽獎名單（空格或換行分隔）
        </label>
        <textarea
          id="names-input"
          value={namesText}
          onChange={(e) => onNamesChange(e.target.value)}
          disabled={disabled}
          placeholder="每行或空格分隔參與者姓名…"
          className="min-h-[120px] w-full resize-y rounded-lg border border-gray-300 p-3 text-sm focus:border-[var(--bni-red)] focus:outline-none focus:ring-2 focus:ring-[var(--bni-red)]/30 disabled:opacity-60"
        />
      </div>
    </section>
  );
}
