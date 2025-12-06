/**
 * DevCycle Management API Token Helper
 * 
 * This script gets a Management API access token using your Client ID and Secret.
 * 
 * Usage:
 *   DEVCYCLE_CLIENT_ID=your_client_id DEVCYCLE_CLIENT_SECRET=your_secret node scripts/get-devcycle-management-token.mjs
 */

const CLIENT_ID = process.env.DEVCYCLE_CLIENT_ID
const CLIENT_SECRET = process.env.DEVCYCLE_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing required environment variables')
  console.log('\nUsage:')
  console.log('  DEVCYCLE_CLIENT_ID=your_client_id DEVCYCLE_CLIENT_SECRET=your_secret node scripts/get-devcycle-management-token.mjs')
  console.log('\nOr add them to your .env.local:')
  console.log('  DEVCYCLE_CLIENT_ID=your_client_id')
  console.log('  DEVCYCLE_CLIENT_SECRET=your_secret')
  console.log('\nThen run: node scripts/get-devcycle-management-token.mjs')
  process.exit(1)
}

async function getManagementToken() {
  try {
    console.log('🔐 Requesting Management API token from DevCycle...\n')
    
    const tokenUrl = 'https://auth.devcycle.com/oauth/token'
    
    const response = await fetch(tokenUrl, {
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
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Failed to get token')
      console.error(`   Status: ${response.status} ${response.statusText}`)
      console.error(`   Error: ${errorText}`)
      console.log('\n💡 Troubleshooting:')
      console.log('   - Verify your Client ID and Secret are correct')
      console.log('   - Check that they have Management API permissions')
      console.log('   - Ensure your DevCycle account has API access enabled')
      return null
    }
    
    const data = await response.json()
    
    if (data.access_token) {
      console.log('✅ Successfully obtained Management API token!\n')
      console.log('📋 Token Information:')
      console.log(`   Token Type: ${data.token_type || 'Bearer'}`)
      console.log(`   Expires In: ${data.expires_in ? `${data.expires_in} seconds` : 'Unknown'}`)
      console.log('\n🔑 Access Token:')
      console.log(data.access_token)
      console.log('\n⚠️  IMPORTANT: Save this token securely!')
      console.log('   The token may expire, so you may need to regenerate it.')
      console.log('\n📝 To use this token:')
      console.log(`   export DEVCYCLE_MANAGEMENT_API_TOKEN="${data.access_token}"`)
      console.log('   node scripts/configure-devcycle-features.mjs')
      console.log('\nOr add it to your .env.local:')
      console.log(`   DEVCYCLE_MANAGEMENT_API_TOKEN=${data.access_token}`)
      
      return data.access_token
    } else {
      console.error('❌ No access token in response:', data)
      return null
    }
  } catch (error) {
    console.error('❌ Error getting token:', error.message)
    if (error.cause) {
      console.error('   Cause:', error.cause)
    }
    return null
  }
}

getManagementToken().then(token => {
  if (token) {
    console.log('\n✨ Token retrieval complete!')
    process.exit(0)
  } else {
    console.log('\n❌ Failed to retrieve token. Please check your credentials.')
    process.exit(1)
  }
})
