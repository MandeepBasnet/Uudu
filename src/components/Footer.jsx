import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="pb-10 pt-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Location Section */}
            <div>
              <h3
                className="text-2xl font-semibold text-[#99564c] mb-4"
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
                <p className="text-[#3E3E3E]">(123) 456-7890</p>
              </div>
              <Link
                to="/location#map"
                className="mt-6 inline-block bg-[#99564c] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#99564c]/80 transition-colors"
              >
                MAP
              </Link>
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
                className="text-2xl font-semibold text-[#99564c] mb-4"
                style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
              >
                Hours
              </h3>
              <div className="text-[#3E3E3E]">
                <p>Mon – Thu: 11:00 AM – 9:00 PM</p>
                <p>Fri – Sat: 11:00 AM – 10:00 PM</p>
                <p>Sun: 12:00 PM – 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
