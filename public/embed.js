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
      widgetId: 'resort-chatbot-iframe-container',
      position: 'bottom-right'
    },

    init: function(customConfig = {}) {
      this.config = { ...this.config, ...customConfig };

      // Prevent duplicate instances
      if (document.getElementById(this.config.widgetId)) {
        return;
      }

      const self = this;
      const setupIframe = () => {
        self.createIframe();
        self.setupMessageListener();
      };

      // Safely initialize when DOM body is ready
      if (document.body) {
        setupIframe();
      } else {
        window.addEventListener('DOMContentLoaded', setupIframe);
      }
    },

    createIframe: function() {
      const container = document.createElement('div');
      container.id = this.config.widgetId;

      // Set initial styles for the collapsed state (floating button only)
      Object.assign(container.style, {
        position: 'fixed',
        bottom: '0',
        [this.config.position === 'bottom-left' ? 'left' : 'right']: '0',
        width: '100px',
        height: '100px',
        zIndex: '99999',
        border: 'none',
        overflow: 'hidden',
        background: 'transparent',
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      });

      const iframe = document.createElement('iframe');
      // Pass the API URL as a query param so the React component can read it
      iframe.src = `${this.config.frontendUrl}/embed?apiUrl=${encodeURIComponent(this.config.apiUrl)}`;
      iframe.title = 'Resort Chatbot';
      iframe.scrolling = 'no';
      
      Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none',
        background: 'transparent',
        colorScheme: 'light' // Avoid browser dark-mode forcing styles
      });

      container.appendChild(iframe);
      document.body.appendChild(container);
      this.container = container;
    },

    setupMessageListener: function() {
      window.addEventListener('message', (event) => {
        // Only accept messages from our frontendUrl
        if (event.origin !== this.config.frontendUrl) {
          return;
        }

        const data = event.data;
        if (data && data.type === 'chatbot-toggle') {
          this.resizeWidget(data.isOpen);
        }
      });
    },

    resizeWidget: function(isOpen) {
      if (!this.container) return;

      const isMobile = window.innerWidth <= 480;

      if (isOpen) {
        if (isMobile) {
          Object.assign(this.container.style, {
            width: '100vw',
            height: '100vh',
            bottom: '0',
            right: '0',
            left: '0'
          });
        } else {
          Object.assign(this.container.style, {
            width: '440px',
            height: '760px',
            bottom: '0',
            right: '0',
            left: 'auto'
          });
        }
      } else {
        // Collapsed state
        Object.assign(this.container.style, {
          width: '100px',
          height: '100px',
          bottom: '0',
          right: this.config.position === 'bottom-right' ? '0' : 'auto',
          left: this.config.position === 'bottom-left' ? '0' : 'auto'
        });
      }
    }
  };

  // Expose to global scope
  window.ResortChatbot = ResortChatbot;

  // Auto-initialize if config is provided
  if (window.ResortChatbotConfig) {
    ResortChatbot.init(window.ResortChatbotConfig);
  }
})();
