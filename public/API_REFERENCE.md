# Resort Chatbot - API Reference

Complete REST API documentation for the Resort Chatbot backend.

## Base URL

```
Production: https://your-backend.onrender.com
Development: http://localhost:3001
```

## Authentication

Most endpoints are public. Admin endpoints require authentication via header:

```
X-Admin-Key: your-admin-key
```

## Chat Endpoints

### Send Message

Send a chat message and get an intelligent response.

**Request**
```
POST /api/chat/message
Content-Type: application/json

{
  "message": "What time is check-in?",
  "sessionId": "unique-session-123"
}
```

**Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| message | string | Yes | User's chat message |
| sessionId | string | Yes | Unique session identifier for tracking |

**Response**
```json
{
  "success": true,
  "response": "Check-in is at 3:00 PM. Early check-in may be available upon request.",
  "type": "faq",
  "confidence": 85,
  "alternatives": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "question": "What about late check-in?",
      "answer": "Late check-in arrangements...",
      "matchScore": 65,
      "type": "faq"
    }
  ]
}
```

**Response Fields**
| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Whether the request was successful |
| response | string | Bot's text response |
| type | string | Type of response: 'faq', 'tourist_place', 'resort_info', 'no_match' |
| confidence | number | Confidence score 0-100 |
| alternatives | array | Alternative responses (up to 2) |

**Example cURL**
```bash
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What time is check-in?",
    "sessionId": "session-123"
  }'
```

**Example JavaScript**
```javascript
const response = await fetch('/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What time is check-in?',
    sessionId: 'unique-session-id'
  })
});

const data = await response.json();
console.log(data.response);
```

### Health Check

Check if the chat service is running.

**Request**
```
GET /api/chat/health
```

**Response**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## Admin Endpoints

All admin endpoints require `X-Admin-Key` header.

### FAQ Management

#### Create FAQ
**Request**
```
POST /api/admin/faq
Content-Type: application/json
X-Admin-Key: your-admin-key

{
  "question": "What time is check-in?",
  "answer": "Check-in is at 3:00 PM",
  "keywords": ["check-in", "time", "arrival"],
  "category": "booking"
}
```

**Parameters**
| Field | Type | Required | Valid Values |
|-------|------|----------|--------------|
| question | string | Yes | - |
| answer | string | Yes | - |
| keywords | array | No | Array of strings |
| category | string | Yes | 'booking', 'facilities', 'dining', 'activities', 'policies', 'general' |

**Response**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "question": "What time is check-in?",
    "answer": "Check-in is at 3:00 PM",
    "keywords": ["check-in", "time", "arrival"],
    "category": "booking",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### List FAQs
**Request**
```
GET /api/admin/faq
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "question": "What time is check-in?",
      "answer": "Check-in is at 3:00 PM",
      "keywords": ["check-in", "time"],
      "category": "booking"
    }
  ]
}
```

#### Update FAQ
**Request**
```
PUT /api/admin/faq/:id
Content-Type: application/json
X-Admin-Key: your-admin-key

{
  "answer": "Check-in is at 4:00 PM"
}
```

**Response**
```json
{
  "success": true,
  "data": { /* Updated FAQ object */ }
}
```

#### Delete FAQ
**Request**
```
DELETE /api/admin/faq/:id
X-Admin-Key: your-admin-key
```

**Response**
```json
{ "success": true }
```

### Tourist Places Management

#### Create Tourist Place
**Request**
```
POST /api/admin/tourist-places
Content-Type: application/json
X-Admin-Key: your-admin-key

{
  "name": "Mountain Peak",
  "description": "Beautiful mountain with scenic views",
  "distance": 15,
  "travelTime": "45 minutes",
  "attractions": ["hiking", "photography"],
  "keywords": ["mountain", "nature", "views"],
  "category": "nature",
  "entryFee": "Free",
  "bestTimeToVisit": "Morning",
  "activities": ["trekking", "picnic"],
  "rating": 4.5
}
```

**Parameters**
| Field | Type | Required | Valid Values |
|-------|------|----------|--------------|
| name | string | Yes | - |
| description | string | Yes | - |
| distance | number | No | Distance in km |
| travelTime | string | No | e.g., "45 minutes" |
| attractions | array | No | Array of strings |
| keywords | array | No | Array of strings |
| category | string | Yes | 'nature', 'historical', 'adventure', 'cultural', 'shopping', 'dining' |
| entryFee | string | No | - |
| bestTimeToVisit | string | No | - |
| activities | array | No | Array of strings |
| rating | number | No | 0-5 |

#### List Tourist Places
**Request**
```
GET /api/admin/tourist-places
```

#### Update Tourist Place
**Request**
```
PUT /api/admin/tourist-places/:id
X-Admin-Key: your-admin-key
```

