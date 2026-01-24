"use client";

import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import toppingsData from "../data/updatedToppings.json";

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
    if (Math.abs(price - 0.95) < 0.001) return "#e320dc"; // pink
    if (Math.abs(price - 1.25) < 0.001) return "#0d0c0d"; // black
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
        width="100%"
        height="100%"
        viewBox="0 0 384 511.4"
        role="img"
        aria-label={`${variant} level flame`}
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        imageRendering="optimizeQuality"
        className="w-full h-full"
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
        className={`inline-flex items-center justify-center h-7 sm:h-8 md:h-9 min-w-[60px] sm:min-w-[70px] md:min-w-[84px] px-2 sm:px-3 md:px-4 rounded-full border bg-white/95 text-xs sm:text-sm md:text-base font-medium tracking-wide shadow-sm ${classByVariant[variant]}`}
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
          className="w-5 h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center relative flex-shrink-0"
        >
          {i === level && (
            <div className="absolute -top-5 sm:-top-8 md:-top-9 lg:-top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-1 h-4 sm:h-6 md:h-7 lg:h-8 bg-blue-600 rounded-full"></div>
              <div
                className="w-0 h-0 drop-shadow-sm"
                style={{
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "8px solid #2563eb",
                }}
              />
            </div>
          )}
          <FlameSvg variant={getVariantForIndex(i)} />
        </div>
      );
    }

    return (
      <div className="relative w-full pt-5 sm:pt-8 md:pt-9 lg:pt-10">
        {/* Blue guideline */}
        <div className="absolute top-0 left-2 right-2 h-[6px] sm:h-[8px] bg-blue-600 rounded-full"></div>

        {/* Grouped Flames and Labels */}
        <div className="w-full max-w-[95%] sm:max-w-[620px] mx-auto flex items-end justify-between gap-1 sm:gap-2 px-2">
          
          {/* Mild Group */}
          <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
            <div className="flex items-center gap-0.5 h-10 sm:h-12 items-end">
              {flames.slice(0, 2)}
            </div>
            <LabelPill text="Mild" variant="mild" />
          </div>

          {/* Medium Group */}
          <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
            <div className="flex items-center gap-0.5 h-10 sm:h-12 items-end">
              {flames.slice(2, 5)}
            </div>
            <LabelPill text="Medium" variant="medium" />
          </div>

          {/* Hot Group */}
          <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
            <div className="flex items-center gap-0.5 h-10 sm:h-12 items-end">
              {flames.slice(5, 8)}
            </div>
            <LabelPill text="Hot" variant="hot" />
          </div>

          {/* Fiery Group */}
          <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1">
            <div className="flex items-center gap-0.5 h-10 sm:h-12 items-end">
               {flames.slice(8, 10)}
            </div>
            <LabelPill text="Fiery" variant="fiery" />
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto font-sans bg-white border border-gray-200 rounded-xl shadow-lg">
      {/* Sticky Header */}
      {onBack && (
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 md:px-10 py-4 mb-6 rounded-t-xl">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#99564c] font-bold text-lg md:text-2xl lg:text-3xl transition-colors"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            <ChevronDown
              className="w-5 h-5 md:w-6 md:h-6 rotate-90"
              strokeWidth={3}
            />
            Back to Menu
          </button>
        </div>
      )}

      <div className="px-4 sm:px-6 md:px-10 pb-6 md:pb-10">

      {/* 1. Name & Price - Mobile: Each row with label and value side-by-side */}
      <section className="mt-0">
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-4">
          {/* Name Row */}
          <div className="flex items-start gap-3">
            <div className="text-sm font-bold text-black whitespace-nowrap">
              Name:
            </div>
            <h1
              className="text-sm font-normal tracking-tight text-gray-900 flex-1"
              title={selectedTopping.name}
            >
              {selectedTopping.name}
            </h1>
          </div>

          {/* Price Row */}
          <div className="flex items-start gap-3">
            <div className="text-sm font-bold text-black whitespace-nowrap">
              Price:
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <div
                  aria-hidden
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderBottom: `16px solid ${getTriangleColor()}`,
                  }}
                  className="flex-shrink-0"
                />
                <span className="tracking-tight font-normal">{`$ ${selectedTopping.price.toFixed(
                  2
                )}`}</span>
              </div>
            </div>
          </div>

          {/* Mobile Image */}
          <div className="w-full max-w-[200px] mx-auto mt-4">
            <img
              src={
                selectedTopping.image_url
                  ? `/images/${selectedTopping.image_url}`
                  : "/images/placeholder.jpg"
              }
              alt={selectedTopping.name}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Desktop Layout - Refactored for alignment */}
        <div className="hidden md:flex gap-6 lg:gap-10 items-start">
          {/* Left Side: Labels and Values Stack */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            {/* Row 1: Name */}
            <div className="flex items-start gap-4">
              <div className="w-20 lg:w-24 flex-shrink-0 text-lg lg:text-xl font-bold text-black pt-0.5">
                Name:
              </div>
              <h1
                className="text-lg lg:text-xl font-normal tracking-tight text-gray-900"
                title={selectedTopping.name}
              >
                {selectedTopping.name}
              </h1>
            </div>

            {/* Row 2: Price */}
            <div className="flex items-start gap-4">
              <div className="w-20 lg:w-24 flex-shrink-0 text-lg lg:text-xl font-bold text-black pt-0.5">
                Price:
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-lg lg:text-xl text-gray-900">
                  <div
                    aria-hidden
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderBottom: `16px solid ${getTriangleColor()}`,
                    }}
                    className="md:hidden"
                  />
                  <div
                    aria-hidden
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "20px solid transparent",
                      borderRight: "20px solid transparent",
                      borderBottom: `36px solid ${getTriangleColor()}`,
                    }}
                    className="hidden md:block"
                  />
                  <span className="tracking-tight font-normal">{`$ ${selectedTopping.price.toFixed(
                    2
                  )}`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="hidden md:block w-48 self-stretch items-center flex-shrink-0">
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
      </section>

      {/* 2. Description */}
      <section className="mt-6 md:mt-12 lg:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm md:text-lg lg:text-xl font-bold text-black">
              Description:
            </div>
          </div>
          <div className="md:col-span-9">
            <p className="text-sm md:text-lg lg:text-xl leading-relaxed text-gray-800">
              {selectedTopping.description || "No description available."}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Spiciness (only if present) */}
      {selectedTopping.spiciness && (
        <section className="mt-6 md:mt-12 lg:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-10 items-start">
            <div className="md:col-span-3">
              <div className="text-sm md:text-lg lg:text-xl font-bold text-black">
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
      <section className="mt-6 md:mt-12 lg:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm md:text-lg lg:text-xl font-bold text-black">
              Allergen:
            </div>
          </div>
          <div className="md:col-span-9">
            <p className="text-sm md:text-lg lg:text-xl leading-relaxed text-gray-800">
              {selectedTopping.allergen ||
                "Our toppings are prepared in-house and may contain or come into contact with common allergens (milk, eggs, peanuts, tree nuts, soy, wheat, sesame, fish, shellfish, msg). Ingredient details available on request. Shared equipment and oil prevent allergen-free preparation."}
            </p>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default ToppingsInfo;
