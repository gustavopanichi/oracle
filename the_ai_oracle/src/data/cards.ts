/* ---------------------------------------------------------------------------
   Card content.
   This file is the single source of truth for the deck. To edit the reading,
   edit here — nothing else needs to change, as long as every card's `id` has a
   matching sigil registered in src/illustrations/index.ts.
--------------------------------------------------------------------------- */

export type DeckId = 'focus' | 'goal' | 'twist'

export interface Card {
  /** Stable key. Also the lookup key for the card's sigil and its artwork. */
  id: string
  deck: DeckId
  /** Large, actionable, deliberately plain-spoken. */
  title: string
  /** One short sentence. Shown under the card, not on it. */
  prompt: string
  /** The longer read, behind the card's help dot: what the card is asking for. */
  detail: string
  /** One concrete illustration of the card, without prescribing an answer. */
  example: string
}

export interface Deck {
  id: DeckId
  /** The number the position carries in the spread: 01, 02, 03. */
  index: string
  /** Shown under the card slot and as the card's own category label. */
  label: string
  /** The plain-English question this position answers. */
  question: string
  cards: Card[]
}

const focus: Card[] = [
  {
    id: 'sketchdeck', deck: 'focus', title: 'SketchDeck',
    prompt: 'Create something for us.',
    detail: 'Think about SketchDeck itself — our people, culture, processes, knowledge, services, or how we operate.',
    example: 'A new way for everyone to discover what other teams are creating.',
  },
  {
    id: 'a-client', deck: 'focus', title: 'A Client',
    prompt: 'Choose a SketchDeck client.',
    detail: 'Choose any SketchDeck client and use them as your playground. Think beyond what they’re currently asking us to do.',
    example: 'An unexpected interactive experience that brings one of their brand ideas to life.',
  },
  {
    id: 'a-real-project', deck: 'focus', title: 'A Real Project',
    prompt: 'Start with something we’ve already made.',
    detail: 'Start with something we’ve actually worked on and imagine what else it could become with AI.',
    example: 'Take a campaign we delivered and turn it into something personalized or interactive.',
  },
  {
    id: 'the-client-experience', deck: 'focus', title: 'The Client Experience',
    prompt: 'Rethink an interaction with SketchDeck.',
    detail: 'Think about what it’s like to work with SketchDeck — from the first conversation to final delivery and beyond.',
    example: 'A completely new way for clients to explore creative directions.',
  },
  {
    id: 'the-creative-process', deck: 'focus', title: 'The Creative Process',
    prompt: 'Change how creative work gets made.',
    detail: 'Explore how ideas are imagined, developed, challenged, designed, or produced.',
    example: 'Something that helps a team explore ten unexpected directions from one initial concept.',
  },
  {
    id: 'a-brand', deck: 'focus', title: 'A Brand',
    prompt: 'Explore its identity, personality, or audience.',
    detail: 'Pick a brand and explore its identity, personality, audience, content, or world.',
    example: 'An experience where the brand responds differently to different people.',
  },
  {
    id: 'a-presentation', deck: 'focus', title: 'A Presentation',
    prompt: 'Rethink what a presentation could be.',
    detail: 'Start with the idea of a presentation — but don’t assume the answer has to be slides.',
    example: 'Turn a traditional sales deck into an interactive conversation.',
  },
  {
    id: 'a-campaign', deck: 'focus', title: 'A Campaign',
    prompt: 'Explore a new kind of campaign experience.',
    detail: 'Think about how a campaign could behave differently when AI becomes part of the creative idea.',
    example: 'One campaign concept that creates a unique execution for every viewer.',
  },
  {
    id: 'an-event', deck: 'focus', title: 'An Event',
    prompt: 'Create something for a physical or digital event.',
    detail: 'Create something for a physical, virtual, or hybrid experience where people are gathered together.',
    example: 'An installation that reacts live to what attendees are doing.',
  },
  {
    id: 'a-client-brief', deck: 'focus', title: 'A Client Brief',
    prompt: 'Start with a real client ask.',
    detail: 'Take a real client ask and use AI to interpret it in a way we normally wouldn’t.',
    example: 'Turn a straightforward “create a launch campaign” brief into a playable experience.',
  },
  {
    id: 'a-boring-task', deck: 'focus', title: 'A Boring Task',
    prompt: 'Find something tedious worth reinventing.',
    detail: 'Find something repetitive, tedious, confusing, or just deeply unexciting — and make it interesting.',
    example: 'Turn filling out a project brief into a conversation that actually feels enjoyable.',
  },
  {
    id: 'our-work', deck: 'focus', title: 'Our Work',
    prompt: 'Change how SketchDeck work is experienced or shared.',
    detail: 'Explore how SketchDeck’s creative work gets discovered, presented, shared, or experienced.',
    example: 'Let someone describe what they’re looking for and dynamically build them a personalized portfolio.',
  },
]

