# भक्ति दैनिक · Bhakti Daily

An Android-first, Hindi-first Hindu devotional companion. The app is being built as a calm,
trustworthy daily space for devotional content, festival dates, puja guidance and japa.

> **Current status — Day 3 local persistence milestone:** all five destinations have their final
> navigation and layout, backed by clearly labelled sample data. Japa progress, appearance and
> optional daily reminders are now saved locally. Verified religious content, calendar dates,
> mantra text and puja instructions are **not** implemented yet.

## Current scope

| Tab | Current state |
| --- | --- |
| होम / Home | Greeting, Hindi date, sample thought, prayer placeholder, upcoming observance and shortcuts to Puja and Jaap |
| कैलेंडर / Calendar | Month grid with previous/next/return-to-today, date selection, sample observances and honest empty states |
| पूजा / Puja Guides | Search, category chips, reusable guide cards and a detail route with materials, steps and notes |
| जाप / Jaap | Circular counter with target selection (27/54/108), progress, increment and confirmed reset. Count and target are saved locally and restored on launch |
| सेटिंग्स / Settings | Working appearance preference and optional daily local reminder, plus About, Contact and Privacy screens. Language remains Hindi-only and visibly unavailable |

Every religious-looking entry is labelled **नमूना** (sample) and marked as source pending. The app
does not claim any festival date, tithi, muhurat, mantra or puja instruction is real.

Not included on purpose: backend, login, subscriptions, advertisements, AI APIs, remote push,
real festival dates, mantra text, religious quotations or muhurat timings.

## Tech stack

- **Expo SDK 58** (`expo@~58.0.17`) with Expo Go support
- **React Native 0.88** and **React 19.3**
- **TypeScript 6** with `strict: true`
- **Expo Router 58** with typed routes
- Native system tabs on Android/iOS, custom headless tabs on web
- **expo-symbols** for platform-native SF Symbols / Material Symbols
- **@react-native-async-storage/async-storage** for local, on-device state
- **expo-notifications** for an optional daily local reminder on Android/iOS
- **jest-expo** and **Jest** for focused logic, storage and notification-service tests
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
npm test            # Jest, one worker
npm run check       # typecheck, lint, then tests
npx expo-doctor     # dependency and configuration diagnosis
npx expo export --platform android   # verify the native bundle
npx expo export --platform web       # verify the server-rendered web bundle
```

Always install Expo packages with `npx expo install <package>` so the SDK-compatible version is
selected. Do not change the Expo SDK or package versions silently.

## Project structure

```text
src/
  app/                    Expo Router routes
    _layout.tsx           Root layout, preferences provider, theme, splash handling
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
      privacy.tsx         Privacy policy for current local data
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
    settings/
      reminder-settings.tsx  Reminder switch, time stepper, permission guidance
    ui/
      button.tsx          Primary/secondary/ghost button
      card.tsx            Surface card with default/accent/muted tones
      chip.tsx            Selectable filter/choice chip
      empty-state.tsx     Honest empty/coming-soon state
      feature-tile.tsx    Linked feature shortcut
      icon-button.tsx     Accessible 44 pt icon-only control
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
    use-jaap.ts           Saved japa state, hydration merge and debounced writes
    use-resolved-color-scheme.ts  Saved appearance + system scheme
    use-theme.ts          Resolves the active colour palette
    use-color-scheme.ts   Native colour scheme
    use-color-scheme.web.ts
  lib/
    calendar.ts           Month grid maths
    date.ts               Hindi date/month formatting and date keys
    jaap-state.ts         Pure counter, progress and hydration-merge helpers
    reminder.ts           Pure reminder time formatting and stepping
    validation.ts         Shared stored-value guards
  providers/
    preferences-provider.tsx  Saved appearance, reminders and permission state
  services/
    reminders.ts          Android/iOS notification permission and scheduling
    reminders.web.ts      Honest unsupported web implementation
  storage/
    json-storage.ts       Defensive AsyncStorage wrapper and write cache
    keys.ts               Namespaced, versioned storage keys
    jaap.ts               Japa schema, restore and save
    preferences.ts        Preferences schema, restore and save
  global.css              Web font stack
