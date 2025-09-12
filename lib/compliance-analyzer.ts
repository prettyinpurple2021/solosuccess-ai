import * as cheerio from 'cheerio'

export function analyze(html: string) {
  const $ = cheerio.load(html)
  const title = $('title').first().text().trim()
  const text = $('body').text().toLowerCase()
  const hasPrivacyPolicy = $('a[href*="privacy"]').length > 0 || text.includes('privacy policy')
  const hasCookieBanner = $('[id*="cookie"], [class*="cookie"]').length > 0 || text.includes('cookie')

  // More specific selectors for forms
  const hasNewsletter =
    $('form').filter((i, el) => {
      const formHtml = $(el).html()?.toLowerCase() || ''
      const formText = $(el).text().toLowerCase()
      return formHtml.includes('email') && (formText.includes('subscribe') || formText.includes('newsletter'))
    }).length > 0 || text.includes('newsletter')

  const hasContactForm =
    $('form').filter((i, el) => {
      const formHtml = $(el).html()?.toLowerCase() || ''
      return (
        formHtml.includes('email') &&
        ($(el).find('textarea').length > 0 ||
          $(el).find('input[name*="message"], input[name*="comment"], input[name*="query"]').length > 0 ||
          $(el).text().toLowerCase().includes('contact'))
      )
    }).length > 0

  const hasAnalytics = $('script[src*="google-analytics"], script:contains("gtag")').length > 0

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