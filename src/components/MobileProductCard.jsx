// src/components/MobileProductCard.jsx
import React, { useState, useCallback } from "react";

export default function MobileProductCard({ image, onClick, status, id }) {
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

  const isComingSoon = status === "coming_soon";

  return (
    <div onClick={onClick} className="cursor-pointer group">
      <div className="relative w-full h-32 sm:h-40 flex items-center justify-center">
        <img
          src={image}
          alt="Product"
          onLoad={handleLoad}
          className={
            orientation === "portrait"
              ? "max-h-full max-w-[70%] object-contain"
              : orientation === "landscape"
              ? "max-h-full max-w-[95%] object-contain"
              : "max-h-full max-w-[85%] object-contain"
          }
          loading="lazy"
        />
        {/* Coming Soon Overlay */}
        {isComingSoon && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/60 py-2">
            <p className="text-white text-center font-bold text-sm tracking-wide">
              Coming Soon
            </p>
          </div>
        )}

        {/* Sold Out Overlay */}
        {status === "out_of_stock" && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-red-800/80 py-2">
            <p className="text-white text-center font-bold text-sm tracking-wide uppercase">
              Sold Out
            </p>
          </div>
        )}
      </div>
      {id && (
        <div className="flex justify-center -mt-2 mb-1 relative z-10">
          <span
            className="bg-transparent text-gray-800 border border-gray-400 font-bold px-2 py-0.5 rounded-full shadow-sm text-xs"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            {id}
          </span>
        </div>
      )}
    </div>
  );
}
