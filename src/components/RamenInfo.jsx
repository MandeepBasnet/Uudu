import React, { useState, useId, useEffect } from "react";
import { createPortal } from "react-dom";
import { Play, ChevronDown, X, CheckSquare, Square } from "lucide-react";
import ramenData from "../data/updatedRamen.json";
import NoodleInstructions from "./NoodleInstructions";

const RamenInfo = ({ product, onBack }) => {
  // Use the product prop if provided, otherwise default to first ramen
  const selectedRamen = product || ramenData.ramen[0];
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isCookModalOpen, setIsCookModalOpen] = useState(false);

  // Extract spiciness level from text (e.g., "8 out of 10 flames" -> 8)
  const getSpicyLevel = (spicinessText) => {
    const match = spicinessText.match(/(\d+)\s*out\s*of\s*10/);
    return match ? Number.parseInt(match[1]) : 5;
  };

  // Circle color by price breakdown
  const getPriceCircleColor = (packetPrice, bowlPrice) => {
    const p = Number(packetPrice);
    const b = Number(bowlPrice);
    const is = (x, y) => Math.abs(x - y) < 0.001;
    if (is(p, 2.25) && is(b, 3.0)) return "bg-blue-600";
    if (is(p, 1.5) && is(b, 3.0)) return "bg-red-600";
    if (is(p, 5.5) && is(b, 3.0)) return "bg-yellow-400";
    return "bg-gray-400";
  };

  // Flame SVG (provided) with dynamic colors via palette per variant
  const FlameSvg = ({ variant }) => {
    const id = useId();
    const gradientId = `flame-grad-${variant}-${id}`;
    const palette = {
      // Updated colors per request
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
          d="M139.16 372.49c-21.83-57.66-18.81-150.75 42.33-183.41.43 107.03 103.57 120.64 84.44 234.9 17.64-20.39 26.51-53.02 28.10-78.75 27.96 65.38 6.04 117.72-33.81 144.37-121.15 81-225.48-83.23-156.11-173.26 2.08 20.07 26.14 51.12 35.05 56.15z"
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

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  const currentVideo = selectedRamen.suggested_videos[selectedVideoIndex];
  const videoId = extractVideoId(currentVideo.url);

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
            <div className="text-sm font-bold text-black whitespace-nowrap py-0.5">
              Name:
            </div>
            <div className="flex-1 flex justify-between items-start gap-2">
              <h1
                className="text-sm font-normal tracking-tight text-gray-900"
                title={selectedRamen.name}
              >
                {selectedRamen.name}
              </h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className="bg-white text-black border border-gray-800 font-bold px-2 py-0.5 rounded shadow-sm text-xs"
                  style={{
                    fontFamily: "Bahnschrift, system-ui, sans-serif",
                  }}
                >
                  {selectedRamen.id}
                </span>
                <div className="bg-white border border-gray-800 rounded px-1 shadow-sm flex items-center justify-center h-6 min-w-[30px] overflow-hidden">
                    <span className="text-lg leading-none">
                      {selectedRamen.country === "S. Korea" ? "🇰🇷" : 
                       selectedRamen.country === "Japan" ? "🇯🇵" : 
                       selectedRamen.country === "Taiwan" ? "🇹🇼" : "🌏"}
                    </span>
                </div>
              </div>
            </div>
          </div>

          {/* Style Row */}
          <div className="flex items-start gap-3">
            <div className="text-sm font-bold text-black whitespace-nowrap">
              Style:
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-900">
              <div className="flex items-center gap-1.5">
                {selectedRamen.type === "Soup" ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>Soup</span>
              </div>
              <div className="flex items-center gap-1.5">
                {selectedRamen.type === "Sauce" ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>Sauce</span>
              </div>
            </div>
          </div>

          {/* Price Row */}
          <div className="flex items-start gap-3">
            <div className="text-sm font-bold text-black whitespace-nowrap">
              Price:
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <div
                  className={`w-5 h-5 rounded-full flex-shrink-0 ${getPriceCircleColor(
                    selectedRamen.price_packet,
                    selectedRamen.price_bowl
                  )}`}
                ></div>
                <span className="tracking-tight font-normal">{`$ ${(
                  selectedRamen.price_packet + selectedRamen.price_bowl
                ).toFixed(2)}`}</span>
              </div>
              <div className="text-xs text-gray-500 italic whitespace-pre ml-7">
                {`* ( Noodle  $ ${selectedRamen.price_packet.toFixed(
                  2
                )}   +   Bowl  $ ${selectedRamen.price_bowl.toFixed(2)} )`}
              </div>
            </div>
          </div>

          {/* Mobile Image */}
          <div className="w-full max-w-[200px] mx-auto mt-4 relative">
            <img
              src={
                selectedRamen.image_url
                  ? `/images/${selectedRamen.image_url}`
                  : "/images/placeholder.jpg"
              }
              alt={selectedRamen.name}
              className="w-full h-auto object-contain"
              loading="lazy"
            />

          </div>
        </div>

        {/* Desktop Layout - Refactored for alignment */}
        <div className="hidden md:flex gap-6 lg:gap-10 items-start">
          {/* Left Side: Labels and Values Stack */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            {/* Row 1: Name (Top Aligned for wrapping) */}
            <div className="flex items-start gap-4">
              <div className="w-20 lg:w-24 flex-shrink-0 text-lg lg:text-xl font-bold text-black pt-0.5">
                Name:
              </div>
              <h1
                className="text-lg lg:text-xl font-normal tracking-tight text-gray-900"
                title={selectedRamen.name}
              >
                {selectedRamen.name}
              </h1>
            </div>

            {/* Row 2: Style (Center Aligned for icons) */}
            <div className="flex items-center gap-4">
              <div className="w-20 lg:w-24 flex-shrink-0 text-lg lg:text-xl font-bold text-black">
                Style:
              </div>
              <div className="text-lg lg:text-xl text-gray-900 font-normal">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    {selectedRamen.type === "Soup" ? (
                      <CheckSquare className="w-6 h-6" />
                    ) : (
                      <Square className="w-6 h-6" />
                    )}
                    <span>Soup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedRamen.type === "Sauce" ? (
                      <CheckSquare className="w-6 h-6" />
                    ) : (
                      <Square className="w-6 h-6" />
                    )}
                    <span>Sauce</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Price (Center Aligned for circle) */}
            <div className="flex items-start gap-4"> 
               {/* Using items-start for price row to handle the breakdown text below nicely if we want label at top, 
                   OR items-center if we want label centered. 
                   User's plan said "items-center" for Price Row. 
                   However, the price section has a breakdown line below it. 
                   If we center the label, it will be centered relative to the whole block (Value + Breakdown). 
                   Actually, typically "Price:" connects to the Value "$ 5.25". The breakdown is secondary. 
                   Let's use items-start but adjust the visual center of the first line?
                   Or separate the breakdown?
                   Let's try items-start (top aligned) but give the label a little top padding to align with the circle/text center?
                   Actually, if we use items-center, the breakdown will pull the label down. 
                   Let's stick to the previous Grid-like behavior for Price but with better control.
                   Let's separate Label and Value block. 
               */}
               <div className="w-20 lg:w-24 flex-shrink-0 text-lg lg:text-xl font-bold text-black pt-0.5">
                Price:
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-lg lg:text-xl text-gray-900">
                  <div
                    className={`w-8 h-8 rounded-full ${getPriceCircleColor(
                      selectedRamen.price_packet,
                      selectedRamen.price_bowl
                    )}`}
                  ></div>
                  <span className="tracking-tight font-normal">{`$ ${(
                    selectedRamen.price_packet + selectedRamen.price_bowl
                  ).toFixed(2)}`}</span>
                </div>
                <div className="text-sm lg:text-base text-gray-500 italic ml-11">
                  {`* ( Noodle  $ ${selectedRamen.price_packet.toFixed(
                    2
                  )}   +   Bowl  $ ${selectedRamen.price_bowl.toFixed(2)} )`}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Image and ID */}
          <div className="hidden md:flex w-48 flex-col items-center flex-shrink-0">
            <div className="w-full flex justify-end items-center gap-2 mb-2">
              <span
                className="bg-white text-black border border-gray-800 font-bold px-2 py-0.5 rounded shadow-sm text-lg"
                style={{
                  fontFamily: "Bahnschrift, system-ui, sans-serif",
                }}
              >
                {selectedRamen.id}
              </span>
              <div className="bg-white border border-gray-800 rounded px-1 shadow-sm flex items-center justify-center h-8 min-w-[40px] overflow-hidden">
                  <span className="text-2xl leading-none">
                      {selectedRamen.country === "S. Korea" ? "🇰🇷" : 
                       selectedRamen.country === "Japan" ? "🇯🇵" : 
                       selectedRamen.country === "Taiwan" ? "🇹🇼" : "🌏"}
                  </span>
              </div>
            </div>
            <div className="relative w-full h-full">
              <img
                src={
                  selectedRamen.image_url
                    ? (selectedRamen.image_url.startsWith('http') ? selectedRamen.image_url : `/images/${selectedRamen.image_url}`)
                    : "/images/placeholder.jpg"
                }
                alt={selectedRamen.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
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
              {selectedRamen.description}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Spiciness */}
      <section className="mt-6 md:mt-12 lg:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm md:text-lg lg:text-xl font-bold text-black">
              Spiciness:
            </div>
          </div>
          <div className="md:col-span-9">
            {generateFlames(getSpicyLevel(selectedRamen.spiciness))}
          </div>
        </div>
      </section>

      {/* 5. Cooker Setting */}
      <section className="mt-6 md:mt-12 lg:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm md:text-lg lg:text-xl font-bold text-black">
              Cooker Setting:
            </div>
          </div>
          <div className="md:col-span-9">
            <div className="space-y-3 md:space-y-4 border border-gray-400 rounded-lg p-3 md:p-5 bg-white relative">
              <div className="text-gray-800 text-xs md:text-base lg:text-lg flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="font-bold">For this specific noodle :</span>
                <span className="text-blue-700 font-extrabold uppercase tracking-wide text-sm md:text-lg lg:text-xl">
                <span className="text-blue-700 font-extrabold uppercase tracking-wide text-sm md:text-lg lg:text-xl">
                  {selectedRamen.menu ? selectedRamen.menu.toUpperCase().startsWith("MENU 3") ? "MENU 3" : selectedRamen.menu.toUpperCase() : "MENU 1"}
                </span>
                </span>
              </div>

              {/* Single row container with no wrapping, centered items */}
              <div className="flex flex-nowrap items-center justify-start sm:justify-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto no-scrollbar py-2 w-full">
                
                {/* Cooker Image Group */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <img
                      src="/RamenCooker.png"
                      alt="Ramen Cooker"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-gray-500 text-xl md:text-2xl">
                    →
                  </span>
                </div>

                {/* Info Group: Menu + Start/Stop */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Menu Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <img
                      src={(function(){
                          const m = selectedRamen.menu || "";
                          if (m.toLowerCase().includes("menu 2")) return "/menu2.png";
                          if (m.toLowerCase().includes("menu 3")) return "/menu3.png";
                          return "/menu1.png";
                      })()}
                      alt="Menu button"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  
                  <span className="text-gray-700 text-xl md:text-2xl">
                    +
                  </span>

                  {/* Start/Stop Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <img
                      src="/startstop.png"
                      alt="Start/Stop button"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* How to Cook Button - Below the icons */}
              <div className="flex justify-start sm:justify-center mt-2">
                <button
                  type="button"
                  onClick={() => setIsCookModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-xs sm:text-sm text-gray-800 font-semibold border border-gray-400 hover:bg-gray-300 transition-colors"
                >
                  How to cook
                </button>
              </div>

              <div className="h-4 sm:h-6"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Hack Videos */}
      <section className="mt-6 md:mt-12 lg:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm md:text-lg lg:text-xl font-bold text-black">
              Hack Videos:
            </div>
          </div>
          <div className="md:col-span-9">
            <div className="flex flex-row md:flex-row items-start gap-3 md:gap-6">
              {/* Large oval buttons on the left - vertical on all screens */}
              <div className="flex flex-col gap-2 sm:gap-3 w-auto md:w-48 lg:w-56">
                {selectedRamen.suggested_videos.map((video, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedVideoIndex(index);
                      setIsVideoModalOpen(true);
                    }}
                    className={`w-8 h-8 sm:w-auto sm:h-auto px-2 sm:px-3 sm:py-2 md:px-5 md:py-3 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-semibold border transition-colors flex items-center justify-center ${
                      selectedVideoIndex === index
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-gray-100 border-gray-300 text-gray-700"
                    }`}
                    aria-label={`Open video ${index + 1}`}
                  >
                    <span className="hidden sm:inline">{`Video ${
                      index + 1
                    }`}</span>
                    <span className="sm:hidden">{index + 1}</span>
                  </button>
                ))}
              </div>

              {/* Smaller TV preview on the right */}
              {/* Smaller TV preview on the right */}
              <div 
                className="flex-1 w-full sm:w-auto cursor-pointer group"
                onClick={() => setIsVideoModalOpen(true)}
              >
                <div className="rounded-lg overflow-hidden border border-gray-200 w-full md:w-[340px] transition-transform group-hover:scale-[1.02]">
                  <div className="bg-black aspect-video flex items-center justify-center">
                    <Play className="w-8 h-8 md:w-12 md:h-12 text-white opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="mt-2 md:mt-3 text-gray-700 text-xs md:text-sm">
                  <p className="font-medium group-hover:text-blue-600 transition-colors">{currentVideo.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Allergen */}
      <section className="mt-6 md:mt-12 lg:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm md:text-lg lg:text-xl font-bold text-black">
              Allergen:
            </div>
          </div>
           <div className="md:col-span-9">
             <p className="text-sm md:text-lg lg:text-xl leading-relaxed text-gray-800">
               Please refer to each product's packaging for detailed allergen information.
             </p>
           </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl mx-4 bg-gray-900 rounded-lg p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close video"
              className="absolute -top-10 right-0 text-white"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-black rounded aspect-video flex items-center justify-center">
              {videoId ? (
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={currentVideo.description}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded"
                ></iframe>
              ) : (
                <div className="text-white text-center">
                  <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-base opacity-75">Video Preview</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Cook Instructions Modal (Picture2.png style) */}
      {isCookModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/70 p-4 pt-10"
          onClick={() => setIsCookModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => setIsCookModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <NoodleInstructions 
              onClose={() => setIsCookModalOpen(false)} 
              menu={selectedRamen.menu || "Menu 1"}
            />
          </div>
        </div>,
        document.body
      )}
      </div>
    </div>
  );
};

export default RamenInfo;
