'use client';

import { useState } from 'react';
import ChatWindow from './ChatWindow';
import FloatingButton from './FloatingButton';
import styles from './ChatWidget.module.css';

interface ChatWidgetProps {
  apiUrl?: string;
}

export default function ChatWidget({ apiUrl = 'https://mountview-chatbot-api.onrender.com' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <FloatingButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} apiUrl={apiUrl} />
    </div>
  );
}
