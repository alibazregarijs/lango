// app/HtmlClassManager.tsx
"use client";

import { useEffect } from 'react';

export function HtmlClassManager() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return null;
}

// app/layout.tsx
