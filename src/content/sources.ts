import type { ContentSource } from './types';

/**
 * Machine-readable source register.
 *
 * This register is intentionally empty. No source may be added here from model
 * memory or a guessed URL. Each entry must be supplied or checked by an editor,
 * with its publisher, source kind, applicable scope and reproduction rights.
 *
 * The editorial process is documented in `docs/content-source-register.md`.
 */
export const ContentSources: readonly ContentSource[] = [];

export function getContentSourceById(id: string): ContentSource | undefined {
  return ContentSources.find((source) => source.id === id);
}

export function getContentSourceTitles(ids: readonly string[]): string[] {
  return ids
    .map((id) => getContentSourceById(id)?.title)
    .filter((title): title is string => typeof title === 'string' && title.trim().length > 0);
}
