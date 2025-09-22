import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { logger, logError, logInfo } from '@/lib/logger'

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ''

export interface S3UploadResult {
  url: string
  key: string
  bucket: string
}

export interface S3UploadOptions {
  contentType?: string
  metadata?: Record<string, string>
  public?: boolean
}

/**
 * Upload a file to S3
 */
export async function uploadToS3(
  key: string,
  file: File | Buffer | Uint8Array,
  options: S3UploadOptions = {}
): Promise<S3UploadResult> {
  try {
    if (!BUCKET_NAME) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is not set')
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: options.contentType || 'application/octet-stream',
      Metadata: options.metadata,
      ACL: options.public ? 'public-read' : 'private',
    })

    await s3Client.send(command)

    const url = options.public 
      ? `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
      : `s3://${BUCKET_NAME}/${key}`

    logInfo(`File uploaded to S3: ${key}`)

    return {
      url,
      key,
      bucket: BUCKET_NAME,
    }
  } catch (error) {
    logError('Error uploading to S3:', error)
    throw error
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(key: string): Promise<void> {
  try {
    if (!BUCKET_NAME) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is not set')
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await s3Client.send(command)
    logInfo(`File deleted from S3: ${key}`)
  } catch (error) {
    logError('Error deleting from S3:', error)
    throw error
  }
}

/**
 * Generate a presigned URL for private file access
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    if (!BUCKET_NAME) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is not set')
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return url
  } catch (error) {
    logError('Error generating presigned URL:', error)
    throw error
  }
}

/**
 * Extract S3 key from URL
 */
export function extractS3KeyFromUrl(url: string): string | null {
  try {
    // Handle both public URLs and s3:// URLs
    if (url.startsWith('s3://')) {
      const parts = url.split('/')
      return parts.slice(3).join('/')
    }
    
    if (url.includes('.s3.') && url.includes('.amazonaws.com/')) {
      const parts = url.split('.amazonaws.com/')
      return parts[1]
    }
    
    return null
  } catch (error) {
    logError('Error extracting S3 key from URL:', error)
    return null
  }
}

/**
 * Legacy compatibility functions to replace Vercel blob API
 */
export const put = uploadToS3
export const del = deleteFromS3
