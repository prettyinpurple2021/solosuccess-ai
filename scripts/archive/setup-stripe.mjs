#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

console.log('🚀 SoloSuccess AI Platform - Stripe Setup Helper\n')

console.log('📋 Step-by-Step Stripe Setup Guide:')
console.log('=====================================\n')

console.log('1️⃣  CREATE STRIPE ACCOUNT')
console.log('   • Go to https://stripe.com')
console.log('   • Click "Start now" and create your account')
console.log('   • Complete account verification\n')

console.log('2️⃣  GET YOUR API KEYS')
console.log('   • Go to Stripe Dashboard → Developers → API keys')
console.log('   • Copy your Publishable key (pk_test_...)')
console.log('   • Copy your Secret key (sk_test_...)\n')

console.log('3️⃣  UPDATE ENVIRONMENT VARIABLES')
console.log('   • Replace the placeholder values in .env.local:')
console.log('   • STRIPE_SECRET_KEY=sk_test_your_actual_secret_key')
console.log('   • STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key')
console.log('   • NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key\n')

console.log('4️⃣  CREATE PRODUCTS IN STRIPE DASHBOARD')
console.log('   • Go to Products → Add product')
console.log('   • Create these 3 products:\n')

const products = [
  {
    name: 'SoloSuccess AI - Launch Plan',
    description: 'Perfect for ambitious beginners ready to start their empire',
    price: '$0.00 (Free)'
  },
  {
    name: 'SoloSuccess AI - Accelerator Plan', 
    description: 'For solo founders ready to scale their empire',
    price: '$19.00/month or $190.00/year'
  },
  {
    name: 'SoloSuccess AI - Dominator Plan',
    description: 'For empire builders who demand the best', 
    price: '$29.00/month or $290.00/year'
  }
]

products.forEach((product, index) => {
  console.log(`   ${index + 1}. ${product.name}`)
  console.log(`      Description: ${product.description}`)
  console.log(`      Price: ${product.price}\n`)
})

console.log('5️⃣  CREATE PRICES FOR EACH PRODUCT')
console.log('   • For each product, create these prices:\n')

const prices = [
  { product: 'Launch Plan', prices: ['$0.00 (One-time)'] },
  { 
    product: 'Accelerator Plan', 
    prices: ['$19.00/month (Recurring)', '$190.00/year (Recurring)'] 
  },
  { 
    product: 'Dominator Plan', 
    prices: ['$29.00/month (Recurring)', '$290.00/year (Recurring)'] 
  }
]

prices.forEach((item, index) => {
  console.log(`   ${index + 1}. ${item.product}:`)
  item.prices.forEach(price => {
    console.log(`      • ${price}`)
  })
  console.log('')
})

console.log('6️⃣  UPDATE PRICE IDs IN CODE')
console.log('   • After creating prices, copy the Price IDs from Stripe')
console.log('   • Update lib/stripe.ts with your actual Price IDs\n')

console.log('7️⃣  SET UP WEBHOOKS')
console.log('   • Go to Developers → Webhooks → Add endpoint')
console.log('   • Endpoint URL: https://yourdomain.com/api/stripe/webhook')
console.log('   • Select these events:')
console.log('     - customer.subscription.created')
console.log('     - customer.subscription.updated') 
console.log('     - customer.subscription.deleted')
console.log('     - invoice.payment_succeeded')
console.log('     - invoice.payment_failed')
console.log('     - customer.created')
console.log('     - customer.updated')
console.log('   • Copy the webhook signing secret (whsec_...)')
console.log('   • Add it to .env.local as STRIPE_WEBHOOK_SECRET\n')

console.log('8️⃣  TEST THE INTEGRATION')
console.log('   • Use Stripe test card: 4242 4242 4242 4242')
console.log('   • Test subscription creation and webhook events\n')

console.log('9️⃣  GO LIVE')
console.log('   • Switch to live API keys when ready for production')
console.log('   • Update webhook URL to production domain\n')

console.log('📚  RESOURCES:')
console.log('   • Stripe Dashboard: https://dashboard.stripe.com')
console.log('   • Stripe Documentation: https://stripe.com/docs')
console.log('   • Test Cards: https://stripe.com/docs/testing\n')

console.log('✅  Once you complete these steps, your Stripe integration will be ready!')
console.log('🚀  Your SoloSuccess AI Platform will be able to process payments and manage subscriptions!')
