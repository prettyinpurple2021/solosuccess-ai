-- Add workflow and achievement tables
-- Migration: 0021_add_workflow_achievement_tables.sql

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) DEFAULT '1.0.0',
    status VARCHAR(50) DEFAULT 'draft',
    trigger_type VARCHAR(100) NOT NULL,
    trigger_config JSONB DEFAULT '{}',
    nodes JSONB DEFAULT '[]',
    edges JSONB DEFAULT '[]',
    variables JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    category VARCHAR(100) DEFAULT 'general',
    tags JSONB DEFAULT '[]',
    template_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Workflow executions table
CREATE TABLE IF NOT EXISTS workflow_executions (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'running',
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    duration INTEGER, -- in milliseconds
    input JSONB DEFAULT '{}',
    output JSONB DEFAULT '{}',
    variables JSONB DEFAULT '{}',
    options JSONB DEFAULT '{}',
    error JSONB,
    logs JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workflow templates table
CREATE TABLE IF NOT EXISTS workflow_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    tags JSONB DEFAULT '[]',
    workflow_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(255) REFERENCES users(id),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Template downloads table
CREATE TABLE IF NOT EXISTS template_downloads (
    id SERIAL PRIMARY KEY,
    template_id INTEGER NOT NULL REFERENCES workflow_templates(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMP DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    points INTEGER DEFAULT 0,
    category VARCHAR(100),
    requirements JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Focus sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    duration_minutes INTEGER,
    task_id INTEGER REFERENCES tasks(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notification jobs table
CREATE TABLE IF NOT EXISTS notification_jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    icon VARCHAR(500),
    badge VARCHAR(500),
    image VARCHAR(500),
    tag VARCHAR(100),
    require_interaction BOOLEAN DEFAULT FALSE,
    silent BOOLEAN DEFAULT FALSE,
    vibrate JSONB,
    user_ids JSONB DEFAULT '[]',
    all_users BOOLEAN DEFAULT FALSE,
    scheduled_time TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(255),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    status VARCHAR(50) DEFAULT 'pending',
    error TEXT,
    processed_at TIMESTAMP
);

-- Add foreign key for workflow template_id
ALTER TABLE workflows ADD CONSTRAINT fk_workflows_template_id FOREIGN KEY (template_id) REFERENCES workflow_templates(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_category ON workflows(category);
CREATE INDEX IF NOT EXISTS idx_workflows_created_at ON workflows(created_at);

CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_user_id ON workflow_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started_at ON workflow_executions(started_at);

CREATE INDEX IF NOT EXISTS idx_workflow_templates_category ON workflow_templates(category);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_featured ON workflow_templates(featured);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_is_public ON workflow_templates(is_public);

CREATE INDEX IF NOT EXISTS idx_template_downloads_template_id ON template_downloads(template_id);
CREATE INDEX IF NOT EXISTS idx_template_downloads_user_id ON template_downloads(user_id);

CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_is_active ON achievements(is_active);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_earned_at ON user_achievements(earned_at);

CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_task_id ON focus_sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_started_at ON focus_sessions(started_at);

CREATE INDEX IF NOT EXISTS idx_notification_jobs_status ON notification_jobs(status);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_scheduled_time ON notification_jobs(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_created_by ON notification_jobs(created_by);

-- Insert default achievements
INSERT INTO achievements (name, title, description, icon, points, category, requirements) VALUES
('first_task', 'First Steps', 'Complete your first task', 'check-circle', 10, 'productivity', '{"tasks_completed": 1}'),
('task_master', 'Task Master', 'Complete 10 tasks', 'award', 50, 'productivity', '{"tasks_completed": 10}'),
('goal_crusher', 'Goal Crusher', 'Complete your first goal', 'target', 100, 'goals', '{"goals_completed": 1}'),
('streak_starter', 'Streak Starter', 'Complete tasks for 3 consecutive days', 'flame', 75, 'consistency', '{"daily_streak": 3}'),
('focus_champion', 'Focus Champion', 'Complete a 25-minute focus session', 'zap', 25, 'focus', '{"focus_minutes": 25}'),
('early_bird', 'Early Bird', 'Complete a task before 8 AM', 'sunrise', 15, 'timing', '{"early_completion": true}'),
('night_owl', 'Night Owl', 'Complete a task after 10 PM', 'moon', 15, 'timing', '{"late_completion": true}'),
('team_player', 'Team Player', 'Collaborate with AI agents', 'users', 30, 'collaboration', '{"ai_collaborations": 1}'),
('workflow_wizard', 'Workflow Wizard', 'Create your first workflow', 'workflow', 100, 'automation', '{"workflows_created": 1}'),
('achievement_hunter', 'Achievement Hunter', 'Earn 5 achievements', 'trophy', 200, 'meta', '{"achievements_earned": 5}')
ON CONFLICT (name) DO NOTHING;

-- Insert default workflow templates
INSERT INTO workflow_templates (name, description, category, tags, workflow_data, is_public, featured) VALUES
('Daily Planning', 'Automated daily planning workflow that helps you organize your tasks and priorities', 'productivity', '["planning", "daily", "automation"]', '{"triggerType": "schedule", "triggerConfig": {"schedule": "0 8 * * *"}, "nodes": [{"id": "1", "type": "task", "data": {"action": "review_yesterday"}}, {"id": "2", "type": "task", "data": {"action": "plan_today"}}, {"id": "3", "type": "notification", "data": {"message": "Daily planning complete"}}], "edges": [{"source": "1", "target": "2"}, {"source": "2", "target": "3"}]}', true, true),
('Goal Review', 'Weekly goal review and progress tracking workflow', 'goals', '["goals", "review", "weekly"]', '{"triggerType": "schedule", "triggerConfig": {"schedule": "0 9 * * 1"}, "nodes": [{"id": "1", "type": "data", "data": {"action": "fetch_goals"}}, {"id": "2", "type": "analysis", "data": {"action": "analyze_progress"}}, {"id": "3", "type": "report", "data": {"action": "generate_report"}}], "edges": [{"source": "1", "target": "2"}, {"source": "2", "target": "3"}]}', true, true),
('Competitor Monitoring', 'Automated competitor monitoring and alert system', 'competitive', '["competitors", "monitoring", "alerts"]', '{"triggerType": "schedule", "triggerConfig": {"schedule": "0 */6 * * *"}, "nodes": [{"id": "1", "type": "scrape", "data": {"target": "competitor_websites"}}, {"id": "2", "type": "analyze", "data": {"action": "detect_changes"}}, {"id": "3", "type": "alert", "data": {"condition": "significant_changes"}}], "edges": [{"source": "1", "target": "2"}, {"source": "2", "target": "3"}]}', true, false),
('Task Automation', 'Automated task creation and assignment based on goals', 'automation', '["tasks", "automation", "goals"]', '{"triggerType": "event", "triggerConfig": {"event": "goal_created"}, "nodes": [{"id": "1", "type": "analyze", "data": {"action": "break_down_goal"}}, {"id": "2", "type": "create", "data": {"action": "create_subtasks"}}, {"id": "3", "type": "schedule", "data": {"action": "assign_deadlines"}}], "edges": [{"source": "1", "target": "2"}, {"source": "2", "target": "3"}]}', true, false),
('Weekly Report', 'Generate comprehensive weekly productivity report', 'reporting', '["report", "weekly", "productivity"]', '{"triggerType": "schedule", "triggerConfig": {"schedule": "0 18 * * 5"}, "nodes": [{"id": "1", "type": "collect", "data": {"action": "gather_metrics"}}, {"id": "2", "type": "analyze", "data": {"action": "analyze_trends"}}, {"id": "3", "type": "generate", "data": {"action": "create_report"}}, {"id": "4", "type": "deliver", "data": {"action": "send_report"}}], "edges": [{"source": "1", "target": "2"}, {"source": "2", "target": "3"}, {"source": "3", "target": "4"}]}', true, false)
ON CONFLICT (name) DO NOTHING;
