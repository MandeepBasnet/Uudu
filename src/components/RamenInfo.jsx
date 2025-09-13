/* eslint-disable no-unused-vars */
import React, { useState, useId } from "react";
import { Play, ChevronDown } from "lucide-react";
import ramenData from "../data/ramen.json";

const RamenInfo = ({ product, onBack }) => {
  // Use the product prop if provided, otherwise default to first ramen
  const selectedRamen = product || ramenData.ramen[0];
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

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
    const getColorForIndex = (i) => {
      if (i <= 2) return "#22c55e"; // green-500
      if (i <= 4) return "#f97316"; // orange-500
      if (i <= 7) return "#ef4444"; // red-500
      return "#111827"; // gray-900 (almost black)
    };

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
        {/* Blue guideline (stays inside this section) */}
        <div className="absolute top-0 left-2 right-2 h-[6px] bg-blue-600 rounded-full"></div>
        {/* Arrow marker is rendered per flame cell when i === level */}

        {/* Flames - 10 equal columns to align with labels */}
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
      <div className="grid grid-cols-1 md:grid-cols-4 bg-yellow-100">
        <div className="col-span-1 bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold text-center">
          NAME
        </div>
        <div className="md:col-span-2 p-3 font-bold">
          {selectedRamen.name}{" "}
          <span className="text-sm">
            [ {selectedRamen.country.toUpperCase()} ]
          </span>
        </div>
        <div className="md:col-span-1 md:border-l-2 border-gray-800 p-2 mt-2 md:mt-0">
          <img
            src={
              selectedRamen.image_url
                ? `/images/${selectedRamen.image_url}`
                : "/images/placeholder.jpg"
            }
            alt={selectedRamen.name}
            className="w-full h-24 object-contain md:object-cover rounded border bg-white"
            loading="lazy"
          />
        </div>
      </div>

      {/* Description Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          THE RUNDOWN...
        </div>
        <div className="md:col-span-3 p-3 text-sm">
          {selectedRamen.description}
        </div>
      </div>

      {/* Price Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          PRICE
        </div>
        <div className="md:col-span-3 p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  selectedRamen.price_packet === 2.25
                    ? "bg-blue-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="font-medium">Noodle packet</span>
              <span className="ml-auto">
                ${selectedRamen.price_packet.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-5 font-medium">Cooker bowl</span>
              <span className="ml-auto">
                ${selectedRamen.price_bowl.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spiciness Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          SPICINESS
        </div>
        <div className="md:col-span-3 p-3">
          {generateFlames(getSpicyLevel(selectedRamen.spiciness))}
        </div>
      </div>

      {/* Cooker Setting Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          COOKER SETTING
        </div>
        <div className="md:col-span-3 p-3">
          <div className="space-y-3">
            <div className="bg-gray-900 p-2 rounded-lg">
              <div className="bg-black rounded aspect-video flex items-center justify-center relative">
                {cookerVideoId ? (
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${cookerVideoId}`}
                    title={cookerSettingsVideo.description}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded"
                  ></iframe>
                ) : (
                  <div className="text-white text-center">
                    <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">Cooker Settings Video</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm space-y-1">
                <div>1. Add noodle & seasoning to cooker bowl</div>
                <div>
                  2. Select:{" "}
                  <span className="text-red-600 font-bold">Menu 1</span> (460 ml
                  water; 280 seconds)
                </div>
                <div>3. Stir noodle during cooking process</div>
                <div>4. If desired, add toppings at final 60 seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Videos Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          SUGGESTED VIDEOS
        </div>
        <div className="md:col-span-3 p-3">
          <div className="space-y-3">
            {/* Video Buttons */}
            <div className="flex gap-2">
              {selectedRamen.suggested_videos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVideoIndex(index)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selectedVideoIndex === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Video Monitor */}
            <div className="bg-gray-900 p-2 rounded-lg">
              <div className="bg-black rounded aspect-video flex items-center justify-center relative">
                {videoId ? (
                  <iframe
                    width="100%"
                    height="200"
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
                    <p className="text-sm opacity-75">Video Preview</p>
                  </div>
                )}
              </div>
              <div className="text-white text-sm mt-2 px-2">
                <p className="font-medium">{currentVideo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Allergen Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          ALLERGEN
        </div>
        <div className="md:col-span-3 p-3 text-sm">
          All ramen packets are sold in original packaging. Please check the
          label for ingredients and allergen details. Some imported items may
          not have full U.S.-style allergen info—ask a staff if you have
          questions.
        </div>
      </div>
    </div>
  );
};

export default RamenInfo;
