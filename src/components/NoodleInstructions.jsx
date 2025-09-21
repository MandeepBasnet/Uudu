import React from "react";
import { X } from "lucide-react";

export default function NoodleInstructions({ onClose }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-2xl font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 sm:p-6 text-center relative">
        <h1 className="text-blue-700 font-bold text-xl sm:text-2xl tracking-wide">
          MENU 1 (460 ml water & 4 minutes)
        </h1>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:hidden inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-colors shadow-sm"
            aria-label="Close instructions"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Step 1 */}
      <div className="border-b border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-gray-50/50 transition-colors">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-blue-700 text-sm">1</span>
            </div>
            <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
              Place bowl on cooker, then add noodle & seasoning
            </p>
          </div>
        </div>
        <div className="flex justify-center sm:justify-end">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg flex items-center justify-center">
            <img
              src="/img1.png"
              alt="Step 1"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="border-b border-gray-100 p-5 sm:p-6 hover:bg-gray-50/50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-700 text-sm">2</span>
              </div>
              <div>
                <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-2">
                  Press the{" "}
                  <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                    Menu 1
                  </span>{" "}
                  button, then press the{" "}
                  <span className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                    Start
                  </span>{" "}
                  button
                </p>
                <p className="text-gray-600 text-sm italic">
                  The cooker will automatically fill the bowl with hot water,
                  then boils as the timer counts down.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg flex items-center justify-center">
              <img
                src="/img2.png"
                alt="Step 2"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="border-b border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-gray-50/50 transition-colors">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-blue-700 text-sm">3</span>
            </div>
            <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
              Use wooden chopsticks to stir noodle periodically during cooking
            </p>
          </div>
        </div>
        <div className="flex justify-center sm:justify-end">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg flex items-center justify-center">
            <img
              src="/img3.png"
              alt="Step 3"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="p-5 sm:p-6 hover:bg-gray-50/50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-700 text-sm">4</span>
              </div>
              <div>
                <p className="text-gray-800 text-base sm:text-lg leading-relaxed mb-2">
                  Once time runs out, remove the bowl from the cooker, add
                  toppings, and enjoy.
                </p>
                <p className="text-gray-600 text-sm italic">
                  Toppings can also be added with 1 minute remaining on the
                  timer
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg flex items-center justify-center">
              <img
                src="/img4.png"
                alt="Step 4"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