#### Delete Tourist Place
**Request**
```
DELETE /api/admin/tourist-places/:id
X-Admin-Key: your-admin-key
```

### Resort Information Management

#### Create Resort Info
**Request**
```
POST /api/admin/resort-info
Content-Type: application/json
X-Admin-Key: your-admin-key

{
  "section": "amenities",
  "title": "Swimming Pool",
  "content": "Olympic-sized pool with heated water",
  "keywords": ["pool", "swimming", "amenities"],
  "displayOrder": 1,
  "details": {
    "availability": "6am - 10pm",
    "temperature": "28°C"
  }
}
```

**Parameters**
| Field | Type | Required | Valid Values |
|-------|------|----------|--------------|
| section | string | Yes | 'overview', 'amenities', 'rooms', 'dining', 'activities', 'contact', 'location' |
| title | string | Yes | - |
| content | string | Yes | - |
| keywords | array | No | Array of strings |
| displayOrder | number | No | - |
| details | object | No | Any JSON object |

#### List Resort Info
**Request**
```
GET /api/admin/resort-info
```

#### Update Resort Info
**Request**
```
PUT /api/admin/resort-info/:id
X-Admin-Key: your-admin-key
```

#### Delete Resort Info
**Request**
```
DELETE /api/admin/resort-info/:id
X-Admin-Key: your-admin-key
```

### Analytics Endpoints

#### Get Chat Logs
**Request**
```
GET /api/admin/analytics/chat-logs?days=30&limit=100
X-Admin-Key: your-admin-key
```

**Query Parameters**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| days | number | 30 | Number of days to look back |
| limit | number | 100 | Max results to return |

**Response**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "sessionId": "session-123",
      "userMessage": "What time is check-in?",
      "botResponse": "Check-in is at 3:00 PM",
      "responseType": "faq",
      "confidence": 85,
      "userRating": 5,
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

#### Get Statistics
**Request**
```
GET /api/admin/analytics/stats
X-Admin-Key: your-admin-key
```

**Response**
```json
{
  "success": true,
  "data": {
    "totalChats": 1234,
    "successfulChats": 1100,
    "successRate": "89.16",
    "averageConfidence": "82.45"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**HTTP Status Codes**
| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing/invalid admin key |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Rate Limiting

Currently no rate limiting. Recommended limits for production:

- **Chat messages**: 100 requests/minute per session
- **Admin endpoints**: 10 requests/minute per admin key
- **Public endpoints**: 1000 requests/minute per IP

---

## Response Types

The chatbot can return different response types based on the source:

### FAQ Response
```json
{
  "type": "faq",
  "data": {
    "question": "...",
    "answer": "...",
    "category": "booking"
  }
}
```

### Tourist Place Response
```json
{
  "type": "tourist_place",
  "data": {
    "name": "...",
    "description": "...",
    "distance": 15,
    "travelTime": "45 minutes",
    "rating": 4.5
  }
}
```

### Resort Info Response
```json
{
  "type": "resort_info",
  "data": {
    "section": "amenities",
    "title": "...",
    "content": "..."
  }
}
```

### No Match Response
```json
{
  "type": "no_match",
  "response": "I couldn't find an answer to your question..."
}
```

---

## Webhooks (Future)

Planned webhook events:

- `chat.message` - When a chat message is received
- `chat.unmatched` - When no answer is found
- `admin.faq.created` - When FAQ is created
- `admin.faq.updated` - When FAQ is updated
- `admin.faq.deleted` - When FAQ is deleted

---

## SDKs

JavaScript SDK (built-in with embed.js):
```javascript
window.ResortChatbot.init({
  apiUrl: 'https://backend.example.com',
  frontendUrl: 'https://frontend.example.com'
});

window.ResortChatbot.sendMessage('Hello');
```

---

## Best Practices

1. **Session Management**
   - Use unique sessionId for each user session
   - Track sessionId for analytics
   - Log sessionId with errors for debugging

2. **Error Handling**
   - Always check `success` field
   - Implement retry logic for failed requests
   - Log errors for monitoring

3. **Performance**
   - Cache responses when possible
   - Batch admin operations
   - Use connection pooling

4. **Security**
   - Never expose ADMIN_KEY in frontend code
   - Use HTTPS for all requests
   - Sanitize user input
   - Implement rate limiting

5. **Analytics**
   - Track successful vs failed responses
   - Monitor average confidence scores
   - Identify common unmatched queries
   - Use feedback to improve database

---

## Changelog

### v1.0.0 (Jan 2024)
- Initial release
- Chat message API
- FAQ management
- Tourist places
- Resort info
- Analytics endpoints

---

## Support

For API support:
- Check this documentation
- Review error messages
- Check server logs
- Contact support team
