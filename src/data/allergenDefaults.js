// Fallback allergen text shown when an item has no `allergen` value saved in Appwrite.
// Admins can override per-item via /edit; when the field is left blank, these defaults
// are displayed on the menu detail panels.
export const ALLERGEN_DEFAULTS = {
  ramen:
    "Please refer to each product's packaging for detailed allergen information.",
  beverages:
    "Please refer to each product's packaging for detailed allergen information.",
  toppings:
    "Our toppings are prepared in-house and may contain or come into contact with common allergens (milk, eggs, peanuts, tree nuts, soy, wheat, sesame, fish, shellfish, msg). Ingredient details available on request. Shared equipment and oil prevent allergen-free preparation.",
  side_dishes:
    "Our side dishes are prepared in-house and may contain or come into contact with common allergens (milk, eggs, peanuts, tree nuts, soy, wheat, sesame, fish, shellfish, msg). Ingredient details available on request. Shared equipment and oil prevent allergen-free preparation.",
};

// Returns the saved allergen text if present (non-empty), otherwise the default for that type.
export const resolveAllergen = (value, type) =>
  (typeof value === "string" && value.trim()) || ALLERGEN_DEFAULTS[type] || "";

// Raw Food Advisory applies only to Toppings and Side Dishes. When left blank,
// items fall back to "N/A"; specific items (e.g. the extra-crispy egg) carry the
// full undercooked-food statement, editable per item via /edit.
export const RAW_FOOD_ADVISORY_DEFAULT = "N/A";

export const resolveRawFoodAdvisory = (value) =>
  (typeof value === "string" && value.trim()) || RAW_FOOD_ADVISORY_DEFAULT;
