# Bhakti Daily — agent guide

This is an Android-first, Hindi-first Hindu devotional companion built with Expo, React Native,
TypeScript and Expo Router. Prioritise mobile-first patterns, performance, accessibility and
cross-platform compatibility.

## Project context

- **Expo SDK 58** (`expo@~58.0.17`), **React Native 0.88**, **React 19.3**, **TypeScript 6 strict**.
- Routes live in `src/app/`; non-route code lives outside it.
- Native tabs are used on Android/iOS. Web uses the headless tabs in `src/components/app-tabs.web.tsx`.
- The design system lives in `src/constants/theme.ts` and `src/constants/typography.ts`.
- Day 1 built the navigation and design foundation; Day 2 added the full UI for all five
  destinations using labelled sample data; Day 3 added local japa persistence, saved appearance,
  optional local reminders and focused tests; Day 4 added shared content/provenance types, a source
  register, structural validation and an editorial checklist.
- Do not add reviewed religious content without the product owner's approval. Sample content must
  stay labelled and must never be promoted to "reviewed" without a named, reviewed source.

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
- Notifications: https://docs.expo.dev/versions/v58.0.0/sdk/notifications.md
- AsyncStorage: https://docs.expo.dev/versions/v58.0.0/sdk/async-storage.md

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
npm test                    # jest-expo, single worker
npm run check               # typecheck, lint, then tests
npx expo-doctor             # dependency/config diagnosis
npx expo install <package>  # ALWAYS use for Expo packages
npx expo install --check    # report SDK patch/compatibility drift
npx expo export --platform android   # verify the native bundle
npx expo export --platform web       # verify the server-rendered web bundle
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

- **Never invent** festival dates, tithi, muhurat timings, mantra text, religious quotations,
  source titles, source URLs or puja instructions.
- Only add religious content that has a named, reviewed source.
- Keep the source attached to the content in both the data model and the UI.
- Use the shared models in `src/content/types.ts`; do not create a parallel content shape in a
  screen.
- Keep sources in `src/content/sources.ts`, separate from user-facing content. The register is
  intentionally empty until a real source is supplied.
- Use `reviewStatus: 'sample' | 'pending-review' | 'reviewed'`. A reviewed entry must name its
  source, reviewer and review date; sample/pending entries must not claim review metadata.
- Run `src/content/validation.ts` through the tests after changing content. It checks structure and
  provenance only; it does not verify religious facts.
- Follow `docs/content-source-register.md` and `docs/content-editorial-checklist.md` before changing
  any status to `reviewed`.
- Do not hard-code content into screen components; future content belongs in a typed data layer.
- If reviewed content is not available, show an honest sample/pending/coming-soon state.
- Do not add a backend, login, subscriptions, ads or AI APIs during the MVP sprint.

## Local data & reminders

- All working state is device-local through AsyncStorage. There is no account, backend or sync.
- Keep storage keys namespaced and versioned. Validate every restored field independently and fall
  back safely on missing, malformed or unknown-version data.
- Do not write restored defaults before hydration finishes. Merge interactions that happen during
  hydration; do not let a late read overwrite them.
- Changing the japa target must not reset the count. Reset only zeroes the count and keeps the
  target. The counter is an ongoing count, not a daily streak.
- Request notification permission only after the user explicitly enables the reminder. Never prompt
  at startup.
- Schedule one identified daily reminder, cancel before rescheduling, and reconcile the saved
  preference at startup without prompting. Handle denial with next-step guidance.
- Do not request exact-alarm permissions or promise an exact Android delivery minute.
- `expo-notifications` is Android/iOS only. Keep the honest web fallback in
  `src/services/reminders.web.ts`; do not import notification APIs directly in screens.

## Testing

- `jest-expo` and Jest are configured. Tests live in `src/**/__tests__/*.test.ts` and run with
  `npm test`.
- Keep tests focused on pure logic, stored-value validation, content/provenance validation, storage
  failure handling and the notification service contract. Add component-testing libraries only when
  a real component test needs them.
- The content validation test must validate the shipped library and keep every current entry
  unreviewed until a real source and reviewer are supplied.
- Always run `npm run check` (typecheck, lint, tests) and `npx expo-doctor` after changes.
- Do not claim native notification delivery, a device launch, or manual accessibility QA passed
  unless it actually ran in this environment.

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

Day 4 is complete: shared content/provenance models, an intentionally empty source register,
structural validation, a source register document and an editorial checklist are in place. All
current content remains `sample` or `pending-review`; no festival date, tithi, muhurat, mantra,
quotation or ritual instruction has been added.

Do not change content to `reviewed` until the product owner supplies a named source and reviewer,
the supported location(s) and the applicable panchang/calendar tradition, and the editorial
checklist is complete. Do not start monetization, ads, analytics or additional product features
without approval. The roadmap lives in `README.md`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
