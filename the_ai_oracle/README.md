# The Deck

A three-card reading for the SketchDeck AI Hackathon. Draw a **focus**, a
**goal** and a **twist**; the three together are a starting point for what you
could build.

Built to be shown on a laptop or projector: no backend, no data collection,
everything runs in the browser.

```bash
npm install
npm run dev      # http://localhost:5173
```

## Deployment

Live at **https://oracle-ten-sand.vercel.app** — Vercel builds from this repo
and redeploys on every push to `main`. Nothing else to run.

Note the layout: the project lives in a `the_ai_oracle/` subfolder rather than
at the repository root, and Vercel's Root Directory is set to match. Keep it
that way, or change both together.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check and build to `dist/` |
| `npm run build:single` | One self-contained `dist-single/index.html` |
| `npm run pack` | The above, repackaged as `the-ai-oracle.html` for hosts that supply their own HTML skeleton |

## Editing the deck

All card content lives in [`src/data/cards.ts`](src/data/cards.ts) — three
decks of plain objects. To change a card's wording, edit it there and nothing
else needs to move.

Each card carries a `prompt` (the line under the card), plus a `detail` and an
`example` — the longer read behind the card's help dot.

To **add** a card you need two things: an entry in the right deck, and a sigil
registered under the same `id` in
[`src/illustrations/index.ts`](src/illustrations/index.ts). In development the
app logs an error to the console for any card missing a sigil, any sigil with
no card, and any sigil used on more than one card.

Titles are stored in title case and rendered uppercase, so keep them readable
as sentences. Keep them short and actionable — the mysticism lives in the
visuals, never in the instructions. Each card's one-line prompt is shown under
the card rather than on it, so the artwork keeps the whole window.

### Card artwork

Drop an image into `src/assets/cards/` named after the card's id —
`a-client.jpg` lights up A CLIENT. That is the whole wiring: the file is
picked up by [`artwork.ts`](src/data/artwork.ts), served as its own request in
the normal build and inlined in the single-file build. A card with no matching
file falls back to its drawn sigil, so the deck can be illustrated a few cards
at a time. All 42 are illustrated today; the sigils remain as the fallback for
any card added later.

Supply artwork at 768×1376. The card is deliberately shorter than that
proportion, so `object-fit: cover` trims about 21% of the image's height —
taken evenly off the top and bottom via `object-position: center`, never off
one side. The image is positioned `absolute; inset: 0` rather than sized with
`width/height: 100%`: as a grid item that percentage height did not resolve,
so the image fell back to its intrinsic size, `object-fit` never engaged at
all, and the window quietly clipped the whole overflow off the bottom. Keep the subject centred with plenty of room around it. The trade is
set by `--card-ratio`: raise it to trim less and lengthen the card (2.0885
crops nothing at all), lower it to trim more. The derivation is written
out above `--card-h` in [`card.css`](src/components/card.css).

Encode at ~520px wide: all 42 come to 4.4 MB as it is, and the single-file
build carries every one of them base64'd.

In development the console reports how many cards are illustrated and names
the ones still drawn as sigils.

The mark in the top-right cell is the Half Pipe, traced from `SD.svg` into
[`SketchdeckMark.tsx`](src/components/SketchdeckMark.tsx). It fills with
`currentColor` and takes the card's own umber, like every other line on the
card.

### Reviewing the artwork

`http://localhost:5173/?gallery` (dev only) renders all 42 card fronts on one
contact sheet. Use it after touching any illustration to check the deck still
reads as one family.

## How it is put together

```
src/
  data/cards.ts            deck content + artwork paths — most edits touch only this
  lib/draw.ts              reading logic: draw, redraw, shuffle
  lib/sound.ts             Web Audio synthesis — no audio files
  hooks/useTilt.ts         pointer-driven 3D tilt for one element
  hooks/usePointerField.ts one shared spring-smoothed pointer, for parallax
  illustrations/           42 sigils + the shared dial they are drawn into
  components/              Landing, ReadingStage, TarotCard, Atmosphere, …
  styles/tokens.css        colour, type, motion and card geometry
```

The pieces are deliberately separable: card data knows nothing about React,
the draw logic knows nothing about animation, and the illustrations are pure
SVG children drawn into one shared frame.

### The card

All of the card is measured in fractions of its own width, so it is the same
drawing at any size. Its height is not chosen — it is solved backwards from
the artwork's proportion (see `--card-h`), which is why the card is as long as
it is. `--card-h` and `--card-radius` are declared on the card
elements rather than at `:root` — declared there they would resolve once
against the base width and ignore the contraction the stage applies when a
reading resolves, which silently changes the card's proportion. A hairline plate inset 4% carries every rule on the card:
the head's bottom border, the two cell dividers, the title bar's top border.
The head is numeral / category / mark; the window sits between; the title bar
grows to fit its title, so a long title takes room from the artwork rather
than being clipped.

