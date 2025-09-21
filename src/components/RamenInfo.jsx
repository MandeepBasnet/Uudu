/* eslint-disable no-unused-vars */
import React, { useState, useId, useEffect } from "react";
import { Play, ChevronDown, X } from "lucide-react";
import ramenData from "../data/ramen.json";
import NoodleInstructions from "./NoodleInstructions";

const RamenInfo = ({ product, onBack }) => {
  // Use the product prop if provided, otherwise default to first ramen
  const selectedRamen = product || ramenData.ramen[0];
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isCookModalOpen, setIsCookModalOpen] = useState(false);

  // Keep category nav bar visible while cook instructions modal is open
  useEffect(() => {
    const navEl = document.getElementById("menu-categories-nav");
    if (!navEl) return;
    // Always ensure nav is visible
    navEl.classList.remove("hidden");
  }, [isCookModalOpen]);

  // Extract spiciness level from text (e.g., "8 out of 10 flames" -> 8)
  const getSpicyLevel = (spicinessText) => {
    const match = spicinessText.match(/(\d+)\s*out\s*of\s*10/);
    return match ? Number.parseInt(match[1]) : 5;
  };

  // Flame SVG (provided) with dynamic colors via palette per variant
  const FlameSvg = ({ variant }) => {
    const id = useId();
    const gradientId = `flame-grad-${variant}-${id}`;
    const palette = {
      mild: { outer: "#22c55e", start: "#86efac", end: "#16a34a" },
      medium: { outer: "#f97316", start: "#fb923c", end: "#f59e0b" },
      hot: { outer: "#ef4444", start: "#f87171", end: "#ef4444" },
      fiery: { outer: "#111827", start: "#ef4444", end: "#111827" },
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
      if (i <= 2) return "mild"; // 2
      if (i <= 5) return "medium"; // +3 => 5
      if (i <= 8) return "hot"; // +3 => 8
      return "fiery"; // +2 => 10
    };

    for (let i = 1; i <= 10; i++) {
      flames.push(
        <div
          key={i}
          className="w-7 h-7 flex items-center justify-center relative"
        >
          {i === level && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
              <ChevronDown className="w-3 h-3 text-blue-600 -mt-0.5 drop-shadow-sm" />
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
        <div className="grid grid-cols-10 gap-2 w-full max-w-[520px] place-items-center">
          {flames}
        </div>

        {/* Labels as pills */}
        <div className="grid grid-cols-10 gap-2 w-full max-w-[520px] mt-4">
          <div className="col-span-2 flex justify-center">
            <LabelPill text="Mild" variant="mild" />
          </div>
          <div className="col-span-3 flex justify-center">
            <LabelPill text="Medium" variant="medium" />
          </div>
          <div className="col-span-3 flex justify-center">
            <LabelPill text="Very Hot" variant="hot" />
          </div>
          <div className="col-span-2 flex justify-center">
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

  const cookerSettingsVideo = {
    url: "https://www.youtube.com/shorts/XTrnfmHpWwo",
    description: "Cooker Settings Guide",
  };

  const currentVideo = selectedRamen.suggested_videos[selectedVideoIndex];
  const videoId = extractVideoId(currentVideo.url);
  const cookerVideoId = extractVideoId(cookerSettingsVideo.url);

  return (
    <div className="max-w-4xl mx-auto font-sans bg-white border border-gray-200 rounded-xl shadow-lg px-6 md:px-10 py-10">
      {/* Back Button - only show if onBack is provided */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-10 flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
          Back to Menu
        </button>
      )}

      {/* 1. Name */}
      <section className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Name
            </div>
          </div>
          <div className="md:col-span-9">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                  {selectedRamen.name}
                </h1>
                <div className="mt-2 text-xl md:text-2xl text-gray-600">
                  [ {selectedRamen.country.toUpperCase()} ]
                </div>
              </div>
              <div className="w-full md:w-48">
                <img
                  src={
                    selectedRamen.image_url
                      ? `/images/${selectedRamen.image_url}`
                      : "/images/placeholder.jpg"
                  }
                  alt={selectedRamen.name}
                  className="w-full h-24 md:h-28 object-contain"
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
            <div className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Description
            </div>
          </div>
          <div className="md:col-span-9">
            <p className="text-xl md:text-2xl leading-relaxed text-gray-800">
              {selectedRamen.description}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Price */}
      <section className="mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Price
            </div>
          </div>
          <div className="md:col-span-9">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-2xl text-gray-900">
                <div
                  className={`w-3 h-3 rounded-full ${
                    selectedRamen.price_packet === 2.25
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="font-semibold">Combined price</span>
                <span className="ml-auto font-extrabold tracking-tight">
                  {`$ ${(
                    selectedRamen.price_packet + selectedRamen.price_bowl
                  ).toFixed(2)}`}
                </span>
              </div>
              <div className="text-sm text-gray-500 italic">
                {`* Price breakdown: $ ${selectedRamen.price_packet.toFixed(
                  2
                )} packet + $ ${selectedRamen.price_bowl.toFixed(2)} bowl`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Spiciness */}
      <section className="mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Spiciness
            </div>
          </div>
          <div className="md:col-span-9">
            {generateFlames(getSpicyLevel(selectedRamen.spiciness))}
          </div>
        </div>
      </section>

      {/* 5. Cooker Setting */}
      <section className="mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Cooker Setting
            </div>
          </div>
          <div className="md:col-span-9">
            <div className="space-y-4 border border-gray-400 rounded-lg p-5 bg-white">
              <div className="text-gray-800 text-base md:text-lg flex items-baseline gap-2">
                <span>For this specific noodle :</span>
                <span className="text-blue-700 font-extrabold uppercase tracking-wide text-2xl md:text-3xl">
                  {`MENU ${selectedRamen.cooker_setting ?? 1}`}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                <img
                  src="/RamenCooker.png"
                  alt="Ramen Cooker"
                  className="h-24 md:h-28 w-auto object-contain"
                  loading="lazy"
                />
                <span className="text-gray-500 text-3xl md:text-4xl">→</span>
                <div className="flex items-center gap-3 md:gap-4">
                  <img
                    src="/menu.png"
                    alt="Menu button"
                    className="h-12 md:h-14 w-auto object-contain"
                    loading="lazy"
                  />
                  <span className="text-gray-700 text-2xl md:text-3xl">+</span>
                  <img
                    src="/startstop.png"
                    alt="Start/Stop button"
                    className="h-12 md:h-14 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsCookModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-gray-800 font-semibold border border-gray-400 hover:bg-gray-300"
                >
                  How to cook
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Hack Videos */}
      <section className="mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Hack Videos
            </div>
          </div>
          <div className="md:col-span-9">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {selectedRamen.suggested_videos.map((video, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedVideoIndex(index);
                      setIsVideoModalOpen(true);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                      selectedVideoIndex === index
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    aria-label={`Open video ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Static preview only */}
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-black aspect-video flex items-center justify-center">
                  <Play className="w-16 h-16 text-white opacity-60" />
                </div>
              </div>

              <div className="text-gray-700 text-sm">
                <p className="font-medium">{currentVideo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Allergen */}
      <section className="mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="md:col-span-3">
            <div className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Allergen
            </div>
          </div>
          <div className="md:col-span-9">
            <p className="text-xs md:text-sm leading-6 text-black">
              All ramen packets are sold in original packaging. Please check the
              label for ingredients and allergen details. Some imported items
              may not have full U.S.-style allergen info—ask a staff if you have
              questions.
            </p>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
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
        </div>
      )}

      {/* Cook Instructions Modal (Picture2.png style) */}
      {isCookModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/70 p-4 pt-20"
          onClick={() => setIsCookModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => setIsCookModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <NoodleInstructions onClose={() => setIsCookModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RamenInfo;
