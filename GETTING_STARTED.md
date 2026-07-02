# Resort Chatbot - Getting Started Guide

Welcome to the Resort Chatbot System! This guide will help you get up and running quickly.

## What You've Built

A complete, production-ready chatbot system with:
- **Frontend**: Modern React/Next.js chat widget (embeddable on any website)
- **Backend**: Express.js REST API with keyword-based search
- **Database**: MongoDB collections for FAQs, tourist info, resort details, and analytics
- **Architecture**: Extensible design ready for AI/vector search integration

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

### 3. Set MongoDB Connection
Edit `.env.local` and add your MongoDB URI:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resort-chatbot
ADMIN_KEY=dev-key
```

### 4. Start Development Servers
```bash
# Terminal 1: Frontend
pnpm run dev

# Terminal 2: Backend  
pnpm run dev:backend
```

### 5. Open in Browser
- **Frontend**: http://localhost:3000
- **Demo**: http://localhost:3000/embed-demo
- **Backend API**: http://localhost:3001

## Project Structure

```
├── app/                          # Next.js frontend pages
│   ├── page.tsx                 # Landing page with chat widget
│   ├── embed-demo/              # Embedding demo page
│   └── layout.tsx               # Root layout
│
├── components/ChatWidget/        # Reusable chat components
│   ├── ChatWidget.tsx           # Main wrapper component
│   ├── ChatWindow.tsx           # Chat interface
│   ├── FloatingButton.tsx       # Floating button
│   └── ChatWidget.module.css    # Styling
│
├── server/                       # Express backend
│   ├── index.js                 # Server entry point
│   ├── config/database.js       # MongoDB connection
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API routes
│   └── services/                # Search logic
│
├── public/
│   ├── embed.js                 # Standalone embed script
│   ├── INTEGRATION_GUIDE.md     # How to embed
│   └── API_REFERENCE.md         # API documentation
│
├── RESORT_CHATBOT.md            # Full system documentation
├── DEPLOYMENT_GUIDE.md          # Production deployment
├── .env.example                 # Environment template
├── docker-compose.yml           # Local Docker setup
└── vercel.json                  # Vercel config
```

## Adding Sample Data

### Add an FAQ
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

### Add a Tourist Place
```bash
curl -X POST http://localhost:3001/api/admin/tourist-places \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: dev-key" \
  -d '{
    "name": "Mountain Peak",
    "description": "Beautiful mountain with scenic views",
    "distance": 25,
    "travelTime": "1 hour",
    "attractions": ["hiking", "photography"],
    "keywords": ["mountain", "nature", "trekking"],
    "category": "nature",
    "entryFee": "Free",
    "rating": 4.8
  }'
