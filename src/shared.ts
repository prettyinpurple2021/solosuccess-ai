export const TASK_QUEUE_NAME = "subscriptions-task-queue";

// SoloBoss AI Platform subscription tiers
export type SubscriptionTier = 'launch' | 'accelerator' | 'dominator';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'trialing';

export interface SoloBossCustomer {
  id: string;
  email: string;
  fullName: string;
  username?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionWorkflowData {
  customer: SoloBossCustomer;
  tier: SubscriptionTier;
  billingCycle: 'monthly' | 'yearly';
  priceId: string;
  amount: number; // in cents
  isFreeTier: boolean;
}
