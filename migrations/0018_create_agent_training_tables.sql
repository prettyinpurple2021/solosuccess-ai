-- Create agent training interactions table
CREATE TABLE IF NOT EXISTS agent_training_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_message TEXT NOT NULL,
    agent_response TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    success BOOLEAN NOT NULL DEFAULT false,
    response_time INTEGER NOT NULL DEFAULT 0, -- in milliseconds
    confidence DECIMAL(3,2) NOT NULL DEFAULT 0.0, -- 0.00 to 1.00
    collaboration_requests JSONB DEFAULT '[]',
    follow_up_tasks JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agent_training_user_agent ON agent_training_interactions(user_id, agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_training_timestamp ON agent_training_interactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_agent_training_success ON agent_training_interactions(success);
CREATE INDEX IF NOT EXISTS idx_agent_training_rating ON agent_training_interactions(user_rating);
CREATE INDEX IF NOT EXISTS idx_agent_training_agent_id ON agent_training_interactions(agent_id);

-- Create fine-tuning jobs table
CREATE TABLE IF NOT EXISTS agent_fine_tuning_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'training', 'validating', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    training_data_size INTEGER NOT NULL DEFAULT 0,
    validation_data_size INTEGER NOT NULL DEFAULT 0,
    parameters JSONB NOT NULL DEFAULT '{}',
    results JSONB,
    error_message TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fine-tuning jobs
CREATE INDEX IF NOT EXISTS idx_fine_tuning_user_agent ON agent_fine_tuning_jobs(user_id, agent_id);
CREATE INDEX IF NOT EXISTS idx_fine_tuning_status ON agent_fine_tuning_jobs(status);
CREATE INDEX IF NOT EXISTS idx_fine_tuning_created_at ON agent_fine_tuning_jobs(created_at);

-- Create training datasets table
CREATE TABLE IF NOT EXISTS agent_training_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    size INTEGER NOT NULL DEFAULT 0,
    data JSONB NOT NULL DEFAULT '[]',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for training datasets
CREATE INDEX IF NOT EXISTS idx_training_datasets_user_agent ON agent_training_datasets(user_id, agent_id);
CREATE INDEX IF NOT EXISTS idx_training_datasets_created_at ON agent_training_datasets(created_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_agent_training_interactions_updated_at ON agent_training_interactions;
CREATE TRIGGER update_agent_training_interactions_updated_at
    BEFORE UPDATE ON agent_training_interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agent_fine_tuning_jobs_updated_at ON agent_fine_tuning_jobs;
CREATE TRIGGER update_agent_fine_tuning_jobs_updated_at
    BEFORE UPDATE ON agent_fine_tuning_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agent_training_datasets_updated_at ON agent_training_datasets;
CREATE TRIGGER update_agent_training_datasets_updated_at
    BEFORE UPDATE ON agent_training_datasets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE agent_training_interactions IS 'Stores all interactions between users and AI agents for training and analytics purposes';
COMMENT ON TABLE agent_fine_tuning_jobs IS 'Tracks fine-tuning jobs for customizing AI agents';
COMMENT ON TABLE agent_training_datasets IS 'Stores curated training datasets for fine-tuning';

COMMENT ON COLUMN agent_training_interactions.user_rating IS 'User rating from 1-5 stars';
COMMENT ON COLUMN agent_training_interactions.response_time IS 'Response time in milliseconds';
COMMENT ON COLUMN agent_training_interactions.confidence IS 'Agent confidence score from 0.00 to 1.00';
COMMENT ON COLUMN agent_training_interactions.collaboration_requests IS 'JSON array of collaboration requests made by the agent';
COMMENT ON COLUMN agent_training_interactions.follow_up_tasks IS 'JSON array of follow-up tasks suggested by the agent';
COMMENT ON COLUMN agent_training_interactions.metadata IS 'Additional metadata about the interaction (model, parameters, etc.)';

COMMENT ON COLUMN agent_fine_tuning_jobs.parameters IS 'JSON object containing fine-tuning parameters (model, epochs, learning rate, etc.)';
COMMENT ON COLUMN agent_fine_tuning_jobs.results IS 'JSON object containing training results and metrics';
COMMENT ON COLUMN agent_training_datasets.data IS 'JSON array of training interactions';
COMMENT ON COLUMN agent_training_datasets.metadata IS 'JSON object containing dataset metadata (quality, diversity, balance, etc.)';
