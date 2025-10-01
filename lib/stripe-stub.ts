// Stub Stripe for build-time when actual module isn't available
export default class StubStripe {
  constructor() {
    console.warn('Stripe stub is being used - actual Stripe not loaded')
  }
  
  customers = {
    create: async () => { throw new Error('Stripe not configured') },
    retrieve: async () => { throw new Error('Stripe not configured') },
  }
  
  subscriptions = {
    create: async () => { throw new Error('Stripe not configured') },
    retrieve: async () => { throw new Error('Stripe not configured') },
    update: async () => { throw new Error('Stripe not configured') },
    cancel: async () => { throw new Error('Stripe not configured') },
    list: async () => { throw new Error('Stripe not configured') },
  }
  
  checkout = {
    sessions: {
      create: async () => { throw new Error('Stripe not configured') },
    }
  }
  
  billingPortal = {
    sessions: {
      create: async () => { throw new Error('Stripe not configured') },
    }
  }
  
  webhooks = {
    constructEvent: () => { throw new Error('Stripe not configured') },
  }
}
