// src/components/MenuCategoryCard.jsx
import React from "react";

export default function MenuCategoryCard({ name, image }) {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <img src={image} alt={name} className="h-48 w-full object-cover" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <span
          className="text-white text-xl font-semibold"
          style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
