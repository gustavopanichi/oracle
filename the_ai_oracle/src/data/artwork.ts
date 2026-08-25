import { ALL_CARDS } from './cards'

/* ---------------------------------------------------------------------------
   Card artwork.

   To illustrate a card, drop an image into src/assets/cards/ named after the
   card's id — `a-client.jpg` lights up A CLIENT. Nothing else to wire up: the
   bundler picks the file up from here, serves it as its own request in the
   normal build, and inlines it in the single-file build.

   A card with no matching file falls back to its drawn sigil, so the deck can
   be illustrated a few cards at a time.
--------------------------------------------------------------------------- */

const files = import.meta.glob<string>('../assets/cards/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

export const ARTWORK: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path.split('/').pop()!.replace(/\.[^.]+$/, ''),
    url,
  ]),
)

/** Cards still waiting on artwork, in deck order. */
export function cardsAwaitingArtwork() {
  return ALL_CARDS.filter((card) => !ARTWORK[card.id])
}

if (import.meta.env.DEV) {
  const orphaned = Object.keys(ARTWORK).filter((id) => !ALL_CARDS.some((c) => c.id === id))
  if (orphaned.length) console.error('[oracle] artwork with no matching card:', orphaned)

  const waiting = cardsAwaitingArtwork()
  console.info(
    `[oracle] artwork: ${ALL_CARDS.length - waiting.length}/${ALL_CARDS.length} cards illustrated` +
      (waiting.length ? ` — still drawn as sigils: ${waiting.map((c) => c.id).join(', ')}` : ''),
  )
}
