'use client';

import { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import FloatingButton from './FloatingButton';
import styles from './ChatWidget.module.css';

interface ChatWidgetProps {
  apiUrl?: string;
}

export default function ChatWidget({ apiUrl = 'https://mountview-chatbot-api.onrender.com' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Notify the parent iframe when the widget is toggled open or closed
    if (typeof window !== 'undefined' && window.self !== window.top) {
      window.parent.postMessage({ type: 'chatbot-toggle', isOpen }, '*');
    }
  }, [isOpen]);

  return (
    <div className={styles.container}>
      <FloatingButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} apiUrl={apiUrl} />
    </div>
  );
}
