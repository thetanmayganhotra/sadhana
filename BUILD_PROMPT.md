# BUILD PROMPT — Guided Yoga Meditation & Pranayama App

> How to use this file: put it in the root of an empty project folder, open Claude Code there, and say:
> "Read BUILD_PROMPT.md fully. Then start Phase 0. Stop at the end of each phase, show me what you built, and wait for my go-ahead before the next phase."

---

## 0. Your role and how to work

You are the lead engineer building a production mobile app for iOS and Android from one codebase. I am the founder. I am a data engineer, comfortable with code, but new to mobile development.

Working rules:

1. **Build in the phases listed in Section 14, in order.** At the end of each phase, stop, summarize what was built, list anything unfinished, and wait for my approval.
2. **Before any decision not covered here** (a new library, a data model change, a paid service), ask me first, with 2 options and your recommendation.
3. **TypeScript strict mode everywhere.** No `any` unless justified in a comment.
4. **Write unit tests for all pure logic,** especially the session engine, the personalization rules, and the streak calculator. These are the core of the product.
5. **Never write content.** All practice instructions, traditional texts, research summaries, and safety rules are written and reviewed by humans (a certified yoga teacher and a clinical advisor). Use clearly marked placeholder content (`"[DRAFT – NEEDS TEACHER REVIEW]"`) and seed only the example content given in this file. **Do not invent traditional health claims, sources, dates, or research findings.**
6. **Never add health or medical claims** in UI text, store listings, or notifications (see Section 3).
7. Keep a `DECISIONS.md` file updated with every architectural decision and why.

---

## 1. Product summary

A subscription app of **guided classical yoga practices** — pranayama (breathwork) and meditation techniques from the Patanjali / Hatha yoga tradition — for the **US yoga and wellness audience** (English first; more languages later).

The core experience:

- The user tells the app **what they're dealing with** (states like "racing thoughts", "low energy mornings", "scattered focus") and gets a **personalized daily flow** of guided techniques.
- **Every practice is guided** by voice, synced with a breathing animation and haptics.
- The user can do **today's flow, any single technique, or their own custom flow** — all of it counts toward the day's practice and streak.
- A **Learn** section teaches each technique's origin, what the classical texts say about it (as history), what modern research shows, and its lineage.
- Design quality benchmark: **as clean, calm, and animated as Headspace**, but with its own visual identity rooted in simplified Indian miniature/manuscript art. **Do not copy Headspace's visual style, characters, or layouts.**

Positioning: *the classical yoga practice path, properly taught and personalized* — authentic, respectful of the tradition, modern in execution.

---

## 2. Target users

- Primary: US adults (25–50) who do yoga or are interested in meditation/breathwork, willing to pay for wellness apps.
- Secondary (later): yoga teachers who assign home practice to students; therapists who assign breathing homework to clients (a "teacher mode" — Phase 11, not MVP).

---

## 3. Legal and wording rules (hard constraints)

The app must stay in the US FDA "general wellness" category. This affects UI text, not just marketing.

**Allowed language:** stress, relaxation, calm, focus, concentration, sleep, energy, mood (general), wellbeing, balance.

**Forbidden in any UI text, notification, onboarding screen, store listing, or code-generated string:**
- Names of disorders or diagnoses: anxiety disorder, depression, ADHD, insomnia (as a condition), PTSD, bipolar, panic disorder, etc.
- Words: treat, cure, heal (a condition), therapy (as what the app is), diagnose, prescription, symptoms, patient.
- Any promise of recovery ("get well", "fix your anxiety").

**Implementation:** create `src/content/forbiddenTerms.ts` with the forbidden list, and a unit test that scans all English translation files and content JSON for these terms and fails the build if any appear. Traditional text claims in the Learn section are the only exception, and only inside the `fromTheTexts` field (see Section 8), which is always rendered with attribution and past-tense framing.

