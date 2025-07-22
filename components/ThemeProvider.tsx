// app/HtmlClassManager.tsx
"use client";

import { useEffect } from 'react';

export function ThemeProvider() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return null;
}

// app/layout.tsx
