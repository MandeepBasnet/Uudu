"use client";

/* eslint-disable no-unused-vars */
// src/pages/Menu/MenuMain.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ramenData from "../../data/ramen.json";
import toppingsData from "../../data/toppings.json";
import categories from "../../data/categories.json";
import ProductCard from "../../components/ProductCard";

export default function MenuMain() {
  const [activeCategory, setActiveCategory] = useState("korea");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const lastY = useRef(window.scrollY);
  const [navHidden, setNavHidden] = useState(false);
  const rafId = useRef(null);

  useEffect(() => {
    loadProducts(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY.current && currentY > 120) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-update active category based on scroll position
  useEffect(() => {
    const updateActiveFromScroll = () => {
      const headerEl = document.querySelector("header");
      const menuNavEl = document.getElementById("menu-categories-nav");
      const headerH = headerEl ? headerEl.getBoundingClientRect().height : 0;
      const menuNavH = menuNavEl ? menuNavEl.getBoundingClientRect().height : 0;
      const anchorOffset = headerH + menuNavH + 12;
      let closestSlug = activeCategory;
      let minDistance = Number.POSITIVE_INFINITY;

      categories.forEach((cat) => {
        const el = document.getElementById(`section-${cat.slug}`);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top - anchorOffset);
        if (distance < minDistance) {
          minDistance = distance;
          closestSlug = cat.slug;
        }
      });

      if (closestSlug !== activeCategory) {
        setSelectedProduct(null);
        setActiveCategory(closestSlug);
      }
    };

    const onScroll = () => {
      if (rafId.current != null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        updateActiveFromScroll();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on mount to set initial category based on current scroll
    updateActiveFromScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
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
    setSelectedProduct(null); // Reset selected product when changing categories
    const element = document.getElementById(`section-${categorySlug}`);
    if (element) {
      const headerEl = document.querySelector("header");
      const menuNavEl = document.getElementById("menu-categories-nav");
      const headerH = headerEl ? headerEl.getBoundingClientRect().height : 0;
      const menuNavH = menuNavEl ? menuNavEl.getBoundingClientRect().height : 0;
      const offset = headerH + menuNavH + 12;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleProductClick = (product, categorySlug) => {
    setSelectedProduct({
      ...product,
      categorySlug: categorySlug,
    });
  };

  const activeInfo = categories.find((cat) => cat.slug === activeCategory);
  const displayInfo = selectedProduct || activeInfo;

  return (
    <>
      <div className="min-h-screen bg-[#F2F2F2] pt-44 md:pt-44">
        {/* Fixed Menu Navigation */}
        <div
          id="menu-categories-nav"
          className={`fixed top-24 md:top-24 left-0 right-0 z-40 transition-transform duration-300 ${
            navHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4">
            <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm border rounded-2xl mx-4 mt-4 mb-3">
              <div className="py-3 px-4">
                {/* Mobile: horizontal scroller */}
                <div className="md:hidden overflow-x-auto">
                  <div className="flex items-center space-x-4">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => scrollToSection(cat.slug)}
                        className={`whitespace-nowrap text-sm font-medium transition-colors ${
                          activeCategory === cat.slug
                            ? "text-[#C84E00] border-b-2 border-[#C84E00] pb-1"
                            : "text-gray-700 hover:text-[#C84E00]"
                        }`}
                        style={{
                          fontFamily: "Bahnschrift, system-ui, sans-serif",
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop: split groups */}
                <div className="hidden md:flex items-center justify-between px-2">
                  <div className="flex items-center space-x-6">
                    <span className="text-gray-500 font-medium whitespace-nowrap">
                      NUUDU
                    </span>
                    <span className="text-gray-300">–</span>
                    {categories.slice(0, 4).map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => scrollToSection(cat.slug)}
                        className={`whitespace-nowrap font-medium transition-colors ${
                          activeCategory === cat.slug
                            ? "text-[#C84E00] border-b-2 border-[#C84E00] pb-1"
                            : "text-gray-600 hover:text-[#C84E00]"
                        }`}
                        style={{
                          fontFamily: "Bahnschrift, system-ui, sans-serif",
                        }}
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
                        style={{
                          fontFamily: "Bahnschrift, system-ui, sans-serif",
                        }}
                      >
                        {cat.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 pt-0">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main Content Area */}
            <div className="flex-1">
              {categories.map((category) => (
                <div
                  key={category.slug}
                  id={`section-${category.slug}`}
                  className="mb-12 md:mb-16 scroll-mt-24 md:scroll-mt-28"
                >
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      {category.slug === "korea" ||
                      category.slug === "japan" ||
                      category.slug === "taiwan" ? (
                        <img
                          src={category.flag || "/placeholder.svg"}
                          alt={`${category.name} flag`}
                          className="w-8 h-6 object-contain rounded"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                          <div
                            key={product.id}
                            onClick={() =>
                              handleProductClick(product, category.slug)
                            }
                            className="cursor-pointer"
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
                          </div>
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

            {/* Right Sidebar - Product/Category Info */}
            <div className="hidden lg:block lg:w-80 lg:order-none">
              <div className="lg:sticky lg:top-40">
                {displayInfo && (
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
                    {selectedProduct ? (
                      // Product Details
                      <>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 bg-white rounded-full shadow-sm overflow-hidden">
                            <img
                              src={
                                selectedProduct.image_url
                                  ? `/images/${selectedProduct.image_url}`
                                  : "/images/placeholder.jpg"
                              }
                              alt={selectedProduct.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <h3
                              className="text-xl font-semibold text-gray-800"
                              style={{
                                fontFamily:
                                  "Bahnschrift, system-ui, sans-serif",
                              }}
                            >
                              {selectedProduct.name}
                            </h3>
                            <p className="text-[#C84E00] font-medium">
                              $
                              {selectedProduct.price ||
                                selectedProduct.price_packet}
                            </p>
                          </div>
                        </div>

                        {selectedProduct.description && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Description
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {selectedProduct.description}
                            </p>
                          </div>
                        )}

                        {selectedProduct.ingredients && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Ingredients
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {selectedProduct.ingredients}
                            </p>
                          </div>
                        )}

                        {selectedProduct.spice_level && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Spice Level
                            </h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 rounded-full ${
                                    i < selectedProduct.spice_level
                                      ? "bg-red-500"
                                      : "bg-gray-200"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">
                                {selectedProduct.spice_level}/5
                              </span>
                            </div>
                          </div>
                        )}

                        {selectedProduct.allergen && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Allergen Information
                            </h4>
                            <p className="text-gray-600 text-xs leading-relaxed bg-yellow-50 p-2 rounded">
                              {selectedProduct.allergen}
                            </p>
                          </div>
                        )}

                        <button
                          onClick={() => setSelectedProduct(null)}
                          className="w-full mt-4 bg-[#C84E00] text-white py-2 px-4 rounded-lg hover:bg-[#B73E00] transition-colors"
                          style={{
                            fontFamily: "Bahnschrift, system-ui, sans-serif",
                          }}
                        >
                          Back to Category Info
                        </button>
                      </>
                    ) : (
                      // Category Info
                      <>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-3xl p-2 bg-white rounded-full shadow-sm">
                            {activeInfo.slug === "korea" ||
                            activeInfo.slug === "japan" ||
                            activeInfo.slug === "taiwan" ? (
                              <img
                                src={activeInfo.flag || "/placeholder.svg"}
                                alt={`${activeInfo.name} flag`}
                                className="w-8 h-6 object-contain rounded"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display =
                                      "inline";
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
                                className="w-16 h-10 object-contain rounded"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display =
                                      "block";
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
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="absolute left-4 right-4 top-28 bottom-6 overflow-y-auto">
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-2xl border border-gray-100">
              <button
                aria-label="Close"
                title="Close"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/95 border border-gray-200 shadow-md text-gray-500 hover:text-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C84E00]/40"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm overflow-hidden">
                  <img
                    src={
                      selectedProduct.image_url
                        ? `/images/${selectedProduct.image_url}`
                        : "/images/placeholder.jpg"
                    }
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3
                    className="text-xl font-semibold text-gray-800"
                    style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
                  >
                    {selectedProduct.name}
                  </h3>
                  <p className="text-[#C84E00] font-medium">
                    ${selectedProduct.price || selectedProduct.price_packet}
                  </p>
                </div>
              </div>

              {selectedProduct.description && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              {selectedProduct.ingredients && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Ingredients
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedProduct.ingredients}
                  </p>
                </div>
              )}

              {selectedProduct.spice_level && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Spice Level
                  </h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < selectedProduct.spice_level
                            ? "bg-red-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {selectedProduct.spice_level}/5
                    </span>
                  </div>
                </div>
              )}

              {selectedProduct.allergen && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Allergen Information
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed bg-yellow-50 p-2 rounded">
                    {selectedProduct.allergen}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full mt-4 bg-[#C84E00] text-white py-2 px-4 rounded-lg hover:bg-[#B73E00] transition-colors"
                style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
              >
                Back to Category Info
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
