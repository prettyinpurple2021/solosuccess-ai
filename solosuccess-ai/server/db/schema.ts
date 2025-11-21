import { pgTable, serial, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').unique(), // Optional for now, single user mode
    xp: integer('xp').default(0),
    level: integer('level').default(1),
    totalActions: integer('total_actions').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
    id: text('id').primaryKey(), // Using string IDs from frontend for now
    title: text('title').notNull(),
    description: text('description'),
    assignee: text('assignee').notNull(), // AgentId
    priority: text('priority').notNull(), // 'low' | 'medium' | 'high'
    status: text('status').default('todo'), // 'todo' | 'in_progress' | 'done'
    estimatedTime: text('estimated_time'),
    createdAt: timestamp('created_at').defaultNow(),
    completedAt: timestamp('completed_at'),
});

export const chatHistory = pgTable('chat_history', {
    id: serial('id').primaryKey(),
    agentId: text('agent_id').notNull(),
    role: text('role').notNull(), // 'user' | 'model'
    text: text('text').notNull(),
    timestamp: text('timestamp').notNull(), // Storing as string to match frontend types easily, or bigint
    createdAt: timestamp('created_at').defaultNow(),
});

export const competitorReports = pgTable('competitor_reports', {
    id: serial('id').primaryKey(),
    competitorName: text('competitor_name').notNull(),
    threatLevel: text('threat_level'),
    data: jsonb('data'), // Stores the full report object
    generatedAt: timestamp('generated_at').defaultNow(),
});

export const businessContext = pgTable('business_context', {
    id: serial('id').primaryKey(),
    companyName: text('company_name'),
    founderName: text('founder_name'),
    industry: text('industry'),
    description: text('description'),
    brandDna: jsonb('brand_dna'), // Stores the BrandDNA object
    updatedAt: timestamp('updated_at').defaultNow(),
});