assets/                   App icons, splash artwork and template imagery
```

## Architecture notes

### Navigation

Expo Router owns all navigation. Every file in `src/app/` is a route and `_layout.tsx` defines the
navigator. The root layout wraps the app in a warm light/dark navigation theme and removes the
native splash screen after saved preferences have loaded (with a short fallback timeout).

- Native platforms use `NativeTabs` from `expo-router/native-tabs`, so the tab bar follows Android
  and iOS system behaviour and safe-area handling.
- Web uses the headless `expo-router/ui` tabs with a custom top navigation. The platform split lives
  in `app-tabs.tsx` and `app-tabs.web.tsx`.
- Tab labels are Hindi. Routes keep stable English names for maintainable URLs and deep links.
- Puja guides and settings pages use nested stacks with a list screen anchor, so detail screens get
  a header-free back button and correct system back behaviour.

### Local persistence

All working state is local to the device. There is no account, backend or cloud sync.

- Storage keys are namespaced and versioned: `bhakti-daily/jaap/v1` and
  `bhakti-daily/preferences/v1`.
- `src/storage/json-storage.ts` catches read, parse and write failures. A missing, malformed or
  incompatible payload falls back to safe defaults instead of crashing a screen.
- Japa count and target are validated independently. An unsupported target falls back to 108; an
  invalid count falls back to 0. A payload with an unknown schema version is ignored entirely.
- The counter saves after a short debounce, skips identical writes, and flushes a pending write when
  leaving the screen.
- If a tap happens before storage finishes loading, the restored count is merged with the new taps
  instead of overwriting them. A reset made during loading wins over the stored count.
- Changing the target never resets the count. Reset only sets the count to zero and keeps the chosen
  target. The counter is an ongoing local count, **not** a daily streak.
- If local storage is unavailable, the counter still works for the session and the Jaap screen shows
  an honest notice that progress may not survive an app restart.

Appearance is saved as `system`, `light` or `dark`. `useResolvedColorScheme` combines that choice
with the device scheme, and all colour consumers go through `useTheme`. The preference applies
immediately and survives relaunch. Changes made before saved preferences finish loading are merged
field by field, and defaults are not written over unread reminder data. Language selection is
deliberately disabled until the whole UI has a reviewed translation; there is no partial English
mode.

### Reminders

The daily reminder is optional and strictly local.

- Permission is requested only after the user turns the reminder on. Nothing prompts at startup.
- One notification is scheduled with a fixed identifier. Rescheduling cancels the previous reminder
  first, and button operations are serialized so rapid time changes cannot leave duplicates.
- The Android channel is silent, non-vibrating and uses default importance. No exact-alarm
  permission is requested, so delivery time is approximate and can be affected by battery and
  system settings.
- Disabling the reminder cancels it. At startup the saved preference is reconciled without
  prompting: an intended reminder is rescheduled only when permission is still granted.
- If permission is denied or later revoked, the UI explains what happened and offers a shortcut to
  system notification settings. It does not claim that a reminder will arrive.
- `expo-notifications` does not support web scheduling, so the web build shows an honest unavailable
  state instead of pretending a reminder was saved.

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
- Touch targets use the shared `TouchTarget` tokens; the reminder stepper uses 44 pt controls

### Content integrity

This is a devotional app, so trust matters more than speed.

- Never invent festival dates, tithi, muhurat timings, mantra text or quotations.
- Add religious content only after it has a named, reviewed source.
- Keep the source visible with the content in the data model and UI.
- `ContentPolicy.verifiedOnly` in `src/constants/app.ts` records this rule in copy.
- Screens do not hard-code religious content; it lives in the typed `src/data/` layer with
  `नमूना` badges and source-pending fields.
- Local persistence of a count does not make any religious content verified.

## Testing

`jest-expo` and Jest are configured in `package.json`; tests live in `src/**/__tests__/` and run with
`npm test`. `npm run check` now runs strict typechecking, lint and the test suite.

The current 6 suites / 39 tests cover:

- japa increment, reset, target changes, progress clamping and completion
- merging taps or a reset that happen while saved japa state is still loading
- merging a reminder toggle, reminder time or appearance change made while preferences are loading
- stored-payload validation, field-level recovery and schema-version rejection
- successful AsyncStorage round-trips plus read, parse and write failure handling
- reminder time formatting and five-minute stepping across midnight
- permission denial, single identified scheduling, cancellation and native failures

Checks run for this milestone:

```bash
npm run check
npx expo-doctor
npx expo export --platform android
npx expo export --platform web
```

All four commands pass. Expo Doctor reports 20/20 checks. Manual web QA covered all nine routes at
320×720 and 360×780 in light and dark mode with no horizontal overflow. The browser run also verified
that three counter taps, a target change to 27, a confirmed reset and a dark appearance preference
all survive a full page reload, and that the web reminder control is visibly disabled as unsupported.

Native notification delivery, Android/iOS tab-bar behaviour and TalkBack/VoiceOver were **not**
verified on a physical device in this environment.

## Next milestones

1. **Verified calendar foundation** — typed festival/vrat model, source registry, review checklist,
   date list and empty states.
2. **Puja guide content** — reviewed materials, preparation, ordered steps and sources.
3. **Device QA** — local reminder delivery, Android/iOS notification permission flows, tab bars,
   safe areas, system back, ripples and screen-reader labels.
4. **Localization** — complete a reviewed English translation before enabling the language choice.
5. **Release readiness** — accessibility pass, Android build, branded icon set, performance and
   store metadata.

## Known limitations

- The launcher icon and iOS Icon Composer asset are still the Expo template artwork. A branded icon
  set is needed before a release build.
- Calendar entries, guides and the home thought are labelled samples; no verified religious content
  has been added.
- Language selection is intentionally unavailable; the app is Hindi-only for now.
- Local reminders are Android/iOS only. Web shows an unsupported state.
- Reminder timing is approximate. The app does not request exact-alarm permission and does not
  promise an exact delivery minute.
- Reminder delivery and native permission behaviour have not been tested on a real Android device or
  simulator; iOS is untested.
- All progress is device-local. There is no account or sync, and uninstalling the app can remove the
  saved data. A dedicated "clear all local data" action is not available yet.
- If storage is unavailable, the app keeps working for the session and shows a warning, but changes
  may not survive a restart.
- Web is a secondary target and uses the custom top navigation; Android is the primary platform.
