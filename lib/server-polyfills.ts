// Minimal server-side polyfills for Web APIs that may be missing in older Node runtimes

// Only define polyfills if we're in a Node.js environment (not browser)
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  // Polyfill global File if not present (Node < 20)
  if (typeof (globalThis as any).File === "undefined") {
    // Simple File-like class for server-side use
    class PolyfillFile {
      public readonly name: string
      public readonly lastModified: number
      public readonly size: number
      public readonly type: string
      private _buffer: Buffer

      constructor(fileBits: BlobPart[] = [], fileName: string = "unknown", options: FilePropertyBag = {}) {
        this.name = String(fileName)
        this.lastModified = typeof options.lastModified === "number" ? options.lastModified : Date.now()
        this.type = options.type || ''
        
        // Convert file bits to buffer
        const buffers: Buffer[] = []
        for (const bit of fileBits) {
          if (typeof bit === 'string') {
            buffers.push(Buffer.from(bit, 'utf-8'))
          } else if (bit instanceof ArrayBuffer) {
            buffers.push(Buffer.from(bit))
          } else if (bit instanceof Uint8Array) {
            buffers.push(Buffer.from(bit))
          } else if (Buffer.isBuffer(bit)) {
            buffers.push(bit)
          }
        }
        this._buffer = Buffer.concat(buffers)
        this.size = this._buffer.length
      }

      arrayBuffer(): Promise<ArrayBuffer> {
        return Promise.resolve(this._buffer.buffer.slice(this._buffer.byteOffset, this._buffer.byteOffset + this._buffer.byteLength))
      }

      text(): Promise<string> {
        return Promise.resolve(this._buffer.toString('utf-8'))
      }

      stream(): ReadableStream {
        // Simple implementation for compatibility
        throw new Error('stream() not implemented in polyfill')
      }
    }
    ;(globalThis as any).File = PolyfillFile
  }

  // Polyfill global FormData if not present
  if (typeof (globalThis as any).FormData === "undefined") {
    class PolyfillFormData {
      private _data: Map<string, string | File> = new Map()

      append(name: string, value: string | Blob | File, fileName?: string): void {
        this._data.set(name, value as string | File)
      }

      get(name: string): FormDataEntryValue | null {
        return this._data.get(name) || null
      }

      has(name: string): boolean {
        return this._data.has(name)
      }

      set(name: string, value: string | Blob | File, fileName?: string): void {
        this._data.set(name, value as string | File)
      }

      delete(name: string): void {
        this._data.delete(name)
      }

      *entries(): IterableIterator<[string, FormDataEntryValue]> {
        for (const [key, value] of this._data) {
          yield [key, value]
        }
      }

      *keys(): IterableIterator<string> {
        for (const key of this._data.keys()) {
          yield key
        }
      }

      *values(): IterableIterator<FormDataEntryValue> {
        for (const value of this._data.values()) {
          yield value
        }
      }

      [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]> {
        return this.entries()
      }
    }
    ;(globalThis as any).FormData = PolyfillFormData
  }
}


