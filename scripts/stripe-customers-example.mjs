#!/usr/bin/env node

/**
 * Example script demonstrating how to use Stripe customer listing functionality
 * This script shows how to list customers using the existing Stripe configuration
 */

import { listStripeCustomers, getStripeCustomersPaginated, isStripeConfigured } from '../lib/stripe.js'

async function main() {
  console.log('🔍 Checking Stripe configuration...')
  
  if (!isStripeConfigured()) {
    console.error('❌ Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.')
    process.exit(1)
  }
  
  console.log('✅ Stripe is configured')
  
  try {
    console.log('\n📋 Listing first 10 customers...')
    const customers = await listStripeCustomers(10)
    
    if (customers.length === 0) {
      console.log('No customers found.')
      return
    }
    
    console.log(`Found ${customers.length} customers:`)
    customers.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.email || 'No email'} (ID: ${customer.id})`)
      if (customer.name) {
        console.log(`   Name: ${customer.name}`)
      }
      if (customer.created) {
        console.log(`   Created: ${new Date(customer.created * 1000).toLocaleDateString()}`)
      }
      console.log('')
    })
    
    // Example of paginated listing
    console.log('\n📄 Example of paginated listing...')
    const paginatedResult = await getStripeCustomersPaginated(5)
    console.log(`Has more customers: ${paginatedResult.hasMore}`)
    console.log(`Next starting after: ${paginatedResult.nextStartingAfter || 'None'}`)
    
  } catch (error) {
    console.error('❌ Error listing customers:', error.message)
    process.exit(1)
  }
}

// Run the script
main().catch(console.error)
