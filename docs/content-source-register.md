# Content source register

This register is the maintainable record of every source used by Bhakti Daily. It is intentionally
separate from user-facing content so a source can be corrected, replaced or withdrawn without
rewriting a screen component.

The machine-readable register lives in [`src/content/sources.ts`](../src/content/sources.ts).
The editorial review process is in [`content-editorial-checklist.md`](./content-editorial-checklist.md).

## Current status

**Reviewed sources: none.** The register is empty on purpose.

No festival date, tithi, muhurat, mantra, scriptural quotation, prayer or ritual instruction has
been supplied for publication. The entries currently visible in the app are labelled UI samples:

| Area | Current content | Source mapping |
| --- | --- | --- |
| Calendar | Generated neutral rows with IDs beginning `sample-` | No source. These are not real observances or panchang dates. |
| Puja guides | Four sample guide shells | No source. Steps and materials are placeholders. |
| Home reflection | One app-authored sample line | Not a quotation. The UI says it is app sample copy. |
| Home prayer | A pending content slot with no body | No source yet. |
| Reviewed calendar entries | None | None. |

Do not fill an empty source field with a plausible title, URL, publisher or date from memory. A
blank field is an honest unresolved state.

## Register fields

Each source entry has these fields:

| Field | Required | Purpose |
| --- | --- | --- |
| `id` | Yes | Stable machine ID used by content `sourceIds`. |
| `title` | Yes | Human-readable source title. |
| `kind` | Yes | `primary`, `official` or `secondary` (defined below). |
| `url` | If available | Link to the source. Must be a valid `http` or `https` URL. |
| `publisher` | Recommended | Person, institution, temple, trust, journal or publisher responsible. |
| `language` | Yes | Language of the source itself, for example `hi`, `sa` or `en`. |
| `publishedOn` | If known | Publication date as a real `YYYY-MM-DD` date. |
| `accessedOn` | If viewed online | Access date as a real `YYYY-MM-DD` date. |
| `reproduction` | Yes | What the app may legally do with the source text (defined below). |
| `rightsNote` | If needed | Licence, permission reference or copyright caveat. |
| `scope.region` | If applicable | Location the source applies to. |
| `scope.tradition` | If applicable | Calendar, panchang or lineage tradition the source follows. |
| `notes` | If needed | Conflicts, uncertainties, edition details or reviewer caveats. |

## Source kinds

Use the narrowest accurate category:

- **Primary** — the source text or primary record itself: a scripture edition, a primary panchang,
  an original temple or trust record, or a directly published primary document.
- **Official** — a publication issued by the institution responsible for the observance, temple,
  trust or calendar. It is not necessarily a primary text.
- **Secondary** — an academic, encyclopedic or curated explanation that interprets primary or
  official material.

A secondary source can help locate a primary source, but it should not silently become the only
basis for a ritual instruction when a primary or official source is expected.

## Reproduction rights

`reproduction` records what the app may do with the source text:

- **`public-domain`** — the relevant text is confirmed to be free of copyright restrictions in the
  intended distribution territories. Record the basis in `rightsNote`.
- **`permission-granted`** — written permission covers the intended use. Record the permission
  reference in `rightsNote`.
- **`link-only`** — the app may link to or summarize the source but must not reproduce its text.
  Do not paste long quotations under this value.
- **`unknown`** — rights have not been established. A reviewed entry cannot use an `unknown` source;
  structural validation treats that as an error.

Copyright is separate from religious accuracy. A source can be authoritative and still not be
licensed for reproduction.

## Calendar mapping

Use this table when a real calendar entry is supplied. Keep one row per observance and list every
source used, not just the first one.

| Observance ID | Date (`YYYY-MM-DD`) | Title | Source ID(s) | Region | Calendar tradition | Reviewer | Last reviewed | Conflict / variation note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _No reviewed entries_ | — | — | — | — | — | — | — | — |

A reviewed calendar entry must record both a region and a calendar tradition. This prevents an
unqualified date from appearing universal when it depends on location, sunrise, timezone, panchang
rules or a particular tradition.

## Puja and reflection mapping

| Content ID | Type | Source ID(s) | Reviewer | Last reviewed | Variation / uncertainty note |
| --- | --- | --- | --- | --- | --- |
| _No reviewed entries_ | — | — | — | — | — |

For a puja guide, also record the applicable lineage or tradition in the content `scope`. For a
reflection or quotation, record the exact edition and attribution in the content record.

## Recording conflicts

Do not resolve a conflict by deleting the inconvenient source.

1. Keep both source entries in the register.
2. Record the disagreement in the relevant source `notes`.
3. Record the user-facing variation or uncertainty in the content `variationNote`.
4. Ask the named reviewer to choose the wording, date, region or tradition that the app will show.
5. If no reviewer can resolve it, leave the content out or keep it pending. Do not guess.

Examples of conflicts that must be recorded: differing festival dates between panchangs, different
tithi cutoff rules, regional name variants, differing ritual sequences, or a source that gives no
location.

## Adding a source

1. Obtain the source from the product owner or an editor. Do not create a source record from model
   memory.
2. Confirm the title, publisher, source kind, language, dates, scope and reproduction rights.
3. Add the source to `src/content/sources.ts`.
4. Reference its `id` from the content entry's `sourceIds`.
5. Fill `reviewedBy`, `lastReviewedOn`, `scope` and `variationNote` only after the named reviewer has
   actually reviewed the content.
6. Run `npm test`; the content validation test checks the shipped library.
7. Check the screen: a reviewed entry must show its source and review details, not a sample label.

## Open editorial questions

These must be answered by the product owner or a named reviewer before real content is published:

- Which location or locations will the calendar support first?
- Which panchang and calendar tradition will be authoritative for those locations?
- Who is the named reviewer for calendar dates, puja steps and devotional quotations?
- Which sources have permission for text reproduction, and under what terms?
- How should regional or lineage variations be displayed when more than one practice is valid?
- What is the correction and withdrawal process if a published source is found to be wrong?

## Day 6 additions — unresolved editorial decisions (draft pack)

The Day 6 draft pack in [`content-drafts/day6-initial-content.md`](./content-drafts/day6-initial-content.md)
introduces original app-authored devotional prose. It stays outside the app until the following
decisions, each mapped to one of the five register distinctions, are made by the owner. None of
these may be guessed.

| # | Decision needed | Register distinction | Status |
| --- | --- | --- | --- |
| D1 | Are app-authored (non-scriptural) daily reflections an approved content type at all, and if so under which label besides `reviewed`? | Source verification — an app-authored text has no scripture source; its "source" must be defined (e.g. internal editorial authorship) before any status above `sample`. | Open, needs owner |
| D2 | Who reviews the draft reflections and the general prayer-routine draft, and does the reviewer need the same qualifications as a panchang reviewer, or a separate editorial-reviewer role? | Editorial review. | Open, needs owner |
| D3 | No reproduction rights question arises for original prose, **but** if a draft ever quotes any external text, the source must be registered with its reproduction rights first. | Reproduction rights or permission. | Standing rule |
| D4 | The seven reflections are written to be region-neutral; the prayer-routine draft explicitly defers to household tradition. Owner must confirm that region-neutral wording is acceptable for the targeted (North India-first) audience, or state the variation the app should show. | Regional and tradition-specific variation. | Open, needs owner |
| D5 | Final approval for publication of any draft line — including the final Hindi wording — must be given by the product owner; the app copies nothing from the draft file silently. | Final approval for publication. | Open, needs owner |
