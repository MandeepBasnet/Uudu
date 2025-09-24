// src/components/ProductCard.jsx
import React, { useState, useCallback } from "react";

export default function ProductCard({
  name,
  image,
  price,
  hidePrice,
  uniformScale,
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
      </div>

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
