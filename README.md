# भक्ति दैनिक · Bhakti Daily

An Android-first, Hindi-first Hindu devotional companion. The app is being built as a calm,
trustworthy daily space for devotional content, festival dates, puja guidance and japa.

> **Current status — Day 2 UI milestone:** all five destinations have their final navigation and
> layout, backed by clearly labelled sample data. Religious content, verified calendar dates,
> persistence and settings behaviour are **not** implemented yet.

## Current scope

| Tab | Day 2 state |
| --- | --- |
| होम / Home | Greeting, Hindi date, sample thought, prayer placeholder, upcoming observance and shortcuts to Puja and Jaap |
| कैलेंडर / Calendar | Month grid with previous/next/return-to-today, date selection, sample observances and honest empty states |
| पूजा / Puja Guides | Search, category chips, reusable guide cards and a detail route with materials, steps and notes |
| जाप / Jaap | Circular counter with target selection (27/54/108), progress, increment and confirmed reset; session-only state |
| सेटिंग्स / Settings | Language, prayer reminders and appearance placeholders, plus About, Contact and Privacy screens |

Every religious-looking entry is labelled **नमूना** (sample) and marked as source pending. The app
does not claim any festival date, tithi, muhurat, mantra or puja instruction is real.

Not included on purpose: backend, login, subscriptions, advertisements, AI APIs, real festival
dates, mantra text, religious quotations or muhurat timings.

## Tech stack

- **Expo SDK 58** (`expo@~58.0.16`) with Expo Go support
- **React Native 0.88** and **React 19.3**
- **TypeScript 6** with `strict: true`
- **Expo Router 58** with typed routes
- Native system tabs on Android/iOS, custom headless tabs on web
- **expo-symbols** for platform-native SF Symbols / Material Symbols
- No custom native modules were added

## Requirements

- Node.js 22 or newer
- npm
- The Expo Go app that matches SDK 58, or a local Android emulator/development build

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` to open an Android emulator if one is configured.

```bash
npm run android   # start and open Android
npm run web       # start the web version
```

## Commands

```bash
npm run start       # start the Expo dev server
npm run android     # start and open Android
npm run web         # start the web version
npm run lint        # ESLint via expo lint
npm run typecheck   # tsc --noEmit
npm run check       # typecheck, then lint
npx expo-doctor     # dependency and configuration diagnosis
```

Always install Expo packages with `npx expo install <package>` so the SDK-compatible version is
selected. Do not change the Expo SDK or package versions silently.

## Project structure

```text
src/
  app/                    Expo Router routes
    _layout.tsx           Root layout, navigation theme, splash handling
    index.tsx             Home
    calendar.tsx          Calendar
    jaap.tsx              Japa counter
    puja/
      _layout.tsx         Stack for the guide list and details
      index.tsx           Guide list, search and filters
      [id].tsx            Guide detail
    settings/
      _layout.tsx         Stack for settings and its sub-pages
      index.tsx           Settings
      about.tsx           About this app
      contact.tsx         Contact placeholder
      privacy.tsx         Privacy draft
  components/
    app-tabs.tsx          Native tab bar (Android/iOS)
    app-tabs.web.tsx      Custom top navigation (web)
    themed-text.tsx       Typography-aware text primitive
    themed-view.tsx       Theme-aware view primitive
    calendar/
      month-grid.tsx      Month grid with selected/today/sample states
      observance-row.tsx  Observance list row
    puja/
      guide-card.tsx      Typed guide card
    ui/
      button.tsx          Primary/secondary/ghost button
      card.tsx            Surface card with default/accent/muted tones
      chip.tsx            Selectable filter chip
      empty-state.tsx     Honest empty/coming-soon state
      feature-tile.tsx    Linked feature shortcut
      info-row.tsx        Settings row with icon, value and press state
      notice.tsx          Sample, info and success notices
      pill.tsx            Small status/label pill
      progress-bar.tsx    Accessible progress indicator
      quick-action.tsx    Compact linked shortcut tile
      screen.tsx          Safe-area screen shell, back button, section header
      search-field.tsx    Search input with clear action
  constants/
    app.ts                App identity and content policy copy
    theme.ts              Colour, spacing, radius and layout tokens
    typography.ts         Devanagari-aware type scale
  data/
    home.ts               Home sample thought and pending prayer
    calendar.ts           Neutral sample observances
    puja-guides.ts        Typed sample guides and categories
    jaap.ts               Targets and mantra placeholder
  hooks/
    use-theme.ts          Resolves the active colour palette
    use-color-scheme.ts   Native colour scheme
    use-color-scheme.web.ts
  lib/
    calendar.ts           Month grid maths
    date.ts               Hindi date/month formatting and date keys
  global.css              Web font stack
