"use client";

/* eslint-disable no-unused-vars */
// src/pages/Menu/MenuMain.jsx
import React, { useState, useEffect, useRef } from "react";
import ramenData from "../../data/ramen.json";
import toppingsData from "../../data/toppings.json";
import categories from "../../data/categories.json";
import ProductCard from "../../components/ProductCard";
import CategoryInfo from "../../components/CategoryInfo";
import RamenInfo from "../../components/RamenInfo";
import ToppingsInfo from "../../components/ToppingsInfo";

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

  // Auto-update active category based on scroll position with increased threshold
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
        // Increased threshold for better sticky behavior
        const distance = Math.abs(rect.top - anchorOffset);
        // Only change category if we're significantly into the next section
        if (distance < minDistance && rect.top <= anchorOffset + 100) {
          minDistance = distance;
          closestSlug = cat.slug;
        }
      });

      if (closestSlug !== activeCategory) {
        // Don't reset selected product when category changes
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
      items = []; // placeholder for bev/snax/specials
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

  const handleBackToCategory = () => {
    setSelectedProduct(null);
  };

  const activeInfo = categories.find((cat) => cat.slug === activeCategory);

  const renderInfoPanel = () => {
    if (!selectedProduct) return null;
    // Determine which component to use based on category
    if (selectedProduct.categorySlug === "toppers") {
      return (
        <ToppingsInfo product={selectedProduct} onBack={handleBackToCategory} />
      );
    }
    return (
      <RamenInfo product={selectedProduct} onBack={handleBackToCategory} />
    );
  };

  const renderMobileModal = () => {
    if (!selectedProduct) return null;

    const InfoComponent =
      selectedProduct.categorySlug === "toppers" ? ToppingsInfo : RamenInfo;

    return (
      <div
        className="fixed inset-0 z-50 lg:hidden"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="absolute inset-0 bg-black/30"
          onClick={handleBackToCategory}
        />
        <div className="absolute left-4 right-4 top-28 bottom-6 overflow-y-auto overscroll-contain">
          <div className="relative">
            <button
              aria-label="Close"
              title="Close"
              onClick={handleBackToCategory}
              className="absolute top-3 right-3 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/95 border border-gray-200 shadow-md text-gray-500 hover:text-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C84E00]/40"
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
            <InfoComponent
              product={selectedProduct}
              onBack={handleBackToCategory}
            />
          </div>
        </div>
      </div>
    );
  };

  // Function to get section background colors
  const getSectionColors = (slug) => {
    switch (slug) {
      case "korea":
        return "bg-red-25";
      case "japan":
        return "bg-blue-25";
      case "taiwan":
        return "bg-green-25";
      case "other-asia":
        return "bg-orange-25";
      default:
        return "bg-gray-25";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F2F2F2] pt-44 md:pt-48">
        {/* Fixed Menu Navigation */}
        <div
          id="menu-categories-nav"
          className={`fixed top-24 md:top-24 left-0 right-0 z-40 transition-transform duration-300 ${
            navHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="w-full px-4">
            <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm border rounded-2xl mx-2 mt-4 mb-3">
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
                            ? "text-[#99564c] border-b-2 border-[#99564c] pb-1"
                            : "text-gray-700 hover:text-[#99564c]"
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
                      UUDU
                    </span>
                    <span className="text-gray-300">—</span>
                    {categories.slice(0, 4).map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => scrollToSection(cat.slug)}
                        className={`whitespace-nowrap font-medium transition-colors ${
                          activeCategory === cat.slug
                            ? "text-[#99564c] border-b-2 border-[#99564c] pb-1"
                            : "text-gray-600 hover:text-[#99564c]"
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
                            ? "text-[#99564c] border-b-2 border-[#99564c] pb-1"
                            : "text-gray-600 hover:text-[#99564c]"
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

        {/* Main Container with max-width for large screens */}
        <div className="w-full px-2 py-8 pt-0">
          <div className="max-w-[2000px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Main Content Area */}
              <div className={selectedProduct ? "flex-1 lg:w-1/2" : "flex-1"}>
                {categories.map((category) => (
                  <div
                    key={category.slug}
                    id={`section-${category.slug}`}
                    className="mb-24 md:mb-32 scroll-mt-24 md:scroll-mt-28"
                    style={{
                      // Alternating light beige and light gray for country sections
                      backgroundColor:
                        category.slug === "korea"
                          ? "#fff7ed" // light beige
                          : category.slug === "japan"
                          ? "#f5f5f5" // light gray
                          : category.slug === "taiwan"
                          ? "#fff7ed" // light beige
                          : category.slug === "other-asia"
                          ? "#f5f5f5" // light gray
                          : category.slug === "toppers"
                          ? "#fff7ed"
                          : category.slug === "bev"
                          ? "#f0f9ff"
                          : category.slug === "snax"
                          ? "#fefce8"
                          : category.slug === "specials"
                          ? "#fdf2f8"
                          : "transparent",
                      padding: [
                        "korea",
                        "japan",
                        "taiwan",
                        "other-asia",
                        "toppers",
                        "bev",
                        "snax",
                        "specials",
                      ].includes(category.slug)
                        ? "2rem 1rem"
                        : "0",
                      marginBottom: [
                        "korea",
                        "japan",
                        "taiwan",
                        "other-asia",
                        "toppers",
                        "bev",
                        "snax",
                        "specials",
                      ].includes(category.slug)
                        ? "3rem"
                        : "2rem",
                    }}
                  >
                    {/* Country Top Banner */}
                    {["korea", "japan", "taiwan", "other-asia"].includes(
                      category.slug
                    ) && (
                      <div className="mb-12 md:mb-14">
                        <div className="w-full rounded-2xl bg-transparent border border-gray-300 shadow-sm px-4 py-4">
                          <div className="flex items-center justify-center gap-4 mb-3">
                            <h2
                              className="px-2 text-[32px] font-extrabold uppercase tracking-wide"
                              style={{
                                fontFamily:
                                  "Bahnschrift, system-ui, sans-serif",
                              }}
                            >
                              {category.name}
                            </h2>
                            <div className="w-14 h-10 overflow-hidden rounded border border-gray-200 bg-white flex items-center justify-center">
                              {typeof category.flag === "string" &&
                              category.flag.startsWith("/images/") ? (
                                <img
                                  src={category.flag}
                                  alt={`${category.name} flag`}
                                  className="w-14 h-10 object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-3xl leading-none">
                                  {category.flag || ""}
                                </span>
                              )}
                            </div>
                          </div>
                          {category.description && (
                            <p className="text-[24px] font-normal text-gray-700 max-w-5xl mx-auto leading-relaxed text-justify">
                              {category.slug === "toppers"
                                ? "Instant noodles are just the beginning - our 32 toppings unlock the real hack. From fresh veggies and bold sauces to melty cheeses and savoury proteins, each add-on transforms a simple bowl into your signature creation. Layer, mix, and match  - this is where the flavour adventure takes flight."
                                : category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Non-country Top Banner (Toppers, Bévs, Snax, Specials) */}
                    {!["korea", "japan", "taiwan", "other-asia"].includes(
                      category.slug
                    ) && (
                      <div className="mb-12 md:mb-14">
                        <div className="w-full rounded-2xl bg-transparent border border-gray-300 shadow-sm px-4 py-4">
                          <div className="flex items-center justify-center gap-4 mb-3">
                            <h2
                              className="px-2 text-[32px] font-extrabold uppercase tracking-wide"
                              style={{
                                fontFamily:
                                  "Bahnschrift, system-ui, sans-serif",
                              }}
                            >
                              {category.name}
                            </h2>
                            <div className="w-14 h-10 overflow-hidden rounded border border-gray-200 bg-white flex items-center justify-center">
                              {typeof category.flag === "string" &&
                              category.flag.startsWith("/images/") ? (
                                <img
                                  src={category.flag}
                                  alt={`${category.name} flag`}
                                  className="w-14 h-10 object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-3xl leading-none">
                                  {category.flag || ""}
                                </span>
                              )}
                            </div>
                          </div>
                          {category.description && (
                            <p className="text-[24px] font-normal text-gray-700 max-w-5xl mx-auto leading-relaxed text-justify">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Products Grid */}
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 ${
                        selectedProduct
                          ? "lg:grid-cols-3 xl:grid-cols-3"
                          : "lg:grid-cols-4 xl:grid-cols-5"
                      }`}
                    >
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
                            (r) =>
                              r.country === categoryToCountry[category.slug]
                          );
                        } else if (category.slug === "toppers") {
                          const allToppings = toppingsData.toppings || [];
                          const toppingCategories = [
                            "Veggies",
                            "Flavoring",
                            "Garnishes",
                            "Protein",
                          ];

                          return (
                            <div className="col-span-full space-y-12">
                              {toppingCategories.map((toppingCategory) => {
                                const categoryToppings = allToppings.filter(
                                  (topping) =>
                                    topping.category === toppingCategory
                                );

                                if (categoryToppings.length === 0) return null;

                                // Unified background color for all topping subsections (match South Korea)
                                const getToppingSubsectionColor = () =>
                                  "#fff7ed";

                                return (
                                  <div
                                    key={toppingCategory}
                                    className="space-y-6"
                                    style={{
                                      backgroundColor:
                                        getToppingSubsectionColor(
                                          toppingCategory
                                        ),
                                      padding: "1.5rem 1rem",
                                      borderRadius: "0.75rem",
                                      marginBottom: "1rem",
                                    }}
                                  >
                                    {/* Subsection Header */}
                                    <div className="flex items-center gap-3 mb-6">
                                      <h3
                                        className="text-xl md:text-2xl font-semibold text-gray-800"
                                        style={{
                                          fontFamily:
                                            "Bahnschrift, system-ui, sans-serif",
                                        }}
                                      >
                                        {toppingCategory}
                                      </h3>
                                    </div>

                                    {/* Subsection Products Grid */}
                                    <div
                                      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 ${
                                        selectedProduct
                                          ? "lg:grid-cols-3 xl:grid-cols-3"
                                          : "lg:grid-cols-4 xl:grid-cols-5"
                                      }`}
                                    >
                                      {categoryToppings.map((product) => (
                                        <div
                                          key={product.id}
                                          onClick={() =>
                                            handleProductClick(
                                              product,
                                              category.slug
                                            )
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
                                            price={
                                              product.price ||
                                              product.price_packet
                                            }
                                            hidePrice
                                            uniformScale
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
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
                                hidePrice
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

              {/* Right Sidebar - Product Info (only when a product is selected) */}
              {selectedProduct && (
                <div
                  className={`hidden lg:block lg:order-none ${
                    selectedProduct ? "lg:w-1/2 xl:w-2/5 2xl:w-1/3" : "lg:w-80"
                  }`}
                >
                  <div className="lg:sticky md:top-36 lg:top-44 xl:top-48 overflow-visible max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {renderInfoPanel()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Modal */}
      {renderMobileModal()}
    </>
  );
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
