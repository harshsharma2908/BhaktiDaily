# Bhakti Daily — release readiness (Day 7)

Status date: 2026-10-25. Scope: stability, accessibility, content handling, privacy accuracy,
Android readiness and release documentation for the first (internal) release. Nothing in this
document publishes, submits or promotes anything.

Companion documents:

- `docs/store-listing-draft.md` — proposed store listing (draft, not submitted).
- `docs/google-play-release-checklist.md` — publishing requirements the owner must verify.
- `docs/content-source-register.md` and `docs/content-editorial-checklist.md` — content gates.
- `docs/product-positioning.md` — audience and promise.

---

## A. Automated checks

All commands were run on the current working tree (base commit `5054f2f`, clean tree, plus the
dependency updates described below).

| Command | Run | Result | Notes |
| --- | --- | --- | --- |
| `npm run check` (typecheck → lint → jest) | ✅ | ✅ Pass | typecheck clean; lint clean; **8 suites / 61 tests passed** |
| `npx expo-doctor` | ✅ | ✅ **20/20** | Previously 19/20; patch-package drift was resolved (see dependency note) |
| `npx expo export --platform android` | ✅ | ✅ Pass | 1394 modules, 3.1 MB Hermes bundle exported to `dist/`. **This is a JS-bundle check, not proof of an installable native app.** No native build was produced. |
| `npx expo export --platform web` | ✅ | ✅ Pass | Server-rendered build, 18 web bundles + routes.json |
| `git diff --check` | ✅ | ✅ Exit 0 | Only CRLF-normalization warnings (pre-existing Windows behaviour) |
| `npx expo install --check` | ✅ | ✅ Pass after update | Reportedly 6 outdated packages before update; none after |
| `npm audit` | ✅ | ⚠️ 5 high advisories | All in the Expo **CLI/dev toolchain** (`node-forge`, `zod` via `@expo/cli` inside `expo`). The only offered "fix" is downgrading to `expo@44` — not acceptable. No compatible fix within SDK 58; see blockers/F section. Runtime app code is not exposed (the CLI is not shipped in the app bundle). |

### Dependency changes made (approved by this milestone's brief)

Applied with `npx expo install` (no manual version edits):

| Package | Before | After |
| --- | --- | --- |
| expo | 58.0.17 | 58.0.19 (~58.0.19) |
| expo-router | 58.0.25 | 58.0.26 (~58.0.26) |
| @expo/ui | 58.0.22 | 58.0.23 (~58.0.23) |
| expo-font | 58.0.9 | 58.0.10 (~58.0.10) |
| expo-glass-effect | 58.0.4 | 58.0.5 (~58.0.5) |
| expo-image | 58.0.16 | 58.0.17 (~58.0.17) |

- `package.json` and `package-lock.json` updated; lockfile diff reviewed (version/ref churn only,
  no conflicts, no peer warnings).
- Expo CLI also added `expo-font` and `expo-image` config plugins to `app.json` (both are standard
  for SDK 58 and are no-ops without arguments). Kept as automatic, expected change.
- After the update, all checks in section A were rerun and pass. `expo-doctor` is now 20/20.

## B. Native testing

### Actually performed (physical device)

Device: realme GT NEO 3T (RMX3371, `f1205b25`), Android with system dark appearance, 1080×2400 @ 480dpi
(≈360 dp width), Expo Go 58.0.5, Metro dev server + `adb reverse`, fresh cold launch after the
dependency update. Interaction verified via `uiautomator` dumps and screenshots; lock screen was
temporarily disabled for QA and re-enabled afterwards; all device artifacts removed.

