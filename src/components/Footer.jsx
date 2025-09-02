import React from "react";

export default function Footer() {
  return (
    <footer className="pb-10 pt-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Location Section */}
            <div>
              <h3
                className="text-2xl font-semibold text-[#C84E00] mb-4"
                style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
              >
                Location
              </h3>
              <div className="space-y-2">
                <p
                  className="text-lg font-semibold text-[#3E3E3E]"
                  style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
                >
                  CYPRESS SQUARE
                </p>
                <div className="text-[#3E3E3E]">
                  <p>4931 Lincoln Avenue</p>
                  <p>Cypress, CA 90630</p>
                </div>
                <p className="text-[#3E3E3E] mt-3">(123) 456.7890</p>
              </div>
              <button className="mt-4 bg-[#C84E00] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#B73D00] transition-colors">
                MAP
              </button>
            </div>

            {/* Store Image Section */}
            <div className="flex justify-center">
              <img
                src="/images/store-front.png"
                alt="UUDU Store Front - Ramen O Hack"
                className="w-full max-w-sm rounded-lg object-cover shadow-sm"
              />
            </div>

            {/* Hours Section */}
            <div>
              <h3
                className="text-2xl font-semibold text-[#C84E00] mb-4"
                style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
              >
                Hours
              </h3>
              <p className="text-lg text-[#3E3E3E]">Mon – Sat: 11am – 7pm</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
