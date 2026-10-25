# Bhakti Daily — store listing draft (Day 7)

**Status: DRAFT — nothing here has been submitted, uploaded or published.** Final wording is an
owner decision. Every statement below is restricted to what the app actually does today; claims the
app cannot support are listed as deliberately excluded.

---

## 1. Proposed app title

**Hindi (title in Play listing): भक्ति दैनिक**
(English fallback name: *Bhakti Daily* — already the app name in `app.json`.)

## 2. Short description (≤80 characters)

Hindi: **रोज़ की भक्ति, सरल और विश्वसनीय** — चिंतन, जाप प्रगति और पूजा रूपरेखा, आपकी गति से।
(English fallback: "Daily devotion, simple and trustworthy — reflections, japa progress, puja outlines.")

## 3. Full description in natural Hindi

भक्ति दैनिक एक सरल दैनिक साथी ऐप है, जिसे पहले Android और हिन्दी भाषा के लिए बनाया गया है।
इसका उद्देश्य शांत चिंतन, स्पष्ट पूजा मार्गदर्शन और अपनी गति से जाप के लिए एक भरोसेमंद जगह बनाना है।

**होम** — दिनभर के शांत चिंतन और सरल कदम। पूजा और जाप से जुड़े अवसर, सभी आपकी गति से।

**कैलेंडर** — महीने देखें और दिन चुनें। वास्तविक पर्व-तिथियाँ तभी दिखेंगी जब वे किसी सत्यापित
पंचांग स्रोत, समीक्षक और क्षेत्र-परंपरा के आधार पर शामिल की गई हों। इस संस्करण में कैलेंडर
आपके लिए एक शांत दिन-दीखावट का साधन है, पूरा पंचांग नहीं।

**पूजा** — सामग्री, चरण और ध्यान देने योग्य बातों की रूपरेखाएँ। प्रत्येक पृष्ठ पर स्रोत-स्थिति —
नमूना, समीक्षा बाकी, या समीक्षित स्रोत सहित — साफ़ दिखाई देती है।

**जाप** — अपनी गति से स्मरण। लक्ष्य 27, 54 या 108 चुनें; गिनती इस डिवाइस पर सहेजी जाती है और लक्ष्य
बदलने पर गिनती नहीं मिटती। कोई श्रेणी-प्रतिस्पर्धा या स्ट्रीक नहीं।

**वैकल्पिक दैनिक स्मरण** — अगर आप चाहें, तो रोज़ लगभग एक समय पर एक चुपचाप सूचना
समर्थन के साथ स्मरण दिखाई देती है। यह सुविधा स्थानीय सूचना के रूप में चलती है; आपके फ़ोन की
बैटरी या सिस्टम सेटिंग्स से समय थोड़ा बदल सकता है।

**गोपनीयता** — कोई खाता नहीं, कोई विज्ञापन नहीं। आपकी जाप गिनती और सेटिंग्स केवल इस डिवाइस पर
सहेजी जाती हैं।

**क्या अभी नहीं है** — इस संस्करण में सामग्री का बड़ा हिस्सा नमूना या समीक्षा-लंबित है और वैसे ही
स्पष्ट रूप से चिह्नित है। कोई पर्व-तिथि, तिथिगणना या मुहूर्त दावा नहीं किया जाता।

This description states facts only: no "best", "most trusted", verification promises, dates-mastered
claims, or outcome guarantees. Every screen name and capability matches shipped behaviour.

## 4. Concise English description (for future use)

Bhakti Daily is an Android-first, Hindi-first devotional companion: calm daily reflections, japa
counting (27/54/108) with locally saved progress, structured puja-guide outlines, and an optional
local daily reminder. All religious entries carry a visible review status (sample / pending review /
reviewed with source). Calendar entries show only review-verified dates, when a named panchang
source, reviewer, region and tradition exist; nothing is published before review. No account, no
ads, no analytics; data stays on the device.

## 5. Core feature list

1. दैनिक हिन्दी चिंतन (currently sample-labelled)
2. जाप काउंटर — 27/54/108 targets, local persistence, confirmed reset
3. पूजा रूपरेखा मार्गदर्शिकाएँ (currently sample/pending-labelled), search + category filters
4. कैलेंडर month grid with today/selected states and verified-only upcoming list
5. वैकल्पिक दैनिक स्थानीय सूचना (approximate time)
6. लाइट/डार्क/सिस्टम थीम
7. Complete device-internal data — no account required

## 6. Hindi-first statement

पूरा ऐप प्रमुखता से हिन्दी में है; प्रत्येक स्क्रीन, लेबल और सूचना हिन्दी में है। अंग्रेज़ी या
अन्य भाषा का विकल्प जानबूझकर उपलब्ध नहीं है — पूर्ण समीक्षित अनुवाद हुए बिना आंशिक
अनुवाद प्रकाशित नहीं किया जाएगा।

