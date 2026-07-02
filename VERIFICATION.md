# Resort Chatbot - Installation Verification

Verify that all components are properly set up and working.

## Step 1: Check File Structure

Run this command to verify all key files exist:

```bash
#!/bin/bash
echo "Checking Resort Chatbot Installation..."

# Check backend files
echo "✓ Backend files:"
ls -q server/index.js server/config/database.js server/models/*.js server/routes/*.js server/services/searchService.js 2>/dev/null | wc -l

# Check frontend files
echo "✓ Frontend files:"
ls -q components/ChatWidget/*.tsx components/ChatWidget/*.css 2>/dev/null | wc -l

# Check public files
echo "✓ Public files:"
ls -q public/embed.js public/*.md 2>/dev/null | wc -l

# Check config files
echo "✓ Config files:"
ls -q .env.example vercel.json render.yaml docker-compose.yml Dockerfile.backend 2>/dev/null | wc -l

# Check documentation
echo "✓ Documentation files:"
ls -q *.md 2>/dev/null | wc -l

echo ""
echo "All key files should be present. Totals above should be non-zero."
```

## Step 2: Verify Dependencies

Check that all dependencies are installed:

```bash
# Check if node_modules exists
ls -d node_modules 2>/dev/null && echo "✓ node_modules exists"

# Check if required packages are installed
pnpm list express mongoose next react 2>/dev/null | grep -c "✓\|│ ├─\|│ ├──\|│ └" && echo "✓ Core packages installed"

# Check npm scripts
grep -q '"dev:backend"' package.json && echo "✓ Backend dev script exists"
grep -q '"dev:all"' package.json && echo "✓ Dev-all script exists"
```

## Step 3: Environment Configuration

Verify environment setup:

```bash
# Check .env.local exists
[ -f .env.local ] && echo "✓ .env.local exists" || echo "✗ .env.local missing - create it"

# Check required variables
grep -q "NEXT_PUBLIC_API_URL" .env.local && echo "✓ NEXT_PUBLIC_API_URL set"
grep -q "MONGODB_URI" .env.local && echo "✓ MONGODB_URI set"
grep -q "ADMIN_KEY" .env.local && echo "✓ ADMIN_KEY set"
```

## Step 4: Test Backend API

Start backend and test:

```bash
# Terminal 1: Start backend
pnpm run dev:backend

# Terminal 2: Test endpoints
# Test health check
curl http://localhost:3001/health
# Should return: {"status":"ok","environment":"development","timestamp":"..."}

# Test root
curl http://localhost:3001/
# Should return API info JSON

# Test chat (requires data)
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "sessionId": "test-session"
  }'
# Should return: {"success":true,"response":"...","type":"no_match",...}
```

## Step 5: Test Frontend

In another terminal:

```bash
# Terminal 1: (Backend still running)
pnpm run dev

# Check if frontend loads
curl http://localhost:3000 | grep -q "Resort Chatbot" && echo "✓ Frontend loads"

# Visit in browser
# http://localhost:3000 - See landing page with chat widget
# http://localhost:3000/embed-demo - See embed demo
```

## Step 6: Test Chat Widget

```bash
# In browser at http://localhost:3000:
1. Click the floating chat button (bottom-right)
2. Should see chat window open
3. Type a message (e.g., "Hello")
4. Should get a response (initially "no_match" if no data)
5. Click close button (X) to close
6. Chat button should show again
```

## Step 7: Add Sample Data

Test admin endpoints:

```bash
# Add an FAQ
curl -X POST http://localhost:3001/api/admin/faq \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: dev-key" \
  -d '{
    "question": "What time is check-in?",
    "answer": "Check-in is at 3:00 PM",
    "keywords": ["check-in", "time"],
    "category": "booking"
  }'
# Should return: {"success":true,"data":{...}}

# List FAQs
curl http://localhost:3001/api/admin/faq
# Should return FAQ data

# Get analytics
curl http://localhost:3001/api/admin/analytics/stats \
  -H "X-Admin-Key: dev-key"
# Should return stats
```

## Step 8: Test Chat with Data

```bash
# In browser at http://localhost:3000:
1. Open chat widget
2. Ask: "What time is check-in?"
3. Should get your FAQ answer!
4. Confidence score should show ~85+
```

## Step 9: Test Embedding