**Placement rule:** a traditional health claim (the `fromTheTexts` field) must never appear on the same screen as a Start Practice button, the paywall, or any purchase action. It appears only in the Learn tab and on a technique's "About" detail screen.

Required static screens: Terms, Privacy Policy, and a "This app supports general wellbeing and is not a substitute for professional care" notice in onboarding and Settings.

---

## 4. Tech stack

| Area | Choice |
|---|---|
| Framework | React Native with **Expo** (latest stable SDK), TypeScript, **expo-router** |
| Builds | **EAS Build** with development builds (Rive needs native code, so Expo Go is not enough) |
| Animation | **Rive** (`rive-react-native`) for breathing visuals; **Lottie** (`lottie-react-native`) for simple illustrated moments; **Reanimated** for UI transitions |
| Audio | Current recommended Expo audio library (`expo-audio`), with background audio enabled |
| Haptics | `expo-haptics` |
| Keep screen awake during sessions | `expo-keep-awake` |
| Local storage | `expo-sqlite` for practice history; MMKV (`react-native-mmkv`) for settings |
| State | Zustand |
| Backend | **Supabase** (auth, Postgres, storage for audio packs later) |
| Auth | Start anonymous (no signup wall). Offer Sign in with Apple / Google later to sync. |
| Subscriptions | **RevenueCat** (`react-native-purchases`) for both stores |
| i18n | `i18next` + `react-i18next` + `expo-localization` |
| Analytics | PostHog (privacy-friendly; no health-state data sent — see Section 12) |
| Crash reporting | Sentry |
| Voice generation | Offline Python pipeline (Section 9), **not** in the app |

---

## 5. App structure (tabs)

1. **Today** — the personalized flow for today, one big "Begin" button, today's progress ring, streak.
2. **Practice** — all techniques and all saved flows (built-in + custom), filterable by state and duration. "Create flow" button.
3. **Learn** — technique cards (origin, texts, research, lineage), "The Eight Limbs" visual journey, short history stories.
4. **Journey** — streak calendar, total minutes, the 12-week path progress, practice history.

Plus: onboarding/intake flow, session player (full-screen), paywall, settings (language, voice volume, background sound, haptics on/off, reminders, retake intake, safety answers, legal pages).

---

## 6. The session engine (the heart of the app)

**Do not use one pre-recorded audio file per session.** Sessions are **assembled at runtime** from short voice clips placed on a timeline.

### 6.1 Concepts

- **Clip:** a short pre-generated voice audio file (e.g. "inhale", "hold", "exhale through the left nostril", "welcome", counts, transitions). Identified by a `clipId`, stored per language.
- **Technique definition:** JSON describing a technique's phases, timing, and levels.
- **Timeline:** the engine's output — an ordered list of timed events.
- **Flow:** an ordered list of technique references (with level/duration overrides), joined by transition clips.
- **Session types:**
  - `assembled` — breathwork and timed practices built by the engine (most techniques).
  - `recorded` — continuous narrative meditations (e.g. yoga nidra, body scan). One audio file per language, played as-is, with chapter markers.

### 6.2 Technique definition schema

```ts
type Phase = {
  phase: 'inhale' | 'exhale' | 'hold_in' | 'hold_out' | 'hum' | 'rest' | 'silent' | 'instruction';
  seconds: number;              // duration of this phase
  cue?: string;                 // clipId played at phase start
  side?: 'left' | 'right' | 'both'; // for alternate-nostril techniques (drives animation + cue)
  haptic?: 'light' | 'medium' | 'none';
};

type LevelConfig = {
  level: 'beginner' | 'intermediate' | 'advanced';
  rounds: number;
  pattern: Phase[];             // one round
  restBetweenRoundsSeconds?: number;
};

type TechniqueDef = {
  id: string;                   // e.g. "nadi_shodhana"
  type: 'assembled' | 'recorded';
  sanskritName: string;         // "Nāḍī Śodhana"
  displayNameKey: string;       // i18n key → "Alternate Nostril Breathing"
  category: 'pranayama' | 'meditation' | 'shatkarma' | 'relaxation';
  states: StateId[];            // which user states it supports
  introClips: string[];         // setup instructions (posture, hand position)
  outroClips: string[];
  levels: LevelConfig[];
  containsBreathHold: boolean;  // used by safety rules
  intensity: 'gentle' | 'moderate' | 'vigorous';
  safetyFlags: SafetyFlagId[];  // conditions where this technique is excluded or modified
  recordedAudio?: { [lang: string]: string }; // only for type 'recorded'
  learnCardId: string;
  reviewStatus: 'draft' | 'teacher_reviewed';
};
```

