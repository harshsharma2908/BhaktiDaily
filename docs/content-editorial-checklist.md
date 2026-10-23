# Content editorial checklist

Use this checklist before any religious content moves from `sample` or `pending-review` to
`reviewed`. Passing the code checks is not a substitute for this editorial review.

## 1. Define the scope

- [ ] The content type is identified: devotional reflection, puja guide, calendar observance or
      source note.
- [ ] The target audience and language are explicit. The app currently ships Hindi (`hi`) only.
- [ ] For calendar content, the location and calendar/panchang tradition are named before research
      begins.
- [ ] For puja content, the lineage or tradition is named, or the content is explicitly marked as a
      generally accepted practice with a source.
- [ ] The product owner has approved the content type and scope.

## 2. Collect the source

- [ ] The source was supplied or checked by a person, not generated from model memory.
- [ ] The source title, publisher, kind and language are recorded in the source register.
- [ ] A URL is included only when a real, checked URL exists.
- [ ] Publication and access dates use real `YYYY-MM-DD` dates.
- [ ] The source's region and tradition are recorded when they affect the content.
- [ ] The source's reproduction rights are known and recorded.
- [ ] Any conflict with another source is written down rather than silently resolved.

## 3. Calendar review

- [ ] The date is a real Gregorian date in `YYYY-MM-DD` form and corresponds to the date the app
      should display.
- [ ] The source's location, timezone and calendar tradition are recorded.
- [ ] Tithi, muhurat, sunrise or other time-dependent details come from the named source; none are
      inferred or calculated by guesswork.
- [ ] The date is checked against the source by a named reviewer.
- [ ] Regional or panchang variants are recorded in `variationNote`.
- [ ] The entry does not imply that a local date is universal when the source is location-specific.

## 4. Puja guide review

- [ ] The guide has a named source and an applicable tradition.
- [ ] Materials are complete enough to follow the source, or the guide explains why none are needed.
- [ ] Steps are ordered and non-empty.
- [ ] The wording does not add ritual rules, quantities or substitutions that the source does not
      support.
- [ ] Safety-sensitive or accessibility-sensitive wording is reviewed by a human.
- [ ] Variations between traditions are recorded instead of blended into one authoritative-sounding
      sequence.
- [ ] The guide is clearly marked as guidance, not a guarantee of religious merit or outcome.

## 5. Reflection and quotation review

- [ ] The title and body are attributed to the correct author, text or app author.
- [ ] A quotation is checked word-for-word against the named edition or translation.
- [ ] The translation and language are identified.
- [ ] The app does not present app-authored sample copy as a scriptural quotation.
- [ ] The source's reproduction rights allow the amount of text shown.
- [ ] Large third-party passages are not copied without explicit permission.

## 6. Review and provenance

- [ ] A named reviewer has reviewed the content against the source.
- [ ] `reviewedBy` contains that reviewer's name or stable identifier.
- [ ] `lastReviewedOn` is the actual review date in `YYYY-MM-DD` form.
- [ ] `reviewStatus` is `reviewed` only after the review is complete.
- [ ] `sourceIds` contains every source used.
- [ ] `scope` records the applicable region and/or tradition.
- [ ] `variationNote` records any uncertainty, alternative practice or unresolved conflict.
- [ ] The content no longer carries sample or pending status in the UI.

## 7. Data and validation

- [ ] The source is in `src/content/sources.ts` and its ID is unique.
- [ ] The content ID is stable and unique across reflections, pending content, calendar entries and
      puja guides.
- [ ] Required fields are filled; no title, body, step or description is blank.
- [ ] Every source reference resolves to a register entry.
- [ ] Dates pass the structural date-key check.
- [ ] `npm test` passes, including the shipped-library validation test.
- [ ] No screen hard-codes a sample label for content that is now reviewed.
- [ ] The source and review details are visible with the content in the UI.

## 8. Copyright and publication

- [ ] `link-only` sources are linked or summarized, not copied at length.
- [ ] `permission-granted` sources have a recorded permission reference.
- [ ] `public-domain` claims are checked for the intended distribution territories.
- [ ] `unknown` rights block publication as reviewed content.
- [ ] The product owner has approved the final wording and source attribution.
- [ ] The content can be corrected or withdrawn without rewriting a screen component.

## 9. What the code can and cannot check

The validation layer checks structure and provenance: duplicate IDs, missing required strings,
invalid URLs, date formats, source references, review metadata and empty guide steps.

It does **not** check whether a festival date is correct, whether a tithi or muhurat is accurate,
whether a mantra is authentic, whether a ritual sequence is valid, or whether a quotation is
faithful to its source. Those are human editorial and religious-review responsibilities.
