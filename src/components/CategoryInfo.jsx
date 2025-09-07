// src/components/CategoryInfo.jsx
import React from "react";

export default function CategoryInfo({ categoryInfo }) {
  if (!categoryInfo) return null;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-3xl p-2 bg-white rounded-full shadow-sm">
          {categoryInfo.slug === "korea" ||
          categoryInfo.slug === "japan" ||
          categoryInfo.slug === "taiwan" ? (
            <img
              src={categoryInfo.flag || "/placeholder.svg"}
              alt={`${categoryInfo.name} flag`}
              className="w-8 h-6 object-contain rounded"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = "inline";
                }
              }}
            />
          ) : (
            <span>
              {typeof categoryInfo.flag === "string" &&
              categoryInfo.flag.includes("/")
                ? "🏳️"
                : categoryInfo.flag}
            </span>
          )}
        </div>
        <h3
          className="text-xl font-semibold text-gray-800"
          style={{
            fontFamily: "Bahnschrift, system-ui, sans-serif",
          }}
        >
          From {categoryInfo.name}:
        </h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        {categoryInfo.description}
      </p>
      {(categoryInfo.slug === "korea" ||
        categoryInfo.slug === "japan" ||
        categoryInfo.slug === "taiwan") && (
        <div className="flex justify-center">
          <div className="w-20 h-14 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
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
    </div>
  );
}