### 6.3 Engine function

Write the engine as a **pure function** with no side effects so it is fully unit-testable:

```ts
buildTimeline(input: {
  items: FlowItem[];          // techniques with level + optional duration target
  user: UserSafetyProfile;    // from intake
  lang: string;
  settings: { backgroundSound: string | null; hapticsOn: boolean };
}): Timeline
```

`Timeline` = `{ totalSeconds, events: TimelineEvent[] }`, where each event is `{ atMs, type: 'clip'|'phase'|'haptic'|'section', payload }`.

Engine responsibilities:
1. Expand each technique's level into rounds.
2. **Apply safety modifications** (Section 7.3) — e.g. strip `hold_in`/`hold_out` phases, swap vigorous techniques for gentle alternatives.
3. Fit to a requested duration by adjusting rounds (never by changing breath ratios beyond the level's definition).
4. Insert intro, transitions between techniques ("Now let's move to humming bee breath…"), and outro.
5. Emit phase events that drive the animation and haptics from **the same clock** as audio.
6. Silence is created by the engine (gaps between events), not baked into clips.

### 6.4 Player

- One master clock (monotonic time). Audio clips, Rive animation state, and haptics are all triggered from timeline events against this clock. Target sync tolerance: under 100 ms.
- **Preload all clips** used by a timeline before the session starts (show a short "Preparing your practice" state).
- Background ambient layer (e.g. tanpura drone, soft rain) loops underneath at user-set volume.
- Controls: pause/resume, skip to next technique, end early, volume for voice vs. background.
- **Known technical risk — do a spike in Phase 1:** JS timers can be throttled when the phone is locked, which breaks precise clip timing. For the MVP, keep the screen awake during sessions (`expo-keep-awake`) and support "eyes closed" practice via haptics and audio. Then investigate and report back on options for locked-screen playback: (a) rendering the assembled timeline into a single audio file on-device, (b) server-side rendering with ffmpeg and caching, (c) a native audio scheduling module. Recommend one; don't implement without my approval.

### 6.5 Logging a practice

- A session is **logged** when the user completes it or plays at least 80% of it.
- Log: sessionId, techniqueIds, flowId (if any), startedAt, durationSeconds, completed (bool), source (`today_flow` | `single_technique` | `custom_flow`).
- **Any logged session counts** toward the day, whatever its source.
- **Day counts for streak** when the day's logged guided minutes ≥ 5 **or** at least one full session is completed. Put this rule in one constant file so I can change it.
- "Day" is based on the user's local time zone; a day ends at 3:00 AM local (so late-night practice counts for the previous day). Make this configurable.

---

## 7. Intake, states, and personalization

### 7.1 Intake flow (onboarding, ~6 screens, skippable parts marked)

1. Welcome + the wellness notice (Section 3).
2. "What are you dealing with lately?" — multi-select states (7.2). Max 3.
3. Experience level: new / some practice / regular practice.
4. Time available per day: 5 / 10 / 20 minutes.
5. Preferred time of day (for reminders).
6. **Safety questions** (7.3) — plain yes/no, with a one-line explanation of why we ask. Answers stay on the device by default.
7. Result screen: "Your practice path" preview → start first session (free).

### 7.2 States (English labels; all in i18n)

| stateId | Label |
|---|---|
| `racing_thoughts` | Racing thoughts |
| `stress_before_moments` | Stress before big moments |
| `cant_switch_off` | Can't switch off at night |
| `low_energy_mornings` | Low energy mornings |
| `feeling_flat` | Feeling flat or heavy |
| `hard_to_start` | Hard to get started |
| `scattered_focus` | Scattered focus |
| `restless_mind` | Restless mind |
| `waking_up_tired` | Waking up tired |
| `want_deeper_practice` | I want a deeper practice |

### 7.3 Safety profile and rules

Safety questions (yes/no): pregnant; high blood pressure or heart condition; epilepsy or seizures; history of panic attacks; recent surgery (abdomen/chest/eyes); ear infection currently; a history of trauma where some practices might feel overwhelming.

Rules are **data, not code**, stored in `src/content/safetyRules.json`, e.g.:

```json
[
  { "flag": "pregnant", "exclude": { "intensity": ["vigorous"], "containsBreathHold": true } },
  { "flag": "high_bp", "exclude": { "intensity": ["vigorous"], "containsBreathHold": true } },
  { "flag": "panic_history", "exclude": { "intensity": ["vigorous"] }, "maxHoldSeconds": 0 },
  { "flag": "trauma", "exclude": { "techniqueIds": [] }, "note": "prefer eyes-open options, shorter silent periods" },
  { "flag": "ear_infection", "exclude": { "techniqueIds": ["bhramari"] } }
]
```

These are **placeholders pending clinical/teacher review** — mark the file `reviewStatus: draft`.

Behavior:
- Excluded techniques are hidden from Today, show a lock with "Not recommended based on your answers" in Practice, and cannot be added to custom flows (explain why, and allow the user to update answers in Settings).
- The engine also applies modifications (e.g. removing holds) to allowed techniques.

### 7.4 Personalization rules (no AI in the MVP)

Personalization is a **deterministic lookup**, stored as data in `src/content/stateMap.json`:

```json
{
  "racing_thoughts": {
    "beginner":   ["sama_vritti", "bhramari", "so_hum"],
    "intermediate": ["nadi_shodhana", "bhramari", "trataka_dharana"]
  }
}
```

Algorithm for today's flow:
1. Take the user's selected states (max 3), experience level, and daily minutes.
2. Collect candidate techniques from the state map; remove anything excluded by safety rules.
3. Order: settle (gentle breath) → main practice → quiet close (silent sitting or so-hum).
4. Fit to daily minutes.
5. Rotate within candidates day to day so the flow isn't identical every day (seeded by date, so it's stable within a day).
6. Follow the **12-week path** (7.5) to gradually raise level and duration.

