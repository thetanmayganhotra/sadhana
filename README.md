# Sadhana (mobile)

A mobile app of guided classical yoga practices — pranayama (breathwork) and meditation from the Patanjali / Hatha yoga tradition. You tell it what you're dealing with ("racing thoughts", "low energy mornings", "scattered focus") and it builds a personalised daily flow of guided techniques.

Built with **Expo (SDK 57) + expo-router** for iOS and Android. Work in progress.

- Full product spec: [BUILD_PROMPT.md](BUILD_PROMPT.md)
- Every architecture decision and why: [DECISIONS.md](DECISIONS.md)

## Run it

This app uses **development builds** (`expo-dev-client`), not Expo Go.

```bash
npm install
npm run ios          # or: npm run android
npm start            # dev server for an installed dev build
npm run web
```

Checks:

```bash
npm run check        # typecheck + lint + tests
npm test
npm run format
```

EAS build profiles (`development`, `development-device`, `preview`, `production`) are in `eas.json`.

## Layout

```
app/                  routes (expo-router): Today, Practice, Journey, Learn
src/
  engine/             session engine + personalisation rules
  content/            practice content + forbidden-terms check (no medical claims)
  design/             tokens, theme, components (Yantra, Ornament, FadeIn…)
  i18n/               i18next (English for now, type-checked keys)
  player/ store/ data/
voice-pipeline/       tooling for the guided voice
```

## Rules the code enforces

- **No health or medical claims** in any UI text. A Jest test scans all content and translation files against `src/content/forbiddenTerms.ts`.
- TypeScript strict + `noUncheckedIndexedAccess`; `any` is a lint error.
- Practice content is placeholder until a teacher and clinical advisor review it.

## Stack

Expo · expo-router · React Native · TypeScript · Reanimated · i18next · Jest

## License

See [LICENSE](LICENSE).
