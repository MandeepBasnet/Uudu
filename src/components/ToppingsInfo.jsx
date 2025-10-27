"use client";

import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import toppingsData from "../data/toppings.json";

const ToppingsInfo = ({ product, onBack }) => {
  // Use the product prop if provided, otherwise default to first topping
  const selectedTopping = product || toppingsData.toppings[0];

  // Determine triangle color: prefer explicit color_code, else map by price
  const getTriangleColor = () => {
    const hex = selectedTopping.color_code;
    if (hex) return hex;
    const price = Number(selectedTopping.price || 0);
    if (Math.abs(price - 0.65) < 0.001) return "#f2960c"; // orange
    if (Math.abs(price - 0.35) < 0.001) return "#26e320"; // green
    if (Math.abs(price - 0.9) < 0.001) return "#e320dc"; // purple
    if (Math.abs(price - 2.0) < 0.001) return "#0d0c0d"; // black
    return "#9ca3af"; // gray-400 fallback
  };

  // Extract spiciness level from text (e.g., "8 out of 10 flames" -> 8)
  const getSpicyLevel = (spicinessText) => {
    const match = spicinessText?.match(/(\d+)\s*out\s*of\s*10/);
    return match ? Number.parseInt(match[1]) : 5;
  };

  // Flame SVG (align with RamenInfo palette)
  const FlameSvg = ({ variant }) => {
    const id = useId();
    const gradientId = `flame-grad-${variant}-${id}`;
    const palette = {
      // Updated colors per RamenInfo
      mild: { outer: "#355f25", start: "#629329", end: "#629329" },
      medium: { outer: "#dca27b", start: "#ecccb7", end: "#ecccb7" },
      hot: { outer: "#ef5a29", start: "#fbae41", end: "#fbae41" },
      fiery: { outer: "#010101", start: "#ffffff", end: "#ffffff" },
    };
    const { outer, start, end } = palette[variant] || palette.mild;

    return (
      <svg
        width="36"
        height="36"
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
        className={`inline-flex items-center justify-center h-9 min-w-[84px] px-4 rounded-full border bg-white/95 text-base font-medium tracking-wide shadow-sm ${classByVariant[variant]}`}
      >
        {text}
      </span>
    );
  };

  // Generate flame icons and guideline based on spiciness level
  const generateFlames = (level) => {
    const flames = [];
    const getVariantForIndex = (i) => {
      if (i <= 2) return "mild"; // 2
      if (i <= 5) return "medium"; // +3 => 5
      if (i <= 8) return "hot"; // +3 => 8
      return "fiery"; // +2 => 10
    };

    for (let i = 1; i <= 10; i++) {
      flames.push(
        <div
          key={i}
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center relative flex-shrink-0"
        >
          {i === level && (
            <div className="absolute -top-8 sm:-top-9 md:-top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-1 h-6 sm:h-7 md:h-8 bg-blue-600 rounded-full"></div>
              <div
                className="w-0 h-0 drop-shadow-sm"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "12px solid #2563eb", // tailwind blue-600
                }}
              />
            </div>
          )}
          <FlameSvg variant={getVariantForIndex(i)} />
        </div>
      );
    }

    return (
      <div className="relative w-full flex flex-col items-center pt-8 sm:pt-9 md:pt-10">
        {/* Blue guideline */}
        <div className="absolute top-0 left-2 right-2 h-[8px] bg-blue-600 rounded-full"></div>

        {/* Flames grouped with responsive spacing */}
        <div className="w-full flex items-center justify-center px-2">
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {flames.slice(0, 2)}
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {flames.slice(2, 5)}
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {flames.slice(5, 8)}
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {flames.slice(8, 10)}
            </div>
          </div>
        </div>

        {/* Labels as pills with responsive grid */}
        <div className="w-full flex items-center justify-center px-2 mt-4">
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 w-full max-w-[95%] sm:max-w-[620px]">
            <div className="flex-[2] flex justify-center">
              <LabelPill text="Mild" variant="mild" />
            </div>
            <div className="flex-[3] flex justify-center">
              <LabelPill text="Medium" variant="medium" />
            </div>
            <div className="flex-[3] flex justify-center">
              <LabelPill text="Hot" variant="hot" />
            </div>
            <div className="flex-[2] flex justify-center">
              <LabelPill text="Fiery" variant="fiery" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto font-sans bg-white border border-gray-200 rounded-xl shadow-lg px-4 sm:px-6 md:px-10 py-8 md:py-10">
      {/* Back Button - only show if onBack is provided */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-12 flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium text-lg md:text-xl"
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
          Back to Menu
        </button>
      )}

      {/* 1. Name */}
      <section className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-lg md:text-xl font-bold text-black">Name:</div>
            <div className="mt-6 text-lg md:text-xl font-bold text-black">
              Price:
            </div>
          </div>
          <div className="md:col-span-9">
            <div className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-4">
              <div className="flex-1">
                <h1
                  className="text-lg md:text-xl font-normal tracking-tight text-gray-900 truncate"
                  title={selectedTopping.name}
                >
                  {selectedTopping.name}
                </h1>
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-3 text-lg md:text-xl text-gray-900">
                    <div
                      aria-hidden
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "20px solid transparent",
                        borderRight: "20px solid transparent",
                        borderBottom: `36px solid ${getTriangleColor()}`,
                      }}
                    />
                    <span className="tracking-tight font-normal">{`$ ${selectedTopping.price.toFixed(
                      2
                    )}`}</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-48 self-stretch flex items-center">
                <img
                  src={
                    selectedTopping.image_url
                      ? `/images/${selectedTopping.image_url}`
                      : "/images/placeholder.jpg"
                  }
                  alt={selectedTopping.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Description */}
      <section className="mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-lg md:text-xl font-bold text-black">
              Description:
            </div>
          </div>
          <div className="md:col-span-9">
            <p className="text-lg md:text-xl leading-relaxed text-gray-800">
              {selectedTopping.description || "No description available."}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Spiciness (only if present) */}
      {selectedTopping.spiciness && (
        <section className="mt-12 md:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="md:col-span-3">
              <div className="text-lg md:text-xl font-bold text-black">
                Spiciness:
              </div>
            </div>
            <div className="md:col-span-9">
              {generateFlames(getSpicyLevel(selectedTopping.spiciness))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Allergen */}
      <section className="mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-lg md:text-xl font-bold text-black">
              Allergen:
            </div>
          </div>
          <div className="md:col-span-9">
            <p className="text-lg md:text-xl leading-relaxed text-gray-800">
              {selectedTopping.allergen ||
                "Our toppings are prepared in-house and may contain or come into contact with common allergens (milk, eggs, peanuts, tree nuts, soy, wheat, sesame, fish, shellfish). Ingredient details available on request. Shared equipment and oil prevent allergen-free preparation."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToppingsInfo;
