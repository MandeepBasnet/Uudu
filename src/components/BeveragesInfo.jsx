"use client";
import React from "react";
import { ChevronDown } from "lucide-react";

const BeveragesInfo = ({ product, onBack }) => {
  const bev = product;

  return (
    <div className="max-w-4xl mx-auto font-sans bg-white border border-gray-200 rounded-xl shadow-lg">
      {onBack && (
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 md:px-10 py-4 mb-6 rounded-t-xl">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#99564c] font-bold text-lg md:text-2xl lg:text-3xl transition-colors"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            <ChevronDown className="w-5 h-5 md:w-6 md:h-6 rotate-90" strokeWidth={3} />
            Back to Menu
          </button>
        </div>
      )}

      <div className="px-4 sm:px-6 md:px-10 pb-6 md:pb-10">
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-4">
          <div className="flex items-start gap-3">
            <div className="text-sm font-bold text-black whitespace-nowrap">Name:</div>
            <h1 className="text-sm font-normal tracking-tight text-gray-900 flex-1">{bev.name}</h1>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-sm font-bold text-black whitespace-nowrap">Price:</div>
            <div className="text-sm text-gray-900">{`$ ${Number(bev.price).toFixed(2)}`}</div>
          </div>
          <div className="w-full max-w-[200px] mx-auto mt-4">
            <img
              src={bev.image_url || "/images/placeholder.jpg"}
              alt={bev.name}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex gap-6 lg:gap-10 items-start">
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <div className="flex items-start gap-4">
              <div className="w-20 lg:w-24 flex-shrink-0 text-lg lg:text-xl font-bold text-black pt-0.5">Name:</div>
              <h1 className="text-lg lg:text-xl font-normal tracking-tight text-gray-900">{bev.name}</h1>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-20 lg:w-24 flex-shrink-0 text-lg lg:text-xl font-bold text-black pt-0.5">Price:</div>
              <div className="text-lg lg:text-xl text-gray-900">{`$ ${Number(bev.price).toFixed(2)}`}</div>
            </div>
          </div>
          <div className="hidden md:block w-48 self-stretch flex-shrink-0">
            <img
              src={bev.image_url || "/images/placeholder.jpg"}
              alt={bev.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {bev.description && (
          <section className="mt-6 md:mt-12 lg:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-10 items-start">
              <div className="md:col-span-3">
                <div className="text-sm md:text-lg lg:text-xl font-bold text-black">Description:</div>
              </div>
              <div className="md:col-span-9">
                <p className="text-sm md:text-lg lg:text-xl leading-relaxed text-gray-800">{bev.description}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BeveragesInfo;
