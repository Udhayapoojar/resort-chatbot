'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Phone, MessageSquare, Calendar, Sparkles, MapPin, 
  Clock, Compass, Star, CreditCard, ShieldCheck, Check, Info, Award
} from 'lucide-react';

export interface CardItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  price?: string;
  rating?: number;
  tags?: string[];
  actionLabel?: string;
  actionUrl?: string;
  actionType?: 'whatsapp' | 'call' | 'booking' | 'link';
  meta?: {
    distance?: string;
    duration?: string;
    entryFee?: string;
  };
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'rooms' | 'places' | 'amenities' | 'contact' | 'error';
  cards?: CardItem[];
  confidence?: number;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
}

// Premium content data matching Mount View Castle
const ROOM_CARDS: CardItem[] = [
  {
    id: 'room-1',
    title: 'Castle Deluxe Room',
    description: 'Spacious luxury room featuring panoramic forest views, a king-sized plush bed, and private sit-out balcony.',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
    price: '₹5,500 / night',
    tags: ['Wifi', 'AC', 'Balcony', 'Breakfast Included'],
    actionLabel: 'Book Deluxe',
    actionType: 'booking',
    actionUrl: 'https://themountviewcastle.com/booking'
  },
  {
    id: 'room-2',
    title: 'Mount View Castle Suite',
    description: 'Indulge in our premium signature suite with royal interiors, glass ceiling skylight, and jacuzzi.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    price: '₹8,500 / night',
    tags: ['Jacuzzi', 'Sky Roof', 'Mini Bar', 'VIP Lounge Access'],
    actionLabel: 'Book Suite',
    actionType: 'booking',
    actionUrl: 'https://themountviewcastle.com/booking'
  },
  {
    id: 'room-3',
    title: 'Royal Family Villa',
    description: 'Two-bedroom independent villa with a private garden, personal fireplace, and dedicated butler service.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
    price: '₹12,500 / night',
    tags: ['2 Bedrooms', 'Butler Service', 'Fireplace', 'Private Garden'],
    actionLabel: 'Book Villa',
    actionType: 'booking',
    actionUrl: 'https://themountviewcastle.com/booking'
  }
];

const TOURIST_CARDS: CardItem[] = [
  {
    id: 'spot-1',
    title: 'Echo Point & Castle Peak',
    description: 'Stunning viewpoint offering 360-degree views of the mountain ranges, misty valleys, and natural echo phenomenon.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    meta: {
      distance: '3.5 km from resort',
      duration: '15 mins drive',
      entryFee: 'Free entry'
    },
    actionLabel: 'Get Directions',
    actionType: 'link',
    actionUrl: 'https://maps.google.com'
  },
  {
    id: 'spot-2',
    title: 'Elephant Rock Falls',
    description: 'A serene, cascading waterfall surrounded by dense pine forests. Ideal for trekking and picnics.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    meta: {
      distance: '6.2 km from resort',
      duration: '22 mins drive',
      entryFee: '₹20 per person'
    },
    actionLabel: 'Get Directions',
    actionType: 'link',
    actionUrl: 'https://maps.google.com'
  }
];

const AMENITY_CARDS: CardItem[] = [
  {
    id: 'amenity-1',
    title: 'Infinity Forest Pool',
    description: 'Temperature-controlled swimming pool merging seamlessly with the valley view.',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80',
    tags: ['Valley View', 'Heated Pool', 'Cocktail Bar']
  },
  {
    id: 'amenity-2',
    title: 'Castle Spa & Wellness',
    description: 'Traditional ayurvedic massages, aromatherapy sessions, and steam sauna.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    tags: ['Aromatherapy', 'Ayurveda', 'Steam Room']
  }
];

const CONTACT_CARDS: CardItem[] = [
  {
    id: 'contact-whatsapp',
    title: 'WhatsApp Concierge',
    description: 'Instant support on the go with our front desk assistant.',
    actionLabel: 'Chat on WhatsApp',
    actionType: 'whatsapp',
    actionUrl: 'https://wa.me/919876543210?text=Hi%20Mount%20View%20Castle,%20I%20have%20an%20inquiry.'
  },
  {
    id: 'contact-call',
    title: 'Front Desk Direct Call',
    description: 'Speak directly with our reservations team.',
    actionLabel: 'Call Now',
    actionType: 'call',
    actionUrl: 'tel:+919876543210'
  }
];

