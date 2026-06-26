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

Add the key (and Map ID) to `.env.development` (gitignored — never committed):

```dotenv
VITE_GOOGLE_MAPS_API_KEY=your-key-here
VITE_GOOGLE_MAPS_MAP_ID=your-map-id-here
```

Both are also injected at build time via the deploy workflow's `env:` block from
repository **Variables** (`vars.*`), matching the other `VITE_*` config.

Vite reads env vars **at startup**, so restart `npm run dev` after adding them.

The Map ID is optional in code — `VenueMap` falls back to Google's `DEMO_MAP_ID`
when it is unset (works, but intended for dev). It does not need its own
referrer/API restrictions; it is just a styling/config reference, and security
still rests on the API key's restrictions.

## Place data persistence (done)

The selected place is persisted end-to-end, and the **backend changes are live in
production** (the four columns exist and the API reads/writes them). The backend
stores four nullable fields on `GroupVenue` — `GooglePlaceId` (`varchar(255)`),
`FormattedAddress` (`nvarchar(512)`), `Latitude`/`Longitude`
(`decimal(8,6)`/`decimal(9,6)`) — and they flow through `CreateGroupVenueRequest`,
`UpdateGroupVenueRequest`, and `GroupVenueResult` (camelCase on the client,
PascalCase on the API). Migrations auto-apply on API startup, so the schema stays
in sync on deploy.

The shared search state for both the create and edit modals lives in the
`useVenuePlaceSearch` hook (`src/hooks/`), which tracks the picked place and
derives the request fields. Behaviour, by design:

- **Create** is all-or-nothing: picking a place sends all four fields; typing a
  name manually (or editing the name after picking) sends none, so we never store a
  place ID that doesn't match the saved name.
- **Edit** (`GroupVenueModal`) has the same place search. Picking a new place
  re-anchors the venue (overwrites all four fields); a manual name edit **preserves**
  the existing place data ("Option B"). The hook is seeded with the venue's existing
  fields via `initialFields`, so editing the name keeps the pin/address unless a new
  place is explicitly chosen. (A venue created by manual typing can also gain a place
  later via the edit search.)

## Map view

The venue detail summary (`RatingDetailsModal`) renders a read-only map via the
`VenueMap` component, with an `AdvancedMarkerElement` pin plotted from the stored
`latitude`/`longitude`. The marker comes from stored coordinates, so it costs only
a **map load** (the Maps JS SKU capped at 100/day) — **no Places API call**. The
formatted address below the map links out to Google Maps, built from the stored
`googlePlaceId` (exact place) or address — also no API call. Venues without
coordinates show no map (and no divider).

`AdvancedMarkerElement` requires the map to be created with a **Map ID**
(`VITE_GOOGLE_MAPS_MAP_ID`, a vector Map ID created in Cloud → Map Management;
`DEMO_MAP_ID` fallback otherwise). Using a Map ID does **not** add a new billing
SKU or quota — it is still the same per-map-load charge under the 100/day cap.

**Dark mode:** the Map ID holds both a light and a dark cloud style, and `VenueMap`
selects between them at render time with `colorScheme: "DARK" | "LIGHT"`, driven by
the app's `useDarkMode()` state. Toggling the app theme rebuilds the map in the
matching scheme. The styles are currently Google's defaults; a branded dark style
can be set in the console's Map style editor with no code change.
