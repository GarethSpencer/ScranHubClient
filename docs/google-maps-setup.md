# Google Maps Platform setup

The "Add Venue" flow uses **Google Places Autocomplete** so users can pick a real
place instead of typing a free-text name. This document records how the Google
Cloud project is configured, so the setup can be reproduced or audited later.

The integration is **optional**: if `VITE_GOOGLE_MAPS_API_KEY` is not set (or the
Maps script fails to load), the venue form silently falls back to a plain text
input. Nothing breaks without a key.

## What the client calls

The autocomplete component ([`src/components/common/PlaceAutocomplete.tsx`](../src/components/common/PlaceAutocomplete.tsx))
makes exactly two kinds of request:

| User action            | Google operation                                                                               | Billing SKU                                |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Typing in the search   | `AutocompletePlacesRequest`                                                                    | Autocomplete Requests (10k/mo free)        |
| Selecting a suggestion | `GetPlaceRequest` (Place Details, fields: `displayName`, `formattedAddress`, `location`, `id`) | Place Details **Essentials** (10k/mo free) |

Those fields are **Essentials tier** — the cheapest Place Details tier. It does
not touch Pro (phone/hours/ratings) or Enterprise (reviews) fields.

The app does **not** render a map yet, so the Maps JavaScript API "map loads" SKU
is effectively unused. (A map view on the venue detail page is a future feature
that also needs backend changes to store the Place ID — see "Future work".)

## Google Cloud project

- **Project:** `scranhub-498909`
- **Billing:** a billing account is attached (Google requires a card on file; there
  is no anonymous tier). Billing being enabled does **not** mean you will be charged
  — see the cost controls below.

### APIs enabled

- **Maps JavaScript API**
- **Places API (New)** — note: the _New_ one, not the legacy "Places API".

## API key

One key (`Maps Platform API Key`) is used by the whole frontend. A single key can
serve multiple APIs; you do not need one key per API.

### Application restrictions (Websites / HTTP referrers)

- `localhost:*` — local development
- `www.scranhub.uk/*` — production

> **Referrer restriction is the weakest control** — the `Referer` header is honest
> in real browsers but can be forged by scripted (non-browser) clients. It stops
> casual reuse of the key from another website; it is **not** a defence against a
> determined attacker. The API + quota restrictions below are the real protection.

### API restrictions

The key is restricted to **only**:

- Maps JavaScript API
- Places API (New)

Even if the key is extracted from the production bundle (it is client-side, so it
is always extractable), it cannot be used against any other Google API.

### Two-key plan for production (recommended, not yet done)

Because the production key ships in the public JS bundle, the cleaner setup is two
keys:

- **Dev key** — referrer `localhost:*` only. Lives only in local `.env.development`.
- **Prod key** — referrer `www.scranhub.uk/*` (and `scranhub.uk/*` if the bare
  domain serves the app directly) — **no** localhost. This is the one that is
  deployed/exposed.

This keeps the publicly-exposed key from allowing localhost. Until this is done, a
single localhost-allowed key is used everywhere.

## Cost controls (so the project is never charged)

Layered defence, strongest first:

1. **Per-day quota caps (hard limit).** A Cloud Console _budget_ only sends alerts —
   it does **not** stop spend. The real cap is the per-API **quota**. Once a daily
   quota is exhausted, further requests are **rejected (HTTP 429 / `OVER_QUERY_LIMIT`),
   not billed**, and the component falls back to the plain text input.

   | API / quota                            | Value |
   | -------------------------------------- | ----- |
   | Maps JS — Map loads per day            | 100   |
   | Places — AutocompletePlacesRequest/day | 100   |
   | Places — GetPlaceRequest per day       | 100   |

2. **Unused quotas zeroed.** Every Places/Maps endpoint the app does **not** call has
   its **per-day quota set to `0`** so a stolen key cannot run them up. These include:
   `SearchTextRequest`, `SearchNearbyRequest`, `GetPhotoMediaRequest`,
   `SearchMediaRequest`, `SearchReviewPostsRequest` (Places), and `3D Map loads`,
   `Maps Grounding Widget` (Maps JS). The per-minute rows for these are left as-is —
   the per-day `0` is the binding limit, so they cannot be used regardless.

   > **Remember:** if a future feature legitimately needs one of these endpoints
   > (e.g. nearby search), it will fail with a quota error until that endpoint's
   > per-day quota is raised back up.

3. **Quota usage alerts (80%).** Cloud Monitoring policies email when any of the
   three active quotas reaches 80% of its 100/day cap.

4. **Budget alert (£1/month, universal backstop).** Scoped to **all services**, so it
   catches spend on _any_ SKU — including one we forgot to alert on. Thresholds at
   **1% (£0.01)**, 50%, 100%, 150%, emailing billing admins. The 1% trigger means an
   email arrives as soon as _any_ real charge appears.

### Free allowances (verify against live pricing)

Both billable SKUs the app uses have a **10,000/month free allowance**
(Autocomplete Requests; Place Details Essentials). With each capped at 100/day
(~3,100/month worst case), usage stays well inside the free tier. Google's pricing
moved to Essentials/Pro/Enterprise tiers — confirm current numbers at
<https://developers.google.com/maps/billing-and-pricing/pricing>.

### Residual risk: availability, not cost

The low daily caps protect **cost** but mean a stolen key could exhaust the 100/day
autocomplete budget and force _real_ users onto the plain-text fallback for the rest
of the day. This is a denial-of-service on the feature, not a billing problem, and is
an accepted trade-off for a hobby app. (Firebase App Check could mitigate it but is
overkill here.)

## Local development

Add the key to `.env.development` (gitignored — never committed):

```dotenv
VITE_GOOGLE_MAPS_API_KEY=your-key-here
```

Vite reads env vars **at startup**, so restart `npm run dev` after adding it.

## Place data persistence (done)

The selected place is persisted end-to-end. The backend stores four nullable
fields on `GroupVenue` — `GooglePlaceId` (`varchar(255)`), `FormattedAddress`
(`nvarchar(512)`), `Latitude`/`Longitude` (`decimal(8,6)`/`decimal(9,6)`) — and
they flow through `CreateGroupVenueRequest`, `UpdateGroupVenueRequest`, and
`GroupVenueResult` (camelCase on the client, PascalCase on the API).

Behaviour, by design:

- **Create** is all-or-nothing: picking a place sends all four fields; typing a
  name manually (or editing the name after picking) sends none, so we never store a
  place ID that doesn't match the saved name.
- **Edit** preserves the place data ("Option B"). The edit modal has no place
  search, so it passes the venue's existing values straight through — renaming a
  venue keeps its pin/address rather than dropping it. The known trade-off: renaming
  a venue to a *genuinely different* place leaves the old pin until "Option C" below
  is built.

## Future work

- **Autocomplete in the edit modal ("Option C").** Add the `PlaceAutocomplete`
  widget to `GroupVenueModal` (mirroring the create modal) so a venue can be
  re-anchored to a new place — selecting a place overwrites all four fields, a manual
  name edit clears them. This is the proper fix for the edit-time consistency
  trade-off noted above.
- **Map view** on the venue detail modal — render a map + marker from the stored
  `latitude`/`longitude` (no extra API call needed for the pin). Uses the Maps
  JavaScript API "map loads" SKU; the 100/day cap is already in place for it.
