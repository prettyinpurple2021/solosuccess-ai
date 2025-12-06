# DevCycle Management API Token Setup

## Issue
Your Client ID and Secret are for SDK authentication, not Management API access. You need to create a separate Management API token.

## Solution: Create Management API Token in Dashboard

### Step 1: Navigate to API Settings
1. Go to: https://app.devcycle.com/o/org_09unKjzV4W9leYeG/settings/api
2. Or navigate: Dashboard → Settings → API

### Step 2: Create Management API Token
1. Look for "Management API" or "API Tokens" section
2. Click "Create Token" or "Generate Token"
3. Give it a name (e.g., "Feature Setup Script")
4. Select appropriate permissions (read/write for features)
5. Copy the token immediately (it only shows once!)

### Step 3: Use the Token
Once you have the token, run:

```powershell
$env:DEVCYCLE_MANAGEMENT_API_TOKEN="your_token_here"
node scripts/configure-devcycle-features.mjs
```

Or add it to `.env.local`:
```
DEVCYCLE_MANAGEMENT_API_TOKEN=your_token_here
```

Then run:
```bash
node scripts/configure-devcycle-features.mjs
```

## Alternative: Manual Dashboard Setup

If you can't get a Management API token, you can set up features manually:

1. Go to: https://app.devcycle.com/o/org_09unKjzV4W9leYeG/p/solo-success-ai/features
2. For each feature, follow the guide in `docs/devcycle-feature-setup.md`

## Need Help?

If you can't find the Management API token option, it might be:
- A paid feature (check your DevCycle plan)
- Requires account admin permissions
- Located under a different section (check "Integrations" or "Developer Tools")

