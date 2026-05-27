/** Replace with your Ko-fi / Buy Me a Coffee URL */
const SPONSOR_URL = "https://www.buymeacoffee.com/";

export function SponsorFooter() {
  return (
    <footer className="border-t border-[var(--bni-red)]/40 bg-[var(--bg-elevated)] py-6 text-center">
      <a
        href={SPONSOR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--bni-red)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(192,0,0,0.5)] transition hover:bg-[var(--bni-red-light)]"
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
