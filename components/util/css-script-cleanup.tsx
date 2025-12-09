"use client";

import { useEffect } from "react";

/**
 * Removes any accidentally-injected <script> tags that point to CSS files,
 * which cause MIME-type console errors and can interrupt hydration.
 */
export function CssScriptCleanup() {
  useEffect(() => {
    const scripts = Array.from(document.querySelectorAll('script[src]')).filter((el) => {
      try {
        const url = new URL(el.getAttribute('src') || '', window.location.href);
        return url.pathname.endsWith('.css');
      } catch {
        return false;
      }
    });
    scripts.forEach((el) => el.parentElement?.removeChild(el));
  }, []);

  return null;
}
