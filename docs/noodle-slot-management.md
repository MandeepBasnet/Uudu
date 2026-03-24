# Noodle Slot Management — Feature Guide

The admin Edit page manages a fixed shelf of **30 noodle slots** (N01–N30). Each slot holds one noodle product. Slot numbers are assigned dynamically at runtime based on a saved sort order — they are not fixed to any product permanently.

---

## Current Features

### 1. Edit

Every noodle on the shelf can be fully edited from the admin panel.

**How to use:**
1. Click any noodle card in the left sidebar to open its edit form.
2. Modify any of the following fields:
   - **Name** — display name shown on the menu
   - **Price** — numeric price (e.g. `4.25`)
   - **Status** — `available`, `coming_soon`, or `out_of_stock`
   - **Flavor Tags** — comma-separated tags (e.g. `Spicy, Savory`)
   - **Origin** — country/region of origin
   - **Heat Level** — spice level rating
   - **Cooking Instructions** — step-by-step prep notes
   - **Image** — upload a new product photo (opens the crop tool, see below)
3. Click **Save** to commit changes to Appwrite.

**Image Upload & Crop Tool:**
- When you select a new image file, a crop modal opens automatically.
- Pan by dragging the image; zoom in/out using the slider (0.2× – 4×).
- Use the aspect ratio presets: **Free**, **Portrait 3:4**, **Square 1:1**, or **Landscape 4:3**.
- Zooming out beyond the image edge fills those areas with a **transparent background** (exported as PNG), shown as a checkerboard in the preview.
- Click **Crop & Upload** to apply and save. The new image appears immediately on the menu.

---

### 2. Shuffle (Drag & Drop Reorder)

Shuffle Mode lets you change the order of noodles on the shelf — which product appears as N01, N02, N03, etc.

**How to use:**
1. Click the **Shuffle** button in the sidebar header to enter Shuffle Mode.
2. The sidebar becomes a reorderable list. Each row shows:
   - A live **preview N-number** (e.g. `→ N04`) reflecting its new position
   - The product name (or a status badge for Coming Soon / Out of Stock items)
   - A drag handle (`⠿`) on the right
3. Drag any row up or down to reorder it.
4. The preview N-numbers update in real time as you drag.
5. Click **Save Order** to persist the new order to Appwrite (`metadata_sort_order`).
6. Click **Cancel** to exit without saving.

**Notes:**
- Slot numbers (N01–N30) are always assigned sequentially from top to bottom — the product at position 1 becomes N01, position 2 becomes N02, and so on.
- The sort order is stored separately from the products themselves, so reordering never modifies product data.
- Coming Soon and Out of Stock items **do not participate in ordering** — they are excluded from the N01–N30 slot assignment and their N-number is not shown anywhere.

---

### 3. Add Blank Noodle

While in Shuffle Mode, you can insert a new empty noodle slot at any position on the shelf.

**How to use:**
1. Enter Shuffle Mode (click **Shuffle** in the sidebar).
2. Click **+ Add Blank Noodle** in the footer.
3. A new blank row labeled `New Noodle` appears at the **bottom** of the list.
4. Drag it up to the desired position.
5. Click **Save Order** — the blank slot is created in Appwrite and all noodles below the insertion point shift down by one.
6. After saving, click the new blank slot in the sidebar and fill in its details using the Edit form.

**Shelf capacity rules:**
- The shelf holds a maximum of **30 active slots** (N01–N30).
- If the shelf is already at 30 items when you add a blank, the noodle currently at position N30 is pushed to position 31 — it becomes **unavailable** (no slot number) until another item is removed.
- To free up a slot, delete an existing noodle or change its status to Coming Soon or Out of Stock (which hides it from the customer menu without deleting it).

---

## Slot Number Reference

| Display ID | Meaning |
|---|---|
| N01 – N30 | Active slots visible on the customer menu |
| No display ID | Item exists in the database but exceeds the 30-slot limit; not shown on menu |
| Coming Soon badge | Slot is reserved; product card is shown but not clickable on the menu |
| Not Available badge | Slot is reserved; product card is shown with a "Not Available" overlay |
