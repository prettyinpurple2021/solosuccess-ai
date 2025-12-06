/**
 * DevCycle Feature Flags Setup Script
 * 
 * This script helps set up variations and targeting for all feature flags.
 * 
 * NOTE: Due to API type constraints, this script provides the configuration
 * data that you can use to manually configure in the DevCycle dashboard,
 * or use with the DevCycle Management API directly.
 * 
 * Run with: npx tsx scripts/setup-devcycle-features.ts
 */

interface FeatureConfig {
  key: string
  name: string
  type: 'Boolean' | 'Number'
  variations: Array<{
    key: string
    name: string
    value: boolean | number
  }>
  defaultVariation: string
}

const featureConfigs: FeatureConfig[] = [
  // Core Feature Flags
  {
    key: 'enable-notifications',
    name: 'Enable Notifications',
    type: 'Boolean',
    variations: [
      { key: 'on', name: 'On', value: true },
      { key: 'off', name: 'Off', value: false }
    ],
    defaultVariation: 'on'
  },
  {
    key: 'enable-scraping',
    name: 'Enable Scraping',
    type: 'Boolean',
    variations: [
      { key: 'on', name: 'On', value: true },
      { key: 'off', name: 'Off', value: false }
    ],
    defaultVariation: 'on'
  },
  {
    key: 'notif-daily-cap',
    name: 'Notification Daily Cap',
    type: 'Number',
    variations: [
      { key: 'default', name: 'Default (500)', value: 500 },
      { key: 'low', name: 'Low (100)', value: 100 },
      { key: 'high', name: 'High (1000)', value: 1000 }
    ],
    defaultVariation: 'default'
  },
  {
    key: 'scraping-user-hourly-cap',
    name: 'Scraping User Hourly Cap',
    type: 'Number',
    variations: [
      { key: 'default', name: 'Default (20)', value: 20 },
      { key: 'low', name: 'Low (10)', value: 10 },
      { key: 'high', name: 'High (50)', value: 50 }
    ],
    defaultVariation: 'default'
  },
  // Worker Configuration
  {
    key: 'enable-agent-message-pump',
    name: 'Enable Agent Message Pump',
    type: 'Boolean',
    variations: [
      { key: 'on', name: 'On', value: true },
      { key: 'off', name: 'Off', value: false }
    ],
    defaultVariation: 'on'
  },
  {
    key: 'enable-session-cleanup',
    name: 'Enable Session Cleanup',
    type: 'Boolean',
    variations: [
      { key: 'on', name: 'On', value: true },
      { key: 'off', name: 'Off', value: false }
    ],
    defaultVariation: 'on'
  },
  {
    key: 'enable-notification-processor',
    name: 'Enable Notification Processor',
    type: 'Boolean',
    variations: [
      { key: 'on', name: 'On', value: true },
      { key: 'off', name: 'Off', value: false }
    ],
    defaultVariation: 'on'
  },
  // Environment-based features (all Boolean)
  ...['has-database', 'has-auth', 'has-billing', 'has-ai', 'has-email', 'has-sms', 'has-push-notifications', 'has-recaptcha'].map(key => ({
    key,
    name: key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    type: 'Boolean' as const,
    variations: [
      { key: 'on', name: 'On', value: true },
      { key: 'off', name: 'Off', value: false }
    ],
    defaultVariation: 'on' // Update based on your .env.local
  })),
  // Subscription tier features (all Boolean)
  ...['feature-core', 'feature-view-only', 'feature-agents', 'feature-basic-tools', 'feature-advanced-tools', 
      'feature-email-integration', 'feature-forecasting', 'feature-api-access', 'feature-team-collaboration', 
      'feature-whitelabel', 'feature-custom-training'].map(key => ({
    key,
    name: key.replace('feature-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    type: 'Boolean' as const,
    variations: [
      { key: 'on', name: 'On', value: true },
      { key: 'off', name: 'Off', value: false }
    ],
    defaultVariation: 'on'
  })),
  // Subscription capabilities (all Boolean)
  ...['has-advanced-analytics', 'has-priority-support', 'has-custom-branding'].map(key => ({
    key,
    name: key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    type: 'Boolean' as const,
    variations: [
      { key: 'on', name: 'On', value: true },
      { key: 'off', name: 'Off', value: false }
    ],
    defaultVariation: 'on'
  }))
]

console.log('DevCycle Feature Flags Configuration')
console.log('=====================================\n')
console.log(`Total features: ${featureConfigs.length}\n`)

featureConfigs.forEach((config, index) => {
  console.log(`${index + 1}. ${config.name} (${config.key})`)
  console.log(`   Type: ${config.type}`)
  console.log(`   Variations:`)
  config.variations.forEach(v => {
    console.log(`     - ${v.name} (${v.key}): ${v.value}`)
  })
  console.log(`   Default: ${config.defaultVariation}\n`)
})

console.log('\nTo set up these features:')
console.log('1. Go to https://app.devcycle.com/o/org_09unKjzV4W9leYeG/p/solo-success-ai/features')
console.log('2. For each feature, add the variations listed above')
console.log('3. Set up targeting rules for Development environment')
console.log('4. Activate features in Development environment')