Put the algorithm in `src/engine/personalize.ts` as a pure function with tests. Later (Phase 12, not MVP), an AI layer may adjust flows based on post-session feedback, **only choosing from the vetted library, never generating instructions**.

### 7.5 The 12-week path

A structured progression mapping loosely to Patanjali's later limbs: weeks 1–3 body and breath (asana-awareness, pranayama basics) → weeks 4–6 withdrawing the senses (pratyahara) → weeks 7–9 concentration (dharana) → weeks 10–12 meditation (dhyana). Stored as data (`src/content/path.json`): each week has a theme, an unlock (new technique), and level/duration targets. Week content = placeholders pending teacher review.

After each session: a one-tap check-in ("How do you feel?" — calmer / same / more restless). Store locally; later use for adjusting flows.

---

## 8. Content model and the Learn tab

### 8.1 Technique Learn card

```ts
type LearnCard = {
  id: string;
  techniqueId: string;
  howTo: string;              // plain steps
  fromTheTexts: {             // HISTORY — always attributed, past tense
    text: string;
    source: string;           // e.g. "Hatha Yoga Pradipika, ch. 2"
    translationCredit: string; // public-domain or original translation only
  } | null;
  modernResearch: string;     // honest one-liner, incl. "evidence is limited" where true
  lineage: string;            // who shaped/taught it
  skipIf: string[];           // human-readable safety notes
  reviewStatus: 'draft' | 'teacher_reviewed' | 'scholar_reviewed';
};
```

