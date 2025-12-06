/**
 * DevCycle Feature Flags Automated Configuration
 * 
 * This script uses the DevCycle Management API to configure all feature flags.
 * 
 * Prerequisites:
 * 1. Get your Management API token by running:
 *    DEVCYCLE_CLIENT_ID=your_id DEVCYCLE_CLIENT_SECRET=your_secret node scripts/get-devcycle-management-token.mjs
 * 2. Set the token: export DEVCYCLE_MANAGEMENT_API_TOKEN=your_token
 * 
 * Or use Client ID/Secret directly:
 *    DEVCYCLE_CLIENT_ID=your_id DEVCYCLE_CLIENT_SECRET=your_secret node scripts/configure-devcycle-features.mjs
 * 
 * Run with: node scripts/configure-devcycle-features.mjs
 */

const PROJECT_ID = '68da2df27d39cbc33125f981'
const DEVELOPMENT_ENV_ID = '68da2df27d39cbc33125f985' // Development environment ID

const API_BASE = 'https://api.devcycle.com/v1'

// Feature configurations
const features = [
  // Core flags
  { key: 'enable-notifications', type: 'Boolean', defaultVal: true },
  { key: 'enable-scraping', type: 'Boolean', defaultVal: true },
  { key: 'notif-daily-cap', type: 'Number', defaultVal: 500, variations: [100, 500, 1000] },
  { key: 'scraping-user-hourly-cap', type: 'Number', defaultVal: 20, variations: [10, 20, 50] },
  // Workers
  { key: 'enable-agent-message-pump', type: 'Boolean', defaultVal: true },
  { key: 'enable-session-cleanup', type: 'Boolean', defaultVal: true },
  { key: 'enable-notification-processor', type: 'Boolean', defaultVal: true },
  // Environment checks
  { key: 'has-database', type: 'Boolean', defaultVal: true },
  { key: 'has-auth', type: 'Boolean', defaultVal: true },
  { key: 'has-billing', type: 'Boolean', defaultVal: true },
  { key: 'has-ai', type: 'Boolean', defaultVal: true },
  { key: 'has-email', type: 'Boolean', defaultVal: true },
  { key: 'has-sms', type: 'Boolean', defaultVal: false },
  { key: 'has-push-notifications', type: 'Boolean', defaultVal: false },
  { key: 'has-recaptcha', type: 'Boolean', defaultVal: false },
  // Subscription features
  { key: 'feature-core', type: 'Boolean', defaultVal: true },
  { key: 'feature-view-only', type: 'Boolean', defaultVal: true },
  { key: 'feature-agents', type: 'Boolean', defaultVal: true },
  { key: 'feature-basic-tools', type: 'Boolean', defaultVal: true },
  { key: 'feature-advanced-tools', type: 'Boolean', defaultVal: true },
  { key: 'feature-email-integration', type: 'Boolean', defaultVal: true },
  { key: 'feature-forecasting', type: 'Boolean', defaultVal: true },
  { key: 'feature-api-access', type: 'Boolean', defaultVal: true },
  { key: 'feature-team-collaboration', type: 'Boolean', defaultVal: true },
  { key: 'feature-whitelabel', type: 'Boolean', defaultVal: true },
  { key: 'feature-custom-training', type: 'Boolean', defaultVal: true },
  // Capabilities
  { key: 'has-advanced-analytics', type: 'Boolean', defaultVal: true },
  { key: 'has-priority-support', type: 'Boolean', defaultVal: true },
  { key: 'has-custom-branding', type: 'Boolean', defaultVal: true },
]

