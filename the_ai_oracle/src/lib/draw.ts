import { DECK_BY_ID, type Card, type DeckId } from '../data/cards'

/* ---------------------------------------------------------------------------
   Reading / randomisation logic. Kept free of React so it can be reasoned
   about (and tested) on its own.
--------------------------------------------------------------------------- */

export interface Reading {
  focus: Card
  goal: Card
  twist: Card
}

/** Stable identity of a three-card combination, order-sensitive by position. */
export function readingKey(reading: Reading): string {
  return [reading.focus.id, reading.goal.id, reading.twist.id].join('×')
}

/** How many recent picks per deck to hold back, so redraws feel fresh. */
const MEMORY = 2

type Memory = Record<DeckId, string[]>

export function emptyMemory(): Memory {
  return { focus: [], goal: [], twist: [] }
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * Pick one card from a deck, avoiding anything in `avoid` — but never at the
 * cost of returning nothing: if the exclusions would empty the deck, they are
 * relaxed one step at a time.
 */
function pickFromDeck(deck: DeckId, avoid: string[]): Card {
  const cards = DECK_BY_ID[deck].cards
  for (let relax = 0; relax <= avoid.length; relax++) {
    const blocked = new Set(avoid.slice(0, avoid.length - relax))
    const available = cards.filter((c) => !blocked.has(c.id))
    if (available.length > 0) return pick(available)
  }
  return pick(cards)
}

function remember(memory: Memory, deck: DeckId, id: string): Memory {
  return { ...memory, [deck]: [id, ...memory[deck]].slice(0, MEMORY) }
}

export interface DrawResult {
  reading: Reading
  memory: Memory
}

/**
 * Draw a fresh three-card reading.
 *
 * Two guarantees: no card repeats a recent pick from its own deck where the
 * deck is large enough to allow it, and the combination is never identical to
 * the one it replaces.
 */
export function drawReading(memory: Memory, previous?: Reading | null): DrawResult {
  let next = memory
  let reading: Reading
  let attempts = 0

  do {
    const focus = pickFromDeck('focus', memory.focus)
    const goal = pickFromDeck('goal', memory.goal)
    const twist = pickFromDeck('twist', memory.twist)
    reading = { focus, goal, twist }
    attempts++
  } while (previous && readingKey(reading) === readingKey(previous) && attempts < 24)

  next = remember(next, 'focus', reading.focus.id)
  next = remember(next, 'goal', reading.goal.id)
  next = remember(next, 'twist', reading.twist.id)

  return { reading, memory: next }
}

/**
 * Fisher–Yates on a copy. Used by the shuffle animation to reorder the deck
 * sprites so the motion reads as a genuine riffle rather than a loop.
 */
export function shuffled<T>(items: T[]): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/* Exposed in development only, so the draw logic can be exercised over many
   thousands of iterations from the console without shipping a test harness. */
if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).__oracle = {
    drawReading,
    emptyMemory,
    readingKey,
  }
}
