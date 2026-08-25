import type { FC } from 'react'
import * as focus from './focus'
import * as goals from './goals'
import * as twists from './twists'
import { ALL_CARDS } from '../data/cards'

export { Sigil } from './Sigil'

/** card.id -> the sigil drawn on that card. One unique illustration per card. */
export const SIGILS: Record<string, FC> = {
  // 01 — Your Focus
  'sketchdeck': focus.Sketchdeck,
  'a-client': focus.AClient,
  'a-real-project': focus.ARealProject,
  'the-client-experience': focus.TheClientExperience,
  'the-creative-process': focus.TheCreativeProcess,
  'a-brand': focus.ABrand,
  'a-presentation': focus.APresentation,
  'a-campaign': focus.ACampaign,
  'an-event': focus.AnEvent,
  'a-client-brief': focus.AClientBrief,
  'a-boring-task': focus.ABoringTask,
  'our-work': focus.OurWork,

  // 02 — Your Goal
  'wow-a-client': goals.WowAClient,
  'save-time': goals.SaveTime,
  'create-a-superpower': goals.CreateASuperpower,
  'remove-the-boring-part': goals.RemoveTheBoringPart,
  'create-something-new': goals.CreateSomethingNew,
  'solve-a-pain-point': goals.SolveAPainPoint,
  'make-it-better': goals.MakeItBetter,
  'make-it-easier': goals.MakeItEasier,
  'make-it-memorable': goals.MakeItMemorable,
  'help-someone-decide': goals.HelpSomeoneDecide,
  'get-people-involved': goals.GetPeopleInvolved,
  'do-the-impossible': goals.DoTheImpossible,

  // 03 — Your Twist
  'make-it-playable': twists.MakeItPlayable,
  'make-it-personal': twists.MakeItPersonal,
  'make-it-alive': twists.MakeItAlive,
  'give-it-a-personality': twists.GiveItAPersonality,
  'break-the-format': twists.BreakTheFormat,
  'make-the-invisible-visible': twists.MakeTheInvisibleVisible,
  'let-it-talk': twists.LetItTalk,
  'let-it-see': twists.LetItSee,
  'make-it-real-time': twists.MakeItRealTime,
  'one-to-many': twists.OneToMany,
  'never-the-same-twice': twists.NeverTheSameTwice,
  'take-it-too-far': twists.TakeItTooFar,
  'remove-the-screen': twists.RemoveTheScreen,
  'make-it-social': twists.MakeItSocial,
  'make-it-emotional': twists.MakeItEmotional,
  'make-it-weird': twists.MakeItWeird,
  'thirty-seconds': twists.ThirtySeconds,
  'human-plus-ai': twists.HumanPlusAI,
}

if (import.meta.env.DEV) {
  const missing = ALL_CARDS.filter((c) => !SIGILS[c.id]).map((c) => c.id)
  const orphaned = Object.keys(SIGILS).filter((id) => !ALL_CARDS.some((c) => c.id === id))
  const duplicated = Object.entries(
    Object.entries(SIGILS).reduce<Record<string, string[]>>((acc, [id, fn]) => {
      const key = fn.name || id
      ;(acc[key] ??= []).push(id)
      return acc
    }, {}),
  ).filter(([, ids]) => ids.length > 1)

  if (missing.length) console.error('[oracle] cards with no sigil:', missing)
  if (orphaned.length) console.error('[oracle] sigils with no card:', orphaned)
  if (duplicated.length) console.error('[oracle] sigil reused across cards:', duplicated)
}