```

## Testing the Chatbot

1. Go to http://localhost:3000
2. Click the floating chat button (bottom-right)
3. Ask: "What time is check-in?"
4. The chatbot should respond with your FAQ answer

## Embedding on Other Websites

### Method 1: Standalone Script
Add this to any HTML page:
```html
<script>
  (function() {
    window.ResortChatbotConfig = {
      apiUrl: 'http://localhost:3001',
      frontendUrl: 'http://localhost:3000'
    };
    
    const script = document.createElement('script');
    script.src = 'http://localhost:3000/embed.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
```

### Method 2: React Component
```tsx
import ChatWidget from '@/components/ChatWidget/ChatWidget';

export default function MyPage() {
  return (
    <div>
      <ChatWidget apiUrl="http://localhost:3001" />
    </div>
  );
}
```

## Key Features Implemented

✓ **Keyword-Based Search**: Fast search without AI complexity
✓ **Three Data Sources**: FAQs, Tourist Places, Resort Information
✓ **Chat History**: All conversations logged for analytics
✓ **Confidence Scores**: Shows how confident each response is
✓ **Mobile Responsive**: Works perfectly on all devices
✓ **Easy Embedding**: Single script tag for any website
✓ **REST API**: Simple, well-documented API
✓ **Admin Endpoints**: Manage content without frontend
✓ **Extensible Design**: Ready for AI/vector search later

## API Endpoints Quick Reference

```
Chat:
  POST /api/chat/message          # Send message
  GET  /api/chat/health           # Health check

Admin (require X-Admin-Key header):
  POST   /api/admin/faq           # Create FAQ
  GET    /api/admin/faq           # List FAQs
  PUT    /api/admin/faq/:id       # Update FAQ
  DELETE /api/admin/faq/:id       # Delete FAQ

  POST   /api/admin/tourist-places    # Create place
  GET    /api/admin/tourist-places    # List places
  PUT    /api/admin/tourist-places/:id
  DELETE /api/admin/tourist-places/:id

  POST   /api/admin/resort-info       # Create info
  GET    /api/admin/resort-info       # List info
  PUT    /api/admin/resort-info/:id
  DELETE /api/admin/resort-info/:id

  GET    /api/admin/analytics/chat-logs    # Get chat history
  GET    /api/admin/analytics/stats        # Get statistics
```

## For Production Deployment

### Quick Deploy Checklist
1. **Set strong ADMIN_KEY** in environment variables
2. **Configure MongoDB Atlas** with secure credentials
3. **Deploy backend to Render** with environment variables
4. **Deploy frontend to Vercel** with API URLs
5. **Test all endpoints** in production
6. **Add sample data** via admin endpoints
7. **Monitor logs** and set up alerts
8. **Configure domain names** and SSL

See **DEPLOYMENT_GUIDE.md** for detailed production setup.

## Extending with AI

The system is designed for easy AI integration:

### To Add OpenAI Integration:
1. Create `server/services/aiSearchService.js`
2. Update `searchService.js` to use AI when keywords don't match
3. Add embeddings for semantic search
4. Update API responses with confidence scores

The architecture ensures this won't require major changes to existing code.

## Troubleshooting

### "Cannot GET /embed.js"
- Ensure embed.js is in `public/` folder
- Check `NEXT_PUBLIC_FRONTEND_URL` is correct
- Restart dev server

### "MongoDB connection failed"
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas IP whitelist
- Confirm database user password

### "No response from chatbot"
- Check backend is running: `curl http://localhost:3001/health`
- Verify sample data exists
- Check browser console for errors

### "CORS errors"
- Verify `FRONTEND_URL` in backend .env
- Check CORS settings in `server/index.js`
- Restart both servers

## Documentation Files

- **RESORT_CHATBOT.md** - Complete system documentation
- **DEPLOYMENT_GUIDE.md** - Production deployment walkthrough
- **INTEGRATION_GUIDE.md** - How to embed the chatbot
- **API_REFERENCE.md** - Detailed API documentation
- **This file** - Quick start and overview

## Next Steps

1. **Add more sample data** using admin endpoints
2. **Test on different websites** using embed script
3. **Set up production MongoDB** on MongoDB Atlas
4. **Deploy backend** to Render
5. **Deploy frontend** to Vercel
6. **Monitor analytics** to improve responses
7. **Add custom branding** and styling
8. **Plan AI integration** for future versions

## Support Resources

- Full docs: `RESORT_CHATBOT.md`
- API docs: `public/API_REFERENCE.md`
- Deployment: `DEPLOYMENT_GUIDE.md`
- Integration: `public/INTEGRATION_GUIDE.md`
- GitHub Issues: (Add your repo URL)

## Tech Stack Summary

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (frontend), Render (backend)
- **Styling**: CSS Modules, Tailwind CSS
- **Scripting**: Vanilla JavaScript (embed.js)

## Performance Notes

- Keywords indexed in MongoDB for fast queries
- Keyword matching response typically < 100ms
- Embed script is lightweight (< 15KB)
- No external dependencies for core functionality
- Ready to scale with caching layers

That's it! You're ready to go. Happy chatbot building!
