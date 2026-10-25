# Day 6 decision log

Scope: product positioning, UX polish, Hindi-first language pass, content readiness. No content
was promoted, no review safeguard was removed, no dependency or architecture change was made.

## Changes made

| Change | Why |
| --- | --- |
| Adopted the product positioning *भक्ति दैनिक — रोज़ की भक्ति, सरल और विश्वसनीय* as the app tagline (`src/constants/app.ts`) and created `docs/product-positioning.md` | Day 6 section 2 asks the strategy to be adopted in the product, not only documented. |
| Home hierarchy: Jaap now the first quick action; "आगामी अवसर" shows the next **reviewed** observance only (`getUpcomingVerifiedObservances`), with an honest empty state | Home must not show a generated sample date next to real actions. Sample rows remain available and clearly labelled in the Calendar tab. |
| Added `getUpcomingVerifiedObservances` (and a filterable `getUpcomingObservances` collector) in `src/data/calendar.ts` plus a focused jest suite | Makes "verified only" a data-layer guarantee with a test, not a screen-level afterthought. Home can never render a generated date. |
| Prayer card icon changed from success-colored check-shield to a neutral clock with reworded caption | A pending slot should not borrow "verified" visual language. |
| Calendar day-cell touch targets: card padding 12→8, day-button `hitSlop` horizontal 2→3, `minHeight: TouchTarget.min` + `alignSelf: 'stretch'` on the day button | At the narrowest supported width (320dp) each day slot is ≈39dp; the widened hit area keeps every date at ≥44dp touch target with no horizontal overflow (hitSlop does not affect layout). Documented in code comments. |
| Calendar "तिथियाँ कैसे जोड़ी जाएँगी" notice now names region **and** calendar tradition, and states a location-specific date will not be shown as universal | Day 6 section 5: make the calculation basis explicit when applicable. |
| Puja detail: sample-only guides show "अनुमानित समय (नमूना)" instead of presenting the duration as fact | Small honesty fix; search and filters untouched. |
| Settings language section: replaced the disabled selector (`InfoRow` + "जल्द" pill + English notice) with a non-interactive Hindi-first note (`LanguagePolicy.hindiFirst`) | A disabled control implies a promised feature. Day 6 section 6 requires a clear note instead. |
| About screen: rewrote the mixed "Android-first, हिन्दी-first" line in natural Hindi | Language-pass item; meaning unchanged. |
| Created `docs/content-drafts/day6-initial-content.md` with 7 original Hindi reflections, 1 general prayer-routine draft and a draft-level checklist | Day 6 section 9. Drafts stay out of `src/data/`; no scripture attribution, mantras, dates or ritual steps. |
| Updated `docs/content-source-register.md` with Day 6 unfinished editorial decisions | Day 6 section 9. Decisions are recorded as requiring owner input, not guessed. |
| Created `docs/day6-decision-log.md` (this file) | Required deliverable. |

## Deliberate non-changes

- **Jaap behaviour untouched.** Targets (27/54/108), persistence, reset confirmation, validation and
  accessible controls are exactly as in Day 5. No streaks or gamification were added.
- **Reminder system untouched.** Optional, permission-after-intent, duplicate-free scheduling and
  startup reconciliation are unchanged.
- **Content statuses untouched.** Every shipped entry remains `sample` or `pending-review`; the
  source register in `src/content/sources.ts` remains empty.
- **No new dependencies; no architecture, navigation or design-system changes.**

## Decisions still requiring owner approval

1. The three uncommitted Day 5 files context vs. this run: Day 5 files were committed in `3eb793c`
   before Day 6 started; Day 6 changes are uncommitted and need owner review before committing.
2. The expo-doctor patch-drift packages (`@expo/ui`, `expo`, `expo-font`, `expo-glass-effect`,
   `expo-image`, `expo-router`) — still awaiting approval to update; no silent version changes.
3. Content drafts (`docs/content-drafts/day6-initial-content.md`) need owner sign-off on the
   subject list, a Hindi proofread, and a named reviewer before any promotion (see the draft file).
4. Unfinished editorial decisions in the source register (location, tradition, reviewer,
   reproduction rights, variation display, correction process) — unresolved, awaiting owner input.
5. Whether Home should additionally show a clearly-labelled approximate observance teaser before
   verified data exists — Day 6 chose the empty state; owner can override.
