# 💳 Stripe Integration Setup Guide

**Generated:** January 2025  
**Status:** Ready for Implementation  
**Platform:** SoloBoss AI Platform

---

## 🎯 **Overview**

This guide will help you set up Stripe integration for your SoloBoss AI Platform pricing tiers. Stripe will handle all payment processing, subscription management, and billing for your users.

---

## 🚀 **Step 1: Create Stripe Account**

### **1.1 Sign Up for Stripe**
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" and create your account
3. Complete the account verification process
4. Add your business information and bank details

### **1.2 Get Your API Keys**
1. Go to your Stripe Dashboard
2. Navigate to "Developers" → "API keys"
3. Copy your **Publishable key** and **Secret key**
4. Keep these secure - never commit them to version control

---

## 🔧 **Step 2: Environment Variables**

Add these environment variables to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook endpoint secret (created in step 4)

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000 # Your app URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Same as above, for client-side
```

---

## 📦 **Step 3: Create Stripe Products & Prices**

### **3.1 Create Products in Stripe Dashboard**

1. Go to "Products" in your Stripe Dashboard
2. Create the following products:

#### **Launch Plan (Free)**
- **Name:** SoloBoss AI - Launch Plan
- **Description:** Perfect for ambitious beginners ready to start their empire
- **Type:** Service

#### **Accelerator Plan**
- **Name:** SoloBoss AI - Accelerator Plan
- **Description:** For solo founders ready to scale their empire
- **Type:** Service

#### **Dominator Plan**
- **Name:** SoloBoss AI - Dominator Plan
- **Description:** For empire builders who demand the best
- **Type:** Service

### **3.2 Create Prices for Each Product**

#### **Launch Plan**
- **Price:** $0.00
- **Billing:** One-time
- **Price ID:** `price_launch_free`

#### **Accelerator Plan**
- **Monthly Price:** $19.00/month
- **Price ID:** `price_accelerator_monthly`
- **Yearly Price:** $190.00/year
- **Price ID:** `price_accelerator_yearly`

#### **Dominator Plan**
- **Monthly Price:** $29.00/month
- **Price ID:** `price_dominator_monthly`
- **Yearly Price:** $290.00/year
- **Price ID:** `price_dominator_yearly`

### **3.3 Update Price IDs in Code**

Update the price IDs in `lib/stripe.ts`:

```typescript
export const STRIPE_PRICES = {
  LAUNCH: 'price_launch_free', // Replace with your actual price ID
  ACCELERATOR_MONTHLY: 'price_accelerator_monthly', // Replace with your actual price ID
  ACCELERATOR_YEARLY: 'price_accelerator_yearly', // Replace with your actual price ID
  DOMINATOR_MONTHLY: 'price_dominator_monthly', // Replace with your actual price ID
  DOMINATOR_YEARLY: 'price_dominator_yearly', // Replace with your actual price ID
} as const
```

---

## 🔗 **Step 4: Set Up Webhooks**

### **4.1 Create Webhook Endpoint**

1. Go to "Developers" → "Webhooks" in your Stripe Dashboard
2. Click "Add endpoint"
3. **Endpoint URL:** `https://yourdomain.com/api/stripe/webhook`
4. **Events to send:**
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.created`
   - `customer.updated`

### **4.2 Get Webhook Secret**

1. After creating the webhook, click on it
2. Copy the "Signing secret" (starts with `whsec_`)
3. Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

---

## 🗄️ **Step 5: Database Schema Updates**

### **5.1 Add Stripe Fields to Users Table**

Add these columns to your users table:

```sql
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(50) DEFAULT 'launch';
ALTER TABLE users ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'active';
ALTER TABLE users ADD COLUMN stripe_subscription_id VARCHAR(255);
ALTER TABLE users ADD COLUMN current_period_start TIMESTAMP;
ALTER TABLE users ADD COLUMN current_period_end TIMESTAMP;
ALTER TABLE users ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT FALSE;
```

### **5.2 Create Subscription History Table**

```sql
CREATE TABLE subscription_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255),
  subscription_tier VARCHAR(50),
  subscription_status VARCHAR(50),
  price_id VARCHAR(255),
  amount INTEGER, -- Amount in cents
  currency VARCHAR(3) DEFAULT 'usd',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 **Step 6: Update User Authentication**