async function getAccessToken() {
  // Try to get token from environment
  let token = process.env.DEVCYCLE_MANAGEMENT_API_TOKEN
  
  if (token) {
    return `Bearer ${token}`
  }
  
  // Try to get token using Client ID/Secret
  const CLIENT_ID = process.env.DEVCYCLE_CLIENT_ID
  const CLIENT_SECRET = process.env.DEVCYCLE_CLIENT_SECRET
  
  if (CLIENT_ID && CLIENT_SECRET) {
    console.log('🔐 Getting Management API token using Client ID/Secret...\n')
    
    try {
      const response = await fetch('https://auth.devcycle.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          audience: 'https://api.devcycle.com/'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.access_token) {
          console.log('✅ Successfully obtained access token\n')
          return `Bearer ${data.access_token}`
        }
      }
    } catch (error) {
      console.error('❌ Failed to get token:', error.message)
    }
  }
  
  console.error('❌ No Management API token found')
  console.log('\nTo get a token, run:')
  console.log('  DEVCYCLE_CLIENT_ID=your_id DEVCYCLE_CLIENT_SECRET=your_secret node scripts/get-devcycle-management-token.mjs')
  console.log('\nThen set:')
  console.log('  export DEVCYCLE_MANAGEMENT_API_TOKEN=your_token')
  process.exit(1)
}

async function configureFeature(apiToken, featureKey, config) {
  try {
    // Get feature details
    const featureRes = await fetch(`${API_BASE}/projects/${PROJECT_ID}/features/${featureKey}`, {
      headers: { 'Authorization': apiToken }
    })
    
    if (!featureRes.ok) {
      if (featureRes.status === 404) {
        console.log(`⚠️  Feature ${featureKey} not found, skipping...`)
        return false
      }
      const errorText = await featureRes.text()
      console.error(`❌ Failed to fetch feature ${featureKey}: ${featureRes.status} ${errorText}`)
      return false
    }
    
    const feature = await featureRes.json()
    
    // Find the default variation
    const defaultVariationKey = config.type === 'Boolean' 
      ? (config.defaultVal ? 'on' : 'off')
      : 'default'
    
    const defaultVariation = feature.variations?.find(v => v.key === defaultVariationKey)
    if (!defaultVariation) {
      console.error(`❌ Could not find variation '${defaultVariationKey}' for ${featureKey}`)
      return false
    }
    
    // Update feature configurations to activate in Development
    const currentConfigs = feature.configurations || []
    const devConfig = currentConfigs.find(c => c._environment === DEVELOPMENT_ENV_ID)
    
    const newConfig = {
      status: 'active',
      targets: [{
        name: 'All Users',
        audience: {
          filters: {
            filters: [{ type: 'all' }],
            operator: 'and'
          }
        },
        distribution: [{
          percentage: 1,
          _variation: defaultVariation._id
        }]
      }]
    }
    
    // PATCH the feature with updated configurations
    const configsToUpdate = currentConfigs.map(c => {
      if (c._environment === DEVELOPMENT_ENV_ID) {
        return { ...c, ...newConfig }
      }
      return c
    })
    
    // If no dev config exists, add it
    if (!devConfig) {
      configsToUpdate.push({
        _environment: DEVELOPMENT_ENV_ID,
        ...newConfig
      })
    }
    
    const patchRes = await fetch(`${API_BASE}/projects/${PROJECT_ID}/features/${featureKey}`, {
      method: 'PATCH',
      headers: {
        'Authorization': apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        configurations: configsToUpdate
      })
    })
    
    if (!patchRes.ok) {
      const errorText = await patchRes.text()
      console.error(`❌ Failed to configure feature ${featureKey}: ${patchRes.status} ${errorText}`)
      return false
    }
    
    console.log(`✅ Configured ${featureKey}`)
    return true
  } catch (error) {
    console.error(`❌ Error configuring ${featureKey}:`, error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Configuring DevCycle feature flags...\n')
  
  const apiToken = await getAccessToken()
  
  let successCount = 0
  let failCount = 0
  
  for (const feature of features) {
    const success = await configureFeature(apiToken, feature.key, feature)
    if (success) {
      successCount++
    } else {
      failCount++
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  
  console.log(`\n✨ Configuration complete!`)
  console.log(`   ✅ Success: ${successCount}/${features.length}`)
  if (failCount > 0) {
    console.log(`   ❌ Failed: ${failCount}/${features.length}`)
  }
  console.log('\nView your features at:')
  console.log('https://app.devcycle.com/o/org_09unKjzV4W9leYeG/p/solo-success-ai/features')
}

main().catch(console.error)

