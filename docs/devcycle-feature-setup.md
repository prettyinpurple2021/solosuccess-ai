# DevCycle Feature Flags Setup Guide

This document contains the complete configuration for all 29 feature flags created in your DevCycle project.

## Quick Setup via Dashboard

1. Go to [DevCycle Dashboard](https://app.devcycle.com/o/org_09unKjzV4W9leYeG/p/solo-success-ai/features)
2. For each feature, click on it and:
   - Add variations (see configurations below)
   - Set up targeting rules for Development environment
   - Activate the feature in Development environment

## Feature Configurations

### Core Feature Flags

#### 1. enable-notifications (Boolean)
- **Variations:**
  - `on`: `true`
  - `off`: `false`
- **Default for Development:** `on` (100% of users)

#### 2. enable-scraping (Boolean)
- **Variations:**
  - `on`: `true`
  - `off`: `false`
- **Default for Development:** `on` (100% of users)

#### 3. notif-daily-cap (Number)
- **Variations:**
  - `default`: `500`
  - `low`: `100`
  - `high`: `1000`
- **Default for Development:** `default` (100% of users)

#### 4. scraping-user-hourly-cap (Number)
- **Variations:**
  - `default`: `20`
  - `low`: `10`
  - `high`: `50`
- **Default for Development:** `default` (100% of users)

### Worker Configuration Flags

#### 5. enable-agent-message-pump (Boolean)
- **Variations:**
  - `on`: `true`
  - `off`: `false`
- **Default for Development:** `on` (100% of users)

#### 6. enable-session-cleanup (Boolean)
- **Variations:**
  - `on`: `true`
  - `off`: `false`
- **Default for Development:** `on` (100% of users)

#### 7. enable-notification-processor (Boolean)
- **Variations:**
  - `on`: `true`
  - `off`: `false`
- **Default for Development:** `on` (100% of users)

### Environment-Based Features

#### 8-15. Has [Service] Features (All Boolean)
These should be set based on your actual environment configuration:

- `has-database`: Set to `true` if DATABASE_URL is configured
- `has-auth`: Set to `true` if JWT_SECRET or Stack Auth is configured
- `has-billing`: Set to `true` if STRIPE_SECRET_KEY is configured
- `has-ai`: Set to `true` if any AI API key is configured
- `has-email`: Set to `true` if RESEND_API_KEY is configured
- `has-sms`: Set to `true` if Twilio is configured
- `has-push-notifications`: Set to `true` if VAPID keys are configured
- `has-recaptcha`: Set to `true` if reCAPTCHA keys are configured

**Variations for all:**
- `on`: `true`
- `off`: `false`

**Default for Development:** Check your `.env.local` and set accordingly

### Subscription Tier Features

#### 16-26. Feature: [Name] (All Boolean)
These control access to subscription-based features:

- `feature-core`: Core platform features (all tiers)
- `feature-view-only`: View-only access (free tier)
- `feature-agents`: AI agents access (solo+ tiers)
- `feature-basic-tools`: Basic automation tools (solo+ tiers)
- `feature-advanced-tools`: Advanced automation tools (solo+ tiers)
- `feature-email-integration`: Email integration (pro+ tiers)
- `feature-forecasting`: Forecasting features (pro+ tiers)
- `feature-api-access`: API access (agency tier)
- `feature-team-collaboration`: Team features (agency tier)
- `feature-whitelabel`: Whitelabel options (agency tier)
- `feature-custom-training`: Custom training (agency tier)

**Variations for all:**
- `on`: `true`
- `off`: `false`

**Default for Development:** `on` for core features, configure based on tier testing needs

### Subscription Capabilities

#### 27-29. Has [Capability] (All Boolean)
- `has-advanced-analytics`: Advanced analytics (accelerator+ tiers)
- `has-priority-support`: Priority support (accelerator+ tiers)
- `has-custom-branding`: Custom branding (accelerator+ tiers)

**Variations for all:**
- `on`: `true`
- `off`: `false`

**Default for Development:** `on` for testing, configure based on tier

## Automated Setup Script

You can use the DevCycle REST API or SDK to programmatically set these up. Here's a TypeScript example:

```typescript
// This would need to be run with proper DevCycle API credentials
// See DevCycle API documentation for authentication
```

## Next Steps

1. **Set up variations** for each feature in the dashboard
2. **Configure targeting** for Development environment (start with "All Users" getting default values)
3. **Activate features** in Development environment
4. **Test** using the DevCycle SDK in your app
5. **Configure** Staging and Production environments as needed

## Using Features in Your Code

Once configured, use them in your Next.js app:

```typescript
// Client component
import { useVariableValue } from '@devcycle/nextjs-sdk'

export function MyComponent() {
  const enableNotifications = useVariableValue('enable-notifications', false)
  const notifCap = useVariableValue('notif-daily-cap', 500)
  
  if (enableNotifications) {
    // Show notifications
  }
}

// Server component
import { getVariableValue } from '@/app/devcycle'

export async function ServerComponent() {
  const enableNotifications = await getVariableValue('enable-notifications', false)
  // Use the value
}
```

