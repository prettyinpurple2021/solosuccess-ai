export const TASK_QUEUE_NAME = "subscriptions-task-queue";

// SoloSuccess AI Platform subscription tiers
export type SubscriptionTier = 'launch' | 'accelerator' | 'dominator';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'trialing';

export interface SoloSuccessCustomer {
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
  customer: SoloSuccessCustomer;
  tier: SubscriptionTier;
  billingCycle: 'monthly' | 'yearly';
  priceId: string;
  amount: number; // in cents
  isFreeTier: boolean;
}
