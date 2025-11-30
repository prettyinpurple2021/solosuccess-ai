-- 1) Create document_folders table (independent)
CREATE TABLE IF NOT EXISTS document_folders (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  parent_id INTEGER REFERENCES document_folders(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#8B5CF6',
  icon VARCHAR(50),
  is_default BOOLEAN DEFAULT FALSE,
  file_count INTEGER DEFAULT 0,
  total_size INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS document_folders_user_id_idx ON document_folders(user_id);
CREATE INDEX IF NOT EXISTS document_folders_parent_id_idx ON document_folders(parent_id);
CREATE INDEX IF NOT EXISTS document_folders_name_idx ON document_folders(name);

-- 2) Ensure documents table has required columns (ALTER if table already exists)
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL
);

ALTER TABLE documents ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS folder_id INTEGER;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS original_name VARCHAR(255);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type VARCHAR(50);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS size INTEGER;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_data TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'uncategorized';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS ai_insights JSONB DEFAULT '{}';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMP;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add folder_id foreign key if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'documents' AND constraint_name = 'documents_folder_id_fkey'
  ) THEN
    ALTER TABLE documents
      ADD CONSTRAINT documents_folder_id_fkey
      FOREIGN KEY (folder_id) REFERENCES document_folders(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Indexes on documents
CREATE INDEX IF NOT EXISTS documents_user_id_idx ON documents(user_id);
CREATE INDEX IF NOT EXISTS documents_folder_id_idx ON documents(folder_id);
CREATE INDEX IF NOT EXISTS documents_category_idx ON documents(category);
CREATE INDEX IF NOT EXISTS documents_file_type_idx ON documents(file_type);
CREATE INDEX IF NOT EXISTS documents_is_favorite_idx ON documents(is_favorite);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at);
CREATE INDEX IF NOT EXISTS documents_name_idx ON documents(name);

-- 3) Create document_activity table
CREATE TABLE IF NOT EXISTS document_activity (
  id SERIAL PRIMARY KEY,
  document_id VARCHAR(255) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS document_activity_document_id_idx ON document_activity(document_id);
CREATE INDEX IF NOT EXISTS document_activity_user_id_idx ON document_activity(user_id);
CREATE INDEX IF NOT EXISTS document_activity_action_idx ON document_activity(action);
CREATE INDEX IF NOT EXISTS document_activity_created_at_idx ON document_activity(created_at);