| Check | Result |
| --- | --- |
| Cold launch (force-stop → fresh launch) | ✅ loads, Home renders |
| Navigation across Home, Calendar, Puja, Jaap, Settings (tab bar) | ✅ |
| Android system Back on nested routes (Puja detail → list) | ✅ returns, no state loss |
| Appearance: लाइट applies immediately; सिस्टम restore confirmed via screenshot | ✅ dark + light both verified (Day 6 report additionally covers लाइट across screens) |
| Jaap: increment ×3 | ✅ count reflects taps |
| Jaap: target change 54→27 keeps count (3/27) | ✅ count not reset |
| Jaap: reset shows confirmation dialog, then zeroes count, keeps target | ✅ "काउंटर रीसेट करें?" dialog; after confirm: 0 / 27 |
| Restart persistence: count 5 + target 27 survive force-stop and relaunch | ✅ |
| Calendar: month navigation, today/selected accessibility states | ✅ |
| Puja: search field accepts input, honest "0 परिणाम" empty state, "फ़िल्टर हटाएँ" clears filters, category filter returns "1 परिणाम" | ✅ |
| Reminder enable flow (permission) | ✅ no prompt at startup; reminder enabled only after explicit toggle. (Permission was already granted with `USER_SET`, so the Android request resolved silently — see C/D for the prompt-path caveat.) |
| Reminder scheduling (real system state) | ✅ `dumpsys alarm` shows exactly one `RTC_WAKEUP` alarm for the saved time (first test: tomorrow 08:00 IST, 1-hour flexible window) |
| Time change replaces the reminder | ✅ after 93 × +5 min to 15:45, the alarm singleton was re-scheduled: old 08:00 alarm gone, one alarm for 15:45 today |
| Actual notification delivery | ✅ posted at 15:45 IST, tagged `bhakti-daily.daily-reminder`, silent, no duplicate. After delivery the daily trigger correctly re-scheduled itself for the next day 08:00. Channel used was Expo Go's generic `expo_notifications_fallback_notification_channel` — the app's own `daily-reminder` channel could not be created inside Expo Go on this Android version, exactly the failure the service code anticipates and tolerates; a standalone build would use the app's own channel |
| Disabling reminders cancels the reminder | ✅ toggle OFF removes the scheduled alarm from `dumpsys alarm` (verified visible on-device) |
| Denial path | ✅ permission revoked via system settings ("Don't allow"); toggling ON again shows the honest "सूचना अनुमति नहीं मिली" notice with a "सूचना सेटिंग्स खोलें" shortcut, no crash, and no alarm is scheduled while denied |
| Notification delivery wording honest | ✅ UI says "लगभग … बजे" and "समय थोड़ा बदल सकता है"; alarm uses a flexible window, no exact-alarm permission requested |

**Notification delivery details:** the notification permission had previously been granted on this
device (`USER_SET`), so enabling the reminder resolved without a fresh system prompt; a second
exercise showed the real system prompt ("Allow Expo Go to send you notifications?") appearing when
the OS can ask, and denial was answered honestly by the app. Delivery was through Expo Go's
foreground/service stack, not through a standalone release build — see limitations below. All
device state (reminder off @ 08:00, permission granted, jaap 0/54, सिस्टम theme) was restored
afterwards and audited via `dumpsys`.

**Safe areas / system bars:** status bar and gesture area render correctly on the device; screens
scroll under the system bars with the shared `Screen` shell.

**Keyboard dismissal:** the Puja search works with `keyboardShouldPersistTaps`; system Back
dismisses the keyboard. Dedicated keyboard-dismiss QA on every screen was not separately exercised.

### Emulator

No emulator exists on this machine (`cmdline-tools`, `emulator`, `system-images` all absent), and
none was installed during this milestone. No emulator results are claimed.

### Remaining unverified (or partially verified)

1. **320 dp narrow-width configuration — NOT tested.** The realme device blocks both `wm size` and
   `wm density` overrides (`SecurityException`, needs `WRITE_SECURE_SETTINGS`), and there is no
   emulator. The Day 6 fix (hit-slop + min-height) was verified only at ≈360 dp and by static math
   at 320 dp. Exact steps to close this are in section F (Follow-up 1).
2. **Permission prompt path.** On this device the notification permission was already granted
   (`POST_NOTIFICATIONS granted=true, USER_SET`), so the actual "ask only after explicit intent"
   system prompt was not observed fresh (the code path was exercised when permission status was
   undetermined in unit tests). Denial → guidance-onboarding flow was also not observed on-device.
3. **Delivery in a standalone/release build.** Delivery was observed through Expo Go; a release
   build (own APK/AAB, own file) has never been produced or run.
4. **TalkBack / screen-reader walkthrough** — labels were verified via accessibility nodes, but a
   real TalkBack pass was not performed.
5. **iOS** — untouched and untested (Android-first project).
6. **Look-and-feel of "empty states and error states"** beyond those listed (e.g. storage-failure
   notice) — code-verified and unit-tested, not exercised on-device.

## C. Content integrity

**Architecture (code-verified):** one shared model (`src/content/types.ts`), one machine-readable
source register (`src/content/sources.ts`, deliberately empty), structural/provenance validation
(`src/content/validation.ts`) and a data-layer verified feed.