## 7. Calendar limitations (accurate)

- **No real panchang data yet.** The calendar ships only clearly-labelled sample rows generated for
  UI structure; no festival date, tithi, muhurat or sunrise time is claimed real.
- The "आगामी अवसर" section on Home shows only entries whose `reviewStatus` is `reviewed` (currently
  none, so it shows an honest empty state).
- Dates become available only after a named panchang source, reviewer, and explicit region + calendar
  tradition are recorded in the app's source register (D1–D5 awaited with the owner).
- The app does not compute sunrise/sunset or muhurat timing, and requests no location permission.

## 8. Optional reminders (accurate)

- Reminders are optional and local; the notification permission is requested **only after** the user
  turns the reminder on.
- One reminder at a time, replaced (not duplicated) on time change; cancelled when disabled.
- Delivery time is approximate; the app does not request exact-alarm permission and states on-screen
  that battery/system settings can shift the time.

## 9. Disclosure — content still under review

**इस ऐप में धार्मिक सामग्री अभी समीक्षा जारी है।** Every religious-looking entry displays its status:
समीक्षित (reviewed, with source), समीक्षा बाकी (pending review), or नमूना (sample). This listing text
must ship together with the disclosure; until content is actually reviewed, the listing must not
depict sample screens as verified.

## 10. Suggested search keywords

बंद: bhakti, bhakti app, hindu bhakti, daily devotion, devotional app, jaap, japa counter, mantra
counter, puja guide, pooja vidhi, aarti, diwali, navratri, ramayana, bhagavad gita, panchang,
muhurat, show me dates, free, offline, best, no. 1

keywords selected: भक्ति, भजन, पूजा, जाप, जप काउंटर, दैनिक भक्ति, हिन्दी साधना, चिंतन, मार्गदर्शिका,
स्मरण अनुस्मारक

- These are 1:1 with actual features (counter, guides, reminder, calendar). Terms such as panChang,
  muhurat, tithi or "all festivals" are deliberately excluded because the app ships no such data.
- Avoid keyword-stuffed repetitions of भक्ति, unrelated traditions, competitor names, "2026 best",
  or promises of specific religious dates.

## Icon & splash asset review (actual files inspected)

| Asset | State | Assessment |
| --- | --- | --- |
| `assets/images/icon.png` (app store/dev icon) | **Expo template artwork** (blue gradient, generic "A") | Not suitable for store presence — replace with a branded warm ivory/saffron mark, e.g. a diya or om-inspired 1024×1024 icon; keep symbol/wordmark restrained |
| `assets/images/android-icon-foreground.png` + background + monochrome | Also the template mark | Replace all three layers together so the subtle-monochrome layer stays meaningful on Android 13+ |
| `assets/images/splash-icon.png` | Template mark, currently unused by config | Either remove from the repo or use after rebranding; splash currently uses brand colours only, which is acceptable |
| `assets/images/expo-badge.png`, `react-logo*.png`, `logo-glow.png`, `tutorial-web.png`, `tabIcons/*` | Template leftovers unused by the shipped config | Safe-cleanup candidates — verify nothing references them before deletion (initial scan shows only `app.json`-referenced assets matter; run `npx expo export` after cleanup to confirm) |
| `assets/expo.icon/` | iOS Icon Composer template | Either refresh for a branded iOS icon or leave until iOS is in scope |

Concrete improvement proposal: one warm-ivory/saffron master artwork (diya or ॐ mark + हिन्दी-first
type treatment), exported to: icon 1024², adaptive foreground/background/monochrome per Android
adaptive-icon rules, plus a matching monochrome; no new external service needed beyond an image editor.

## Screenshot checklist (genuine device screenshots only — from this milestone's QA device where noted)

1. **Home** — greeting, honest prayer slot, Jaap-first quick actions, verified-only upcoming state
   (✅ screenshot exists from device QA; light + dark variants)
2. **Calendar** — month grid view with today selected; include the visible नमूना warning notice
   (✅ from device QA, 360dp dark)
3. **Puja detail** — a single guide detail showing the "नमूना" label and honest "यह पूजा विधि नहीं है"
   notice (✅ exists from device QA)
4. **Jaap** — counter with progress and target chips (✅ exists from device QA; shows 5/27 real state,
   acceptable; prefer a neutral count like 27/108 for listing)
5. **Settings** — दैनिक स्मरण + दिखावट + भाषा (हिन्दी-प्राथमिक) sections (✅ from device QA, light)
6. Contact / privacy screens — optional, low visual value; skip unless required

Rules: never fabricate or composite UI; never display sample rows as if verified; keep the system
status bar clean; capture both light and dark; same device (360 dp class, correct language) for all
screenshots for consistent look.
