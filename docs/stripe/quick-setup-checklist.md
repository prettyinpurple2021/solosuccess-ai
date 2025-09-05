# ✅ Stripe Setup Checklist

**Status:** Ready to Start  
**Platform:** SoloBoss AI Platform

---

## 🚀 **Quick Setup Checklist**

### **Phase 1: Account & Keys (5 minutes)**
- [ ] Create Stripe account at [stripe.com](https://stripe.com)
- [ ] Complete account verification
- [ ] Get API keys from Dashboard → Developers → API keys
- [ ] Update `.env.local` with your actual keys:
  - `STRIPE_SECRET_KEY=sk_test_your_actual_key`
  - `STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key`

### **Phase 2: Products & Prices (10 minutes)**
- [ ] Create **Launch Plan** product (Free)
- [ ] Create **Accelerator Plan** product ($19/month, $190/year)
- [ ] Create **Dominator Plan** product ($29/month, $290/year)
- [ ] Create prices for each product
- [ ] Copy Price IDs from Stripe Dashboard

### **Phase 3: Update Code (5 minutes)**
- [ ] Update `lib/stripe.ts` with your actual Price IDs
- [ ] Replace placeholder values with real Stripe Price IDs

### **Phase 4: Webhooks (10 minutes)**
- [ ] Create webhook endpoint in Stripe Dashboard
- [ ] Set endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
- [ ] Select required events (see list below)
- [ ] Copy webhook signing secret
- [ ] Add `STRIPE_WEBHOOK_SECRET` to `.env.local`

### **Phase 5: Testing (5 minutes)**
- [ ] Test with Stripe test card: `4242 4242 4242 4242`
- [ ] Verify subscription creation works
- [ ] Check webhook events are received

---

## 📋 **Required Webhook Events**

Select these events in your Stripe webhook:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.created`
- `customer.updated`

---

## 🧪 **Test Cards**

Use these Stripe test cards for testing:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires 3D Secure:** `4000 0025 0000 3155`

---

## 🎯 **Next Steps After Setup**

1. **Test the integration** with test cards
2. **Verify webhook events** are processed correctly
3. **Test subscription upgrades/downgrades**
4. **Test payment failures** and retry logic
5. **Go live** with production keys when ready

---

**Total Setup Time: ~30 minutes** ⏱️

*Ready to start processing payments!* 🚀💜
