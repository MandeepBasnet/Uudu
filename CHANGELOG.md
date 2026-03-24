# Changelog

## [1.1.0] - 2026-03-24

### Added
- **Shuffle Mode** — drag-and-drop reordering of the noodle shelf in the admin Edit page. Live N-number preview updates as you drag. Order persists via `metadata_sort_order` in Appwrite.
- **Add Blank Noodle** — insert a new empty noodle slot at any N-slot position in Shuffle Mode. Noodles below the insertion point shift down (e.g. N29 → N30); if the shelf is already full, the last item is pushed past N30 and becomes unavailable (limit is 30 active slots).
- **Image Crop Tool** — interactive crop modal on image upload with pan, zoom (0.2×–4×), and aspect ratio presets (Free, Portrait 3:4, Square 1:1, Landscape 4:3). Exports as PNG with transparent background.

### Fixed
- Coming Soon / Out of Stock noodles no longer display their raw N-number in the admin sidebar — only a status badge is shown.
- Topping images uploaded via admin now correctly appear on the `/menu` page (was prepending `/images/` to full Appwrite URLs).
- Card images no longer overlap the N-number chip — reserved clearance at the bottom of every card frame.

## [1.0.0] - initial release
