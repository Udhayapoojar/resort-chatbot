# Resort Chatbot - Deployment Guide

Complete guide to deploy the Resort Chatbot system to production.

## Prerequisites

- GitHub account with repository access
- Vercel account (for frontend)
- Render account (for backend)
- MongoDB Atlas account (for database)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Any Website (Embedded)                   │
│                    ↓ embed.js script                        │
├─────────────────────────────────────────────────────────────┤
│                    Vercel Frontend                          │
│              (Next.js + Chat Widget)                        │
│              https://your-frontend.vercel.app              │
├─────────────────────────────────────────────────────────────┤
│                   Render Backend API                        │
│              (Express.js + Search Service)                 │
│              https://your-backend.onrender.com             │
├─────────────────────────────────────────────────────────────┤
│                MongoDB Atlas Database                       │
│         (FAQ, TouristPlaces, ResortInfo, ChatLogs)         │
│         mongodb+srv://cluster.mongodb.net/...              │
└─────────────────────────────────────────────────────────────┘
```

## Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Account**
   - Go to mongodb.com/cloud/atlas
   - Sign up for a free account
   - Verify email

2. **Create Database Cluster**
   - Click "Create a Deployment"
   - Choose Free tier (M0 Sandbox)
   - Select region closest to your users
   - Click "Create Deployment"

3. **Configure Security**
   - Go to "Security" → "Database Access"
   - Add new database user:
     - Username: `resort-admin`
     - Password: Generate secure password
   - Click "Add User"

4. **Network Access**
   - Go to "Security" → "Network Access"
   - Add IP Address: `0.0.0.0/0` (allows all - restrict in production)
   - Or add specific IPs from Render

5. **Get Connection String**
   - Go to "Deployment" → "Drivers"
   - Copy MongoDB connection string
   - Replace `<password>` with your database user password
   - Format: `mongodb+srv://resort-admin:PASSWORD@cluster.mongodb.net/resort-chatbot?retryWrites=true&w=majority`

## Step 2: Deploy Backend on Render

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Resort Chatbot"
   git push -u origin main
   ```

2. **Create Render Service**
   - Go to render.com
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository
   - Choose `Dockerfile.backend` or `server/index.js`

3. **Configure Service**
   - **Name**: `resort-chatbot-backend`
   - **Region**: Choose closest to users
   - **Branch**: `main`
   - **Build Command**: `pnpm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free (for testing) or Paid for production

4. **Add Environment Variables**
   - Click "Environment"
   - Add the following:
     ```
     NODE_ENV=production
     PORT=3001
     MONGODB_URI=mongodb+srv://resort-admin:PASSWORD@cluster.mongodb.net/resort-chatbot?retryWrites=true&w=majority
     ADMIN_KEY=generate-secure-key-here
     FRONTEND_URL=https://your-frontend.vercel.app
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://resort-chatbot-backend.onrender.com`)

## Step 3: Deploy Frontend on Vercel

1. **Create Vercel Project**
   - Go to vercel.com/new
   - Select GitHub repository
   - Import project

2. **Configure Project**
   - **Framework**: Next.js
   - **Build Command**: `next build`
   - **Start Command**: `next start`
   - **Root Directory**: `./`

3. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://resort-chatbot-backend.onrender.com
     NEXT_PUBLIC_FRONTEND_URL=https://your-frontend.vercel.app
     ```
   - Replace with actual URLs after Render deployment

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Get your frontend URL

5. **Update Backend Environment**
   - Go to Render dashboard
   - Edit environment variable:
     - `FRONTEND_URL` = Your Vercel URL
   - Redeploy backend

## Step 4: Test Deployment

### Test Backend
```bash
curl https://your-backend.onrender.com/health

# Response:
# {"status":"ok","environment":"production","timestamp":"2024-01-01T00:00:00.000Z"}
```

### Add Sample Data
```bash
curl -X POST https://your-backend.onrender.com/api/admin/faq \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: your-admin-key" \
  -d '{
    "question": "What time is check-in?",
    "answer": "Check-in is at 3:00 PM",
    "keywords": ["check-in", "time"],
    "category": "booking"
  }'
