// src/components/CategoryInfo.jsx
import React from "react";

export default function CategoryInfo({ categoryInfo }) {
  if (!categoryInfo) return null;

  // Define colors for different countries/regions
  const getBackgroundColors = (slug) => {
    switch (slug) {
      case "korea":
        return "bg-gradient-to-br from-red-50 to-red-100";
      case "japan":
        return "bg-gradient-to-br from-blue-50 to-blue-100";
      case "taiwan":
        return "bg-gradient-to-br from-green-50 to-green-100";
      case "other-asia":
        return "bg-gradient-to-br from-orange-50 to-orange-100";
      default:
        return "bg-gradient-to-br from-white to-gray-50";
    }
  };

  return (
    <div
      className={`${getBackgroundColors(
        categoryInfo.slug
      )} rounded-2xl md:rounded-3xl overflow-hidden p-6 md:p-8 shadow-xl border border-gray-200/80 transform transition-all duration-300 hover:shadow-2xl`}
    >
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h3
          className="text-xl md:text-2xl font-semibold text-gray-800"
          style={{
            fontFamily: "Bahnschrift, system-ui, sans-serif",
          }}
        >
          From {categoryInfo.name}:
        </h3>
      </div>
      <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed mb-6">
        {categoryInfo.description}
      </p>
      {(categoryInfo.slug === "korea" ||
        categoryInfo.slug === "japan" ||
        categoryInfo.slug === "taiwan") && (
        <div className="flex justify-center">
          <div
            className={`w-20 h-14 bg-white ${
              categoryInfo.slug === "japan"
                ? "border-2 border-black"
                : "border-2 border-gray-200"
            } rounded-lg flex items-center justify-center shadow-sm`}
          >
            <img
              src={categoryInfo.flag || "/placeholder.svg"}
              alt={`${categoryInfo.name} Flag`}
              className="w-16 h-10 object-contain rounded"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = "block";
                }
              }}
            />
            <div className="text-2xl hidden">
              {categoryInfo.slug === "korea"
                ? "🇰🇷"
                : categoryInfo.slug === "japan"
                ? "🇯🇵"
                : "🇹🇼"}
            </div>
          </div>
        </div>
      )}
      {categoryInfo.slug === "other-asia" && (
        <div className="flex justify-center">
          <div className="w-20 h-14 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-sm">
            <div className="text-2xl">{categoryInfo.flag}</div>
          </div>
        </div>
      )}
    </div>
  );
}
