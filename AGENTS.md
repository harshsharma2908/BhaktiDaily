# Bhakti Daily — agent guide

This is an Android-first, Hindi-first Hindu devotional companion built with Expo, React Native,
TypeScript and Expo Router. Prioritise mobile-first patterns, performance, accessibility and
cross-platform compatibility.

## Project context

- **Expo SDK 58** (`expo@~58.0.16`), **React Native 0.88**, **React 19.3**, **TypeScript 6 strict**.
- Routes live in `src/app/`; non-route code lives outside it.
- Native tabs are used on Android/iOS. Web uses the headless tabs in `src/components/app-tabs.web.tsx`.
- The design system lives in `src/constants/theme.ts` and `src/constants/typography.ts`.
- Day 1 built the navigation and design foundation; Day 2 added the full UI for all five
  destinations using labelled sample data. Do not add verified religious content or persistence
  without the product owner's approval.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or
removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with
   corrections to common LLM misconceptions. Follow its links to the specific page you need; never
   answer from memory.

Useful SDK 58 references:

- Native tabs: https://docs.expo.dev/router/advanced/native-tabs.md
- Custom/headless tabs: https://docs.expo.dev/router/advanced/custom-tabs.md
- Symbols: https://docs.expo.dev/versions/latest/sdk/symbols.md
- Fonts: https://docs.expo.dev/develop/user-interface/fonts.md
- Testing: https://docs.expo.dev/develop/unit-testing.md

## Commands

Use `bunx` instead of `npx` only if the project later adds `bun.lock`. This project currently uses
npm and has `package-lock.json`.

```bash
npm install                 # install dependencies
npm run start               # start the Expo dev server
npm run android             # start and open Android
npm run web                 # start the web version
npm run lint                # ESLint (expo lint)
npm run typecheck           # tsc --noEmit
npm run check               # typecheck, then lint
npx expo-doctor             # dependency/config diagnosis
npx expo install <package>  # ALWAYS use for Expo packages
npx expo export --platform android   # verify the native bundle
```

Run `npm run check` before declaring any task done. Do not claim a build, test or device launch
passed unless it actually ran in this environment.

## Navigation & routing

- Use **Expo Router** for all navigation.
- Every file in `src/app/` is a route; `_layout.tsx` files define navigators.
- Keep non-route code (components, hooks, utils, data) outside `src/app/`.
- Import `Link`, `router`, `Href` and `useLocalSearchParams` from `expo-router`.
- Typed routes are enabled. After adding or renaming a route, run `npx expo start` once so
  `.expo/types/router.d.ts` regenerates before typechecking.
- On Windows the dev-server watcher can write an incorrect `router.d.ts` after a route file is
  edited (it may list `/puja/index` or imported modules as routes). If `npm run typecheck` reports
  valid routes as missing, stop and restart `npx expo start` to regenerate the file, then rerun
  the check.
- Native platforms use `NativeTabs`; web uses `expo-router/ui`. Preserve this platform split.
- Tab labels are Hindi; route names stay English for stable URLs and maintainable deep links.

## Design system rules

- Use tokens from `src/constants/theme.ts` and `src/constants/typography.ts`; avoid hard-coded
  colours, spacing and font sizes in screens.
- Reuse `components/ui/screen.tsx`, `card.tsx`, `pill.tsx`, `info-row.tsx` and `feature-tile.tsx`.
- Keep the palette restrained: warm ivory/charcoal surfaces, deep saffron accent, dark readable text.
- Devanagari needs generous line height. Preserve the type scale's line heights.
- Support light and dark mode. Check contrast when adding a colour pair.
- Use `SymbolView` from `expo-symbols` for platform-native icons; pass per-platform names.
- Prefer the platform Devanagari-capable system font. Do not add a font package or font asset unless
  the task explicitly requires it.

## Content integrity rules

These are product requirements, not suggestions:

- **Never invent** festival dates, tithi, muhurat timings, mantra text, religious quotations or
  puja instructions.
- Only add religious content that has a named, reviewed source.
- Keep the source attached to the content in both the data model and the UI.
- Do not hard-code content into screen components; future content belongs in a typed data layer.
- If verified content is not available, show an honest empty/coming-soon state.
- Do not add a backend, login, subscriptions, ads or AI APIs during the MVP sprint.

## Testing

- There is no test runner configured yet. Do not add a heavy test setup for static placeholders.
- When the first real logic lands (calendar validation, source rules, japa persistence), add
  `jest-expo` + `@testing-library/react-native` and cover it.
- Always run `npm run check` and `npx expo-doctor` after changes.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship
over-the-air updates (`eas update`). Run EAS CLI as `npx eas-cli@latest <command>` in this npm
project; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native
  Generation). Never create or edit them by hand — configure native behavior in `app.json` and
  config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app
  needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check available skills before
  adding dependencies.
- Do not silently change package versions or the Expo SDK.
- Keep the app runnable through Expo Go wherever the selected SDK supports it.
- Preserve existing working configuration unless the task explicitly requires a change.
- Keep changes small enough to review.

## Current milestone

Day 2 UI is complete: all five tabs have their final layout, nested detail routes, shared
primitives, typed sample data in `src/data/`, and honest empty/coming-soon states. Lint, strict
typecheck, Expo Doctor and Android/web exports pass.

Do not start Day 3 (verified calendar content, real puja content, japa persistence, working
settings) without approval. The roadmap lives in `README.md`.
