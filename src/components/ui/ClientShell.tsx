"use client";

/**
 * ClientShell - Client-side wrapper for interactive UI elements
 * Prevents hydration mismatch by rendering interactive components client-side only
 */

import { useState, useEffect } from 'react';
import ScrollToTop from './ScrollToTop';
import SilasChat from './SilasChat';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {children}
      {mounted && (
        <>
          <ScrollToTop />
          <SilasChat />
        </>
      )}
    </>
  );
}
