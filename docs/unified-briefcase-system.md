# Unified Briefcase System

The Unified Briefcase System provides a centralized storage solution for all user-generated content, conversations, templates, and files. Each user has a single "briefcase" that stores all their created or uploaded content with automatic organization, search, and management capabilities.

## Features

- **Centralized Storage**: Single briefcase per user for all content
- **Avatar Management**: Profile picture upload with blob storage
- **Auto-Save**: Automatic saving of chat conversations, template progress, and brand work
- **Search & Filter**: Full-text search and filtering by content type, tags, and dates
- **Blob Storage**: Secure file storage using Vercel Blob with automatic cleanup
- **Database Integration**: PostgreSQL with optimized indexes and triggers
- **Real-time Updates**: Debounced auto-saving and instant UI updates

## Architecture

### Database Schema

#### `user_briefcases` Table
```sql
CREATE TABLE user_briefcases (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `briefcase_items` Table
```sql
CREATE TABLE briefcase_items (
  id VARCHAR(255) PRIMARY KEY,
  briefcase_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('avatar', 'chat', 'brand', 'template_save', 'document', 'ai_interaction')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB,
  blob_url TEXT,
  file_size BIGINT,
  mime_type VARCHAR(255),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Content Types

- **avatar**: User profile pictures
- **chat**: AI chat conversations
- **brand**: Brand identity work and assets
- **template_save**: Work-in-progress template saves
- **document**: Uploaded documents
- **ai_interaction**: General AI interactions

## Components

### Core Components

#### `UnifiedBriefcase` Component
- Main briefcase interface
- Grid/list view toggle
- Search and filtering
- Pagination support
- Content type statistics
- Item management (view, delete)

#### `AvatarUpload` Component
- File upload interface
- Image validation (type, size)
- Preview functionality
- Automatic cleanup of old avatars
- Error handling

### API Endpoints

#### Avatar Management
- `POST /api/avatar/upload` - Upload new avatar
- `GET /api/avatar/upload` - Get current avatar

#### Briefcase Operations
- `GET /api/unified-briefcase` - List briefcase items
- `POST /api/unified-briefcase` - Save new content
- `DELETE /api/unified-briefcase` - Delete item

### Hooks

#### `useAvatar`
```typescript
const { avatar, loading, error, refetch, updateAvatar } = useAvatar()
```

Manages avatar state with automatic loading and updates.

### Utilities

#### `BriefcaseAutoSaver`
```typescript
// Auto-save chat conversation
await briefcaseAutoSaver.saveChatConversation(
  conversationId,
  title,
  messages,
  agentName
)

// Save template progress
await briefcaseAutoSaver.saveTemplateProgress(
  templateSlug,
  title,
  content,
  progress
)

// Save brand work
await briefcaseAutoSaver.saveBrandWork(title, brandData)
```

Provides debounced auto-saving for different content types.

## Setup

### Database Setup

1. Run the setup script:
```bash
npm run setup-unified-briefcase
```

This creates the necessary tables, indexes, and triggers.

### Environment Variables

Required environment variables:
```env
DATABASE_URL=your_neon_database_url
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Authentication

The system uses JWT authentication compatible with your existing auth system. API routes expect Bearer tokens with user information.

## Usage Examples

### Basic Briefcase Display
```tsx
import UnifiedBriefcase from '@/components/UnifiedBriefcase'

function MyBriefcasePage() {
  return <UnifiedBriefcase />
}
```

### Avatar Upload
```tsx
import AvatarUpload from '@/components/AvatarUpload'
import { useAvatar } from '@/hooks/useAvatar'

function ProfilePage() {
  const { avatar, updateAvatar } = useAvatar()
  
  return (
    <AvatarUpload 
      currentAvatar={avatar}
      onAvatarChange={updateAvatar}
    />
  )
}
```

### Auto-Save Integration
```tsx
import { briefcaseAutoSaver } from '@/utils/briefcase-auto-save'

// In a chat component
useEffect(() => {
  if (messages.length >= 3) {
    briefcaseAutoSaver.saveChatConversation(
      conversationId,
      'My Chat',
      messages,
      'Assistant Name'
    )
  }
}, [messages])
```

## Demo Page

Visit `/briefcase-demo` to see the complete system in action with:
- Interactive briefcase browser
- Avatar upload functionality
- Demo content creation buttons
- Real-time updates and filtering

## Security Features

- **Authentication**: JWT-based user authentication
- **File Validation**: Type and size validation for uploads
- **Privacy Controls**: Items marked private by default
- **Automatic Cleanup**: Old files automatically removed when replaced
- **Rate Limiting**: Built-in rate limiting for API endpoints

## Performance Optimizations

- **Database Indexes**: Optimized queries with GIN indexes for arrays
- **Debounced Auto-Save**: Prevents excessive API calls
- **Pagination**: Efficient loading of large datasets
- **Blob Storage**: CDN-optimized file serving
- **Lazy Loading**: Components load content on demand

## Monitoring

The system includes comprehensive logging for:
- Upload operations
- Auto-save activities
- Error tracking
- Performance metrics

## Future Enhancements

Planned improvements:
- Content versioning
- Collaborative sharing
- Advanced search with AI
- Content recommendations
- Export capabilities
- Mobile app support

## Troubleshooting

### Common Issues

1. **Upload Failures**: Check file size (max 5MB) and type (images only for avatars)
2. **Authentication Errors**: Verify JWT token and user permissions
3. **Database Connection**: Ensure DATABASE_URL is correctly configured
4. **Blob Storage**: Verify BLOB_READ_WRITE_TOKEN is valid

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

## API Reference

### Save Chat Conversation
```http
POST /api/unified-briefcase
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "type": "chat",
  "title": "Business Planning Session",
  "content": {
    "messages": [...]
  },
  "metadata": {
    "agentName": "Business Advisor",
    "conversationId": "conv-123"
  }
}
```

### Upload Avatar
```http
POST /api/avatar/upload
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>

avatar: <image-file>
```

### List Briefcase Items
```http
GET /api/unified-briefcase?type=chat&limit=20&offset=0
Authorization: Bearer <jwt-token>
```

This unified briefcase system provides a powerful, scalable solution for managing user content across your SoloSuccess AI platform.