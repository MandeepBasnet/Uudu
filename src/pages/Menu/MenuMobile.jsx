import React, { useState } from "react";
import ramenData from "../../data/ramen.json";
import toppingsData from "../../data/toppings.json";
import ProductCard from "../../components/ProductCard";
import RamenInfo from "../../components/RamenInfo";
import ToppingsInfo from "../../components/ToppingsInfo";

export default function MenuMobile() {
  const [activeTab, setActiveTab] = useState("ramen");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product, isRamen) => {
    setSelectedProduct({
      ...product,
      isRamen: isRamen,
    });
  };

  const handleBackToCategory = () => {
    setSelectedProduct(null);
  };

  const renderMobileModal = () => {
    if (!selectedProduct) return null;

    const InfoComponent = selectedProduct.isRamen ? RamenInfo : ToppingsInfo;

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
            <button
              onClick={() => setActiveTab("ramen")}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${
                activeTab === "ramen"
                  ? "text-[#99564c] border-b-4 border-[#99564c]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              style={{
                fontFamily: "Bahnschrift, system-ui, sans-serif",
                fontSize: "1.125rem",
              }}
            >
              Ramen Info
            </button>
            <button
              onClick={() => setActiveTab("addon")}
              className={`flex-1 py-4 text-center font-semibold transition-colors ${
                activeTab === "addon"
                  ? "text-[#99564c] border-b-4 border-[#99564c]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              style={{
                fontFamily: "Bahnschrift, system-ui, sans-serif",
                fontSize: "1.125rem",
              }}
            >
              Add-on Info
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 py-8">
          {/* Ramen Info Tab */}
          {activeTab === "ramen" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {ramenData.ramen.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product, true)}
                  className="cursor-pointer"
                >
                  <ProductCard
                    name={product.name}
                    image={
                      product.image_url
                        ? `/images/${product.image_url}`
                        : "/images/placeholder.jpg"
                    }
                    price={product.price_packet}
                    hidePrice
                  />
                </div>
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
                  const categoryToppings = toppingsData.toppings.filter(
                    (topping) => topping.category === categoryName
                  );

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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                        {categoryToppings.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product, false)}
                            className="cursor-pointer"
                          >
                            <ProductCard
                              name={product.name}
                              image={
                                product.image_url
                                  ? `/images/${product.image_url}`
                                  : "/images/placeholder.jpg"
                              }
                              price={product.price}
                              hidePrice
                              uniformScale
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Modal */}
      {renderMobileModal()}
    </>
  );
}
