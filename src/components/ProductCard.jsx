// src/components/ProductCard.jsx
import React, { useState, useCallback } from "react";

export default function ProductCard({
  name,
  image,
  price,
  hidePrice,
  uniformScale,
  status,
  id,
}) {
  const [orientation, setOrientation] = useState("square");

  const handleLoad = useCallback((e) => {
    const img = e.target;
    const { naturalWidth, naturalHeight } = img;
    if (!naturalWidth || !naturalHeight) {
      setOrientation("square");
      return;
    }
    if (naturalHeight > naturalWidth * 1.1) {
      setOrientation("portrait");
    } else if (naturalWidth > naturalHeight * 1.1) {
      setOrientation("landscape");
    } else {
      setOrientation("square");
    }
  }, []);

  const priceText =
    typeof price === "number" && !Number.isNaN(price) && !hidePrice
      ? `$${price.toFixed(2)}`
      : undefined;

  const isComingSoon = status === "coming_soon";

  return (
    <div className="group">
      {/* Invisible frame that reserves consistent space */}
      <div className="relative w-full h-56 sm:h-60 md:h-64 lg:h-72 flex items-center justify-center border border-transparent">
        <img
          src={image}
          alt={name}
          onLoad={handleLoad}
          className={
            uniformScale
              ? "max-h-full max-w-[85%] object-contain"
              : orientation === "portrait"
              ? "max-h-full max-w-[70%] object-contain"
              : orientation === "landscape"
              ? "max-h-full max-w-[95%] object-contain"
              : "max-h-full max-w-[85%] object-contain"
          }
          loading="lazy"
        />
        {/* Coming Soon Overlay */}
        {isComingSoon && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/60 py-3">
            <p className="text-white text-center font-bold text-lg tracking-wide">
              Coming Soon
            </p>
          </div>
        )}
        
        {/* Sold Out Overlay */}
        {status === "out_of_stock" && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-red-800/80 py-3">
            <p className="text-white text-center font-bold text-lg tracking-wide uppercase">
              Sold Out
            </p>
          </div>
        )}
      </div>

      {id && (
        <div className="flex justify-center -mt-3 mb-2 relative z-10">
          <span
            className="bg-transparent text-gray-800 border border-gray-400 font-bold px-3 py-1 rounded-full shadow-sm text-sm sm:text-base"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            {id}
          </span>
        </div>
      )}

      {/* Text block */}
      <div className="mt-3 text-center px-2">
        <h3
          className="text-2xl sm:text-[28px] md:text-3xl font-bold leading-snug"
          style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
        >
          {name}
        </h3>
        {priceText && (
          <p className="mt-1 text-base sm:text-lg text-gray-700" aria-label="price">
            {priceText}
          </p>
        )}
      </div>
    </div>
  );
}
