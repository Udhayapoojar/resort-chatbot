import ChatWidget from '@/components/ChatWidget/ChatWidget';

export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  return (
    <>
      <main className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">Resort Chatbot</div>
            <div className="flex gap-4">
              <a href="/embed-demo" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
                Embed Demo
              </a>
              <a href="https://github.com" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
                GitHub
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-3xl w-full text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Smart Resort Chatbot
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Embed an intelligent chatbot on your website to answer guest questions about your resort,
              tourist attractions, and local information in seconds.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
              <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-lg mb-2">Instant Setup</h3>
                <p className="text-gray-600 text-sm">
                  Add a single script tag to any website and go live immediately.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-lg mb-2">Keyword Search</h3>
                <p className="text-gray-600 text-sm">
                  Fast, cost-effective keyword-based search without AI complexity.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-lg mb-2">Analytics Ready</h3>
                <p className="text-gray-600 text-sm">
                  Logs all conversations for insights and future improvements.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center mb-12">
              <a
                href="/embed-demo"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Try Demo
              </a>
              <a
                href="/RESORT_CHATBOT.md"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition"
              >
                Documentation
              </a>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 text-gray-100 p-6 rounded-lg text-left max-w-xl mx-auto overflow-auto">
              <p className="text-sm font-mono mb-3 text-gray-400"># Add to your website</p>
              <pre className="text-xs font-mono">{`<script>
  window.ResortChatbotConfig = {
    apiUrl: 'https://api.example.com',
    frontendUrl: 'https://chat.example.com'
  };
  
  const script = document.createElement('script');
  script.src = '${apiUrl.replace('localhost', 'your-domain')}/embed.js';
  document.head.appendChild(script);
</script>`}</pre>
            </div>

            <p className="text-gray-600 text-sm mt-8">
              Visit the <a href="/embed-demo" className="text-blue-600 hover:underline font-semibold">embed demo</a> to see it in action.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 text-sm">
            <p>Resort Chatbot • Built with Next.js, Express, and MongoDB • Ready for deployment</p>
          </div>
        </footer>
      </main>

      {/* Chat Widget */}
      <ChatWidget apiUrl={apiUrl} />
    </>
  );
}