export default function ChatWindow({ isOpen, onClose, apiUrl }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Welcome to Mount View Castle! I am your digital concierge. How may I assist you with your luxury getaway today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `mvc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleQuickAction = (action: string) => {
    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: action,
      sender: 'user',
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setIsLoading(true);

    setTimeout(() => {
      let botMsg: Message = {
        id: `bot-${Date.now()}`,
        text: '',
        sender: 'bot',
        timestamp: new Date(),
      };

      const normalizedAction = action.toLowerCase();
      if (normalizedAction.includes('rates') || normalizedAction.includes('price')) {
        botMsg.text = "Here are our exclusive room selections and rates at Mount View Castle:";
        botMsg.type = 'rooms';
        botMsg.cards = ROOM_CARDS;
      } else if (normalizedAction.includes('availability') || normalizedAction.includes('book')) {
        botMsg.text = "Check out our live availability and booking options. You can reserve directly for the best rates:";
        botMsg.type = 'rooms';
        botMsg.cards = ROOM_CARDS;
      } else if (normalizedAction.includes('spots') || normalizedAction.includes('tourist')) {
        botMsg.text = "Here are the top attractions near Mount View Castle you shouldn't miss:";
        botMsg.type = 'places';
        botMsg.cards = TOURIST_CARDS;
      } else if (normalizedAction.includes('amenities') || normalizedAction.includes('facilities')) {
        botMsg.text = "Indulge in our premium signature services designed for your absolute relaxation:";
        botMsg.type = 'amenities';
        botMsg.cards = AMENITY_CARDS;
      } else if (normalizedAction.includes('contact') || normalizedAction.includes('support')) {
        botMsg.text = "Our guest support team is available 24/7. Connect with us through any of these options:";
        botMsg.type = 'contact';
        botMsg.cards = CONTACT_CARDS;
      } else {
        botMsg.text = `Here is our information regarding "${action}". Please click below to check details or contact us directly.`;
        botMsg.type = 'contact';
        botMsg.cards = CONTACT_CARDS;
      }

      addMessage(botMsg);
      setIsLoading(false);
    }, 900);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          sessionId: sessionIdRef.current,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Enriched presentation based on tags/keywords returned
        let botMsgType: Message['type'] = 'text';
        let botCards: CardItem[] | undefined = undefined;

        const responseTextLower = data.response.toLowerCase();
        if (responseTextLower.includes('room') || responseTextLower.includes('rate') || responseTextLower.includes('deluxe') || responseTextLower.includes('suite')) {
          botMsgType = 'rooms';
          botCards = ROOM_CARDS;
        } else if (responseTextLower.includes('waterfall') || responseTextLower.includes('falls') || responseTextLower.includes('temple') || responseTextLower.includes('point') || responseTextLower.includes('tourist')) {
          botMsgType = 'places';
          botCards = TOURIST_CARDS;
        } else if (responseTextLower.includes('pool') || responseTextLower.includes('spa') || responseTextLower.includes('massage') || responseTextLower.includes('gym')) {
          botMsgType = 'amenities';
          botCards = AMENITY_CARDS;
        } else if (responseTextLower.includes('contact') || responseTextLower.includes('phone') || responseTextLower.includes('call') || responseTextLower.includes('number')) {
          botMsgType = 'contact';
          botCards = CONTACT_CARDS;
        }

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          text: data.response,
          sender: 'bot',
          timestamp: new Date(),
          type: botMsgType,
          cards: botCards,
          confidence: data.confidence,
        };
        addMessage(botMsg);
      } else {
        addMessage({
          id: `bot-${Date.now()}`,
          text: 'I apologize, but I am having trouble connecting right now. Please feel free to call our reception directly.',
          sender: 'bot',
          type: 'contact',
          cards: CONTACT_CARDS,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('[Chat Widget] Request failed, using intelligent local concierge service:', error);
      // fallback matching
      setTimeout(() => {
        let botMsg: Message = {
          id: `bot-fallback-${Date.now()}`,
          text: '',
          sender: 'bot',
          timestamp: new Date(),
        };

        const q = userText.toLowerCase();
        if (q.includes('room') || q.includes('rate') || q.includes('price') || q.includes('cost') || q.includes('deluxe') || q.includes('suite') || q.includes('stay') || q.includes('avail')) {
          botMsg.text = "Here are our current luxury accommodations and rates. You can book directly:";
          botMsg.type = 'rooms';
          botMsg.cards = ROOM_CARDS;
        } else if (q.includes('place') || q.includes('tourist') || q.includes('sight') || q.includes('visit') || q.includes('echo') || q.includes('falls')) {
          botMsg.text = "Discover these gorgeous tourist destinations near Mount View Castle:";
          botMsg.type = 'places';
          botMsg.cards = TOURIST_CARDS;
        } else if (q.includes('amenit') || q.includes('pool') || q.includes('spa') || q.includes('gym') || q.includes('wifi') || q.includes('food') || q.includes('dining')) {
          botMsg.text = "Enjoy world-class amenities during your stay at Mount View Castle:";
          botMsg.type = 'amenities';
          botMsg.cards = AMENITY_CARDS;
        } else {
          botMsg.text = "I would be happy to help you with that! Here is how you can connect directly with our front desk reservations and concierge team for personalized requests:";
          botMsg.type = 'contact';
          botMsg.cards = CONTACT_CARDS;
        }
        addMessage(botMsg);
      }, 700);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCardIcon = (type: CardItem['actionType']) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare size={16} className="mr-2" />;
      case 'call':
        return <Phone size={16} className="mr-2" />;
      case 'booking':
        return <Calendar size={16} className="mr-2" />;
      default:
        return <Compass size={16} className="mr-2" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 35, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 right-6 w-[400px] h-[640px] max-h-[85vh] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_12px_40px_rgba(18,53,36,0.18)] border border-brand-green/10 flex flex-col overflow-hidden z-[10001]"
        >
          {/* Branded Header */}
          <div className="bg-brand-green p-4 flex justify-between items-center relative border-b border-brand-gold/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/40 flex items-center justify-center text-brand-gold font-serif text-lg font-bold">
                  M
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-brand-green" />
              </div>
              <div>
                <h3 className="font-semibold text-[15px] leading-tight tracking-wide flex items-center gap-1.5">
                  Mount View Castle
                  <Sparkles size={13} className="text-brand-gold animate-pulse" />
                </h3>
                <span className="text-brand-gold-light/80 text-xs flex items-center gap-1">
                  Digital Concierge • Online
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="tel:+919876543210"
                className="p-1.5 rounded-full hover:bg-white/10 text-brand-gold transition-colors"
                title="Call Desk"
              >
                <Phone size={18} />
              </a>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#f9faf9] to-white flex flex-col gap-4">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-1.5">
                {/* Single Bubble */}
                <div
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-brand-green rounded-tr-none border border-brand-green/20'
                        : 'bg-stone-100 text-brand-green rounded-tl-none border border-stone-200/50'
                    }`}
                  >
                    {message.text}
                    {message.confidence !== undefined && (
                      <div className="text-[10px] text-brand-green/50 mt-1 italic text-right">
                        Confidence: {Math.round(message.confidence)}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Cards rendering */}
                {message.cards && message.cards.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin scrollbar-thumb-stone-300">
                    {message.cards.map((card) => (
                      <div
                        key={card.id}
                        className="flex-shrink-0 w-[240px] bg-white rounded-xl border border-stone-200/60 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:border-brand-gold/40"
                      >
                        {card.image && (
                          <div className="relative h-28 w-full overflow-hidden">
                            <img
                              src={card.image}
                              alt={card.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            {card.price && (
                              <div className="absolute bottom-2 left-2 bg-brand-green/90 backdrop-blur-xs text-brand-gold text-[11px] font-semibold px-2 py-0.5 rounded-md border border-brand-gold/30">
                                {card.price}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-brand-green text-[13px] leading-tight mb-1">
                              {card.title}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-3 mb-2 leading-relaxed">
                              {card.description}
                            </p>

                            {/* Tags or Meta details */}
                            {card.tags && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {card.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {card.meta && (
                              <div className="flex flex-col gap-0.5 mb-2 text-[10px] text-stone-500">
                                {card.meta.distance && (
                                  <div className="flex items-center gap-1">
                                    <MapPin size={10} className="text-brand-gold" />
                                    <span>{card.meta.distance}</span>
                                  </div>
                                )}
                                {card.meta.duration && (
                                  <div className="flex items-center gap-1">
                                    <Clock size={10} className="text-brand-gold" />
                                    <span>{card.meta.duration}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {card.actionLabel && card.actionUrl && (
                            <a
                              href={card.actionUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`mt-2 w-full py-1.5 px-3 rounded-md text-[11px] font-semibold flex items-center justify-center transition-all ${
                                card.actionType === 'whatsapp'
                                  ? 'bg-[#25D366] hover:bg-[#20ba59] text-white'
                                  : card.actionType === 'booking'
                                  ? 'bg-brand-gold hover:bg-brand-gold/90 text-brand-green'
                                  : 'bg-brand-green hover:bg-brand-green/95 text-white'
                              }`}
                            >
                              {renderCardIcon(card.actionType)}
                              {card.actionLabel}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-100 rounded-2xl rounded-tl-none px-4 py-3 border border-stone-200/50">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Chips */}
          <div className="px-4 py-2 bg-[#fdfdfd] border-t border-stone-100 flex gap-2 overflow-x-auto scrollbar-none">
            {[
              'Room Availability',
              'Room Rates',
              'Tourist Spots',
              'Amenities',
              'Contact Help'
            ].map((action) => (
              <button
                key={action}
                onClick={() => handleQuickAction(action)}
                className="flex-shrink-0 px-3 py-1 bg-white hover:bg-brand-green/5 border border-brand-green/20 hover:border-brand-green/50 text-[11px] font-semibold text-brand-green rounded-full transition-all duration-200 cursor-pointer shadow-xs"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-stone-100 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can we help make your stay magical?"
              className="flex-1 px-4 py-2 border border-stone-200 focus:border-brand-gold rounded-full text-xs outline-none transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-8 h-8 rounded-full bg-brand-green hover:bg-brand-green/95 disabled:bg-stone-200 text-brand-gold flex items-center justify-center cursor-pointer transition-all shrink-0"
            >
              <Send size={14} className={input.trim() ? "text-brand-gold" : "text-stone-400"} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
