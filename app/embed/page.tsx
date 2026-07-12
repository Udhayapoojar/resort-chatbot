'use client';

import { useSearchParams } from 'next/navigation';
import ChatWidget from '@/components/ChatWidget/ChatWidget';
import { Suspense } from 'react';

function EmbedContent() {
  const searchParams = useSearchParams();
  // Get API URL from query parameters or default to Mount View Castle's backend
  const apiUrl = searchParams.get('apiUrl') || 'https://mountview-chatbot-api.onrender.com';

  return <ChatWidget apiUrl={apiUrl} />;
}

export default function EmbedPage() {
  return (
    <div style={{ background: 'transparent', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Suspense fallback={null}>
        <EmbedContent />
      </Suspense>
    </div>
  );
}
