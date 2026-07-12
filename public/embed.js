/**
 * Resort Chatbot Embed Script
 * 
 * Usage:
 * <script>
 *   (function() {
 *     const config = {
 *       apiUrl: 'https://your-backend.com',
 *       frontendUrl: 'https://your-frontend.com',
 *       widgetId: 'resort-chatbot',
 *       position: 'bottom-right' // or 'bottom-left'
 *     };
 *     const script = document.createElement('script');
 *     script.src = 'https://your-frontend.com/embed.js';
 *     script.async = true;
 *     script.onload = function() {
 *       if (window.ResortChatbot) {
 *         window.ResortChatbot.init(config);
 *       }
 *     };
 *     document.head.appendChild(script);
 *   })();
 * </script>
 */

(function() {
  'use strict';

  const ResortChatbot = {
    config: {
      apiUrl: 'https://mountview-chatbot-api.onrender.com',
      frontendUrl: 'https://resort-chatbot-swart.vercel.app',
      widgetId: 'resort-chatbot',
      position: 'bottom-right',
    },

    state: {
      isOpen: false,
      messages: [],
      sessionId: '',
    },

    /**
     * Initialize the chatbot
     */
    init: function(customConfig = {}) {
      // Merge configs
      this.config = { ...this.config, ...customConfig };

      // Generate session ID if not exists
      if (!this.state.sessionId) {
        this.state.sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      // Create widget container
      this.createWidget();

      // Add initial message
      this.addInitialMessage();

      console.log('[ResortChatbot] Initialized with config:', this.config);
    },

    /**
     * Create the widget DOM structure
     */
    createWidget: function() {
      // Check if widget already exists
      if (document.getElementById(this.config.widgetId)) {
        return;
      }

      // Create container
      const container = document.createElement('div');
      container.id = this.config.widgetId;
      container.setAttribute('data-position', this.config.position);
      container.innerHTML = `
        <style>
          #${this.config.widgetId} {
            --primary-color: #2563eb;
            --primary-dark: #1e40af;
            --bg-light: #f9fafb;
            --border-color: #e5e7eb;
            --text-primary: #111827;
            --text-secondary: #6b7280;
            --user-bg: #e0f2fe;
            --bot-bg: #f3f4f6;
          }

          #${this.config.widgetId} * {
            box-sizing: border-box;
          }

          #${this.config.widgetId}-button {
            position: fixed;
            bottom: 20px;
            ${this.config.position === 'bottom-left' ? 'left' : 'right'}: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 9999;
            font-size: 24px;
          }

          #${this.config.widgetId}-button:hover:not(.active) {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          }

          #${this.config.widgetId}-button.active {
            background-color: var(--primary-dark);
            transform: scale(0.95);
          }

          #${this.config.widgetId}-window {
            display: none;
            position: fixed;
            bottom: 80px;
            ${this.config.position === 'bottom-left' ? 'left' : 'right'}: 20px;
            width: 380px;
            height: 600px;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
            flex-direction: column;
            z-index: 10001;
            animation: rc-slideUp 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
          }

          #${this.config.widgetId}-window.open {
            display: flex;
          }

          @keyframes rc-slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          #${this.config.widgetId} .rc-chat-header {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            padding: 16px;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          #${this.config.widgetId} .rc-chat-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: white;
          }

          #${this.config.widgetId} .rc-chat-header p {
            margin: 4px 0 0 0;
            font-size: 12px;
            opacity: 0.9;
            color: white;
          }

          #${this.config.widgetId} .rc-chat-close-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            font-size: 20px;
            line-height: 1;
          }

          #${this.config.widgetId} .rc-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            background-color: var(--bg-light);
          }

          #${this.config.widgetId} .rc-chat-messages::-webkit-scrollbar {
            width: 6px;
          }

          #${this.config.widgetId} .rc-chat-messages::-webkit-scrollbar-track {
            background: transparent;
          }

          #${this.config.widgetId} .rc-chat-messages::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 3px;
          }

          #${this.config.widgetId} .rc-chat-message-wrapper {
            display: flex;
            margin-bottom: 8px;
            animation: rc-fadeIn 0.3s ease;
          }

          @keyframes rc-fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          #${this.config.widgetId} .rc-chat-message-wrapper.rc-user {
            justify-content: flex-end;
          }

          #${this.config.widgetId} .rc-chat-message-wrapper.rc-bot {
            justify-content: flex-start;
          }

          #${this.config.widgetId} .rc-chat-message {
            padding: 10px 14px;
            border-radius: 8px;
            max-width: 70%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.4;
          }

          #${this.config.widgetId} .rc-chat-message-wrapper.rc-user .rc-chat-message {
            background-color: var(--user-bg);
            color: var(--text-primary);
            border-bottom-right-radius: 2px;
          }

          #${this.config.widgetId} .rc-chat-message-wrapper.rc-bot .rc-chat-message {
            background-color: var(--bot-bg);
            color: var(--text-primary);
            border-bottom-left-radius: 2px;
          }

          #${this.config.widgetId} .rc-chat-typing {
            display: flex;
            gap: 4px;
            align-items: center;
            padding: 4px 0;
          }

          #${this.config.widgetId} .rc-chat-typing span {
            width: 6px;
            height: 6px;
            background-color: var(--text-secondary);
            border-radius: 50%;
            animation: rc-typing 1.4s infinite;
          }

          #${this.config.widgetId} .rc-chat-typing span:nth-child(2) {
            animation-delay: 0.2s;
          }

          #${this.config.widgetId} .rc-chat-typing span:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes rc-typing {
            0%, 60%, 100% {
              opacity: 0.5;
              transform: translateY(0);
            }
            30% {
              opacity: 1;
              transform: translateY(-8px);
            }
          }

          #${this.config.widgetId} .rc-chat-input-form {
            display: flex;
            gap: 8px;
            padding: 12px 16px;
            border-top: 1px solid var(--border-color);
            background-color: white;
            border-radius: 0 0 12px 12px;
          }

          #${this.config.widgetId} .rc-chat-input {
            flex: 1;
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 8px 14px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
            font-family: inherit;
          }

          #${this.config.widgetId} .rc-chat-input:focus {
            border-color: var(--primary-color);
          }

          #${this.config.widgetId} .rc-chat-input:disabled {
            background-color: #f3f4f6;
            color: var(--text-secondary);
          }

          #${this.config.widgetId} .rc-chat-send-btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
            font-size: 18px;
            flex-shrink: 0;
          }

          #${this.config.widgetId} .rc-chat-send-btn:hover:not(:disabled) {
            background-color: var(--primary-dark);
          }

          #${this.config.widgetId} .rc-chat-send-btn:disabled {
            background-color: var(--border-color);
            cursor: not-allowed;
          }

          @media (max-width: 480px) {
            #${this.config.widgetId}-window {
              width: calc(100vw - 20px);
              height: calc(100vh - 100px);
              bottom: 20px;
              ${this.config.position === 'bottom-left' ? 'left' : 'right'}: 10px;
            }

            #${this.config.widgetId} .rc-chat-message {
              max-width: 85%;
            }
          }
        </style>

        <div id="${this.config.widgetId}-button" class="chat-floating-btn">💬</div>
        
        <div id="${this.config.widgetId}-window" class="chat-window">
          <div class="rc-chat-header">
            <div>
              <h3>Resort Chatbot</h3>
              <p>Always here to help</p>
            </div>
            <button class="rc-chat-close-btn" title="Close chat">✕</button>
          </div>
          <div class="rc-chat-messages" id="${this.config.widgetId}-messages"></div>
          <form class="rc-chat-input-form" id="${this.config.widgetId}-form">
            <input
              type="text"
              class="rc-chat-input"
              id="${this.config.widgetId}-input"
              placeholder="Ask me anything..."
              autocomplete="off"
            />
            <button type="submit" class="rc-chat-send-btn" title="Send message">➤</button>
          </form>
        </div>
      `;

      document.body.appendChild(container);

      // Attach event listeners
      this.attachEventListeners();
    },

    /**
     * Attach event listeners
     */
    attachEventListeners: function() {
      const button = document.getElementById(`${this.config.widgetId}-button`);
      const closeBtn = document.querySelector(`#${this.config.widgetId}-window .rc-chat-close-btn`);
      const form = document.getElementById(`${this.config.widgetId}-form`);
      const input = document.getElementById(`${this.config.widgetId}-input`);

      const self = this;

      button.addEventListener('click', () => this.toggleWindow());
      closeBtn.addEventListener('click', () => this.closeWindow());

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (message) {
          self.sendMessage(message);
          input.value = '';
        }
      });
    },

    /**
     * Toggle chat window
     */
    toggleWindow: function() {
      if (this.state.isOpen) {
        this.closeWindow();
      } else {
        this.openWindow();
      }
    },

    /**
     * Open chat window
     */
    openWindow: function() {
      const window = document.getElementById(`${this.config.widgetId}-window`);
      const button = document.getElementById(`${this.config.widgetId}-button`);
      window.classList.add('open');
      button.classList.add('active');
      this.state.isOpen = true;
      document.getElementById(`${this.config.widgetId}-input`).focus();
    },

    /**
     * Close chat window
     */
    closeWindow: function() {
      const window = document.getElementById(`${this.config.widgetId}-window`);
      const button = document.getElementById(`${this.config.widgetId}-button`);
      window.classList.remove('open');
      button.classList.remove('active');
      this.state.isOpen = false;
    },

    /**
     * Add initial message
     */
    addInitialMessage: function() {
      this.addMessage('Hello! I\'m the resort chatbot. How can I help you today?', 'bot');
    },

    /**
     * Add message to chat
     */
    addMessage: function(text, sender, type = null) {
      const messagesContainer = document.getElementById(`${this.config.widgetId}-messages`);
      const messageWrapper = document.createElement('div');
      messageWrapper.className = `rc-chat-message-wrapper rc-${sender}`;

      const message = document.createElement('div');
      message.className = 'rc-chat-message';
      message.textContent = text;

      messageWrapper.appendChild(message);
      messagesContainer.appendChild(messageWrapper);

      // Auto-scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    /**
     * Send message to API
     */
    sendMessage: function(message) {
      const input = document.getElementById(`${this.config.widgetId}-input`);
      input.disabled = true;

      // Add user message to UI
      this.addMessage(message, 'user');

      // Show typing indicator
      this.showTypingIndicator();

      // Send to API
      fetch(`${this.config.apiUrl}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: this.state.sessionId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.removeTypingIndicator();

          if (data.success) {
            this.addMessage(data.response, 'bot', data.type);
          } else {
            this.addMessage(
              'Sorry, I encountered an error. Please try again.',
              'bot'
            );
          }
        })
        .catch((error) => {
          console.error('[ResortChatbot] Error:', error);
          this.removeTypingIndicator();
          this.addMessage(
            'Sorry, I\'m currently unavailable. Please try again later.',
            'bot'
          );
        })
        .finally(() => {
          input.disabled = false;
          input.focus();
        });
    },

    /**
     * Show typing indicator
     */
    showTypingIndicator: function() {
      const messagesContainer = document.getElementById(`${this.config.widgetId}-messages`);
      const wrapper = document.createElement('div');
      wrapper.className = 'rc-chat-message-wrapper rc-bot';
      wrapper.id = `${this.config.widgetId}-typing`;

      const typing = document.createElement('div');
      typing.className = 'rc-chat-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';

      wrapper.appendChild(typing);
      messagesContainer.appendChild(wrapper);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    /**
     * Remove typing indicator
     */
    removeTypingIndicator: function() {
      const typing = document.getElementById(`${this.config.widgetId}-typing`);
      if (typing) {
        typing.remove();
      }
    },
  };

  // Expose to global scope
  window.ResortChatbot = ResortChatbot;

  // Auto-initialize if config is provided in window
  if (window.ResortChatbotConfig) {
    ResortChatbot.init(window.ResortChatbotConfig);
  }
})();