- **Verified-only Home feed:** `getUpcomingVerifiedObservances` filters `reviewStatus === 'reviewed'`;
  sample rows cannot enter by construction. Tested in `src/data/__tests__/calendar.test.ts`, which
  also asserts every generated row stays labelled `sample`. Home currently shows the honest empty
  state ("अभी कोई सत्यापित अवसर नहीं") — no fake dates.
- **Sample/pending warnings remain visible** where sample content appears: Calendar ("नमूना डेटा"
  notice + per-row labels), Puja list ("नमूना और समीक्षा-लंबित मार्गदर्शिकाएँ"), Puja detail
  ("यह पूजा विधि नहीं है" + "अनुमानित समय (नमूना)"), Home reflection ("ऐप नमूना पाठ — …").
- **Missing reviewed content produces truthful empty states** (Home upcoming, Jaap mantra section
  "सत्यापन के बाद", Contact screen placeholder). This was device-verified (see B).
- **No source, reviewer, date, location or tradition is invented.** The register is empty; every
  shipped entry is `sample` or `pending-review`; reviewed status cannot exist without
  source + reviewer + date or validation fails (`reviewed-without-source`,
  `reviewed-without-reviewer`, `reviewed-date-missing`, `reviewed-calendar-without-scope`).
- **Source/portion vs. editorial status are not conflated:** `reviewStatus` and source references are
  separate fields; unreviewed entries may not claim review metadata (`review-metadata-on-unreviewed`).

**Day 6 draft pack (`docs/content-drafts/day6-initial-content.md`):**

- Still carries "Status: DRAFT — awaiting owner and editorial approval"; still outside
  `src/data/` (verified by `git status`: no production content file touched); contains no mantra,
  scripture quotation, saint attribution, festival date, tithi, muhurat or ritual instruction.
- Nothing was promoted and no reviewer was invented. Basic language read-through: the Hindi is
  clear, simple and consistent in tone with the app's voice; no exaggerated or fear-based wording
  found. Editorial suggestions (not acted on): #4 "क्षमा" line "यह एक बार काम नहीं, निरंतर कोशिश है"
  could read more smoothly as "यह एक बार का काम नहीं, निरंतर की कोशिश है"; #7's long second sentence
  could be split for readability. Both belong to the owner's Hindi proofread, not this milestone.

**Unresolved editorial decisions (classified, from `docs/content-source-register.md` D1–D5):**

| Item | Owner decision | Research needed | Independent technical work | Blocks publishing? |
| --- | --- | --- | --- | --- |
| D1 app-authored reflections as a content type | ✅ owner must decide | — | — | Blocks the 7 reflections |
| D2 reviewer role/qualification for drafts | ✅ owner must decide | Whether a separate editorial role is defined | Register schema already supports it | Blocks the 7 reflections |
| D3 reproduction rights (only arises if drafts quote external text) | Standing rule is already recorded | — | — | Blocks only quoted material |
| D4 region-neutral wording acceptability | ✅ owner must decide | North-India-first audience fit | Text is already region-neutral | Blocks prayer routine + any region-specific item |
| D5 final approval of Hindi wording | ✅ owner must decide | Hindi proofread | — | Blocks everything in the draft pack |
| Calendar tradition/panchang source (register) | ✅ owner must decide | Which panchang/tradition, which location(s) | Feed + warning UI are ready | Blocks all real calendar dates |
| Privacy policy legal review | ✅ owner must decide | Legal advisor | In-app honest draft already present | Blocks public Play listing, not internal testing |

## D. Privacy and permissions

Factual findings verified against code, dependency list and device behaviour — no claim removed:

- **No account**: no login/auth UI or code; no user identity exists anywhere.
- **Local-only state**: jaap count/target and preferences are stored via AsyncStorage under
  namespaced, versioned keys (`bhakti-daily/jaap/v1`, `bhakti-daily/preferences/v1`). No sync, no
  server upload, no network request in app code. (Running in Expo Go fetches a dev manifest from
  Expo's servers — a property of Expo Go in development, not of the app's code.)
- **No analytics/ad SDKs**: dependency list contains only Expo/RN libraries; no Firebase,
  no crash reporter, no ads code. `npm audit` advisories are in the dev/build CLI, not runtime.
