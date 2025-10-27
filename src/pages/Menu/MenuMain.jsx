"use client";

/* eslint-disable no-unused-vars */
// src/pages/Menu/MenuMain.jsx
import React, { useState, useEffect, useRef } from "react";
import MenuDesktop from "./MenuDesktop";
import MenuMobile from "./MenuMobile";

export default function MenuMain() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile ? <MenuMobile /> : <MenuDesktop />;
}