UI: four clearly separated sections with headings **How to practice · From the texts · Modern research · Lineage**, plus a "Skip if" box. Display a small "Reviewed by [name, credential]" badge when `reviewStatus` is reviewed.

### 8.2 Seed example (use exactly this; everything else is placeholders)

```json
{
  "id": "learn_bhramari",
  "techniqueId": "bhramari",
  "howTo": "Sit comfortably. Inhale through the nose. Exhale slowly while making a steady humming sound, like a bee. Repeat 5–7 rounds.",
  "fromTheTexts": {
    "text": "Described in the Hatha Yoga Pradipika, which says the practice brings a feeling of bliss to the mind.",
    "source": "Hatha Yoga Pradipika, chapter 2",
    "translationCredit": "[DRAFT – NEEDS SCHOLAR REVIEW]"
  },
  "modernResearch": "Small studies suggest it may slow heart rate and support relaxation; larger trials are needed.",
  "lineage": "Part of the Hatha yoga tradition; widely taught today through schools such as the Bihar School of Yoga.",
  "skipIf": ["You have an active ear infection."],
  "reviewStatus": "draft"
}
```

### 8.3 Initial technique list (IDs and names only; content = placeholders)

Assembled: `dirga` (three-part breath), `sama_vritti` (equal breathing), `ujjayi`, `nadi_shodhana`, `bhramari`, `sheetali`, `sitkari`, `kapalabhati` (category **shatkarma**, intensity vigorous), `bhastrika` (vigorous), `so_hum` (mantra-breath meditation), `trataka_dharana` (candle/point gaze concentration), `silent_sitting`.
Recorded: `yoga_nidra_short`, `body_scan`.

### 8.4 Other Learn content

- **The Eight Limbs** — an illustrated vertical journey (yama, niyama, asana, pranayama, pratyahara, dharana, dhyana, samadhi), each with a short explanation (placeholder text) and links to related techniques.
- **Stories** — short illustrated history pieces (placeholder), e.g. on Patanjali as a compiler of earlier knowledge, the Hatha texts, and 20th-century teachers who brought yoga to scientific study and the West.
- Sanskrit names are shown in IAST (with diacritics) plus a tap-to-hear pronunciation clip.

### 8.5 Copyright rule for texts

Only use Sanskrit originals, **public-domain translations (published before 1929)**, or original translations commissioned by us. Store the `translationCredit` for every quote. Never paste modern copyrighted translations.

---

## 9. Voice pipeline (offline, outside the app)

Create `/voice-pipeline` (Python) that generates the clip library.

1. **Clip script** — `voice-pipeline/scripts/clips.csv` with columns:
   `clipId, lang, text, phoneticOverride, contextNoteForTranslators, maxDurationSec`
   e.g. `inhale_left, en, "Inhale through the left nostril.", , "calm, slow, warm", 3`
   Sanskrit words use `phoneticOverride` (e.g. "Naa-dee Show-dhuh-naa").
2. **Generator** — `generate.py --engine chatterbox|kokoro --lang en --voice <id>`:
   - Primary engine: **Chatterbox** (MIT license) with low emotion exaggeration for a calm, warm delivery; supports voice cloning from a short reference clip. **Only clone a voice with a signed written consent + contract**; store the consent reference in `voice-pipeline/CONSENT.md`.
   - Fallback: **Kokoro** (Apache 2.0).
   - Verify each model's license at the time of use and record it in `DECISIONS.md`.
   - Do not use models whose licenses prohibit commercial use.
