'use client';

import { MessageCircle, X } from 'lucide-react';
import styles from './ChatWidget.module.css';

interface FloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function FloatingButton({ isOpen, onClick }: FloatingButtonProps) {
  return (
    <button
        onClick={onClick}
      className={`${styles.floatingButton} ${isOpen ? styles.active : ''}`}
      aria-label="Open chat widget"
      title="Chat with us"
        >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
    </button>
  );
}
