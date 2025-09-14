// src/components/ToppingsInfo.jsx
import React from "react";

export default function ToppingsInfo({ product, onBack }) {
  if (!product) return null;

  // Function to render spiciness with fire emojis
  const renderSpiciness = (spiciness) => {
    if (!spiciness) return null;

    const match = spiciness.match(/(\d+)\s*out\s*of\s*10\s*flames?/i);
    if (match) {
      const count = parseInt(match[1]);
      const fireEmojis = "🔥".repeat(count);
      return (
        <div className="flex items-center gap-2">
          <span className="text-2xl">{fireEmojis}</span>
          <span className="text-gray-500 text-xs">({count}/10)</span>
        </div>
      );
    }

    return <p className="text-red-500 font-medium text-sm">{spiciness}</p>;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-white rounded-full shadow-sm overflow-hidden">
          <img
            src={
              product.image_url
                ? `/images/${product.image_url}`
                : "/images/placeholder.jpg"
            }
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h3
            className="text-xl font-semibold text-gray-800"
            style={{
              fontFamily: "Bahnschrift, system-ui, sans-serif",
            }}
          >
            {product.name}
          </h3>
          <p className="text-[#99564c] font-medium">
            {product.price === 0 ? "FREE" : `$${product.price}`}
          </p>
        </div>
      </div>

      {product.category && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Category</h4>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      )}

      {product.description && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {product.spiciness && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Spiciness</h4>
          {renderSpiciness(product.spiciness)}
        </div>
      )}

      {product.allergen && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">
            Allergen Information
          </h4>
          <p className="text-gray-600 text-xs leading-relaxed bg-yellow-50 p-2 rounded">
            {product.allergen}
          </p>
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full mt-4 bg-[#99564c] text-white py-2 px-4 rounded-lg hover:bg-[#99564c] transition-colors"
        style={{
          fontFamily: "Bahnschrift, system-ui, sans-serif",
        }}
      >
        Back to Category Info
      </button>
    </div>
  );
}
