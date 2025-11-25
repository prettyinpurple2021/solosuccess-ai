// Stripe Integration Setup
import Stripe from 'stripe';

// Initialize Stripe with secret key from environment
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-11-17.clover',
});

// Price IDs for each tier (set these after creating products in Stripe dashboard)
export const PRICE_IDS = {
    starter: process.env.STRIPE_STARTER_PRICE_ID || '',
    professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
    empire: process.env.STRIPE_EMPIRE_PRICE_ID || '',
};

// Tier limits for feature gating
export const TIER_LIMITS = {
    starter: {
        businesses: 1,
        aiGenerations: 200, // per month
        competitors: 3,
        features: ['core', 'agents', 'basic_tools']
    },
    professional: {
        businesses: 3,
        aiGenerations: -1, // unlimited
        competitors: -1, // unlimited
        features: ['core', 'agents', 'basic_tools', 'advanced_tools', 'email_integration', 'forecasting']
    },
    empire: {
        businesses: -1, // unlimited
        aiGenerations: -1,
        competitors: -1,
        features: ['all', 'api_access', 'team_collaboration', 'whitelabel', 'custom_training']
    }
};

import { db } from './db';
import { subscriptions, usageTracking } from './db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Get user's subscription tier
 */
export async function getUserTier(userId: number): Promise<string> {
    try {
        const sub = await db.select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, userId))
            .limit(1);

        // If no subscription or not active, return starter (free tier)
        if (!sub.length || sub[0].status !== 'active') {
            return 'starter';
        }

        return sub[0].tier;
    } catch (error) {
        console.error('Error fetching user tier:', error);
        return 'starter'; // Fallback to free tier on error
    }
}

/**
 * Check if user can access a feature
 */
export async function canAccessFeature(userId: number, feature: string): Promise<boolean> {
    const tier = await getUserTier(userId);
    const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS];

    if (!limits) return false;

    return limits.features.includes(feature) || limits.features.includes('all');
}

/**
 * Check if user has exceeded usage limits
 */
export async function checkUsageLimit(
    userId: number,
    type: 'aiGenerations' | 'competitors' | 'businesses'
): Promise<{ allowed: boolean; limit: number; current: number }> {
    try {
        const tier = await getUserTier(userId);
        const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS];

        const limit = limits[type === 'competitors' ? 'competitors' : type === 'businesses' ? 'businesses' : 'aiGenerations'];

        // -1 means unlimited
        if (limit === -1) {
            return { allowed: true, limit: -1, current: 0 };
        }

        // Get current month in YYYY-MM format
        const month = new Date().toISOString().slice(0, 7);

        // Get or create usage tracking record
        let usage = await db.select()
            .from(usageTracking)
            .where(
                and(
                    eq(usageTracking.userId, userId),
                    eq(usageTracking.month, month)
                )
            )
            .limit(1);

        // Create record if doesn't exist
        if (!usage.length) {
            const [newUsage] = await db.insert(usageTracking)
                .values({
                    userId,
                    month,
                    aiGenerations: 0,
                    competitorsTracked: 0,
                    businessProfiles: type === 'businesses' ? 1 : 0
                })
                .returning();
            usage = [newUsage];
        }

        // Map type to database column
        const columnMap = {
            'aiGenerations': 'aiGenerations',
            'competitors': 'competitorsTracked',
            'businesses': 'businessProfiles'
        };

        const current = usage[0][columnMap[type] as keyof typeof usage[0]] as number || 0;

        return {
            allowed: current < limit,
            limit,
            current
        };
    } catch (error) {
        console.error('Error checking usage limit:', error);
        // On error, allow the action to prevent blocking users
        return { allowed: true, limit: -1, current: 0 };
    }
}

/**
 * Increment usage counter
 */
export async function incrementUsage(
    userId: number,
    type: 'aiGenerations' | 'competitors' | 'businesses'
): Promise<void> {
    try {
        const month = new Date().toISOString().slice(0, 7);

        // Get or create usage record
        let usage = await db.select()
            .from(usageTracking)
            .where(
                and(
                    eq(usageTracking.userId, userId),
                    eq(usageTracking.month, month)
                )
            )
            .limit(1);

        const columnMap = {
            'aiGenerations': 'aiGenerations',
            'competitors': 'competitorsTracked',
            'businesses': 'businessProfiles'
        };

        const column = columnMap[type];

        if (usage.length) {
            // Increment existing
            const currentValue = usage[0][column as keyof typeof usage[0]] as number || 0;
            await db.update(usageTracking)
                .set({ [column]: currentValue + 1 })
                .where(
                    and(
                        eq(usageTracking.userId, userId),
                        eq(usageTracking.month, month)
                    )
                );
        } else {
            // Create new
            await db.insert(usageTracking)
                .values({
                    userId,
                    month,
                    [column]: 1
                });
        }
    } catch (error) {
        console.error('Error incrementing usage:', error);
        // Don't throw - usage tracking shouldn't block operations
    }
}
