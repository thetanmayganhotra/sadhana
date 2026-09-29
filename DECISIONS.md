# Decisions

Newest at the bottom. Each entry: what, why, and what would change it.

## 2026-09-29 — Phase 0

**D1. Separate repo at `~/Desktop/sadhana`.** The build prompt assumes an empty folder; the
original working folder held the Monty app and other projects. Founder chose a new sibling repo.

**D2. Expo SDK 57 (latest stable), React Native 0.86, React 19.2, TypeScript 6.** Created with
`create-expo-app --template blank-typescript@sdk-57`; all Expo packages added via `npx expo install`
so versions match the SDK. `expo-doctor`: 21/21 checks pass.

**D3. Routes live in `/app` at the repo root** (as in BUILD_PROMPT §15), not `src/app/` (the
template's AGENTS.md default). Both are supported by expo-router; we follow the spec. Non-route code
stays in `/src`.

**D4. Development builds only (`expo-dev-client`), never Expo Go.** Rive needs native code.
`npm run ios` / `npm run android` = `expo run:*` (local native build); `eas.json` has
`development` (iOS simulator + Android APK), `development-device`, `preview`, `production` profiles.

**D5. Bundle ID / package `com.tanmayganhotra.sadhana` — placeholder.** Change before the first
store build (it can't be changed after a store listing exists).

**D6. TypeScript strict + `noUncheckedIndexedAccess`.** Array/record lookups return `T | undefined`,
which matters for the engine (phase patterns, level lookups). ESLint bans `any` as an error.
TS 6 no longer auto-includes `@types/*`, so `tsconfig.types` lists `jest` and `node`.

**D7. Testing: `jest-expo` preset + `@testing-library/react-native`** (Expo's documented setup;
`react-test-renderer` doesn't support React 19). `@/` path alias maps to `src/` in both TS and Jest.

**D8. Lint/format: `eslint-config-expo` flat config + Prettier** via `eslint-plugin-prettier`.
`npm run check` = typecheck + lint + tests.

**D9. i18n: `i18next` + `react-i18next` + `expo-localization`.** English only; device language
falls back to `en`. Translation keys are type-checked against `en.json` (`src/i18n/i18next.d.ts`).

**D10. Forbidden-terms enforcement (§3).** `src/content/forbiddenTerms.ts` holds the list and a
whole-word, case-insensitive matcher. A Jest test scans every `.json` under `src/i18n` and
`src/content`, skipping only `fromTheTexts`. Chosen beyond the literal spec list: inflections
(`treats`, `healing`, `diagnosis`…), `disorder`, `ocd`, `therapeutic`, `recover/recovery`.
Deliberately **not** included: `add` (common verb), `clinical` (would block reviewer credentials),
bare `anxiety`/`panic` (needed for safety intake wording — revisit with the clinical advisor).
Notification text and store listing copy must be added to the scanned set when they exist (Phase 10).

**D11. Design tokens are placeholders** (warm manuscript paper, ink, mineral-pigment accents).
A unit test enforces WCAG 4.5:1 for text pairs and every state accent on the background in both
light and dark mode — it already caught one failing saffron value. Fonts are system defaults until
the serif (IAST + Devanagari) and sans are confirmed.

## 2026-09-29 — Visual direction v2

**D12. Palette switched to miniature-painting pigments** (founder feedback: v1 wasn't pretty
enough; Headspace-level warmth as the bar, without copying it). Lapis blue for hero cards,
marigold for the primary button, vermilion/rose/malachite/peacock as illustration pigments,
warm ivory background. Dark mode is a deep night indigo rather than black. Headspace's
signature orange is deliberately not the primary colour. State accents are now `{ fill, soft }`
pairs: vivid `fill` for decoration only, `soft` tints must carry body text at 4.5:1 (tested).

**D13. Today screen design preview uses static data** (`PREVIEW` in `app/(tabs)/today.tsx`) until
`personalize()` and the practice log exist. The arch illustration and tab icons are plain View
shapes, placeholders until commissioned art and an icon set are chosen.

**D14. `react-native-web` added for browser previews only** (no simulator on the dev machine).

## 2026-09-29 — Visual direction v3: "Vedic minimal"

**D15. v2 was rejected as too close to Headspace** (saturated blocks, cartoon sun, yellow CTA).
v3 supersedes D12/D13's look: sandalwood paper `#F4EEE3`, kohl ink, a single kumkum-red primary,
thin temple-gold line-work, generous empty space. Dark mode is a lamp-lit night (warm near-black
+ gold). Colour is sparse; line and type carry the identity.

**D16. Fonts (approved by founder):** Cormorant Garamond (headings + all Sanskrit/IAST — verified it
covers every IAST diacritic), Jost (body/UI — verified it does NOT cover ṛ ṣ ṇ ṭ ḍ ṃ ḥ, so IAST must
always use the `sanskrit` text variant), Tiro Devanagari Sanskrit (Devanagari). All via
`@expo-google-fonts/*` (OFL). Loaded in `app/_layout.tsx`; the app holds on a blank page of the
background colour until they load. No `fontWeight` on custom fonts — each weight is its own family.

**D17. Motion language:** everything breath-paced and eased (sine in-out / soft ease-out), no
springs. Screens enter with a staggered 900 ms fade + 10 pt drift (`FadeIn`). The Today yantra
breathes (5 s in, 5 s out), its lotus drifts one turn per 2 min, the bindu glows with the breath.
Tabs cross-fade. Reduce Motion: no movement, opacity only. All built on Reanimated (already a dep).

**D18. Yantra and tab icons are placeholders drawn with plain Views** (no SVG dependency yet).
If the final art needs curves Views can't draw, the choice is react-native-svg vs Rive — to decide
with the illustrator.