const goal: Card[] = [
  {
    id: 'wow-a-client', deck: 'goal', title: 'Wow a Client',
    prompt: 'Create something they wouldn’t expect from us.',
    detail: 'Make something that changes what a client thinks SketchDeck is capable of doing.',
    example: 'Instead of pitching an experiential idea, actually build a working version they can play with.',
  },
  {
    id: 'save-time', deck: 'goal', title: 'Save Time',
    prompt: 'Turn something slow into something fast.',
    detail: 'Find something that takes far too long today and dramatically compress it.',
    example: 'Turn hours of searching through previous projects into a 30-second conversation.',
  },
  {
    id: 'create-a-superpower', deck: 'goal', title: 'Create a Superpower',
    prompt: 'Give someone an ability they don’t have today.',
    detail: 'Give someone an ability they simply don’t have today. Think beyond just making an existing task faster.',
    example: 'Let a creative director instantly see how one idea might work across 20 different audiences.',
  },
  {
    id: 'remove-the-boring-part', deck: 'goal', title: 'Remove the Boring Part',
    prompt: 'Let AI handle something humans shouldn’t have to.',
    detail: 'Find the part of a task nobody actually enjoys doing and let AI take care of it.',
    example: 'Automatically organize messy project inputs so a designer can start with the interesting part.',
  },
  {
    id: 'create-something-new', deck: 'goal', title: 'Create Something New',
    prompt: 'Imagine something SketchDeck doesn’t offer today.',
    detail: 'Imagine a service, product, experience, or creative deliverable SketchDeck doesn’t offer today.',
    example: 'An AI-powered brand experience clients could launch alongside a campaign.',
  },
  {
    id: 'solve-a-pain-point', deck: 'goal', title: 'Solve a Pain Point',
    prompt: 'Fix something genuinely frustrating.',
    detail: 'Pick something that regularly frustrates people and see if you can make it disappear.',
    example: 'Eliminate the endless back-and-forth required to understand exactly what a client means by their feedback.',
  },
  {
    id: 'make-it-better', deck: 'goal', title: 'Make It Better',
    prompt: 'Take something we already do and transform it.',
    detail: 'Start with something that already works and ask what AI could fundamentally improve about it.',
    example: 'Make a brand guideline respond to questions and generate examples instead of just being read.',
  },
  {
    id: 'make-it-easier', deck: 'goal', title: 'Make It Easier',
    prompt: 'Remove friction or complexity.',
    detail: 'Remove steps, confusion, decisions, or unnecessary complexity from an experience.',
    example: 'Let someone explain what they need naturally instead of completing a complicated form.',
  },
  {
    id: 'make-it-memorable', deck: 'goal', title: 'Make It Memorable',
    prompt: 'Create an experience people remember.',
    detail: 'Optimize for the thing people will remember, talk about, or want to show someone else.',
    example: 'Turn a standard client deliverable into a personalized reveal experience.',
  },
  {
    id: 'help-someone-decide', deck: 'goal', title: 'Help Someone Decide',
    prompt: 'Turn complexity into clarity.',
    detail: 'Use AI to make complicated information easier to understand, compare, or act on.',
    example: 'Let a client explore the trade-offs between three creative directions interactively.',
  },
  {
    id: 'get-people-involved', deck: 'goal', title: 'Get People Involved',
    prompt: 'Turn an audience into participants.',
    detail: 'Don’t create something people simply consume — give them a role in what happens.',
    example: 'Let an event audience collectively influence the creative appearing on screen.',
  },
  {
    id: 'do-the-impossible', deck: 'goal', title: 'Do the Impossible',
    prompt: 'Try something that used to require too much time, money, or expertise.',
    detail: 'Try something we previously wouldn’t have attempted because it required too much time, budget, production, or specialist knowledge.',
    example: 'Build a functioning interactive client prototype in two hours instead of pitching what it could eventually become.',
  },
]

