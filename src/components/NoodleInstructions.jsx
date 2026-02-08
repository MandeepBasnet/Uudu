import React, { useMemo } from "react";
import { X } from "lucide-react";

export default function NoodleInstructions({ onClose, menu }) {
  // Normalize menu input (e.g. "Menu 1", "MENU 3E")
  const menuKey = (menu || "Menu 1").toUpperCase();

  // Highlight helper: colors specific words based on type (Soup=Blue, Sauce=Red)
  const Highlight = ({ text, type, bold = false }) => {
    const colorClass = type === "Soup" ? "text-blue-700" : "text-red-600";
    return <span className={`${colorClass} ${bold ? "font-bold" : ""}`}>{text}</span>;
  };

  // Helper to process text with highlighted keywords
  const processText = (text, type) => {
    // Keywords to highlight.
    // For Soup: Prep, stir, Menu 1/3, Start, toppings
    // For Sauce: Prep, stir, Menu 2/3, Start, toppings, strainer, drain, + Water, + Time
    const keywords = [
      "Prep", "stir", "Menu 1", "Menu 2", "Menu 3", "Start", "toppings", 
      "strainer", "drain", "\\+ Water", "\\+ Time"
    ];
    
    // Create a regex that matches any of the keywords
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");
    
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      // Check if this part matches a keyword (case-insensitive check)
      const matchedKeyword = keywords.find(k => new RegExp(`^${k}$`, "i").test(part));
      
      if (matchedKeyword) {
          // Special handling for Menu X to match exact casing if needed, but here we just colorize
          return <Highlight key={i} text={part} type={type} bold />;
      }
      return part;
    });
  };

  // Menu Configuration Data
  const MENU_DATA = {
    "MENU 1": {
      type: "Soup",
      title: "MENU 1: SOUP NOODLE",
      subtitle: "460 ml water & 240 seconds (4 minutes)",
      step2_desc: "Press the Menu 1 button, then press the Start button.",
      step2_note: "The cooker will automatically fill the bowl with hot water, then boils as the timer counts down.",
      step4_type: "Soup",
      step5: "Safely bring bowl and serving tray to the dining area. Now smack that ramen!",
      step2_img: "/menu1.png" // reusing existing assets assumption or placeholders
    },
    // Menu 2
    "MENU 2": {
      type: "Sauce",
      title: "MENU 2: SAUCE NOODLE",
      subtitle: "520 ml water & 300 seconds (5 minutes)",
      step2_desc: "Press the Menu 2 button, then press the Start button.",
      step2_note: "The cooker will automatically fill the bowl with hot water, then boils as the timer counts down.",
      step4_type: "Sauce",
      step5: "Place bowl on the serving tray and safely bring it to the dining area. Now smack that ramen!",
      step2_img: "/menu2.png"
    },
    // Menu 3A
    "MENU 3A": {
      type: "Soup",
      title: "MENU 3A: SOUP NOODLE",
      subtitle: "420 ml water & 180 seconds (3 minutes)",
      step2_desc: "Press the Menu 1 button, then press the Start button.",
      step2_note: "The cooker will automatically fill the bowl with hot water, then boils as the timer counts down.",
      step4_type: "Soup",
      step5: "Safely bring bowl and serving tray to the dining area. Now smack that ramen!",
      step2_img: "/menu1.png"
    },
    // Menu 3B
    "MENU 3B": {
      type: "Sauce",
      title: "MENU 3B: SAUCE NOODLE",
      subtitle: "420 ml water & 180 seconds (3 minutes)",
      step2_desc: "Press the Menu 3 button, then press the Start button.",
      step2_note: "The cooker will automatically fill the bowl with hot water, then boils as the timer counts down.",
      step4_type: "Sauce",
      step5: "Place bowl on the serving tray and safely bring it to the dining area. Now smack that ramen!",
      step2_img: "/menu2.png"
    },
    // Menu 3C
    "MENU 3C": {
      type: "Sauce",
      title: "MENU 3C: SAUCE NOODLE",
      subtitle: "460 ml water & 210 seconds (3.5 minutes)",
      step2_desc: "Press the Menu 3 button, then press the + Water button to increase water to 460 ml.\nPress the + Time button to increase time to 210 seconds. Then press the Start button.",
      step2_note: "The cooker will automatically fill the bowl with hot water, then boils as the timer counts down.",
      step4_type: "Sauce",
      step5: "Safely bring bowl and serving tray to the dining area. Now smack that ramen!",
      step2_img: "/menu3.png"
    },
    // Menu 3D
    "MENU 3D": {
      type: "Soup",
      title: "MENU 3D: SOUP NOODLE",
      subtitle: "460 ml water & 180 seconds (3 minutes)",
      step2_desc: "Press the Menu 3 button, then press the + Water button to increase water to 460 ml.\nThen press the Start button.",
      step2_note: "The cooker will automatically fill the bowl with hot water, then boils as the timer counts down.",
      step4_type: "Soup",
      step5: "Safely bring bowl and serving tray to the dining area. Now smack that ramen!",
      step2_img: "/menu3.png"
    },
    // Menu 3E
    "MENU 3E": {
      type: "Soup",
      title: "MENU 3E: SOUP NOODLE",
      subtitle: "520 ml water & 360 seconds (6 minutes)",
      step2_desc: "Press the Menu 3 button, then press the + Water button to increase water to 520 ml.\nPress the + Time button to increase time to 360 seconds. Then press the Start button.",
      step2_note: "The cooker will automatically fill the bowl with hot water, then boils as the timer counts down.",
      step4_type: "Soup",
      step5: "Safely bring bowl and serving tray to the dining area. Now smack that ramen!",
      step2_img: "/menu3.png"
    }
  };

  const currentMenu = MENU_DATA[menuKey] || MENU_DATA["MENU 1"];
  const isSoup = currentMenu.type === "Soup";

  // Dynamic Styles
  const headerBg = isSoup ? "bg-blue-100" : "bg-red-100"; // Light background for header
  const headerText = isSoup ? "text-blue-700" : "text-red-600";
  const numberBg = isSoup ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-600";
  const borderColor = "border-gray-200"; // Keep borders neutral or simple

  return (
    <div className="w-full bg-white rounded-xl shadow-2xl font-sans overflow-hidden border border-gray-300">
      {/* Header */}
      <div className={`${headerBg} border-b ${borderColor} p-4 sm:p-5 text-center relative`}>
        <h1 className={`${headerText} font-bold text-xl sm:text-2xl tracking-wide whitespace-pre-line`}>
          {currentMenu.title}
        </h1>
         <h2 className="text-black font-bold text-lg sm:text-xl mt-1">
          {currentMenu.subtitle}
        </h2>

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
      <div className={`border-b ${borderColor} p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4`}>
        <div className={`flex-shrink-0 w-8 h-8 ${numberBg} rounded-full flex items-center justify-center font-bold text-sm`}>
          1
        </div>
        <div className="flex-1">
          <p className="text-black text-base sm:text-lg leading-relaxed">
            {processText("Prep the bowl by adding noodle & seasoning*, then place bowl on the cooker.", currentMenu.type)}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm italic mt-1">
            * Check packet on whether seasoning, flakes, oil, and sauce should be added before or after this cooking step. *
          </p>
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-4 w-24 h-16 border border-black flex items-center justify-center">
             {/* Placeholder for visual or keep standard image */}
             <img src="/img1.png" alt="Step 1" className="h-full object-contain" />
        </div>
      </div>

      {/* Step 2 */}
      <div className={`border-b ${borderColor} p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4`}>
        <div className={`flex-shrink-0 w-8 h-8 ${numberBg} rounded-full flex items-center justify-center font-bold text-sm`}>
          2
        </div>
        <div className="flex-1">
          <p className="text-black text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {processText(currentMenu.step2_desc, currentMenu.type)}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm italic mt-1">
            * {currentMenu.step2_note} *
          </p>
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-4 w-24 h-16 border border-black flex items-center justify-center">
             <img src="/startstop.png" alt="Step 2" className="h-full object-contain" />
        </div>
      </div>

      {/* Step 3 */}
      <div className={`border-b ${borderColor} p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4`}>
        <div className={`flex-shrink-0 w-8 h-8 ${numberBg} rounded-full flex items-center justify-center font-bold text-sm`}>
          3
        </div>
        <div className="flex-1">
          <p className="text-black text-base sm:text-lg leading-relaxed">
             {processText("Use wooden chopsticks to stir noodle regularly during cooking.", currentMenu.type)}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm italic mt-1">
            * Do not stir with plastic utensils. Also, the bowl will overheat and damage cooker if not stirred regularly. *
          </p>
        </div>
         <div className="mt-2 sm:mt-0 sm:ml-4 w-24 h-16 border border-black flex items-center justify-center">
             <img src="/img3.png" alt="Step 3" className="h-full object-contain" />
         </div>
      </div>

      {/* Step 4 */}
      <div className={`border-b ${borderColor} p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4`}>
        <div className={`flex-shrink-0 w-8 h-8 ${numberBg} rounded-full flex items-center justify-center font-bold text-sm`}>
          4
        </div>
        <div className="flex-1">
          {currentMenu.step4_type === "Soup" ? (
             <>
                <p className="text-black text-base sm:text-lg leading-relaxed">
                  Once time runs out, transfer bowl from the cooker to serving tray. Add any remaining {processText("seasoning* and toppings**.", currentMenu.type)}
                </p>
             </>
          ) : (
            <>
              <p className="text-black text-base sm:text-lg leading-relaxed mb-2">
                Once time runs out, transfer bowl from the cooker to serving tray.
              </p>
              <div className="space-y-2">
                 <p className="text-black text-base sm:text-lg">
                    Use the {processText("strainer", currentMenu.type)} to scoop out the noodle. Place strainer with noodle temporarily on a paper plate.
                 </p>
                 <p className="text-black text-base sm:text-lg">
                    Safely pour excess water from the bowl into the {processText("drain", currentMenu.type)} bucket, but leave some water as per the noodle's instruction.
                 </p>
                 <p className="text-black text-base sm:text-lg">
                    Put the noodle back into the bowl, add remaining seasoning* and {processText("toppings**", currentMenu.type)}, then mix thoroughly.
                 </p>
              </div>
            </>
          )}

          <p className="text-gray-500 text-xs sm:text-sm italic mt-1">
             * Most toppings are added at serving, but some can be reheated with the noodles for the final 30-60 seconds. *
          </p>
        </div>
         <div className="mt-2 sm:mt-0 sm:ml-4 w-24 h-16 border border-black flex items-center justify-center">
              <img src="/img4.png" alt="Step 4" className="h-full object-contain" />
         </div>
      </div>

      {/* Step 5 */}
      <div className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4`}>
        <div className={`flex-shrink-0 w-8 h-8 ${numberBg} rounded-full flex items-center justify-center font-bold text-sm`}>
          5
        </div>
        <div className="flex-1">
          <p className="text-black text-base sm:text-lg leading-relaxed">
            {currentMenu.step5}
          </p>
        </div>
        <div className="mt-2 sm:mt-0 sm:ml-4 w-24 h-16 border border-black flex items-center justify-center">
            {/* Using a placeholder or reusing img1 for serving if appropriate */}
             <img src="/img1.png" alt="Step 5" className="h-full object-contain" />
        </div>
      </div>

    </div>
  );
}
