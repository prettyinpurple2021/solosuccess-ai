// Global type declarations to resolve legacy import issues without overriding React itself.

declare module '*.tsx' {
  const content: any;
  export default content;
}

declare module '*.ts' {
  const content: any;
  export default content;
}

declare global {
  type ReactNode = import('react').ReactNode;
}
