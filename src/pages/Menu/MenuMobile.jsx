import React, { useState } from "react";
import { useRamenData } from "../../hooks/useRamenData";
import { useToppingsData } from "../../hooks/useToppingsData";
import { useBeveragesData } from "../../hooks/useBeveragesData";
import { useSideDishesData } from "../../hooks/useSideDishesData";
import MobileProductCard from "../../components/MobileProductCard";
import RamenInfo from "../../components/RamenInfo";
import ToppingsInfo from "../../components/ToppingsInfo";
import BeveragesInfo from "../../components/BeveragesInfo";
import SideDishInfo from "../../components/SideDishInfo";

export default function MenuMobile() {
  const [activeTab, setActiveTab] = useState("ramen");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Appwrite Data Hook
  const { data: ramenItems } = useRamenData();
  const { data: toppingsItems } = useToppingsData();
  const { data: beveragesItems } = useBeveragesData();
  const { data: sideDishesItems } = useSideDishesData();

  const handleProductClick = (product, kind) => {
    if (product.status === "coming_soon" || product.status === "out_of_stock") return;
    setSelectedProduct({ ...product, kind });
  };

  // ... (keep handleBackToCategory and renderMobileModal unchanged)

  const handleBackToCategory = () => {
    setSelectedProduct(null);
  };

  const renderMobileModal = () => {
    if (!selectedProduct) return null;

    const InfoComponent =
      selectedProduct.kind === "ramen" ? RamenInfo
      : selectedProduct.kind === "bev" ? BeveragesInfo
      : selectedProduct.kind === "sides" ? SideDishInfo
      : ToppingsInfo;

    return (
      <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
        <div
          className="absolute inset-0 bg-black/30"
          onClick={handleBackToCategory}
        />
        <div className="absolute left-4 right-4 top-20 bottom-6 overflow-y-auto overscroll-contain">
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

  return (
    <>
      <div className="min-h-screen bg-[#F2F2F2]">
        {/* Uudu Logo */}
        <div className="pt-8 pb-6 px-4 flex justify-center">
          <img
            src="/images/logo.png"
            alt="Uudu Logo"
            className="h-20 object-contain"
          />
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-30 bg-[#F2F2F2] border-b-2 border-gray-300">
          <div className="flex">
            {[
              { key: "ramen", label: "Ramen" },
              { key: "addon", label: "Toppings" },
              { key: "sides", label: "Sides" },
              { key: "bev",   label: "Bêv" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 py-4 text-center font-semibold transition-colors ${
                  activeTab === key
                    ? "text-[#99564c] border-b-4 border-[#99564c]"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                style={{
                  fontFamily: "Bahnschrift, system-ui, sans-serif",
                  fontSize: "1rem",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 py-8">
          {/* Ramen Info Tab */}
          {activeTab === "ramen" && (
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {ramenItems && [...ramenItems].sort((a, b) => {
                const aFlag = a.status === "coming_soon" || a.status === "out_of_stock";
                const bFlag = b.status === "coming_soon" || b.status === "out_of_stock";
                if (aFlag && !bFlag) return 1;
                if (!aFlag && bFlag) return -1;
                if (!aFlag && !bFlag)
                  return (a.display_id || a.id).localeCompare(b.display_id || b.id);
                return (a.id || "").localeCompare(b.id || "");
              }).map((product) => (
                <MobileProductCard
                  key={product.id}
                  image={
                    product.image_url
                      ? (product.image_url.startsWith('http') ? product.image_url : `/images/${product.image_url}`)
                      : "/images/placeholder.jpg"
                  }
                  onClick={() => handleProductClick(product, "ramen")}
                  status={product.status}
                  id={product.display_id}
                />
              ))}
            </div>
          )}

          {/* Add-on Info Tab */}
          {activeTab === "addon" && (
            <div className="space-y-12">
              {/* Group toppings by category */}
              {(() => {
                const toppingCategories = [
                  "Veggies",
                  "Flavoring",
                  "Garnishes",
                  "Protein",
                ];

                return toppingCategories.map((categoryName) => {
                  const categoryToppings = toppingsItems.filter(
                    (topping) => topping.category === categoryName
                  ).sort((a, b) => {
                    const aFlag = a.status === "coming_soon" || a.status === "out_of_stock";
                    const bFlag = b.status === "coming_soon" || b.status === "out_of_stock";
                    if (aFlag && !bFlag) return 1;
                    if (!aFlag && bFlag) return -1;
                    return 0;
                  });

                  if (categoryToppings.length === 0) return null;

                  return (
                    <div key={categoryName} className="space-y-6">
                      {/* Subsection Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <h3
                          className="text-xl md:text-2xl font-semibold text-gray-800"
                          style={{
                            fontFamily: "Bahnschrift, system-ui, sans-serif",
                          }}
                        >
                          {categoryName}
                        </h3>
                      </div>

                      {/* Subsection Products Grid */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-4">
                        {categoryToppings.map((product) => (
                          <MobileProductCard
                            key={product.id}
                            image={
                              product.image_url
                                ? (product.image_url.startsWith('http') ? product.image_url : `/images/${product.image_url}`)
                                : "/images/placeholder.jpg"
                            }
                            onClick={() => handleProductClick(product, "toppings")}
                            status={product.status}
                            id={null}
                            coverMode
                          />
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* Sides Tab */}
          {activeTab === "sides" && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {(sideDishesItems || []).slice().sort((a, b) => {
                const aFlag = a.status === "coming_soon" || a.status === "out_of_stock";
                const bFlag = b.status === "coming_soon" || b.status === "out_of_stock";
                if (aFlag && !bFlag) return 1;
                if (!aFlag && bFlag) return -1;
                return (a.display_id || a.id || "").localeCompare(b.display_id || b.id || "");
              }).map((product) => (
                <MobileProductCard
                  key={product.id}
                  image={
                    product.image_url
                      ? (product.image_url.startsWith('http') ? product.image_url : `/images/${product.image_url}`)
                      : "/images/placeholder.jpg"
                  }
                  onClick={() => handleProductClick(product, "sides")}
                  status={product.status}
                  id={product.display_id}
                  coverMode
                />
              ))}
            </div>
          )}

          {/* Bêv Tab */}
          {activeTab === "bev" && (
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {(beveragesItems || []).slice().sort((a, b) => {
                const aFlag = a.status === "coming_soon" || a.status === "out_of_stock";
                const bFlag = b.status === "coming_soon" || b.status === "out_of_stock";
                if (aFlag && !bFlag) return 1;
                if (!aFlag && bFlag) return -1;
                return (a.display_id || a.id || "").localeCompare(b.display_id || b.id || "");
              }).map((product) => (
                <MobileProductCard
                  key={product.id}
                  image={
                    product.image_url
                      ? (product.image_url.startsWith('http') ? product.image_url : `/images/${product.image_url}`)
                      : "/images/placeholder.jpg"
                  }
                  onClick={() => handleProductClick(product, "bev")}
                  status={product.status}
                  id={product.display_id}
                  coverMode
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Modal */}
      {renderMobileModal()}
    </>
  );
}
