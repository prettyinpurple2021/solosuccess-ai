// Cheerio removed - using simplified text analysis
// import * as cheerio from 'cheerio'

export function analyze(html: string) {
  // Simplified analysis without cheerio to reduce bundle size
  const text = html.toLowerCase()
  const title = extractTitle(html)
  
  const hasPrivacyPolicy = text.includes('privacy policy') || text.includes('privacy')
  const hasCookieBanner = text.includes('cookie') && (text.includes('accept') || text.includes('consent'))
  const hasNewsletter = text.includes('newsletter') || (text.includes('subscribe') && text.includes('email'))
  const hasContactForm = text.includes('contact') && text.includes('form')
  const hasAnalytics = text.includes('google-analytics') || text.includes('gtag')

  const dataCollectionPoints: string[] = []
  if (hasContactForm) dataCollectionPoints.push('Contact Form')
  if (hasNewsletter) dataCollectionPoints.push('Newsletter Signup')
  if (hasAnalytics) dataCollectionPoints.push('Analytics Tracking')

  const cookieTypes: string[] = []
  if (text.includes('marketing cookies')) cookieTypes.push('Marketing')
  if (text.includes('analytics cookies')) cookieTypes.push('Analytics')
  if (text.includes('strictly necessary')) cookieTypes.push('Necessary')

  const consentMechanisms: string[] = []
  if (hasCookieBanner) consentMechanisms.push('Cookie Banner')

  // Simple trust score heuristic
  let trustScore = 50
  if (hasPrivacyPolicy) trustScore += 15
  if (hasCookieBanner) trustScore += 10
  if (hasContactForm) trustScore += 5
  if (hasAnalytics && !hasCookieBanner) trustScore -= 10
  trustScore = Math.max(0, Math.min(100, trustScore))

  return {
    page_title: title,
    has_privacy_policy: hasPrivacyPolicy,
    has_cookie_banner: hasCookieBanner,
    has_contact_form: hasContactForm,
    has_newsletter_signup: hasNewsletter,
    has_analytics: hasAnalytics,
    data_collection_points: dataCollectionPoints,
    cookie_types: cookieTypes,
    consent_mechanisms: consentMechanisms,
    trust_score: trustScore,
  }
}

function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return titleMatch ? titleMatch[1].trim() : ''
}
