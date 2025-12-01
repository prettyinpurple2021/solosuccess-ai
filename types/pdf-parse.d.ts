declare module 'pdf-parse' {
  interface PDFInfo {
    Title?: string
    Author?: string
    CreationDate?: string
    ModDate?: string
    [key: string]: any
  }
  interface PDFData {
    numpages: number
    numrender: number
    info?: PDFInfo
    metadata?: any
    version?: string
    text: string
  }
  function pdf(data: Buffer | Uint8Array): Promise<PDFData>
  export default pdf
}
