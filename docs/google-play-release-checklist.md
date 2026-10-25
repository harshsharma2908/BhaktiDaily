# Bhakti Daily — Google Play release preparation checklist (Day 7)

**Status: DRAFT — for the owner to work through. Nothing has been submitted, uploaded, purchased,
an account created, or account settings changed.** Where a current rule must be confirmed the exact
official documentation is named so the owner can check the live requirement at submission time;
this document deliberately avoids guessing current thresholds.

## 1. Developer account

- [ ] Owner confirms the Google Play Console developer account exists and identity/address
      verification status (Play Console: Settings → Developer account). No account was created here.
- [ ] Owner confirms the account type (individual vs organisation) — it affects required testers for
      closed testing. See: https://support.google.com/googleplay/android-developer/answer/10669792
      (personal account testing requirements — confirm the live numbers yourself at submission).
- [ ] One-time registration fee (paid by owner only).

## 2. App identifier and build

- [ ] Decide the final application ID (`android.package` in `app.json`). None exists yet — this is a
      release blocker. Never change it after first submission.
- [ ] Set the first `android.versionCode` and `version` explicitly (currently only
      `version: 1.0.0` exists; no versionCode).
- [ ] Create the build pipeline: add `eas.json` with a production profile (or document any manual
      `gradle`-based flow). `npx eas-cli@latest build` — see https://docs.expo.dev/build/introduction/
- [ ] Signing: Play App Signing key managed by Google or an uploaded key; record the upload key
      safely. See https://docs.expo.dev/app-signing/app-identity/
- [ ] Produce and verify a real `.aab` artifact on a device before any listing work continues.

## 3. Store listing assets

- [ ] Branded icon 512×512 PNG (currently the Expo template artwork — blocker).
- [ ] Featured graphic 1024×500; consider a Promo video (optional).
- [ ] Phone screenshots from **real device captures** per `docs/store-listing-draft.md`
      (Home/Calendar/Puja detail/Jaap/Settings; light+dark; no fabricated UI; no sample content
      presented as verified).
- [ ] App category (e.g. Lifestyle / Books & Reference — owner choice) and content description text
      from `docs/store-listing-draft.md` (owner-approved Hindi).
- [ ] Tags/keywords consistent with section 10 of the listing draft; no misleading date/panchang claims.

## 4. Privacy / Data safety

- [ ] **Privacy policy URL** — the app currently has only an honest in-app draft and no hosted
      policy. Owner must publish a policy URL (no invented URL). See
      https://support.google.com/googleplay/android-developer/answer/9888379
- [ ] **Data safety declaration** — mirror the audit in `docs/release-readiness.md` section D:
      no data collected/off-device, no sharing; local storage only; notifications local-only.
      The owner (not a template) must answer Play Console questions truthfully. See
      https://support.google.com/googleplay/android-developer/answer/10787469
- [ ] Permissions declaration: the release build will request only `POST_NOTIFICATIONS`
      (via `expo-notifications`). No location, contacts, storage, camera etc. Verify the merged
      manifest of the real `.aab` (`aapt2 dump badging`) before review.
- [ ] Confirm there is no background-location, advertising ID, or other sensitive declaration need.

## 5. Content rating

- [ ] Complete the IARC content-rating questionnaire (owner). Expected: no ads, no user-generated
      content, no sensitive themes enforcement issues; religious guidance is not itself restricted
      content, but answer honestly. See https://support.google.com/googleplay/android-developer/answer/188189

## 6. App access

- [ ] "All functionality available without restrictions" — no login, so no credentials need to be
      provided to reviewers. Confirm the empty Contact screen does not trigger a reviewer complaint
      about broken features (it is clearly labelled as "available later"; consider owner choice to
      keep or drop it for listing screenshots).

## 7. Target API and platform requirements

- [ ] Confirm the current target-API-level requirement for Play submissions at the time of upload
      (it advances yearly; check the live policy —
      https://support.google.com/googleplay/android-developer/answer/11926878 — rather than trusting
      this document). With Expo SDK 58 / RN 0.88 the build tooling targets a modern API level; verify
      the produced artifact's `compileSdk/targetSdk` after the first successful build.
- [ ] Confirm 64-bit support is satisfied by the build outputs (should be with current Expo defaults).

## 8. Testing / production access

- [ ] Start with closed (internal) testing track per the recommendation in
      `docs/release-readiness.md` §G; upload the verified `.aab`, add the owner + chosen testers.
- [ ] Personal developer accounts may have a required minimum number of closed testers and days in
      testing before production access — check the live requirement on the Play Console page listed
      in §1 instead of trusting any number written here.
- [ ] Plan a Testing/production-access questionnaire answer if asked (no account needed; all
      features open).

## 9. Policy areas worth a second look before submission

- [ ] **Health/financial claims**: ensure no description or screenshot implies guaranteed outcomes
      of religious practice (the listing draft already excludes such wording).
- [ ] **Impersonation/IP**: mantra text, scripture quotations, puja instructions must not ship
      without the source register cleared for reproduction rights (currently nothing religious is
      reviewed at all, so there is nothing to infringe — keep it that way until D1–D5 complete).
- [ ] **Misleading claims**: the calendar must not be described as a panchang or "all festivals"
      source (listing draft intentionally avoids this).
- [ ] Confirm the behaviour at any future update that adds backend/sync — Data Safety answers would
      change; the in-app privacy screen must be updated in the same release.

## 10. Submission sequence (once blockers clear)

1. Package ID + versionCode + eas.json + first `.aab` build + device install test.
2. Branded icon set + final screenshots.
3. Owner-approved listing text (`docs/store-listing-draft.md`).
4. Privacy policy URL + Data Safety answers.
5. IARC rating questionnaire.
6. Internal-testing track → owner verification → broaden as chosen.
