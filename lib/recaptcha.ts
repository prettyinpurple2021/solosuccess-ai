import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
// reCAPTCHA configuration
export const RECAPTCHA_CONFIG = {
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
  actions: {
    signup: 'signup',
    signin: 'signin',
    contact: 'contact',
    demo: 'demo',
    submit: 'submit'
  }
}

/**
 * Verify reCAPTCHA token with Google's verification API
 * 
 * @param token - The generated token obtained from the client
 * @param action - Action name corresponding to the token
 * @returns Promise<number | null> - Risk score or null if validation failed
 */
export async function createAssessment(
  token: string,
  action: string = 'submit'
): Promise<number | null> {
  try {
    if (!RECAPTCHA_CONFIG.secretKey) {
      logWarn('reCAPTCHA secret key not configured, skipping validation')
      return 0.9 // Return high score if not configured
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_CONFIG.secretKey,
        response: token,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      logError(`reCAPTCHA validation failed: ${data['error-codes']?.join(', ')}`)
      return null
    }

    const score = data.score || 0
    logInfo(`reCAPTCHA score for action '${action}': ${score}`)

    return score
  } catch (error) {
    logError('Error verifying reCAPTCHA token:', error)
    return null
  }
}

/**
 * Validate reCAPTCHA token with a minimum score threshold
 * 
 * @param token - The reCAPTCHA token
 * @param action - The expected action
 * @param minScore - Minimum acceptable score (0.0 to 1.0, default 0.5)
 * @returns Promise<boolean> - Whether the token is valid and meets score threshold
 */
export async function validateRecaptcha(
  token: string,
  action: string = 'submit',
  minScore: number = 0.5
): Promise<boolean> {
  const score = await createAssessment(token, action)
  
  if (score === null) {
    return false
  }

  return score >= minScore
}

/**
 * Get reCAPTCHA script URL for client-side loading
 */
export function getRecaptchaScriptUrl(): string {
  return `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_CONFIG.siteKey}`
}

/**
 * reCAPTCHA action types for different user interactions
 */
export const RECAPTCHA_ACTIONS = {
  LOGIN: 'login',
  REGISTER: 'register', 
  SIGNUP: 'signup',
  SIGNIN: 'signin',
  CONTACT: 'contact',
  DEMO: 'demo',
  SUBMIT: 'submit',
  FORGOT_PASSWORD: 'forgot_password',
  RESET_PASSWORD: 'reset_password',
  UPDATE_PROFILE: 'update_profile',
  CREATE_GOAL: 'create_goal',
  CREATE_TASK: 'create_task',
  SEND_MESSAGE: 'send_message',
  UPLOAD_FILE: 'upload_file',
  DELETE_ITEM: 'delete_item',
  PAYMENT: 'payment',
  SUBSCRIPTION: 'subscription'
} as const

export type RecaptchaAction = typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS]