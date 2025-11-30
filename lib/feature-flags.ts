export type FeatureFlags = {
  enableNotifications: boolean
  enableScraping: boolean
  notifDailyCap: number
  scrapingUserHourlyCap: number
}

let flags: FeatureFlags = {
  enableNotifications: (process.env.FEATURE_ENABLE_NOTIFICATIONS ?? 'true') === 'true',
  enableScraping: (process.env.FEATURE_ENABLE_SCRAPING ?? 'true') === 'true',
  notifDailyCap: parseInt(process.env.NOTIF_DAILY_CAP || '500', 10),
  scrapingUserHourlyCap: parseInt(process.env.SCRAPING_USER_HOURLY_CAP || '20', 10)
}

export function getFeatureFlags(): FeatureFlags {
  return { ...flags }
}

export function updateFeatureFlags(update: Partial<FeatureFlags>): FeatureFlags {
  flags = { ...flags, ...update }
  return getFeatureFlags()
}