```bash
# Create a test HTML file: test.html
cat > test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Embed Test</title>
</head>
<body>
  <h1>Test Website</h1>
  <p>Chat widget should appear in bottom-right corner.</p>

  <script>
    (function() {
      window.ResortChatbotConfig = {
        apiUrl: 'http://localhost:3001',
        frontendUrl: 'http://localhost:3000',
        position: 'bottom-right'
      };
      
      const script = document.createElement('script');
      script.src = 'http://localhost:3000/embed.js';
      script.async = true;
      document.head.appendChild(script);
    })();
  </script>
</body>
</html>
EOF

# Open in browser: file:///path/to/test.html
# Chat widget should appear and be functional
```

## Step 10: Docker Verification

```bash
# Start all services with Docker
docker-compose up -d

# Check if services are running
docker-compose ps
# Should show 3 services: mongodb, backend, frontend (all running)

# Test backend in Docker
docker-compose exec backend curl http://localhost:3001/health

# View logs
docker-compose logs backend

# Cleanup
docker-compose down
```

## Step 11: Documentation Verification

Verify all documentation files exist and are readable:

```bash
ls -lh *.md public/*.md
# Should show:
# - README.md
# - GETTING_STARTED.md
# - RESORT_CHATBOT.md
# - DEPLOYMENT_GUIDE.md
# - BUILD_SUMMARY.md
# - FEATURES_CHECKLIST.md
# - public/API_REFERENCE.md
# - public/INTEGRATION_GUIDE.md
```

## Step 12: Quick Functionality Test

Checklist of core features:

```
Backend API:
  ✓ Server starts without errors
  ✓ Health check returns 200
  ✓ Chat endpoint responds
  ✓ Admin endpoints require auth
  ✓ MongoDB connects

Frontend:
  ✓ Landing page loads
  ✓ Chat widget appears
  ✓ Widget opens/closes
  ✓ Messages send and receive
  ✓ Embed demo page works

Database:
  ✓ MongoDB connection works
  ✓ Collections can be created
  ✓ Data can be added
  ✓ Data can be queried

Embedding:
  ✓ Embed script loads
  ✓ Widget works on external pages
  ✓ API communication works
```

## Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is in use
lsof -i :3001

# Check if MongoDB is accessible
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('✓ MongoDB OK')).catch(e => console.error('✗', e.message))"

# Check logs
tail -50 ~/.pm2/logs/backend-error.log
```

### Frontend won't load
```bash
# Check if port 3000 is in use
lsof -i :3000

# Check build errors
pnpm run build

# Check next.js logs
cat .next/server/middlewares.js 2>/dev/null || echo "Not built"
```

### Chat not responding
```bash
# Check backend is running
curl http://localhost:3001/health

# Check MongoDB connection
mongo "mongodb://localhost:27017/resort-chatbot" --eval "db.adminCommand('ping')"

# Check logs
pnpm run dev:backend 2>&1 | grep -i error
```

### MongoDB connection failed
```bash
# Check connection string in .env.local
cat .env.local | grep MONGODB_URI

# Test connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ Connected'))
  .catch(e => console.error('✗ Error:', e.message))
"

# Check MongoDB Atlas IP whitelist
# Go to Security → Network Access
# Ensure your IP is whitelisted (or 0.0.0.0/0 for dev)
```

## Success Indicators

You're ready when you see:

✓ All files present and accounted for  
✓ Dependencies installed  
✓ Backend starts without errors  
✓ Frontend loads at localhost:3000  
✓ Chat widget appears and functions  
✓ Sample data can be added and queried  
✓ Embed script works on external pages  
✓ Documentation is complete and readable  

## Next Steps

Once verified:
1. Read [GETTING_STARTED.md](./GETTING_STARTED.md)
2. Add more sample data via admin API
3. Test on different websites
4. Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production
5. Plan AI integration upgrades

## Performance Baseline

Expected metrics for local development:

| Metric | Value |
|--------|-------|
| Search Response Time | <100ms |
| Chat Widget Load | <500ms |
| Embed Script Size | ~15KB |
| Database Query Time | <50ms |
| API Response Time | <200ms |

## Support

If verification fails:
1. Check error messages carefully
2. Review troubleshooting section above
3. Check documentation files
4. Verify MongoDB connection
5. Ensure all ports are available
6. Check .env.local configuration

---

**Status**: Ready to verify! Follow the steps above in order.
