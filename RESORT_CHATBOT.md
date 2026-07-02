# Resort Chatbot System

A scalable, keyword-based resort chatbot that can be embedded on any website with support for AI/vector search integration in the future.

## Architecture Overview

### Frontend (Next.js/React)
- Floating chat widget component
- Mobile-responsive chat interface
- Embed script for any website
- Session management

### Backend (Node.js/Express)
- REST API endpoints for chat
- MongoDB integration
- Chat logging for analytics
- Admin panel for content management

### Database (MongoDB Atlas)
- FAQ collection (keyword-indexed)
- Tourist Places collection
- Resort Information collection
- Chat Logs collection

## Features

✓ Keyword-based search without AI (fast, cost-effective)
✓ Mobile-responsive design
✓ Chat history logging for analytics
✓ Easy website embedding via script tag
✓ RESTful API
✓ Admin endpoints for content management
✓ Extensible architecture for future AI/vector search integration

## Project Structure

```
/vercel/share/v0-project/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Main landing page
│   ├── embed-demo/              # Embed demo page
│   └── layout.tsx               # Root layout
├── components/
│   └── ChatWidget/              # Chat widget components
│       ├── ChatWidget.tsx       # Main widget component
│       ├── ChatWindow.tsx       # Chat window UI
│       ├── FloatingButton.tsx   # Floating button
│       └── ChatWidget.module.css # Styling
├── server/                       # Express backend
│   ├── index.js                 # Main server file
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── FAQ.js               # FAQ schema
│   │   ├── TouristPlace.js      # Tourist places schema
│   │   ├── ResortInfo.js        # Resort info schema
│   │   └── ChatLog.js           # Chat logs schema
│   ├── routes/
│   │   ├── chat.js              # Chat API routes
│   │   └── admin.js             # Admin routes
│   └── services/
│       └── searchService.js     # Keyword search logic
├── public/
│   └── embed.js                 # Standalone embed script
├── package.json                 # Dependencies
├── .env.example                 # Environment variables template
├── render.yaml                  # Render deployment config
└── RESORT_CHATBOT.md           # This file
```

## Installation & Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### 2. Local Development

Clone and install:
```bash
git clone <repo-url>
cd /vercel/share/v0-project
pnpm install
```

Create `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your MongoDB URI:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resort-chatbot
NODE_ENV=development
ADMIN_KEY=dev-key
```

Start development servers:
```bash
# Terminal 1: Frontend
pnpm run dev

# Terminal 2: Backend
pnpm run dev:backend

# Or run both together
pnpm run dev:all
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Embed Demo: http://localhost:3000/embed-demo

### 3. Populate Sample Data

Create FAQs via API:
```bash
curl -X POST http://localhost:3001/api/admin/faq \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: dev-key" \
  -d '{
    "question": "What time is check-in?",
    "answer": "Check-in is at 3:00 PM. Early check-in may be available upon request.",
    "keywords": ["check-in", "time", "arrival"],
    "category": "booking"
  }'
```

Similar endpoints available for:
- `/api/admin/tourist-places` - Tourist attractions
- `/api/admin/resort-info` - Resort information

## API Endpoints

### Chat Endpoint
```
POST /api/chat/message

Request:
{
  "message": "What time is check-in?",
  "sessionId": "unique-session-id"
}

Response:
{
  "success": true,
  "response": "Check-in is at 3:00 PM...",
  "type": "faq",
  "confidence": 85,
  "alternatives": []
}
```

### Health Check
```
GET /api/chat/health
GET /health
```

### Admin Endpoints
All require `X-Admin-Key: <ADMIN_KEY>` header

**FAQ Management:**
- `POST /api/admin/faq` - Create FAQ
- `GET /api/admin/faq` - List FAQs
- `PUT /api/admin/faq/:id` - Update FAQ
- `DELETE /api/admin/faq/:id` - Delete FAQ

**Tourist Places:**
- `POST /api/admin/tourist-places` - Create
- `GET /api/admin/tourist-places` - List
- `PUT /api/admin/tourist-places/:id` - Update
- `DELETE /api/admin/tourist-places/:id` - Delete

**Resort Info:**
- `POST /api/admin/resort-info` - Create
- `GET /api/admin/resort-info` - List
- `PUT /api/admin/resort-info/:id` - Update
- `DELETE /api/admin/resort-info/:id` - Delete

**Analytics:**
- `GET /api/admin/analytics/chat-logs` - Get chat logs
- `GET /api/admin/analytics/stats` - Get statistics

## Embedding the Chatbot

### Method 1: Using Standalone Script
Add this to any website:
```html
<script>
  (function() {
    window.ResortChatbotConfig = {
      apiUrl: 'https://your-backend.com',
      frontendUrl: 'https://your-frontend.com',
      position: 'bottom-right'
    };
    
    const script = document.createElement('script');
    script.src = 'https://your-frontend.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
```

### Method 2: Using React Component
```tsx
import ChatWidget from '@/components/ChatWidget/ChatWidget';

export default function MyPage() {
  return (
    <div>
      <ChatWidget apiUrl="https://your-backend.com" />
      {/* Rest of your page */}
    </div>
  );
}
```

## Deployment

### Frontend: Vercel

1. Connect repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = Backend API URL
   - `NEXT_PUBLIC_FRONTEND_URL` = Frontend URL
3. Deploy (automatic on git push)

### Backend: Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set environment variables:
   - `MONGODB_URI` = MongoDB connection string
   - `NODE_ENV` = production
   - `ADMIN_KEY` = Secure key
   - `FRONTEND_URL` = Vercel frontend URL
4. Start command: `node server/index.js`
5. Build command: `npm install`

### Database: MongoDB Atlas

1. Create cluster on MongoDB Atlas
2. Add IP whitelist (or 0.0.0.0 for all)
3. Create database user
4. Get connection string
5. Add to Render environment variables

## Future Enhancements

The system is designed for easy extension:

### Adding AI/Vector Search
1. Create new search service: `server/services/aiSearchService.js`
2. Update `searchService.js` to support pluggable search engines
3. Add embeddings model configuration
4. Update API response with confidence scores

### Adding Authentication
1. Add JWT middleware
2. Implement user sessions
3. Track per-user analytics

### Adding Admin Dashboard
1. Create Next.js admin pages
2. Add charts for analytics
3. Content management UI

## Troubleshooting

### MongoDB Connection Issues
- Verify IP is whitelisted in MongoDB Atlas
- Check connection string format
- Ensure database user has appropriate permissions

### CORS Errors
- Update `FRONTEND_URL` in server/.env
- Check origin in server/index.js CORS config

### Embed Script Not Loading
- Verify `NEXT_PUBLIC_FRONTEND_URL` is correct
- Check browser console for 404 errors
- Ensure embed.js is in public/ folder

### No Chat Responses
- Check backend is running (curl http://localhost:3001/health)
- Verify MongoDB is connected (check server logs)
- Confirm sample data exists in database

## Performance Optimization

### Current Implementation
- Keyword indexing in MongoDB for fast queries
- Limit 5 results per collection search
- Connection pooling via Mongoose

### Future Improvements
- Redis caching for popular queries
- Elasticsearch for advanced full-text search
- Vector embeddings for semantic search
- Response caching

## Security Considerations

- Admin key required for content management
- Implement rate limiting on production
- Use HTTPS/TLS for all connections
- Add input validation and sanitization
- Consider JWT authentication for admin panel
- Store sensitive data in environment variables

## License

[Your License Here]

## Support

For issues and questions, please create an issue or contact the team.
