// Environment variables type definitions
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_ADSENSE_CLIENT_ID?: string;
    }
  }
  
  // Make React namespace available globally for Next.js generated types
  namespace React {
    type ReactNode = import('react').ReactNode
  }
}

// This ensures the file is treated as a module
export {};