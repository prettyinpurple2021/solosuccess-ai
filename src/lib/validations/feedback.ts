import { z } from 'zod';

export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature_request', 'comment', 'error', 'other']),
  title: z.string().optional().nullable(),
  message: z.string().min(1, 'Message is required'),
  browserInfo: z.record(z.any()).optional().nullable(),
  screenshotUrl: z.string().url().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