assets/                   App icons, splash artwork and template imagery
```

## Architecture notes

### Navigation

Expo Router owns all navigation. Every file in `src/app/` is a route and `_layout.tsx` defines the
navigator. The root layout wraps the app in a warm light/dark navigation theme and removes the
native splash screen after mount.

- Native platforms use `NativeTabs` from `expo-router/native-tabs`, so the tab bar follows Android
  and iOS system behaviour and safe-area handling.
- Web uses the headless `expo-router/ui` tabs with a custom top navigation. The platform split lives
  in `app-tabs.tsx` and `app-tabs.web.tsx`.
- Tab labels are Hindi. Routes keep stable English names for maintainable URLs and deep links.
- Puja guides and settings pages use nested stacks with a list screen anchor, so detail screens get
  a header-free back button and correct system back behaviour.

### Design system

`src/constants/theme.ts` is the single source of truth for colour, spacing, radius and layout.
`src/constants/typography.ts` defines the type scale with generous Devanagari line heights. Screens
use the shared `ui/` primitives instead of one-off styles.

- Warm ivory background (`#FFF9F0`) with a deep saffron accent (`#B45309`) in light mode
- Warm charcoal background (`#14100D`) with a softer saffron accent in dark mode
- `#D97706` is kept as a decorative `saffron` token; text and buttons use the deeper accent so
  pairings meet WCAG AA contrast on their intended surfaces
- System Devanagari-capable fonts are used so Expo Go needs no font download or native rebuild
- Web uses the `Noto Sans Devanagari` / `Nirmala UI` CSS stack
- Touch targets use the shared `TouchTarget` tokens; calendar day cells are 46 px tall

### Content integrity

This is a devotional app, so trust matters more than speed.

- Never invent festival dates, tithi, muhurat timings, mantra text or quotations.
- Add religious content only after it has a named, reviewed source.
- Keep the source visible with the content in the data model and UI.
- `ContentPolicy.verifiedOnly` in `src/constants/app.ts` records this rule in copy.
- Screens do not hard-code content; it lives in the typed `src/data/` layer with `नमूना` badges.
- The japa counter is intentionally session-only until persistence can be tested properly.

## Testing

There is no automated test runner yet. The current milestone is UI and sample data, and the first
real logic (calendar validation, source rules, japa persistence) has not landed. When it does, add
`jest-expo` + `@testing-library/react-native` and cover it.

Checks run for this milestone:

```bash
npm run typecheck
npm run lint
npx expo-doctor
npx expo export --platform android
npx expo export --platform web
```

Manual web checks at 320 px and 360 px covered all nine routes (Home, Calendar, Puja list/detail,
Jaap, Settings, About, Contact, Privacy) in light and dark mode: no horizontal overflow, Hindi text
renders correctly, month navigation works, filtering and empty states work, the counter increments
and reset confirms, and back navigation returns to the list screens.

## Next milestones

1. **Verified calendar foundation** — typed festival/vrat model, source registry, review checklist,
   date list and empty states.
2. **Puja guide content** — reviewed materials, preparation, ordered steps and sources.
3. **Japa counter persistence** — local storage, saved targets, reset/continue flow and tests.
4. **Settings** — language preference, optional local reminders and a reviewed privacy policy.
5. **Release readiness** — accessibility pass, Android build, branded icon set, performance and
   store metadata.

## Known limitations

- The launcher icon and iOS Icon Composer asset are still the Expo template artwork. A branded icon
  set is needed before a release build.
- Calendar entries, guides and the home thought are labelled samples; no verified religious content
  has been added.
- The japa count is in-memory only and resets when the app process ends.
- Language selection and prayer reminders are visible but not functional.
- Contact details are not published, so the contact screen offers no fake address.
- No automated tests have been added yet.
- Web is a secondary target and uses the custom top navigation; Android is the primary platform.
