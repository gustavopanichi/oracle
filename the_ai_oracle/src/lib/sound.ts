/* ---------------------------------------------------------------------------
   Sound design, synthesised in the Web Audio API — no audio files, nothing to
   download, nothing to wait for. Everything here is deliberately quiet: card
   handling is filtered noise, reveals are a soft struck partial.

   The whole experience is designed to work with sound off; this module is
   additive only and every call is a no-op until it is both enabled and
   unlocked by a real user gesture.
--------------------------------------------------------------------------- */

const STORAGE_KEY = 'oracle:sound'

type Ctor = typeof AudioContext

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noise: AudioBuffer | null = null
let enabled = readPreference()

function readPreference(): boolean {
  if (typeof window === 'undefined') return false
  const stored = window.localStorage?.getItem(STORAGE_KEY)
  return stored === null ? true : stored === 'on'
}

function ensureContext(): AudioContext | null {
  if (!enabled) return null
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  }
  const Ctx: Ctor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext
  if (!Ctx) return null

  ctx = new Ctx()
  master = ctx.createGain()
  master.gain.value = 0.34
  master.connect(ctx.destination)

  // ~1s of white noise, reused for every paper/card sound.
  const frames = Math.floor(ctx.sampleRate)
  noise = ctx.createBuffer(1, frames, ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1

  return ctx
}

interface NoiseOptions {
  duration: number
  /** Band-pass centre, in Hz. Higher reads as thinner, crisper paper. */
  frequency: number
  q?: number
  gain?: number
  delay?: number
  /** Sweep the filter over the burst — this is what makes a card sound moved. */
  sweepTo?: number
}

function burst(options: NoiseOptions) {
  const audio = ensureContext()
  if (!audio || !master || !noise) return

  const { duration, frequency, q = 0.9, gain = 0.5, delay = 0, sweepTo } = options
  const t = audio.currentTime + delay

  const source = audio.createBufferSource()
  source.buffer = noise
  source.playbackRate.value = 0.8 + Math.random() * 0.4

  const filter = audio.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = q
  filter.frequency.setValueAtTime(frequency, t)
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, t + duration)

  const envelope = audio.createGain()
  envelope.gain.setValueAtTime(0.0001, t)
  envelope.gain.exponentialRampToValueAtTime(gain, t + duration * 0.16)
  envelope.gain.exponentialRampToValueAtTime(0.0001, t + duration)

  source.connect(filter).connect(envelope).connect(master)
  source.start(t, Math.random() * 0.4)
  source.stop(t + duration + 0.05)
}

interface ToneOptions {
  frequency: number
  duration?: number
  gain?: number
  delay?: number
  type?: OscillatorType
}

function tone({ frequency, duration = 2.4, gain = 0.16, delay = 0, type = 'sine' }: ToneOptions) {
  const audio = ensureContext()
  if (!audio || !master) return
  const t = audio.currentTime + delay

  const osc = audio.createOscillator()
  osc.type = type
  osc.frequency.value = frequency

  const envelope = audio.createGain()
  envelope.gain.setValueAtTime(0.0001, t)
  envelope.gain.exponentialRampToValueAtTime(gain, t + 0.035)
  envelope.gain.exponentialRampToValueAtTime(0.0001, t + duration)

  osc.connect(envelope).connect(master)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

/** A quiet minor-pentatonic ladder — three reveals should feel like a phrase. */
const REVEAL_PITCHES = [329.63, 392.0, 493.88, 587.33]

export const sound = {
  get enabled() {
    return enabled
  },

  setEnabled(next: boolean) {
    enabled = next
    window.localStorage?.setItem(STORAGE_KEY, next ? 'on' : 'off')
    if (!next && ctx) void ctx.suspend()
    if (next) {
      ensureContext()
      sound.tick()
    }
  },

  /** Call from a click handler once, to unlock audio under autoplay policy. */
  unlock() {
    ensureContext()
  },

  /** Riffle: a run of short bursts with uneven spacing. */
  shuffle() {
    const count = 7
    for (let i = 0; i < count; i++) {
      burst({
        duration: 0.1,
        frequency: 1500 + Math.random() * 1400,
        sweepTo: 700,
        q: 0.7,
        gain: 0.24,
        delay: i * 0.045 + Math.random() * 0.02,
      })
    }
  },

  /** A card sliding out of the deck into its slot. */
  deal(index = 0) {
    burst({
      duration: 0.3,
      frequency: 900,
      sweepTo: 2600,
      q: 0.5,
      gain: 0.16,
      delay: index * 0.02,
    })
  },

  /** The card turning over: air, then the edge landing. */
  flip() {
    burst({ duration: 0.26, frequency: 2400, sweepTo: 900, q: 0.6, gain: 0.3 })
    burst({ duration: 0.06, frequency: 3600, q: 2.4, gain: 0.22, delay: 0.2 })
  },

  /** Struck partial on reveal — pitch rises across the three positions. */
  reveal(position = 0) {
    const root = REVEAL_PITCHES[Math.min(position, REVEAL_PITCHES.length - 1)]
    tone({ frequency: root, duration: 2.6, gain: 0.13 })
    tone({ frequency: root * 2, duration: 1.5, gain: 0.05, delay: 0.02 })
    tone({ frequency: root * 3.01, duration: 0.9, gain: 0.022, delay: 0.04, type: 'triangle' })
  },

  /** The reading completing — the three notes gathered into one chord. */
  resolve() {
    tone({ frequency: 164.81, duration: 4.5, gain: 0.1 })
    tone({ frequency: 246.94, duration: 4, gain: 0.06, delay: 0.06 })
    tone({ frequency: 329.63, duration: 3.4, gain: 0.05, delay: 0.12 })
    tone({ frequency: 493.88, duration: 2.8, gain: 0.03, delay: 0.18 })
  },

  /** Smallest possible acknowledgement, for toggles and hovers. */
  tick() {
    burst({ duration: 0.045, frequency: 3200, q: 3, gain: 0.14 })
  },
}
