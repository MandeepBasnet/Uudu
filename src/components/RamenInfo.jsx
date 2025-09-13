/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Play, ChevronDown } from "lucide-react";
import ramenData from "../data/ramen.json";

const RamenInfo = () => {
  const [selectedRamen, setSelectedRamen] = useState(ramenData.ramen[0]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  // Extract spiciness level from text (e.g., "8 out of 10 flames" -> 8)
  const getSpicyLevel = (spicinessText) => {
    const match = spicinessText.match(/(\d+)\s*out\s*of\s*10/);
    return match ? Number.parseInt(match[1]) : 5;
  };

  // Generate flame icons based on spiciness level
  const generateFlames = (level) => {
    const flames = [];

    // Create flame icons with proper styling to match screenshot
    for (let i = 1; i <= 10; i++) {
      let flameColor = "";

      if (i <= 2) {
        flameColor = i <= level ? "text-green-500" : "text-gray-300"; // Mild - green
      } else if (i <= 4) {
        flameColor = i <= level ? "text-orange-400" : "text-gray-300"; // Medium - orange
      } else if (i <= 7) {
        flameColor = i <= level ? "text-red-500" : "text-gray-300"; // Hot - red
      } else {
        flameColor = i <= level ? "text-red-900" : "text-gray-300"; // Fiery - dark red/black
      }

      flames.push(
        <div key={i} className="relative flex flex-col items-center">
          <div className={`text-2xl ${flameColor}`}>🔥</div>
          {/* Arrow indicator for current spiciness level */}
          {i === level && (
            <ChevronDown className="w-4 h-4 text-blue-600 absolute -top-2" />
          )}
        </div>
      );
    }

    // Add labels below the flame groups
    const labels = (
      <div className="flex justify-between w-full mt-2 text-xs font-medium">
        <span className="text-green-500">Mild</span>
        <span className="text-orange-400">Medium</span>
        <span className="text-red-500">Hot</span>
        <span className="text-red-900">Fiery</span>
      </div>
    );

    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1">{flames}</div>
        {labels}
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
    <div className="max-w-4xl mx-auto bg-white border-2 border-gray-800 font-sans">
      {/* Header Row */}
      <div className="grid grid-cols-4 bg-yellow-100">
        <div className="col-span-1 bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold text-center">
          NAME
        </div>
        <div className="col-span-2 p-3 font-bold">
          {selectedRamen.name}{" "}
          <span className="text-sm">
            [ {selectedRamen.country.toUpperCase()} ]
          </span>
        </div>
        <div className="col-span-1 border-l-2 border-gray-800 p-2">
          <img
            src={`/api/placeholder/120/120`}
            alt={selectedRamen.name}
            className="w-full h-24 object-cover rounded border"
          />
        </div>
      </div>

      {/* Description Row */}
      <div className="grid grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          THE RUNDOWN...
        </div>
        <div className="col-span-3 p-3 text-sm">
          {selectedRamen.description}
        </div>
      </div>

      {/* Price Row */}
      <div className="grid grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          PRICE
        </div>
        <div className="col-span-3 p-3">
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
      <div className="grid grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          SPICINESS
        </div>
        <div className="col-span-3 p-3">
          {generateFlames(getSpicyLevel(selectedRamen.spiciness))}
        </div>
      </div>

      {/* Cooker Setting Row */}
      <div className="grid grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          COOKER SETTING
        </div>
        <div className="col-span-3 p-3">
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
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                <div className="text-red-500 text-xs">
                  <div className="w-8 h-8 border-2 border-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
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
      <div className="grid grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          SUGGESTED VIDEOS
        </div>
        <div className="col-span-3 p-3">
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
      <div className="grid grid-cols-4 border-t-2 border-gray-800">
        <div className="bg-yellow-200 border-r-2 border-gray-800 p-3 font-bold">
          ALLERGEN
        </div>
        <div className="col-span-3 p-3 text-sm">
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