The back is drawn with the same plate geometry in CSS, so a card looks like
one object whichever way up it is lying.

### Sigils

Sigils are the fallback for any card without artwork. Each is a fragment of
SVG children on a 120×120 field centred on
(60, 60), stroked in `currentColor`. Every drawable element carries
`pathLength="1"` so the reveal can draw them all in at one rate regardless of
their real length. `Sigil.tsx` supplies the guide circle and cardinal ticks
that every card shares.

Elements can opt into idle behaviour by class — `sig-spin`, `sig-spin-rev`,
`sig-spin-fast`, `sig-pulse`, `sig-breathe`, `sig-trace` — all of which stop
under `prefers-reduced-motion`.

### Randomisation

`drawReading` holds back each deck's two most recent picks and never returns
the combination it is replacing. Over 20,000 consecutive draws: no repeated
combination, no card repeating its previous draw, and near-uniform
distribution across all 42 cards.

In development the draw functions are exposed on `window.__oracle`, so the
logic can be exercised from the console without a test harness.

## Art direction

| | |
| --- | --- |
| Cloth | `#161638` at its brightest, falling away to `#0D0D24` and `#07071A`; `#0077E4` is the light in the folds and the sheen |
| Highlight | `#C0D8FF` — linework, labels, the `×` separators, the frame |
| Cards | `#F4F4F0` paper, `#7E5735` umber linework and titles, `#858580` stone for secondary text |
| Card back | A printed image, `src/assets/card-back.jpg`, shown on all three cards |
| Display | Instrument Serif — titles, card type and the reading |
| Body | Inter Regular, with Bold available for emphasis |

Letter-spacing is zero everywhere, including uppercase labels. If you add type,
keep it that way — there is a `letter-spacing: 0` on `body` and on every
element that sets a font, deliberately.

The background is a midnight silk table: a pool of light in the middle, folds
from two interfering rulings blurred together, a slow sheen, a fine crossed
weave, and a fibre grain over the top. A hairline frame with corner ticks is
held off the viewport edge at every size.

## Two cascade traps

**`global.css` is imported before `App`** in [`main.tsx`](src/main.tsx). The
other way round, component CSS is injected first and any component rule that
ties on specificity with a `:root` rule in `tokens.css` loses — which silently
killed the mobile card-width override and left phone cards at half size.

**The reading holds one line** by taking its font size from the viewport
(`min(2.4vw, 2.6rem)`) with `white-space: nowrap`, rather than from a rem
scale. The deck's longest possible combination — THE CLIENT EXPERIENCE ×
REMOVE THE BORING PART × MAKE THE INVISIBLE VISIBLE — measures 1069px against
1328px of available width at 1440, and scales with the viewport from there.
Phones fall back to wrapping.

## Fitting the screen

Height, not width, is what constrains this layout: three 3:5 cards, their
prompts and the whole reading have to sit on one screen without scrolling,
because it is shown on a projector. So the card width is solved from the
height budget rather than picked:

Everything else on the stage is declared once in `tokens.css` — the top
padding that clears the centred wordmark, the column gap, the prompt line, the
reading's reserve, the bottom padding — and the stage consumes those same
tokens. What is left of the viewport becomes the card:

```css
--stage-overhead: calc(
  var(--stage-pad-top) + var(--column-gap) + var(--prompt-line) +
  var(--foot-margin) + var(--foot-reserve) + var(--stage-pad-bottom)
);

--card-w-base: max(
  8.5rem,
  min(27vw, calc((100svh - var(--stage-overhead)) / 1.8379), 30rem)
);
```

`1.8379` is `--card-ratio × --card-converged`: the height one unit of card
width costs once the spread has contracted. The `vw` term keeps three cards
plus gaps and gutters inside the width; the `8.5rem` floor stops very short
windows from shrinking the cards past legibility (they scroll instead).

Because every term is named, changing any of them resizes the cards to suit —
there is no constant to re-tune. One thing to watch: `--foot-reserve` is
deliberately *not* viewport-scaled, since the reading's height comes from type
with rem floors and stays about the same on every screen. Scaling it with `vh`
made it spill over the frame on short displays. It is sized for the *tallest*
reading — one whose formula wraps to two lines — so a one-line reading leaves
visible space below it. That is the price of the spread not jumping between
draws, and it is the right trade.

Verified with zero overflow, in both the face-down and resolved states, at
1280×720, 1440×900 and 1920×1080.

## Sound

Synthesised at runtime — filtered noise for card handling, struck partials for
reveals. Quiet by design, on by default, and the preference is remembered.
The experience is complete with sound off.

## Motion and accessibility

`prefers-reduced-motion` is respected throughout: parallax, tilt, particles,
idle float, the reveal burst and the deal springs all stand down, while the
cards still turn and the reading still resolves. Cards are reachable by
keyboard while face down, and hover states are gated behind `@media (hover:
hover)` so a tap does not leave one stuck.
