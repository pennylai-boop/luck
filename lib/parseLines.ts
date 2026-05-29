import type { ListEntry } from "./types";

/** Split by whitespace, newlines, or common punctuation; drop empty tokens. */
export function parseLines(text: string): string[] {
  return text
    .split(/[\s\n,，;；、|·]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function toListEntries(labels: string[]): ListEntry[] {
  return labels.map((label, index) => ({
    id: `${index}-${label}`,
    label,
  }));
}