### **6.1 Update User Type**

Add Stripe fields to your user type:

```typescript
interface User {
  id: string
  email: string
  full_name: string
  // ... existing fields
  stripe_customer_id?: string
  subscription_tier: string
  subscription_status: string
  stripe_subscription_id?: string
  current_period_start?: Date
  current_period_end?: Date
  cancel_at_period_end: boolean
}
```

### **6.2 Update Authentication Functions**

Update your authentication functions to include Stripe data:

```typescript
// In your auth functions, include Stripe fields
const user = {
  id: userData.id,
  email: userData.email,
  full_name: userData.full_name,
  stripe_customer_id: userData.stripe_customer_id,
  subscription_tier: userData.subscription_tier || 'launch',
  subscription_status: userData.subscription_status || 'active',
  // ... other fields
}
```

---

## 🧪 **Step 7: Testing**

### **7.1 Test Mode**

1. Make sure you're using test API keys (start with `sk_test_` and `pk_test_`)
2. Use Stripe's test card numbers:
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - **Requires 3D Secure:** `4000 0025 0000 3155`

### **7.2 Test Scenarios**

1. **Create Subscription:** Test upgrading from free to paid
2. **Update Subscription:** Test changing between tiers
3. **Cancel Subscription:** Test cancellation flow
4. **Payment Failure:** Test failed payment handling
5. **Webhook Events:** Verify webhook processing

---

## 🚀 **Step 8: Production Setup**

### **8.1 Switch to Live Mode**

1. Get your live API keys from Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook endpoint URL to production domain
4. Test with real (small) transactions

### **8.2 Security Checklist**

- [ ] Use HTTPS for all webhook endpoints
- [ ] Verify webhook signatures
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting
- [ ] Add proper error handling
- [ ] Log all payment events
- [ ] Set up monitoring and alerts

---

## 📊 **Step 9: Monitoring & Analytics**

### **9.1 Stripe Dashboard**

Monitor these metrics in your Stripe Dashboard:
- Monthly Recurring Revenue (MRR)
- Customer churn rate
- Payment success rate
- Failed payment reasons
- Subscription growth

### **9.2 Custom Analytics**

Track these metrics in your app:
- Conversion rate from free to paid
- Most popular subscription tier
- Average revenue per user (ARPU)
- Customer lifetime value (CLV)
- Feature usage by tier

---

## 🔧 **Step 10: Advanced Features**

### **10.1 Usage-Based Billing**

For features like AI conversations, you can implement usage-based billing:

```typescript
// Track usage and create usage records
await createStripeUsageRecord(
  subscriptionItemId,
  conversationCount,
  new Date()
)
```

### **10.2 Proration**

Stripe automatically handles proration when users upgrade/downgrade:

```typescript
// Update subscription with proration
await updateStripeSubscription(subscriptionId, newPriceId)
```

### **10.3 Dunning Management**

Set up automatic retry logic for failed payments:

```typescript
// In webhook handler
if (event.type === 'invoice.payment_failed') {
  // Send email notification
  // Update user status
  // Schedule retry
}
```

---

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Webhook Not Receiving Events**
   - Check endpoint URL is correct
   - Verify webhook secret
   - Check server logs for errors

2. **Payment Failures**
   - Verify card details
   - Check Stripe Dashboard for error codes
   - Implement proper error handling

3. **Subscription Not Updating**
   - Check webhook event processing
   - Verify database updates
   - Check user authentication

### **Debug Tools**

- **Stripe CLI:** Test webhooks locally
- **Stripe Dashboard:** Monitor events and payments
- **Server Logs:** Check for errors and warnings

---

## 📚 **Resources**

### **Documentation**
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)

### **Tools**
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

---

**Ready to start processing payments and scaling your empire!** 🚀💜

*Last Updated: January 2025*  
*Status: Ready for Implementation*
