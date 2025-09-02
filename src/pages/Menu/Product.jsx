// src/pages/Menu/Product.jsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import ramenData from "../../data/ramen.json";
import toppingsData from "../../data/toppings.json";

export default function Product() {
  const { category, productSlug } = useParams();

  // Merge ramen + toppings into one lookup pool
  const allItems = [...ramenData, ...toppingsData];

  // Find product by slug
  const product = allItems.find((item) => slugify(item.name) === productSlug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] pb-20">
      {/* Banner */}
      <div className="relative h-56 w-full">
        <img
          src={product.image || "/images/placeholder.jpg"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1
            className="text-3xl sm:text-4xl font-semibold text-white text-center"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            {product.name}
          </h1>
        </div>
      </div>

      {/* Product Info */}
      <div className="mx-auto max-w-4xl px-4 mt-10 bg-white rounded-3xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Product Image */}
          <div className="flex-shrink-0 w-full md:w-1/2">
            <img
              src={product.image || "/images/placeholder.jpg"}
              alt={product.name}
              className="w-full rounded-2xl object-cover shadow"
            />
          </div>

          {/* Right: Product Details */}
          <div className="flex-1">
            <h2
              className="text-2xl font-semibold mb-3"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              {product.name}
            </h2>
            {product.price && (
              <p className="text-lg text-[#C84E00] font-medium mb-4">
                ${product.price}
              </p>
            )}
            <p className="text-gray-700 mb-4 leading-relaxed">
              {product.description || "No description available."}
            </p>

            {product.allergens && (
              <p className="text-sm text-red-600 mb-3">
                ⚠ Allergens: {product.allergens}
              </p>
            )}

            {product.manufacturer_url && (
              <a
                href={product.manufacturer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                Manufacturer Info
              </a>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            to={`/menu/${category}`}
            className="text-sm text-[#C84E00] hover:underline"
          >
            ← Back to {category}
          </Link>
        </div>
      </div>
    </div>
  );
}

// helper slugify
function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
