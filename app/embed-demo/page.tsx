import Head from 'next/head';

export const metadata = {
  title: 'Resort Chatbot Embed Demo',
  description: 'Demo page showing how to embed the resort chatbot on any website',
};

export default function EmbedDemo() {
  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ResortChatbotConfig = {
                apiUrl: '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}',
                frontendUrl: '${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}',
                position: 'bottom-right'
              };
            `,
          }}
        />
      </Head>
      
      <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h1>Resort Chatbot Embed Demo</h1>
          
          <section style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid #eee' }}>
            <h2>How to Embed This Chatbot</h2>
            <p>Copy and paste this code into your website to embed the chatbot widget:</p>
            <pre style={{ background: '#f0f0f0', padding: '20px', borderRadius: '4px', overflow: 'auto' }}>
{`<script>
  (function() {
    window.ResortChatbotConfig = {
      apiUrl: '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}',
      frontendUrl: '${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}',
      position: 'bottom-right' // or 'bottom-left'
    };
    
    const script = document.createElement('script');
    script.src = '${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/embed.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`}
            </pre>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2>Features</h2>
            <ul>
              <li>✓ Keyword-based FAQ search</li>
              <li>✓ Tourist place recommendations</li>
              <li>✓ Resort information lookup</li>
              <li>✓ Chat history logging for analytics</li>
              <li>✓ Mobile-responsive design</li>
              <li>✓ Easy integration with any website</li>
              <li>✓ Extensible for AI and vector search</li>
            </ul>
          </section>

          <section>
            <h2>Configuration Options</h2>
            <pre style={{ background: '#f0f0f0', padding: '20px', borderRadius: '4px', overflow: 'auto' }}>
{`{
  apiUrl: 'https://mountview-chatbot-api.onrender.com',    // Backend API URL
  frontendUrl: 'https://resort-chatbot-swart.vercel.app',  // Frontend URL
  position: 'bottom-right',                   // 'bottom-right' or 'bottom-left'
  widgetId: 'resort-chatbot'                  // Widget container ID
}`}
            </pre>
          </section>

          <div style={{ marginTop: '60px', padding: '20px', background: '#e8f4f8', borderRadius: '4px', border: '1px solid #b0d9e8' }}>
            <p><strong>Note:</strong> The chatbot widget is now visible in the bottom-right corner of this page. Try asking it a question!</p>
          </div>
        </div>
      </div>

      <script
        src="/embed.js"
        async
      />
    </>
  );
}