```

### Test Chat
```bash
curl -X POST https://your-backend.onrender.com/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What time is check-in?",
    "sessionId": "test-session"
  }'
```

### Visit Frontend
- Open https://your-frontend.vercel.app
- Test the chat widget
- Try the embed demo at https://your-frontend.vercel.app/embed-demo

## Step 5: Local Docker Development

For testing the full stack locally:

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- MongoDB: localhost:27017

## Monitoring & Maintenance

### View Logs
- **Vercel**: Dashboard → Deployments → Logs
- **Render**: Dashboard → Logs
- **MongoDB**: Atlas → Monitoring

### Performance Optimization

1. **Enable Caching**
   - Set `Cache-Control` headers in vercel.json
   - Use Redis on backend for frequent queries

2. **Database Optimization**
   - Create indexes on `keywords` fields
   - Monitor query performance in MongoDB Atlas

3. **CDN**
   - embed.js is automatically cached by Vercel CDN
   - Set appropriate cache headers

### Backup Strategy

1. **MongoDB**
   - Enable automated backups in MongoDB Atlas
   - Export data regularly

2. **Code**
   - All code in GitHub
   - Regular commits for backup

## Scaling for Production

### Backend Scaling
- Upgrade Render from Free → Starter → Pro plan
- Use connection pooling with MongoDB
- Add Redis for caching

### Database Scaling
- Upgrade MongoDB from M0 → M2+ cluster
- Enable sharding for large datasets
- Use read replicas for high traffic

### Frontend Scaling
- Already auto-scales on Vercel
- Use Edge Functions for global distribution
- Cache embed.js aggressively

## Troubleshooting

### Backend not connecting to MongoDB
```
Check:
1. MongoDB connection string in environment variables
2. IP whitelist in MongoDB Atlas includes Render IPs
3. Database user password is correct
4. Check Render logs for error messages
```

### Frontend can't reach backend
```
Check:
1. Backend is running (curl /health)
2. NEXT_PUBLIC_API_URL is correct
3. CORS is configured in backend
4. Check browser console for errors
```

### Chat widget not loading
```
Check:
1. embed.js exists at public/embed.js
2. NEXT_PUBLIC_FRONTEND_URL is correct
3. Check browser console for 404 errors
4. Verify embed script URL in your website
```

### Database queries slow
```
Check:
1. Indexes are created on keywords fields
2. Query performance in MongoDB Atlas
3. Add caching layer if needed
4. Consider upgrading MongoDB cluster
```

## Custom Domain Setup

### Vercel
1. Go to Settings → Domains
2. Add custom domain
3. Follow DNS setup instructions
4. Update NEXT_PUBLIC_FRONTEND_URL

### Render
1. Go to Settings → Custom Domains
2. Add domain
3. Update DNS records
4. Update NEXT_PUBLIC_API_URL

## Cost Estimation (Monthly)

- **Vercel Frontend**: Free-$20 (depending on traffic)
- **Render Backend**: $7-$25 (depending on compute tier)
- **MongoDB Atlas**: Free-$57 (depending on data size and tier)
- **Total**: $14-$102/month for small production setup

## Next Steps

1. Add authentication for admin panel
2. Set up monitoring and alerts
3. Configure email notifications
4. Add analytics dashboard
5. Implement rate limiting
6. Set up CI/CD pipeline
7. Add webhook integrations
8. Implement vector search for AI-powered responses

## Support

For issues:
- Check Render/Vercel/MongoDB documentation
- Review application logs
- Check GitHub Issues
- Contact support teams

## Security Checklist

- [ ] Changed ADMIN_KEY from default value
- [ ] Set MONGODB_URI with strong password
- [ ] Restricted IP access in MongoDB Atlas
- [ ] Enabled HTTPS everywhere
- [ ] Configured CORS properly
- [ ] Set environment variables in production
- [ ] Enabled monitoring and alerts
- [ ] Regular backups configured
- [ ] Domain SSL certificate installed
- [ ] Rate limiting configured
