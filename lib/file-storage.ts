
// File storage system using Neon database - stores files as BLOB data in PostgreSQL
export interface FileUploadResult {
  url: string
  pathname: string
  contentType: string
  contentDisposition: string
}

export interface FileStorageProvider {
  upload(_file: File, _pathname: string): Promise<FileUploadResult>
  delete(_pathname: string): Promise<void>
  list(_prefix: string): Promise<Array<{
    url: string
    pathname: string
    size: number
    uploadedAt: Date
  }>>
}

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

// Neon database storage implementation
class NeonFileStorage implements FileStorageProvider {
  private async ensureTablesExist() {
    const sql = getSql()
    
    // Create file storage table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS file_storage (
        id SERIAL PRIMARY KEY,
        pathname VARCHAR(255) UNIQUE NOT NULL,
        filename VARCHAR(255) NOT NULL,
        content_type VARCHAR(100) NOT NULL,
        file_size INTEGER NOT NULL,
        file_data BYTEA NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    
    // Create index for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_file_storage_pathname 
      ON file_storage(pathname)
    `
  }

  async upload(file: File, pathname: string): Promise<FileUploadResult> {
    try {
      await this.ensureTablesExist()
      
      const sql = getSql()
      
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Store file in database
      await sql`
        INSERT INTO file_storage (pathname, filename, content_type, file_size, file_data)
        VALUES (${pathname}, ${file.name}, ${file.type}, ${file.size}, ${buffer})
        ON CONFLICT (pathname) DO UPDATE SET
          filename = EXCLUDED.filename,
          content_type = EXCLUDED.content_type,
          file_size = EXCLUDED.file_size,
          file_data = EXCLUDED.file_data,
          updated_at = NOW()
      `
      
      // Return a data URL that points to our API endpoint
      const url = `/api/files/${encodeURIComponent(pathname)}`
      
      logInfo(`File uploaded to Neon database: ${pathname}`)
      
      return {
        url,
        pathname,
        contentType: file.type,
        contentDisposition: `attachment; filename="${file.name}"`,
      }
    } catch (error) {
      logError('Error uploading file to Neon:', { error })
      throw error
    }
  }

  async delete(pathname: string): Promise<void> {
    try {
      await this.ensureTablesExist()
      
      const sql = getSql()
      
      await sql`
        DELETE FROM file_storage WHERE pathname = ${pathname}
      `
      
      logInfo(`File deleted from Neon database: ${pathname}`)
    } catch (error) {
      logError('Error deleting file from Neon:', { error })
      throw error
    }
  }

  async list(prefix: string): Promise<Array<{
    url: string
    pathname: string
    size: number
    uploadedAt: Date
  }>> {
    try {
      await this.ensureTablesExist()
      
      const sql = getSql()
      
      const files = await sql`
        SELECT pathname, file_size, created_at
        FROM file_storage
        WHERE pathname LIKE ${prefix + '%'}
        ORDER BY created_at DESC
      `
      
      return files.map(file => ({
        url: `/api/files/${encodeURIComponent(file.pathname)}`,
        pathname: file.pathname,
        size: file.file_size,
        uploadedAt: file.created_at
      }))
    } catch (error) {
      logError('Error listing files from Neon:', { error })
      throw error
    }
  }
}

// Default implementation using local storage (for development)
class LocalFileStorage implements FileStorageProvider {
  async upload(file: File, pathname: string): Promise<FileUploadResult> {
    // For development, we'll create a data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          pathname,
          contentType: file.type,
          contentDisposition: `attachment; filename="${file.name}"`,
        })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async delete(_pathname: string): Promise<void> {
    // No-op for local storage
    logInfo(`Would delete file: ${_pathname}`)
  }

  async list(_prefix: string): Promise<Array<{
    url: string
    pathname: string
    size: number
    uploadedAt: Date
  }>> {
    // Return empty array for local storage
    return []
  }
}

// Initialize storage provider based on environment
const getStorageProvider = (): FileStorageProvider => {
  // Use Neon storage if DATABASE_URL is available, otherwise local storage
  if (process.env.DATABASE_URL) {
    return new NeonFileStorage()
  }
  
  // Fallback to local storage for development
  return new LocalFileStorage()
}

const storageProvider = getStorageProvider()

export const uploadFile = async (file: File, filename: string, userId: string): Promise<FileUploadResult> => {
  try {
    const pathname = `users/${userId}/${Date.now()}-${filename}`

    const result = await storageProvider.upload(file, pathname)

    return {
      url: result.url,
      pathname: result.pathname,
      contentType: file.type,
      contentDisposition: `attachment; filename="${filename}"`,
    }
  } catch (error) {
    logError("Error uploading file:", error)
    throw new Error("Failed to upload file")
  }
}

export const deleteFile = async (pathname: string): Promise<void> => {
  try {
    await storageProvider.delete(pathname)
  } catch (error) {
    logError("Error deleting file:", error)
    throw new Error("Failed to delete file")
  }
}

export const listUserFiles = async (userId: string) => {
  try {
    const files = await storageProvider.list(`users/${userId}/`)

    return files.map((file) => ({
      url: file.url,
      pathname: file.pathname,
      size: file.size,
      uploadedAt: file.uploadedAt,
    }))
  } catch (error) {
    logError("Error listing files:", error)
    throw new Error("Failed to list files")
  }
}

export const getFileQuota = (subscriptionTier: string): number => {
  const quotas = {
    launchpad: 5 * 1024 * 1024 * 1024, // 5GB
    accelerator: 50 * 1024 * 1024 * 1024, // 50GB
    dominator: -1, // Unlimited
  }

  return quotas[subscriptionTier as keyof typeof quotas] || quotas.launchpad
}

export const checkFileQuota = async (
  userId: string,
  subscriptionTier: string,
): Promise<{
  used: number
  limit: number
  available: number
  canUpload: boolean
}> => {
  try {
    const files = await listUserFiles(userId)
    const used = files.reduce((total, file) => total + (file.size || 0), 0)
    const limit = getFileQuota(subscriptionTier)
    const available = limit === -1 ? Number.POSITIVE_INFINITY : limit - used
    const canUpload = limit === -1 || used < limit

    return {
      used,
      limit,
      available,
      canUpload,
    }
  } catch (error) {
    logError("Error checking file quota:", error)
    return {
      used: 0,
      limit: getFileQuota(subscriptionTier),
      available: getFileQuota(subscriptionTier),
      canUpload: true,
    }
  }
}
