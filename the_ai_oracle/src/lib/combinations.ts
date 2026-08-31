import type { Reading } from './draw'

/* ---------------------------------------------------------------------------
   The written reading for a particular three-card combination — one entry for
   each of the 2,592 possibilities.

   Loaded on demand rather than bundled into the entry chunk: it is ~1.5 MB of
   JSON and only ever one entry is needed, so parsing it at startup would cost
   the landing for nothing. The stage asks for it as the cards are dealt, which
   is comfortably before the third card is turned.
--------------------------------------------------------------------------- */

export interface Combination {
  interpretation: string
  example: string
}

/* The lookup was authored with a different id for one card. Rather than rename
   it here — the id is also the filename of its artwork — the difference is
   mapped at the boundary. */
const ID_ALIASES: Record<string, string> = {
  'thirty-seconds': '30-seconds',
}

const alias = (id: string) => ID_ALIASES[id] ?? id

export function combinationKey(reading: Reading): string {
  return [reading.focus.id, reading.goal.id, reading.twist.id].map(alias).join('__')
}

let table: Record<string, Combination> | null = null
let pending: Promise<Record<string, Combination>> | null = null

/** Starts the fetch without waiting for it. Safe to call repeatedly. */
export function preloadCombinations(): void {
  void loadCombinations()
}

export function loadCombinations(): Promise<Record<string, Combination>> {
  if (table) return Promise.resolve(table)
  pending ??= import('../data/combinations.json').then((m) => {
    table = m.default as Record<string, Combination>
    return table
  })
  return pending
}

/** The entry for a reading, or null while the table is still in flight. */
export function combinationFor(reading: Reading): Combination | null {
  return table ? (table[combinationKey(reading)] ?? null) : null
}
