// src/components/MobileProductCard.jsx
import React, { useState, useCallback } from "react";

export default function MobileProductCard({ image, onClick }) {
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
      </div>
    </div>
  );
}
