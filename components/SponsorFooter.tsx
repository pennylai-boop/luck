/** Replace with your Ko-fi / Buy Me a Coffee URL */
const SPONSOR_URL = "https://www.buymeacoffee.com/";

export function SponsorFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 text-center">
      <a
        href={SPONSOR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--bni-red)] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[var(--bni-red-dark)]"
      >
        <span aria-hidden>☕</span>
        請我喝杯咖啡
      </a>
      <p className="mt-2 text-xs text-[var(--text-muted)]">
        感謝您的支持，讓抽獎工具持續優化
      </p>
    </footer>
  );
}