3. **Post-processing** — normalize loudness (target around −16 LUFS for mobile), trim silence at both ends, 10 ms fades, export `.m4a` (AAC) mono.
4. **Output** — `app/assets/audio/<lang>/<clipId>.m4a` plus `manifest.json` (clipId → file, duration ms). The app reads durations from the manifest to build timelines.
5. **Human overrides** — if a file exists in `voice-pipeline/human/<lang>/<clipId>.wav` (e.g. a teacher recording Sanskrit names), use it instead of generating.
6. **A/B test script** — `ab_test.py` generates the same 5 test lines across candidate voices into a shuffled, anonymized folder for blind listening tests.

MVP bundles English audio inside the app. Later languages are downloadable packs from Supabase storage.

---

## 10. Custom flow builder

- Screen: "Create a flow" → pick techniques from the library (safety-excluded ones are locked) → drag to reorder → set level per technique → see live total duration → name it → save.
- Constraints: 1–8 techniques, total 3–60 minutes. Warn (don't block) if two vigorous techniques are placed back to back.
- Saved flows appear in Practice under "My flows" and play through the same engine with auto-inserted transitions.
- Stored locally; synced to Supabase if signed in.
- Free users: 1 custom flow. Subscribers: unlimited.

---

## 11. Design system

### 11.1 Visual identity
- Style: modern flat illustration inspired by **Indian miniature and manuscript art**, simplified — soft geometric shapes, gentle textures, no clutter. Commissioned illustrations will replace placeholders; build with placeholder shapes/colors until then.
- Lots of white space, large type, **max one primary button per screen**.
- Each state has one accent color (define tokens; e.g. cool blue for racing thoughts, warm saffron for low energy). Final palette TBD with the illustrator.

### 11.2 Tokens
Create `src/design/tokens.ts`: colors (light + dark mode), spacing scale (4-pt), radii, typography scale (one serif for headings with Devanagari/IAST diacritic support, one clean sans for body — confirm fonts with me), motion durations (fast 150 ms, base 250 ms, slow 400 ms, easing curves).

### 11.3 Animation
- **Breathing visual (Rive):** a central shape that expands on inhale, holds still on hold, contracts on exhale, driven by Rive state machine inputs (`phase`, `progress 0–1`, `side`). For alternate-nostril practice, the left/right side glows. Build a simple placeholder Rive file first; the final art replaces it.
- Screen transitions: soft fades and gentle scale, never bouncy.
- Respect the OS "Reduce Motion" setting: replace motion with opacity changes.

### 11.4 Accessibility
Dynamic type support, minimum 4.5:1 contrast, screen-reader labels on all controls, captions (text of the current cue) optionally shown during sessions.

---

## 12. Privacy and data

- Intake answers (states + safety answers) are **stored on-device by default**. They're only synced if the user signs in and explicitly opts in.
- **Never send states, safety answers, or check-in feelings to analytics.** Analytics only gets anonymous product events: `session_started`, `session_completed` (duration, source), `flow_created`, `paywall_viewed`, `trial_started`, etc.
- Provide "Delete my data" in Settings (local + server).

---

## 13. Monetization

- **Free:** intake, the first 3 days of the personalized flow, 3 basic techniques always free, Learn tab previews.
- **Subscription (via RevenueCat):** monthly and yearly with free trial. Price points configured remotely in RevenueCat (starting assumption: $9.99/month, $59.99/year — I will set final prices).
- Paywall appears after day 3's session or when tapping a locked item. Clean, one screen, no dark patterns, clear trial terms, restore purchases button.
- Regional pricing configured in the stores (not in code).

---

## 14. Build phases and acceptance criteria

**Phase 0 — Setup**
Expo + TypeScript + expo-router project, EAS dev build config for iOS and Android, folder structure (below), ESLint/Prettier, Jest, tokens file, i18n wired with English strings, forbidden-terms test.
✅ App runs on iOS simulator and Android emulator via dev build; tests pass.

**Phase 1 — Session engine + player (most important)**
Technique schema, `buildTimeline()` with tests, player with master clock, placeholder clips (use any TTS locally), placeholder Rive breathing animation, haptics, background sound layer, keep-awake. Locked-screen spike report.
✅ Play a 3-minute Nadi Shodhana beginner session where voice, animation, and haptics stay in sync within 100 ms for the full session; tests cover safety modifications and duration fitting.

**Phase 2 — Content structure**
Technique definitions for all IDs in 8.3 (placeholder content), learn cards (Bhramari seed + placeholders), safety rules, state map, path JSON. Content validation script (schema check + forbidden terms).
✅ Every technique plays end-to-end with placeholder clips.

**Phase 3 — Onboarding + Today**
Intake flow, safety profile, `personalize()` with tests, Today screen.
✅ Different intake answers produce different, safe flows; excluded techniques never appear.

**Phase 4 — Practice tab + custom flows**
Library with filters, technique detail, flow builder, "My flows".
✅ A custom 4-technique flow plays with automatic transitions.

**Phase 5 — Logging + Journey**
SQLite history, streak rule, day boundary, Journey screen, post-session check-in.
✅ Streak tests cover: time zones, the 3 AM boundary, partial sessions, multiple sessions per day.

**Phase 6 — Learn tab**
Learn cards UI, Eight Limbs journey, stories, pronunciation clips. Placement rule enforced (no claims near purchase or Start buttons).
✅ Learn content renders with correct section separation.

**Phase 7 — Subscriptions**
RevenueCat integration (sandbox), paywall, entitlements gating, restore purchases.
✅ Sandbox purchase unlocks premium on both platforms.

**Phase 8 — Voice pipeline**
Python pipeline per Section 9, A/B test script, manifest integration.
✅ Running the pipeline regenerates all English clips and the app plays them.

**Phase 9 — Accounts + sync**
Anonymous → Sign in with Apple/Google, Supabase sync of history and custom flows, delete-my-data.

**Phase 10 — Polish and release prep**
Reduce motion, accessibility pass, reminders (notification text passes the forbidden-terms check), Sentry, PostHog, store screenshots checklist, privacy labels, app review notes.
✅ TestFlight and Play internal testing builds uploaded.

**Later (don't build yet):** Phase 11 teacher/therapist "assign a practice" mode; Phase 12 AI-adjusted flows (choosing only from the vetted library); Phase 13 additional languages as downloadable packs.

---

## 15. Folder structure

```
/app                   expo-router screens
  /(tabs)/today.tsx, practice.tsx, learn.tsx, journey.tsx
  /onboarding/*
  /session/[id].tsx
  /flow-builder.tsx
  /paywall.tsx
  /settings/*
/src
  /engine              buildTimeline.ts, personalize.ts, streak.ts (+ __tests__)
  /player              clock.ts, audioPlayer.ts, hapticsDriver.ts, riveDriver.ts
  /content             techniques/*.json, learn/*.json, stateMap.json, safetyRules.json,
                       path.json, forbiddenTerms.ts, validate.ts
  /design              tokens.ts, components/*
  /i18n                en.json (later de.json, es.json ...)
  /store               zustand stores
  /data                sqlite.ts, supabase.ts, revenuecat.ts
/assets
  /audio/en/*.m4a, manifest.json
  /rive/*.riv
  /lottie/*.json
/voice-pipeline        Python generator, scripts/clips.csv, human/, CONSENT.md
DECISIONS.md
BUILD_PROMPT.md
```

---

## 16. Things you must NOT do

- Don't generate practice instructions, traditional claims, research summaries, or safety rules as final content — placeholders only.
- Don't use disorder names or treatment language anywhere (Section 3).
- Don't copy Headspace's (or any other app's) illustrations, characters, or layouts.
- Don't send health-related user answers to analytics or third parties.
- Don't use a TTS model or voice without verifying its commercial license, and never clone a voice without signed consent.
- Don't use copyrighted modern translations of classical texts.
- Don't add libraries or paid services without asking.
- Don't skip tests for the engine, personalization, safety rules, or streak logic.

Start with Phase 0.
