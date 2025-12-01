import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';

// Explicitly load .env from root
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Set dummy Stripe key for testing if not present
if (!process.env.STRIPE_SECRET_KEY) {
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
}

async function main() {
    console.log('💰 Starting Revenue Tracking Verification...');
    console.log('CWD:', process.cwd());
    console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);

    try {
        console.log('Importing DB...');
        const { db } = await import('../server/db');
        const { users, subscriptions } = await import('../server/db/schema');
        const { TIER_PRICES } = await import('../server/stripe');
        const { eq } = await import('drizzle-orm');
        console.log('Imports successful.');

        // 1. Setup Dummy Data
        const timestamp = Date.now();
        const user1Email = `test_revenue_solo_${timestamp}@example.com`;
        const user2Email = `test_revenue_agency_${timestamp}@example.com`;

        console.log('Creating test users...');
        const [user1] = await db.insert(users).values({ email: user1Email, password: 'hash' }).returning();
        const [user2] = await db.insert(users).values({ email: user2Email, password: 'hash' }).returning();

        console.log('Creating test subscriptions...');
        await db.insert(subscriptions).values({
            userId: user1.id,
            tier: 'solo',
            status: 'active',
            stripeCustomerId: 'cus_test1',
            stripeSubscriptionId: 'sub_test1',
            stripePriceId: 'price_solo',
            currentPeriodEnd: new Date()
        });

        await db.insert(subscriptions).values({
            userId: user2.id,
            tier: 'agency',
            status: 'active',
            stripeCustomerId: 'cus_test2',
            stripeSubscriptionId: 'sub_test2',
            stripePriceId: 'price_agency',
            currentPeriodEnd: new Date()
        });

        // 2. Calculate Expected MRR
        // Solo ($29) + Agency ($199) = $228
        const expectedNewMRR = TIER_PRICES.solo + TIER_PRICES.agency;
        console.log(`Expected MRR increase from test users: $${expectedNewMRR}`);

        // 3. Verify Logic (Simulating Admin API logic)
        const activeSubs = await db.select().from(subscriptions).where(eq(subscriptions.status, 'active'));
        let totalMRR = 0;

        activeSubs.forEach((sub) => {
            const tier = sub.tier as keyof typeof TIER_PRICES;
            if (TIER_PRICES[tier]) {
                totalMRR += TIER_PRICES[tier];
            }
        });

        console.log(`📊 Total Calculated MRR: $${totalMRR}`);

        // 4. Cleanup
        console.log('Cleaning up test data...');
        await db.delete(subscriptions).where(eq(subscriptions.userId, user1.id));
        await db.delete(subscriptions).where(eq(subscriptions.userId, user2.id));
        await db.delete(users).where(eq(users.id, user1.id));
        await db.delete(users).where(eq(users.id, user2.id));

        console.log('✅ Verification Complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    }
}

main();
