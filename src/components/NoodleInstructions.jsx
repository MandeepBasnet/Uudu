import React from "react";

export default function NoodleInstructions() {
  return (
    <div className="max-w-2xl mx-auto bg-white border-2 border-gray-800 font-sans">
      {/* Header */}
      <div className="bg-gray-200 border-b-2 border-gray-800 p-4 text-center">
        <h1 className="text-blue-600 font-bold text-xl">
          MENU 1 (460 ml water & 4 minutes)
        </h1>
      </div>

      {/* Step 1 */}
      <div className="border-b-2 border-gray-800 p-6 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <span className="font-bold text-lg">1)</span>
            <p className="text-lg">
              Place bowl on cooker, then add noodle & seasoning
            </p>
          </div>
        </div>
        <div className="ml-6">
          <img
            src="/img1.png"
            alt="Step 1"
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      {/* Step 2 */}
      <div className="border-b-2 border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <span className="font-bold text-lg">2)</span>
              <div>
                <p className="text-lg mb-3">
                  Press the{" "}
                  <span className="text-blue-600 font-semibold">Menu 1</span>{" "}
                  button, then press the{" "}
                  <span className="text-blue-600 font-semibold">Start</span>{" "}
                  button
                </p>
                <p className="text-gray-500 italic text-sm">
                  The cooker will automatically fill the bowl with hot water,
                  then boils as the timer counts down.
                </p>
              </div>
            </div>
          </div>
          <div className="ml-6">
            <img
              src="/img2.png"
              alt="Step 2"
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="border-b-2 border-gray-800 p-6 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <span className="font-bold text-lg">3)</span>
            <p className="text-lg">
              Use wooden chopsticks to stir noodle periodically during cooking
            </p>
          </div>
        </div>
        <div className="ml-6">
          <img
            src="/img3.png"
            alt="Step 3"
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      {/* Step 4 */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <span className="font-bold text-lg">4)</span>
              <div>
                <p className="text-lg mb-3">
                  Once time runs out, remove the bowl from the cooker, add
                  toppings, and enjoy.
                </p>
                <p className="text-gray-500 italic text-sm">
                  Toppings can also be added with 1 minute remaining on the
                  timer
                </p>
              </div>
            </div>
          </div>
          <div className="ml-6">
            <img
              src="/img4.png"
              alt="Step 4"
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
