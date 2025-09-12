// Sample files for demo with actual paths that can be parsed
export const MOCK_FILES = [
  {
    id: '1',
    name: 'Business Plan 2024.txt',
    file_type: 'txt',
    mime_type: 'text/plain',
    size: 2847, // Actual file size
    upload_date: '2024-01-15T10:00:00Z',
    last_modified: '2024-01-15T10:00:00Z',
    category: 'document',
    tags: ['business', 'planning', '2024', 'strategy'],
    description: 'Annual business plan and strategy document for SoloSuccess AI Platform',
    is_favorite: true,
    folder_id: null,
    storage_path: require('path').join(process.cwd(), 'uploads', 'business-plan-2024.txt')
  },
  {
    id: '2',
    name: 'Marketing Strategy Q1.txt',
    file_type: 'txt',
    mime_type: 'text/plain',
    size: 2934, // Actual file size
    upload_date: '2024-01-14T09:30:00Z',
    last_modified: '2024-01-14T09:30:00Z',
    category: 'document',
    tags: ['marketing', 'strategy', 'Q1', 'campaigns'],
    description: 'Comprehensive marketing strategy for Q1 2024 including campaigns and KPIs',
    is_favorite: false,
    folder_id: null,
    storage_path: require('path').join(process.cwd(), 'uploads', 'marketing-strategy.txt')
  },
  {
    id: '3',
    name: 'Technical Architecture.txt',
    file_type: 'txt',
    mime_type: 'text/plain',
    size: 6842, // Actual file size
    upload_date: '2024-01-13T14:20:00Z',
    last_modified: '2024-01-13T14:20:00Z',
    category: 'document',
    tags: ['technical', 'architecture', 'development', 'infrastructure'],
    description: 'Complete technical architecture documentation for the platform',
    is_favorite: false,
    folder_id: null,
    storage_path: require('path').join(process.cwd(), 'uploads', 'technical-architecture.txt')
  }
]
