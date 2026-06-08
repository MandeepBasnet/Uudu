# Changelog

## [1.3.1] - 2026-05-13

### Fixed
- Topping price indicator is now a **circle** (was a triangle). Same color logic — Black free, Green $0.40, Blue $0.75, Orange $1.10.
- Beverages and Side Dishes on the menu use the same square-fill image style as Toppings — small or portrait images now fill the card uniformly.

### Changed
- **Sides** section moved between **Toppers** and **BÊV** in both the section flow and the top navigation bar.

## [1.3.0] - 2026-05-06

### Added — Side Dishes (replaces Snax)
- New `side_dishes` Appwrite collection (SD01–SD04).
- Migrated from toppings: T28 → SD01 Crispy Pork Egg Roll, T29 → SD02 K-Spam Crunch, T30 → SD03 Fish Balls with Egg Roe. T28/T29/T30 deleted from toppings.
- New SD04 Popcorn Chicken (no image yet — upload via edit panel).
- New **SideDishInfo** detail panel; price circle defaults to pink `#FF66FF`.
- Snax category renamed to **Sides**; description updated to remove "coming soon" language.

### Added — Beverages
- New `beverages` Appwrite collection (B01–B26) seeded from the supplier spreadsheet.
- BÊV section on the menu wired to live data — clicking a drink opens **BeveragesInfo**.
- BÊV category description updated; no longer shows "Coming Soon" placeholder.

### Added — Edit panel
- New **Side** tab alongside Ramen / Toppings / Bêv. Fields: status, name, description, price, color dropdown.
- New **Color** dropdown on toppings, ramen, and side dish forms. Selecting **Auto** uses the price-tier default; explicit choices override.
  - Toppings: Auto / Black / Green / Blue / Orange
  - Ramen: Auto / Red / Gray / Yellow
  - Side dishes: Auto / Pink / Black / Green / Blue / Orange
- `color_code` attribute added to ramen, toppings, and side_dishes collections.
- Display ID shown alongside slot ID when they differ (e.g. `B03 (slot: B01abc123)`).

### Changed — Pricing (per supplier price sheet)
- Noodles N01–N24, N27–N29: $5.75 → **$6.00**.
- Noodle N30: $8.75 → **$8.50**.
- Toppings T02/T07/T09/T11/T17 (Corn, Mayo House, Butter, Chili Oil, Lime): $0.35 → **$0.40**.
- Toppings T01/T03/T13/T14/T18/T19/T20/T22 (Bok Choy, Kimchi, Rocket Boosters, Cheeses, Cheetos, Hard Boiled Egg): $0.70 → **$0.75**.
- Side dishes (was T28/T29/T30): $1.75 → **$2.75**.

### Changed — Price color codes
- Noodle circle: Red `#FF0000` ($4.75) / Gray `#BFBFBF` ($6.00) / Yellow `#FFFF00` ($8.50).
- Topping circle: Black `#000000` (free) / Green `#00DE64` ($0.40) / Blue `#53D2FF` ($0.75) / Orange `#FF8B28` ($1.10).
- Side dish circle: Pink `#FF66FF` ($2.75).

## [1.2.0] - 2026-05-05

### Changed — Infrastructure
- Migrated all data from Appwrite Cloud (`sgp.cloud.appwrite.io`) to self-hosted instance (`appwrite.itsoch.com`).
  - 54/54 storage files transferred.
  - 32 ramen + 30 toppings documents migrated; collection schemas, attributes, and indexes copied.
- Post-migration fixes: image URLs rewritten from cloud to local endpoint; collection and bucket permissions reset; admin user recreated.
- `.env` removed from `.dockerignore` so Vite picks up the local Appwrite endpoint at build time.

### Added
- Migration scripts: `migrate_database_to_local.js`, `migrate_files_to_local.js`, `fix_image_urls.js`, `fix_collection_permissions.js`, `fix_bucket_permissions.js`, `create_admin_user.js`.

### Fixed
- Login flow: existing session is now deleted automatically on re-login instead of throwing an error.

## [1.1.0] - 2026-03-24

### Added
- **Shuffle Mode** — drag-and-drop reordering of the noodle shelf in the admin Edit page. Live N-number preview updates as you drag. Order persists via `metadata_sort_order` in Appwrite.
- **Add Blank Noodle** — insert a new empty noodle slot at any N-slot position in Shuffle Mode. Noodles below the insertion point shift down (e.g. N29 → N30); if the shelf is already full, the last item is pushed past N30 and becomes unavailable (limit is 30 active slots).
- **Image Crop Tool** — interactive crop modal on image upload with pan, zoom (0.2×–4×), and aspect ratio presets (Free, Portrait 3:4, Square 1:1, Landscape 4:3). Exports as PNG with transparent background.
- Permanent delete option for Coming Soon / OOS items in shuffle mode.
- Ramen shelf visual diagram on the edit page.

### Fixed
- Coming Soon / Out of Stock noodles no longer display their raw N-number in the admin sidebar — only a status badge is shown.
- Topping images uploaded via admin now correctly appear on the `/menu` page (was prepending `/images/` to full Appwrite URLs).
- Card images no longer overlap the N-number chip — reserved clearance at the bottom of every card frame.
- Coming Soon / OOS noodles excluded from N-slot ordering — slots only count available items.

## [1.0.0] - initial release