const twist: Card[] = [
  {
    id: 'make-it-playable', deck: 'twist', title: 'Make It Playable',
    prompt: 'Turn it into something people can play with.',
    detail: 'Introduce interaction, rules, discovery, choices, challenges, or rewards. It doesn’t have to literally become a game.',
    example: 'Instead of browsing a brand’s history, let people explore it by making choices.',
  },
  {
    id: 'make-it-personal', deck: 'twist', title: 'Make It Personal',
    prompt: 'Make the experience different for every person.',
    detail: 'Use something about the person interacting with it to change what they experience.',
    example: 'The same campaign generates completely different creative depending on someone’s interests.',
  },
  {
    id: 'make-it-alive', deck: 'twist', title: 'Make It Alive',
    prompt: 'Let it change and evolve.',
    detail: 'Don’t let the experience stay static. Let it respond, evolve, learn, or change over time.',
    example: 'A piece of creative that continuously evolves based on how people interact with it.',
  },
  {
    id: 'give-it-a-personality', deck: 'twist', title: 'Give It a Personality',
    prompt: 'Make it behave like a character.',
    detail: 'Make the thing feel like it has a point of view, behavior, voice, or character of its own.',
    example: 'Turn a brand guideline into a brand character you can actually debate ideas with.',
  },
  {
    id: 'break-the-format', deck: 'twist', title: 'Break the Format',
    prompt: 'Don’t make the obvious deliverable.',
    detail: 'Question the obvious deliverable. If your first instinct is “website,” “deck,” or “chatbot,” try something else.',
    example: 'Instead of presenting a campaign concept in slides, let the client experience the campaign itself.',
  },
  {
    id: 'make-the-invisible-visible', deck: 'twist', title: 'Make the Invisible Visible',
    prompt: 'Reveal something people normally can’t see.',
    detail: 'Reveal information, patterns, relationships, emotions, or processes that are normally hidden.',
    example: 'Visualize how a client’s feedback has changed the creative direction across an entire project.',
  },
  {
    id: 'let-it-talk', deck: 'twist', title: 'Let It Talk',
    prompt: 'Use conversation or voice.',
    detail: 'Use language, conversation, or voice as part of the experience.',
    example: 'Let someone talk naturally to a brand instead of navigating its website.',
  },
  {
    id: 'let-it-see', deck: 'twist', title: 'Let It See',
    prompt: 'Use images, cameras, or visual understanding.',
    detail: 'Give the experience visual awareness through images, cameras, screenshots, or other visual inputs.',
    example: 'Point a camera at something and have the brand transform what it sees.',
  },
  {
    id: 'make-it-real-time', deck: 'twist', title: 'Make It Real-Time',
    prompt: 'Let people watch it happen.',
    detail: 'Don’t pre-generate everything. Make part of the experience happen live in response to what’s happening now.',
    example: 'An event visual that continuously reacts to what the audience is saying.',
  },
  {
    id: 'one-to-many', deck: 'twist', title: 'One → Many',
    prompt: 'Turn one input into many different outputs.',
    detail: 'Start with one input and use AI’s scale to create a huge variety of outputs.',
    example: 'Turn one campaign concept into 100 executions tailored to different audiences and contexts.',
  },
  {
    id: 'never-the-same-twice', deck: 'twist', title: 'Never the Same Twice',
    prompt: 'Make every output unique.',
    detail: 'Design variability into the idea so every interaction can produce something different.',
    example: 'Every visitor receives a unique piece of brand artwork generated just for them.',
  },
  {
    id: 'take-it-too-far', deck: 'twist', title: 'Take It Too Far',
    prompt: 'Push the idea beyond what’s reasonable.',
    detail: 'Find the ambitious or slightly ridiculous version of your idea before worrying about practicality.',
    example: 'Don’t just personalize the headline — personalize the entire campaign universe.',
  },
  {
    id: 'remove-the-screen', deck: 'twist', title: 'Remove the Screen',
    prompt: 'Imagine it without a traditional interface.',
    detail: 'Imagine the idea living somewhere other than a traditional website, app, or computer interface.',
    example: 'Use voice, physical objects, printed material, projections, or an installation as the interaction.',
  },
  {
    id: 'make-it-social', deck: 'twist', title: 'Make It Social',
    prompt: 'Make people experience it together.',
    detail: 'Make other people an essential part of the experience. Think collaboration, competition, sharing, or collective creation.',
    example: 'The output only becomes complete once five different people contribute to it.',
  },
  {
    id: 'make-it-emotional', deck: 'twist', title: 'Make It Emotional',
    prompt: 'Design for a feeling, not just a function.',
    detail: 'Start with the feeling you want to create rather than the function you want to perform.',
    example: 'Instead of making an onboarding experience more efficient, make someone’s first day feel genuinely exciting.',
  },
  {
    id: 'make-it-weird', deck: 'twist', title: 'Make It Weird',
    prompt: 'Choose the less obvious direction.',
    detail: 'Ignore the safest interpretation. Combine things that don’t normally belong together and see where it takes you.',
    example: 'What if a financial-services brand behaved like a video game, fortune teller, or dating app?',
  },
  {
    id: 'thirty-seconds', deck: 'twist', title: '30 Seconds',
    prompt: 'Make it work with almost no attention.',
    detail: 'Assume you have almost none of someone’s attention. Strip the idea down to its most immediate and compelling interaction.',
    example: 'Give a client one button that produces an instant “holy shit” moment.',
  },
  {
    id: 'human-plus-ai', deck: 'twist', title: 'Human + AI',
    prompt: 'Design it so both are essential.',
    detail: 'Don’t simply hand the job to AI. Design something where the human brings something essential and AI brings something humans can’t easily do alone.',
    example: 'A designer makes the creative decision, while AI instantly explores hundreds of expressions of that decision.',
  },
]

