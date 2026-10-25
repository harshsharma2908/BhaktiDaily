# Bhakti Daily — product positioning (Day 6)

This document records the initial product strategy adopted in Day 6. It is a working document for
the development team and the product owner; nothing in it is user-facing copy.

## 1. Initial audience

**Primary:** Hindi-speaking everyday Hindu devotees, initially prioritising a North India-oriented
Hindi experience — people who use a devotional companion alongside an already religious daily
household routine.

**Secondary segments:**

- **Beginners** who want to understand basic puja procedures without being lectured.
- **Household festival planners** who organise devotional activities around observances and need
  trustworthy dates and preparation structure.
- **Habit-seekers** who want a small, regular daily prayer or Jaap habit without streak pressure.

**Future audiences (not served in this release):** users who prefer other Indian languages, and
Indians abroad who need location- and tradition-aware calendar support.

## 2. Product promise and positioning

**Positioning:** *Bhakti Daily — रोज़ की भक्ति, सरल और विश्वसनीय*

**Core promise:** a calm, easy-to-use daily companion offering devotional reflections, Jaap,
beginner-friendly puja guides and carefully reviewed Hindu observances.

This promise is deliberately modest. The app does **not** claim to be the most accurate, most
trusted or "best" devotional app; such claims require evidence the project does not yet have.

## 3. What differentiates Bhakti Daily

- Simple Hindi instead of unnecessarily technical or mixed English-Hindi wording.
- A focused daily devotional experience, not an overloaded religious super-app.
- Clear source and editorial-review status on every religious-looking entry.
- Useful local-first functionality (Jaap, reminders, appearance) without requiring an account.
- User-controlled reminders — permission is requested only after explicit user intent.
- Honest handling of uncertainty and regional variation; no invented dates, no unqualified
  panchang claims.

## 4. What is intentionally excluded from the first release

- Backend, login, sync, accounts, subscriptions, ads, analytics, tracking, AI APIs, social features.
- Muhurat, Rahu Kaal, tithi tables and any time-dependent calendar detail until a validated source,
  location and review process exists.
- Festival dates inferred from government holiday lists — holidays are an administrative proxy,
  not a panchang source, and will not be used for date inference.
- Multi-language switching before a complete reviewed translation exists.
- Any claim that a practice guarantees money, health, success or other worldly outcomes.

## 5. Why the initial release is Hindi-first

1. The core audience (primary segment above) is fastest served in natural, familiar Hindi.
2. Hindi-first keeps scope small: quality review, source integrity and calendar trust are worth
   more than extra languages at this stage.
3. A partial translation is worse than none — a mixed-language devotional app feels unreliable.
   (This is why the app shows a clear non-interactive Hindi-first note in Settings instead of a
   language selector.)

## 6. Future language and regional expansion (requires research)

- **Languages:** any second language (for example English or a regional Indian language) needs a
  complete, reviewed translation of all nine routes and the content library — not just UI labels.
- **Regional expansion:** supporting South India, Maharashtra, Bengal, or other traditions requires
  a named panchang/calendrical source per region and a reviewer for each tradition. Northern-India
  conventions cannot silently stand in for other regions.
- **Diaspora use:** location-aware support (timezones, sunrise-dependent fields if ever added,
  region selection) and clarifying which tradition a date belongs to. This materially changes the
  calendar data model and is deliberately deferred.

## 7. Most important questions to ask early testers

1. "आपने ऐप सबसे पहले किस काम के लिए खोला — क्या वह उपयोगी लगा या नहीं?" (What did you open the
   app for, and was it useful?)
2. Is the Hindi natural everywhere? Which words feel alien, technical or disrespectful?
3. Do Jaap users understand that the count persists and is not a daily streak?
4. Do users trust the sample/pending labels, or do they read labelled entries as real data?
5. Is the calendar honest-empty state preferable to a clearly-labelled approximate list? Would they
   rather have a named tradition's approximate list than none?
6. Which festivals matter most to a North-India Hindi household, and in what format would they
   expect to see them?
7. Do the reminders feel optional and respectful, or intrusive?
8. Is anything missing that would stop a household from making the app part of its daily routine?
