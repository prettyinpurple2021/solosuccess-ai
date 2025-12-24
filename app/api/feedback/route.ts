import { NextResponse } from 'next/server';
import { db } from '@/db';
import { feedback } from '@/db/schema';
import { auth } from '@/auth';
import { feedbackSchema } from '@/lib/validations/feedback';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    
    // Validate request body
    const result = feedbackSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }

    const { type, title, message, browserInfo, screenshotUrl, priority } = result.data;

    // Save feedback to database
    const [newFeedback] = await db.insert(feedback).values({
      userId: session?.user?.id,
      type,
      title,
      message,
      browserInfo,
      screenshotUrl,
      priority,
      status: 'pending',
    }).returning();

    logger.info('Feedback submitted', {
      id: newFeedback.id,
      userId: session?.user?.id,
      type,
    });

    return NextResponse.json({
      message: 'Feedback received with thanks.',
      id: newFeedback.id,
    }, { status: 201 });

  } catch (error) {
    logger.error('Failed to submit feedback', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
