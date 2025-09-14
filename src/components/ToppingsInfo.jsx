"use client";

import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import toppingsData from "../data/toppings.json";

const ToppingsInfo = ({ product, onBack }) => {
  // Use the product prop if provided, otherwise default to first topping
  const selectedTopping = product || toppingsData.toppings[0];

  // Extract spiciness level from text (e.g., "8 out of 10 flames" -> 8)
  const getSpicyLevel = (spicinessText) => {
    if (!spicinessText) return 1;
    const match = spicinessText.match(/(\d+)\s*out\s*of\s*10/);
    return match ? Number.parseInt(match[1]) : 1;
  };

  // Flame SVG (from RamenInfo) with dynamic colors via palette per variant
  const FlameSvg = ({ variant }) => {
    const id = useId();
    const gradientId = `flame-grad-${variant}-${id}`;
    const palette = {
      mild: { outer: "#22c55e", start: "#86efac", end: "#16a34a" },
      medium: { outer: "#f97316", start: "#fb923c", end: "#f59e0b" },
      hot: { outer: "#ef4444", start: "#f87171", end: "#ef4444" },
      fiery: { outer: "#111827", start: "#6b7280", end: "#111827" },
    };
    const { outer, start, end } = palette[variant] || palette.mild;

    return (
      <svg
        width="26"
        height="26"
        viewBox="0 0 384 511.4"
        role="img"
        aria-label={`${variant} level flame`}
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        imageRendering="optimizeQuality"
      >
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1="163.52"
            y1="286.47"
            x2="163.52"
            y2="500.71"
          >
            <stop offset="0" stopColor={start} />
            <stop offset="1" stopColor={end} />
          </linearGradient>
        </defs>
        <path
          fill={outer}
          d="M77.46 228.43C65.33 119.85 128.78 43.48 247.72 0c-72.85 94.5 62.09 196.88 69.53 295.03 17.44-29.75 27.34-69.48 29.3-122.55 89.18 139.92 15.25 368.59-181.02 335.73-18.02-3.01-35.38-8.7-51.21-17.17C42.76 452.8 0 369.53 0 290c0-50.69 21.68-95.95 49.74-131.91 3.75 35.23 11.73 61.51 27.72 70.34z"
        />
        <path
          fill={`url(#${gradientId})`}
          d="M139.16 372.49c-21.83-57.66-18.81-150.75 42.33-183.41.43 107.03 103.57 120.64 84.44 234.9 17.64-20.39 26.51-53.02 28.1-78.75 27.96 65.38 6.04 117.72-33.81 144.37-121.15 81-225.48-83.23-156.11-173.26 2.08 20.07 26.14 51.12 35.05 56.15z"
        />
      </svg>
    );
  };

  // Clean, reusable label pill
  const LabelPill = ({ text, variant }) => {
    const classByVariant = {
      mild: "text-green-700 border-green-300",
      medium: "text-orange-700 border-orange-300",
      hot: "text-red-700 border-red-300",
      fiery: "text-gray-700 border-gray-300",
    };
    return (
      <span
        className={`inline-flex items-center justify-center h-7 min-w-[72px] px-3 rounded-full border bg-white/95 text-sm font-medium tracking-wide shadow-sm ${classByVariant[variant]}`}
      >
        {text}
      </span>
    );
  };

  // Generate flame icons and guideline based on spiciness level
  const generateFlames = (level) => {
    const flames = [];
    const getVariantForIndex = (i) => {
      if (i <= 2) return "mild";
      if (i <= 5) return "medium";
      if (i <= 8) return "hot";
      return "fiery";
    };

    for (let i = 1; i <= 10; i++) {
      flames.push(
        <div
          key={i}
          className="w-7 h-7 flex items-center justify-center relative"
        >
          {i === level && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="mb-0.5 text-[10px] leading-none font-semibold text-blue-700 bg-white/95 px-1.5 py-0.5 rounded border border-blue-200 shadow-sm">
                {`${level}/10`}
              </span>
              <div className="w-0.5 h-4 bg-blue-600"></div>
              <ChevronDown className="w-4 h-4 text-blue-600 -mt-1" />
            </div>
          )}
          <FlameSvg variant={getVariantForIndex(i)} />
        </div>
      );
    }

    return (
      <div className="relative w-full flex flex-col items-center pt-9">
        {/* Blue guideline */}
        <div className="absolute top-0 left-2 right-2 h-[6px] bg-blue-600 rounded-full"></div>

        {/* Flames - 10 equal columns */}
        <div className="grid grid-cols-10 gap-2 w-full max-w-[480px] pt-2 place-items-center">
          {flames}
        </div>

        {/* Labels as pills */}
        <div className="grid grid-cols-10 gap-2 w-full max-w-[480px] mt-3">
          <div className="col-span-2 flex justify-center">
            <LabelPill text="Mild" variant="mild" />
          </div>
          <div className="col-span-3 flex justify-center">
            <LabelPill text="Medium" variant="medium" />
          </div>
          <div className="col-span-3 flex justify-center">
            <LabelPill text="Hot" variant="hot" />
          </div>
          <div className="col-span-2 flex justify-center">
            <LabelPill text="Fiery" variant="fiery" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border-2 border-gray-800 font-sans overflow-visible">
      {/* Back Button - only show if onBack is provided */}
      {onBack && (
        <div className="bg-gray-100 border-b-2 border-gray-800 p-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
            Back to Menu
          </button>
        </div>
      )}

      {/* Header Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 bg-white">
        <div className="col-span-1 bg-blue-50 border-r-2 border-gray-800 p-3 font-bold text-center">
          NAME
        </div>
        <div className="md:col-span-2 p-3 font-bold">
          {selectedTopping.name}{" "}
          {selectedTopping.category && (
            <span className="text-sm">
              [ {selectedTopping.category.toUpperCase()} ]
            </span>
          )}
        </div>
        <div className="md:col-span-1 md:border-l-2 border-gray-800 p-2 mt-2 md:mt-0">
          <img
            src={
              selectedTopping.image_url
                ? `/images/${selectedTopping.image_url}`
                : "/images/placeholder.jpg"
            }
            alt={selectedTopping.name}
            className="w-full h-24 object-contain md:object-cover rounded border bg-white"
            loading="lazy"
          />
        </div>
      </div>

      {/* Description Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-blue-50 border-r-2 border-gray-800 p-3 font-bold">
          THE RUNDOWN...
        </div>
        <div className="md:col-span-3 p-3 text-sm">
          {selectedTopping.description || "No description available."}
        </div>
      </div>

      {/* Price Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-blue-50 border-r-2 border-gray-800 p-3 font-bold">
          PRICE
        </div>
        <div className="md:col-span-3 p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-orange-500"></div>
              <span className="font-medium">
                ${selectedTopping.price.toFixed(2)}{" "}
                {selectedTopping.price === 0 && "(House Mayo)"}
              </span>
            </div>
            {/* Show premium option for mayo */}
            {selectedTopping.name.toLowerCase().includes("mayonnaise") &&
              selectedTopping.price < 0.65 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="font-medium">
                    $0.90 (Premium Kewpie Mayo)
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Spiciness Row */}
      {selectedTopping.spiciness && (
        <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-gray-800">
          <div className="bg-blue-50 border-r-2 border-gray-800 p-3 font-bold">
            SPICINESS
          </div>
          <div className="md:col-span-3 p-3">
            {generateFlames(getSpicyLevel(selectedTopping.spiciness))}
          </div>
        </div>
      )}

      {/* Allergen Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-blue-50 border-r-2 border-gray-800 p-3 font-bold">
          ALLERGEN
        </div>
        <div className="md:col-span-3 p-3 text-sm">
          {selectedTopping.allergen ||
            "Our toppings are prepared in-house and may contain or come into contact with common allergens (milk, eggs, peanuts, tree nuts, soy, wheat, sesame, fish, shellfish). Ingredient details available on request. Shared equipment and oil prevent allergen-free preparation."}
        </div>
      </div>
    </div>
  );
};

export default ToppingsInfo;
