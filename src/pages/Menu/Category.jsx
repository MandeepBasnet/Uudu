// src/pages/Menu/Category.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import ramenData from "../../data/ramen.json";
import toppingsData from "../../data/toppings.json";
import ProductCard from "../../components/ProductCard";

export default function Category() {
  const { category } = useParams();

  // Category display names (for banner)
  const categoryNames = {
    korea: "S. Korea",
    japan: "Japan",
    taiwan: "Taiwan",
    "other-asia": "Other Asia",
    toppers: "Toppers",
    bevs: "Bévs",
    snax: "Snax",
    specials: "Specials",
  };

  // Placeholder images for banner
  const bannerImages = {
    korea: "/images/categories/korea.jpg",
    japan: "/images/categories/japan.jpg",
    taiwan: "/images/categories/taiwan.jpg",
    "other-asia": "/images/categories/other-asia.jpg",
    toppers: "/images/categories/toppers.jpg",
    bevs: "/images/categories/bevs.jpg",
    snax: "/images/categories/snax.jpg",
    specials: "/images/categories/specials.jpg",
  };

  // Get product list depending on category
  let products = [];
  if (["korea", "japan", "taiwan", "other-asia"].includes(category)) {
    products = (ramenData.ramen || ramenData || []).filter(
      (r) => r.origin?.toLowerCase().replace(/\s/g, "-") === category
    );
  } else if (category === "toppers") {
    products = toppingsData.toppings || toppingsData || [];
  } else {
    products = []; // placeholder for bevs/snax/specials
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] pb-16">
      {/* Banner */}
      <div className="relative h-64 w-full">
        <img
          src={bannerImages[category]}
          alt={categoryNames[category]}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1
            className="text-3xl sm:text-4xl font-semibold text-white"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            {categoryNames[category]}
          </h1>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mx-auto max-w-7xl px-4 mt-10">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <Link
                key={p.id || p.name}
                to={`/menu/${category}/${slugify(p.name)}`}
              >
                <ProductCard
                  name={p.name}
                  image={p.image || "/images/placeholder.jpg"}
                  price={p.price}
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-20">
            No items found in this category.
          </p>
        )}
      </div>
    </div>
  );
}

// helper slugify
function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
