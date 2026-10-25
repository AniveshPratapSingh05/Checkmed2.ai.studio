import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MinusSquare, 
  RefreshCw, 
  User, 
  Stethoscope, 
  AlertCircle, 
  HeartPulse, 
  ChevronDown,
  ShieldCheck,
  MessageSquareText
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiConsultantChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Namaste! 🙏 I am your Checkmed AI Healthcare Consultant.\nHow can I assist you today with symptoms, doctor recommendations, OPD tokens, ICU bed availability, or emergency ambulance tracking?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    '🩺 Check Fever & Cough Symptoms',
    '🚑 Book GPS Ambulance with ETA',
    '🏥 Check Live ICU Bed Status',
    '🎫 How to get OPD Token?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history })
      });

      if (!res.ok) {
        throw new Error('API server returned error');
      }

      const data = await res.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'Namaste! I am here to help you with Checkmed hospital services.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback helpful message
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Namaste! 🙏 For immediate medical emergencies across Kanpur, Gorakhpur, Prayagraj, Varanasi & Lucknow, please use the Checkmed 24x7 Ambulance booking button or call 108. You can also view live ICU beds and OPD queue tokens directly in this app!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'Namaste! 🙏 Chat history reset. How can I assist you with your health or hospital services today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* FLOATING CHAT TRIGGER BUTTON AT RIGHT BOTTOM CORNER */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1E293B] border border-[#38BDF8]/50 text-white text-xs font-bold shadow-xl shadow-[#0EA5E9]/20 hover:border-[#38BDF8] transition-all cursor-pointer group animate-bounce hover:animate-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-[#38BDF8]">AI Consultant</span>
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          </button>
        )}

        <button
          id="btn-ai-consultant"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all transform cursor-pointer relative ${
            isOpen 
              ? 'bg-[#1E293B] border-2 border-[#EF4444] text-white rotate-90 scale-95' 
              : 'bg-gradient-to-tr from-[#0EA5E9] via-[#0284C7] to-[#0369A1] text-white hover:scale-105 border-2 border-[#38BDF8]/60 shadow-[#0EA5E9]/40'
          }`}
          title="Open Checkmed AI Health Consultant"
          aria-label="AI Health Consultant Chat"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-[#EF4444]" />
          ) : (
            <>
              <Bot className="w-7 h-7 text-white" />
              {/* Pulse Indicator */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#10B981] border-2 border-[#0F172A]"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* FLOATING CHAT DRAWER / WINDOW */}
      {isOpen && (
        <div className="fixed bottom-22 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[380px] h-[520px] max-h-[80vh] bg-[#1E293B] rounded-3xl border border-[#38BDF8]/40 shadow-2xl flex flex-col overflow-hidden animate-fadeIn backdrop-blur-md">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-b border-[#334155] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] p-0.5 shadow-md flex items-center justify-center relative">
                <Bot className="w-6 h-6 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#0F172A]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">AI Health Consultant</h3>
                  <span className="px-1.5 py-0.2 bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/30 rounded text-[9px] font-bold">
                    24/7
                  </span>
                </div>
                <p className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Checkmed Medical Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-[#334155] rounded-xl transition-all cursor-pointer"
                title="Reset Chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-[#334155] rounded-xl transition-all cursor-pointer"
                title="Minimize Window"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Chip Bar */}
          <div className="bg-[#0F172A]/80 px-3 py-2 border-b border-[#334155]/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.replace(/^[^\s]+\s/, ''))}
                className="px-2.5 py-1 rounded-full bg-[#1E293B] hover:bg-[#38BDF8]/20 border border-[#334155] hover:border-[#38BDF8]/50 text-[#CBD5E1] hover:text-white text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#0F172A]/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 flex items-center justify-center flex-shrink-0 text-[#38BDF8] mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white rounded-br-xs shadow-md'
                      : 'bg-[#1E293B] border border-[#334155] text-[#F8FAFC] rounded-bl-xs shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-[9px] text-right ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-[#94A3B8]'
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-[#334155] flex items-center justify-center flex-shrink-0 text-white mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 flex items-center justify-center flex-shrink-0 text-[#38BDF8]">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#1E293B] border border-[#334155] p-3 rounded-2xl rounded-bl-xs text-[#94A3B8] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8] animate-spin" />
                  <span>Analyzing medical database...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Emergency Advisory Footer Note */}
          <div className="px-3 py-1.5 bg-[#0F172A] border-t border-[#334155] flex items-center justify-between text-[9px] text-[#94A3B8]">
            <span className="flex items-center gap-1 text-[#F59E0B]">
              <ShieldCheck className="w-3 h-3" /> Checkmed AI Assistant
            </span>
            <span>Emergency Dial 108</span>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#1E293B] border-t border-[#334155] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about symptoms, ICU beds, tokens..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8] transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-50 text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
