import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from './auth';

/**
 * Middleware to check if user account is suspended
 * Should be applied after authMiddleware
 */
export const checkSuspended = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ((req as unknown) as AuthRequest).userId;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const user = await db.select({
            suspended: users.suspended,
            suspendedReason: users.suspendedReason
        })
            .from(users)
            .where(eq(users.id, Number(userId)))
            .limit(1);

        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user[0].suspended) {
            return res.status(403).json({
                error: 'Account suspended',
                reason: user[0].suspendedReason || 'Your account has been suspended. Please contact support.'
            });
        }

        next();
    } catch (error) {
        console.error('Error checking suspension status:', error);
        res.status(500).json({ error: 'Failed to verify account status' });
    }
};
