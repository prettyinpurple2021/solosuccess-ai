-- Create agent security tables
-- This migration creates tables for managing agent security, permissions, and audit logging

-- Agent permissions table
CREATE TABLE IF NOT EXISTS agent_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    agent_id VARCHAR(255) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]',
    restrictions JSONB NOT NULL DEFAULT '[]',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique user-agent combinations
    UNIQUE(user_id, agent_id)
);

-- Security audit logs table
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    agent_id VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    success BOOLEAN NOT NULL DEFAULT false,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent security configurations table
CREATE TABLE IF NOT EXISTS agent_security_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(255) NOT NULL UNIQUE,
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    agent_id VARCHAR(255) NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 0,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique user-agent-window combinations
    UNIQUE(user_id, agent_id, window_start)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agent_permissions_user_id ON agent_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_permissions_agent_id ON agent_permissions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_permissions_expires_at ON agent_permissions(expires_at);

CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_agent_id ON security_audit_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_timestamp ON security_audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_action ON security_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_success ON security_audit_logs(success);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_agent ON rate_limits(user_id, agent_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_end ON rate_limits(window_end);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agent_permissions_updated_at 
    BEFORE UPDATE ON agent_permissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_security_configs_updated_at 
    BEFORE UPDATE ON agent_security_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default security configurations for each agent
INSERT INTO agent_security_configs (agent_id, config) VALUES
('roxy', '{"requireAuthentication": true, "requireAuthorization": true, "maxRequestsPerHour": 100, "allowedActions": ["processRequest", "collaborateWith", "analyzeWithSPADE", "createStrategicPlan"]}'),
('blaze', '{"requireAuthentication": true, "requireAuthorization": true, "maxRequestsPerHour": 100, "allowedActions": ["processRequest", "collaborateWith", "analyzeWithCBM", "designSalesFunnel", "validateMarketOpportunity"]}'),
('echo', '{"requireAuthentication": true, "requireAuthorization": true, "maxRequestsPerHour": 100, "allowedActions": ["processRequest", "collaborateWith", "createContentStrategy", "developBrandPositioning", "createViralContent", "buildCommunityStrategy"]}'),
('lumi', '{"requireAuthentication": true, "requireAuthorization": true, "maxRequestsPerHour": 50, "allowedActions": ["processRequest", "collaborateWith", "scanForCompliance", "generatePolicy", "assessRisk", "buildTrustStrategy"]}'),
('vex', '{"requireAuthentication": true, "requireAuthorization": true, "maxRequestsPerHour": 100, "allowedActions": ["processRequest", "collaborateWith", "designSystemArchitecture", "implementSecurity", "optimizePerformance", "designAutomation"]}'),
('lexi', '{"requireAuthentication": true, "requireAuthorization": true, "maxRequestsPerHour": 100, "allowedActions": ["processRequest", "collaborateWith", "analyzeWithFiveWhys", "analyzePerformanceMetrics", "conductStrategicAnalysis", "identifyPatterns"]}'),
('nova', '{"requireAuthentication": true, "requireAuthorization": true, "maxRequestsPerHour": 100, "allowedActions": ["processRequest", "collaborateWith", "designUserExperience", "createDesignSystem", "developPrototype", "conductUsabilityTesting"]}'),
('glitch', '{"requireAuthentication": true, "requireAuthorization": true, "maxRequestsPerHour": 100, "allowedActions": ["processRequest", "collaborateWith", "analyzeWithFiveWhys", "identifyFrictionPoints", "conductQualityAssurance", "optimizeSystem"]}')
ON CONFLICT (agent_id) DO NOTHING;

-- Insert default permissions for a default user (for development)
INSERT INTO agent_permissions (user_id, agent_id, permissions, restrictions) VALUES
('default-user', 'roxy', '["*"]', '[]'),
('default-user', 'blaze', '["*"]', '[]'),
('default-user', 'echo', '["*"]', '[]'),
('default-user', 'lumi', '["*"]', '[]'),
('default-user', 'vex', '["*"]', '[]'),
('default-user', 'lexi', '["*"]', '[]'),
('default-user', 'nova', '["*"]', '[]'),
('default-user', 'glitch', '["*"]', '[]')
ON CONFLICT (user_id, agent_id) DO NOTHING;

-- Create a function to clean up expired data
CREATE OR REPLACE FUNCTION cleanup_expired_security_data()
RETURNS void AS $$
BEGIN
    -- Clean up expired permissions
    DELETE FROM agent_permissions WHERE expires_at < NOW();
    
    -- Clean up expired sessions
    DELETE FROM user_sessions WHERE expires_at < NOW();
    
    -- Clean up old rate limit records (older than 24 hours)
    DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '24 hours';
    
    -- Clean up old audit logs (older than 90 days)
    DELETE FROM security_audit_logs WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Create a function to get security metrics
CREATE OR REPLACE FUNCTION get_security_metrics()
RETURNS TABLE (
    total_users INTEGER,
    active_sessions INTEGER,
    total_audit_logs_24h INTEGER,
    failed_auth_attempts_24h INTEGER,
    rate_limit_hits_24h INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(DISTINCT user_id) FROM agent_permissions)::INTEGER as total_users,
        (SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW())::INTEGER as active_sessions,
        (SELECT COUNT(*) FROM security_audit_logs WHERE timestamp >= NOW() - INTERVAL '24 hours')::INTEGER as total_audit_logs_24h,
        (SELECT COUNT(*) FROM security_audit_logs WHERE action = 'authenticate' AND success = false AND timestamp >= NOW() - INTERVAL '24 hours')::INTEGER as failed_auth_attempts_24h,
        (SELECT COUNT(*) FROM rate_limits WHERE window_start >= NOW() - INTERVAL '24 hours')::INTEGER as rate_limit_hits_24h;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE agent_permissions IS 'Stores user permissions for accessing specific agents and actions';
COMMENT ON TABLE security_audit_logs IS 'Logs all security-related events for audit and monitoring purposes';
COMMENT ON TABLE agent_security_configs IS 'Stores security configuration settings for each agent';
COMMENT ON TABLE user_sessions IS 'Tracks active user sessions for authentication and session management';
COMMENT ON TABLE rate_limits IS 'Tracks rate limiting data to prevent abuse and ensure fair usage';

COMMENT ON FUNCTION cleanup_expired_security_data() IS 'Cleans up expired security data to maintain database performance';
COMMENT ON FUNCTION get_security_metrics() IS 'Returns security metrics for monitoring and dashboard purposes';
