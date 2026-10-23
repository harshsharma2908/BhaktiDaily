/**
 * Every key is namespaced and versioned. If a payload shape changes, add a new
 * key rather than guessing at old data.
 */
export const StorageKeys = {
  jaap: 'bhakti-daily/jaap/v1',
  preferences: 'bhakti-daily/preferences/v1',
} as const;
