# Resort Chatbot - Integration Guide

## Quick Start

### 1. Embed on Your Website

Add this single script tag before the closing `</body>` tag:

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

That's it! The chatbot will appear as a floating widget in the bottom-right corner.

### 2. Configuration

**Available options:**
```javascript
window.ResortChatbotConfig = {
  apiUrl: 'https://backend.example.com',        // Required: Your backend API URL
  frontendUrl: 'https://frontend.example.com',  // Required: Your frontend URL  
  position: 'bottom-right',                     // Optional: 'bottom-right' or 'bottom-left'
  widgetId: 'resort-chatbot'                    // Optional: Custom widget ID
};
```

### 3. Examples

#### Basic HTML Site
```html
<!DOCTYPE html>
<html>
<head>
  <title>My Resort</title>
</head>
<body>
  <h1>Welcome to Paradise Resort</h1>
  <p>Your information will appear here...</p>

  <!-- Add the chatbot here -->
  <script>
    (function() {
      window.ResortChatbotConfig = {
        apiUrl: 'https://api.myresort.com',
        frontendUrl: 'https://chat.myresort.com',
        position: 'bottom-right'
      };
      
      const script = document.createElement('script');
      script.src = 'https://chat.myresort.com/embed.js';
      script.async = true;
      document.head.appendChild(script);
    })();
  </script>
</body>
</html>
```

#### React Component
```jsx
import { useEffect } from 'react';

export default function MyPage() {
  useEffect(() => {
    window.ResortChatbotConfig = {
      apiUrl: 'https://api.myresort.com',
      frontendUrl: 'https://chat.myresort.com'
    };

    const script = document.createElement('script');
    script.src = 'https://chat.myresort.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return <div>Your page content...</div>;
}
```

#### Vue Component
```vue
<template>
  <div>Your page content...</div>
</template>

<script>
export default {
  mounted() {
    window.ResortChatbotConfig = {
      apiUrl: 'https://api.myresort.com',
      frontendUrl: 'https://chat.myresort.com'
    };

    const script = document.createElement('script');
    script.src = 'https://chat.myresort.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
  }
}
</script>
```

#### WordPress
Add this to your theme's `functions.php`:
```php
function add_resort_chatbot() {
  ?>
  <script>
    (function() {
      window.ResortChatbotConfig = {
        apiUrl: 'https://api.myresort.com',
        frontendUrl: 'https://chat.myresort.com'
      };
      
      const script = document.createElement('script');
      script.src = 'https://chat.myresort.com/embed.js';
      script.async = true;
      document.head.appendChild(script);
    })();
  </script>
  <?php
}
add_action('wp_footer', 'add_resort_chatbot');
```

Or add directly to your footer template.

#### Shopify Theme
Add to your theme's `theme.liquid`:
```liquid
<script>
  (function() {
    window.ResortChatbotConfig = {
      apiUrl: 'https://api.myresort.com',
      frontendUrl: 'https://chat.myresort.com'
    };
    
    const script = document.createElement('script');
    script.src = 'https://chat.myresort.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
```

#### Wix
1. Go to Settings > Custom Code
2. Add new Custom Code
3. Paste the embed script
4. Apply to All Pages

## Styling Customization

The widget uses CSS custom properties (variables) that you can override:

```html
<style>
  #resort-chatbot {
    --primary-color: #2563eb;
    --primary-dark: #1e40af;
    --bg-light: #f9fafb;
    --border-color: #e5e7eb;
    --text-primary: #111827;
    --text-secondary: #6b7280;
  }
</style>
```

## API Integration

If you want to build your own UI, use the REST API directly:

### Send Message
```javascript
fetch('https://your-backend.com/api/chat/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'What time is check-in?',
    sessionId: 'unique-session-id'
  })
})
.then(res => res.json())
.then(data => console.log(data.response));
```

### Response Format
```json
{
  "success": true,
  "response": "Check-in is at 3:00 PM...",
  "type": "faq",
  "confidence": 85,
  "alternatives": []
}
```

## Troubleshooting

### Widget not appearing
- Verify `frontendUrl` is correct
- Check browser console for errors
- Ensure `embed.js` is accessible at `{frontendUrl}/embed.js`

### No responses from chatbot
- Verify `apiUrl` is correct
- Check backend is running: `curl {apiUrl}/health`
- Confirm sample data exists in database

### CORS errors
- Update `FRONTEND_URL` in backend environment
- Backend must allow origin in CORS config

### Widget position issues
- Try changing `position` from 'bottom-right' to 'bottom-left'
- Check for CSS conflicts with `z-index`
- Inspect element to verify styles applied

## Performance Tips

1. Load script asynchronously (already done with `async: true`)
2. Use CDN for faster script delivery
3. Cache responses using service workers
4. Implement Redis caching on backend

## Advanced Usage

### Custom Session Management
```javascript
window.ResortChatbotConfig = {
  apiUrl: 'https://api.myresort.com',
  frontendUrl: 'https://chat.myresort.com',
  // Custom session ID from your system
  customSessionId: user.id
};
```

### Analytics Integration
```javascript
// After initialization
window.addEventListener('chatbot:message', (e) => {
  console.log('User asked:', e.detail.message);
  
  // Send to your analytics
  gtag('event', 'chatbot_message', {
    question: e.detail.message,
    response_type: e.detail.type
  });
});
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs: `docker logs resort-chatbot-backend`
3. Contact support team

## Next Steps

- [API Documentation](./API_DOCS.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Admin Panel Setup](./ADMIN_SETUP.md)