- **Third-party data sharing**: none found. In a standalone release build the app makes no network
  call by itself; `expo-notifications` schedules **local** notifications.
- **Reminders**: optional; permission is requested only after explicit user intent (code + tests;
  on-device scheduling verified). Denial is handled without a crash and shows system-settings
  guidance. Revocation leaves no stale reminder (cancel-before-check + startup reconciliation).
- **Denying permission**: reminder stays off, UI explains consequences, no retry loop.
- **Contact information**: none exists — the Contact screen honestly shows no email/form rather
  than a made-up address. ✅ no fake identity, but a **store listing needs a real support contact
  (owner action)**.
- **Privacy screen**: factual, and explicitly marked "not final legal policy; legal review
  pending". No company name, address, email or URL was invented anywhere.

**Unresolved privacy owner actions:** (1) final legal review / hosting of an external privacy
policy if Play requires a URL; (2) a valid support contact; (3) Play Data Safety answers must
mirror this section (owner confirm), see Google checklist.

## E. Store readiness

Completed without publishing or uploading anything:

- Draft listing in `docs/store-listing-draft.md` (Hindi title/short/full description, English
  alternative, features, limitations, review-status disclosure, honest keywords).
- Draft screenshot checklist backed by genuine device screenshots already taken this milestone.
- Realistic Play requirements checklist in `docs/google-play-release-checklist.md`.

Missing / verified gaps:

- **App icon + adaptive icon are still Expo template artwork** — confirmed by reading the actual
  asset files. Not usable for a store presence.
- **No `android.package`** in `app.json` — no application ID exists yet (see blockers).
- **No native build workflow** (`eas.json` absent; no `npm run` build script defined).
- **No store account items can be prepared here** (owner-only).
- Splash configuration is colour-only (matches design; dedicated splash artwork is optional).

## F. Release blockers (classification)

### Blocker — must resolve before any public release

1. **No native build path**: no `android.package` (application ID), no explicit
   `android.versionCode`, no `eas.json`/build profile, and no signed APK/AAB ever produced. The app
   cannot exist on Play without these. (Owner decision needed on the ID; recommend something
   reversible now, e.g. `com.<owner>.bhaktidaily` — final value must come from the owner.)
2. **Branded icon set**: app icon and Android adaptive icon are Expo template artwork.
3. **First reviewed religious content**: zero `reviewed` entries exist; store listing must not
   imply verified data. Play metadata in the draft discloses this, but the blockers above mean the
   listing copy cannot promise dates the app does not show.
4. **Privacy documentation for Play**: Data Safety declaration + final privacy policy need owner
   validation (draft present; no invented identity).

### Important — should resolve before public release

1. **TalkBack pass** and dedicated keyboard-dismiss QA.
2. **Denial-path permission observation** on a device with revoked permission.
3. **Release-build delivery test**: notification delivery in a standalone build (not Expo Go).
4. **Support contact** on the Contact screen (replacing the honest placeholder).
5. **`npm audit` advisories** (node-forge/zod via Expo CLI): monitor Expo patch releases for an
   SDK-compatible bump; do not downgrade the SDK.

### Follow-up — can wait until after launch

1. **320 dp real-device/emulator verification** (steps: install Android cmdline-tools →
   `sdkmanager "emulator" "system-images;android-36;google_apis;x86_64"` → create an AVD with
   `hw.lcd.width=1080, hw.lcd.height=2400, hw.lcd.density=540` (=320 dp width) → run the same
   calendar/overflow checks; or use any second 320dp-class device. Chosen explicitly because the
   primary device blocks density/size overrides).
2. Dark-only splash artwork, iOS support, language expansion (deferred by design).
3. Home "clear all local data" action noted in README known-limitations.

## G. Final recommendation

**Ready for internal testing only.**

Evidence:

- All 61 automated tests, typecheck, lint, both JS exports and `expo-doctor` 20/20 pass; real
  device QA exercised navigation, jaap behaviour, persistence, calendar, search/filters, reminder
  scheduling/replacement and delivery — with honest labelling everywhere.
- But it is **not** a closed-test candidate yet because there is no installable native build, no
  application ID, no version code, a template icon, no support contact, and not a single reviewed
  content entry. Every one of those is a Blocker in section F.
- It is certainly not "ready for submission review": store account, listing assets, Data Safety
  validation and content-gate decisions (D1–D5, calendar tradition) all remain open and owner-only.
