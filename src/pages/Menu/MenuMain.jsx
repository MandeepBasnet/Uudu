"use client";

/* eslint-disable no-unused-vars */
// src/pages/Menu/MenuMain.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ramenData from "../../data/ramen.json";
import toppingsData from "../../data/toppings.json";
import ProductCard from "../../components/ProductCard";

const categories = [
  {
    name: "S. Korea",
    slug: "korea",
    flag: "/images/s-korea.jpg",
    description:
      "Known for bold, fiery flavors and satisfyingly chewy noodles, Korean instant ramyun has emerged as the worldwide packaged noodle of choice. UUDU's Seoul-ful lineup includes the iconic spicy umami of Shin Ramyun to Buldak's creamy, cheesy heat — plus other tasty options in between. It's plenty of options to indulge your Korean flavor cravings.",
  },
  {
    name: "Japan",
    slug: "japan",
    flag: "/images/japan.jpg",
    description:
      "The birthplace of instant ramen brings refined, balanced flavors with premium ingredients. From rich tonkotsu to delicate shio broths, Japanese ramen offers sophisticated taste profiles that have perfected the art of noodle-making over decades.",
  },
  {
    name: "Taiwan",
    slug: "taiwan",
    flag: "/images/taiwan.jpg",
    description:
      "Taiwan's innovative noodle scene features unique air-dried textures and creative flavor combinations. A-Sha's premium wheat noodles showcase the island's dedication to quality ingredients and distinctive cooking techniques.",
  },
  {
    name: "Other Asia",
    slug: "other-asia",
    flag: "🌏",
    description:
      "Explore diverse flavors from across Asia, including Indonesia's beloved Mi Goreng, Thailand's aromatic Tom Yum, and Singapore's rich curry laksa. Each region brings its own special blend of spices and cooking traditions.",
  },
  {
    name: "Toppers",
    slug: "toppers",
    flag: "🍳",
    description:
      "Transform your ramen with our curated selection of proteins, vegetables, and garnishes. From Korean fish cake to crispy eggs, these toppings let you customize your bowl exactly how you want it.",
  },
  {
    name: "Bévs",
    slug: "bevs",
    flag: "🥤",
    description:
      "Refresh your palate with drinks that complement your ramen experience. Coming soon with authentic Asian beverages and modern refreshments.",
  },
  {
    name: "Snax",
    slug: "snax",
    flag: "🍢",
    description:
      "Perfect sides and snacks to round out your meal. From crispy treats to traditional accompaniments, these items enhance your ramen adventure.",
  },
  {
    name: "Specials",
    slug: "specials",
    flag: "⭐",
    description:
      "Limited-time offerings and unique creations that showcase innovative flavor combinations and seasonal ingredients. Check back regularly for new discoveries.",
  },
];

