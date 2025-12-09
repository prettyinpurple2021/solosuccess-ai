"use client";

import { useEffect } from "react";

/**
 * Removes any accidentally-injected <script> tags that point to CSS files,
 * which cause MIME-type console errors and can interrupt hydration.
 */
export function CssScriptCleanup() {
  useEffect(() => {
    const scripts = Array.from(document.querySelectorAll('script[src$=".css"]'));
    scripts.forEach((el) => el.parentElement?.removeChild(el));
  }, []);

  return null;
}