export const DECKS: Deck[] = [
  {
    id: 'focus',
    index: '01',
    label: 'Your Focus',
    question: 'What are you working with?',
    cards: focus,
  },
  {
    id: 'goal',
    index: '02',
    label: 'Your Goal',
    question: 'What are you trying to achieve?',
    cards: goal,
  },
  {
    id: 'twist',
    index: '03',
    label: 'Your Twist',
    question: 'How will you push the idea?',
    cards: twist,
  },
]

export const DECK_BY_ID: Record<DeckId, Deck> = {
  focus: DECKS[0],
  goal: DECKS[1],
  twist: DECKS[2],
}

export const ALL_CARDS: Card[] = [...focus, ...goal, ...twist]

/** Roman numeral. Covers the whole deck, so it needs the forties. */
const ROMAN: [number, string][] = [
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

export function roman(n: number): string {
  let rest = n
  let out = ''
  for (const [value, glyph] of ROMAN) {
    while (rest >= value) {
      out += glyph
      rest -= value
    }
  }
  return out
}

/**
 * The numeral printed on a card. Numbered across the whole deck rather than
 * per deck, so no two cards in a spread can ever show the same numeral.
 */
export function cardNumeral(card: Card): string {
  return roman(ALL_CARDS.findIndex((c) => c.id === card.id) + 1)
}