export default function MenuMain() {
  const [activeCategory, setActiveCategory] = useState("korea");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts(activeCategory);
  }, [activeCategory]);

  const loadProducts = (categorySlug) => {
    let items = [];
    if (["korea", "japan", "taiwan", "other-asia"].includes(categorySlug)) {
      const ramenItems = ramenData.ramen || [];
      const categoryToCountry = {
        korea: "S. Korea",
        japan: "Japan",
        taiwan: "Taiwan",
        "other-asia": "Other Asia",
      };
      items = ramenItems.filter(
        (r) => r.country === categoryToCountry[categorySlug]
      );
    } else if (categorySlug === "toppers") {
      items = toppingsData.toppings || [];
    } else {
      items = []; // placeholder for bevs/snax/specials
    }
    setProducts(items);
  };

  const scrollToSection = (categorySlug) => {
    setActiveCategory(categorySlug);
    const element = document.getElementById(`section-${categorySlug}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const activeInfo = categories.find((cat) => cat.slug === activeCategory);

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-20">
      {/* Sticky Menu Navigation */}
      <div className="fixed top-24 left-0 right-0 z-40 bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-6 overflow-x-auto">
              <span className="text-gray-500 font-medium whitespace-nowrap">
                NUUDU
              </span>
              <span className="text-gray-300">—</span>
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => scrollToSection(cat.slug)}
                  className={`whitespace-nowrap font-medium transition-colors ${
                    activeCategory === cat.slug
                      ? "text-[#C84E00] border-b-2 border-[#C84E00] pb-1"
                      : "text-gray-600 hover:text-[#C84E00]"
                  }`}
                  style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-6">
              {categories.slice(4).map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => scrollToSection(cat.slug)}
                  className={`whitespace-nowrap font-medium transition-colors ${
                    activeCategory === cat.slug
                      ? "text-[#C84E00] border-b-2 border-[#C84E00] pb-1"
                      : "text-gray-600 hover:text-[#C84E00]"
                  }`}
                  style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
                >
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 pt-20">
        <div className="flex gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {categories.map((category) => (
              <div
                key={category.slug}
                id={`section-${category.slug}`}
                className="mb-16"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    {category.slug === "korea" ||
                    category.slug === "japan" ||
                    category.slug === "taiwan" ? (
                      <img
                        src={category.flag || "/placeholder.svg"}
                        alt={`${category.name} flag`}
                        className="w-8 h-6 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = "inline";
                          }
                        }}
                      />
                    ) : null}
                    <span
                      className="text-3xl"
                      style={{
                        display:
                          category.slug === "korea" ||
                          category.slug === "japan" ||
                          category.slug === "taiwan"
                            ? "none"
                            : "inline",
                      }}
                    >
                      {typeof category.flag === "string" &&
                      category.flag.includes("/")
                        ? "🏳️"
                        : category.flag}
                    </span>
                    <h2
                      className="text-2xl font-semibold"
                      style={{
                        fontFamily: "Bahnschrift, system-ui, sans-serif",
                      }}
                    >
                      {category.name}
                    </h2>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(() => {
                    let items = [];
                    if (
                      ["korea", "japan", "taiwan", "other-asia"].includes(
                        category.slug
                      )
                    ) {
                      const ramenItems = ramenData.ramen || [];
                      const categoryToCountry = {
                        korea: "S. Korea",
                        japan: "Japan",
                        taiwan: "Taiwan",
                        "other-asia": "Other Asia",
                      };
                      items = ramenItems.filter(
                        (r) => r.country === categoryToCountry[category.slug]
                      );
                    } else if (category.slug === "toppers") {
                      items = toppingsData.toppings || [];
                    }

                    return items.length > 0 ? (
                      items.map((product) => (
                        <Link
                          key={product.id}
                          to={`/menu/${category.slug}/${slugify(product.name)}`}
                        >
                          <ProductCard
                            name={product.name}
                            image={
                              product.image_url
                                ? `/images/${product.image_url}`
                                : "/images/placeholder.jpg"
                            }
                            price={product.price || product.price_packet}
                          />
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">Coming soon...</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar - Country Info - Now with better styling */}
          <div className="w-80">
            <div className="sticky top-40">
              {activeInfo && (
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-3xl p-2 bg-white rounded-full shadow-sm">
                      {activeInfo.slug === "korea" ||
                      activeInfo.slug === "japan" ||
                      activeInfo.slug === "taiwan" ? (
                        <img
                          src={activeInfo.flag || "/placeholder.svg"}
                          alt={`${activeInfo.name} flag`}
                          className="w-8 h-6 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = "inline";
                            }
                          }}
                        />
                      ) : (
                        <span>
                          {typeof activeInfo.flag === "string" &&
                          activeInfo.flag.includes("/")
                            ? "🏳️"
                            : activeInfo.flag}
                        </span>
                      )}
                    </div>
                    <h3
                      className="text-xl font-semibold text-gray-800"
                      style={{
                        fontFamily: "Bahnschrift, system-ui, sans-serif",
                      }}
                    >
                      From {activeInfo.name}:
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {activeInfo.description}
                  </p>
                  {(activeInfo.slug === "korea" ||
                    activeInfo.slug === "japan" ||
                    activeInfo.slug === "taiwan") && (
                    <div className="flex justify-center">
                      <div className="w-20 h-14 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                        <img
                          src={activeInfo.flag || "/placeholder.svg"}
                          alt={`${activeInfo.name} Flag`}
                          className="w-16 h-10 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = "block";
                            }
                          }}
                        />
                        <div className="text-2xl hidden">
                          {activeInfo.slug === "korea"
                            ? "🇰🇷"
                            : activeInfo.slug === "japan"
                            ? "🇯🇵"
                            : "🇹🇼"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Intersection Observer to track active section
const useIntersectionObserver = (setActiveCategory) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categorySlug = entry.target.id.replace("section-", "");
            setActiveCategory(categorySlug);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    );

    categories.forEach((cat) => {
      const element = document.getElementById(`section-${cat.slug}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [setActiveCategory]);
};

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
