// app/HtmlClassManager.tsx
"use client";

import { useEffect } from "react";

export function ThemeProvider() {
  useEffect(() => {
    const html = document.documentElement;
    
    // Only add classes if they don't exist
    if (!html.classList.contains("dark")) {
      html.classList.add("dark");
    }
    
    if (!html.classList.contains("custom-scrollbar")) {
      html.classList.add("custom-scrollbar");
    }
  }, []);

  return null;
}