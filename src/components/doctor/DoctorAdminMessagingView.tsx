import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Shield, 
  Clock, 
  User, 
  CheckCircle2, 
  Sparkles,
  Building2,
  RefreshCw
} from 'lucide-react';
import { store, AUTHORIZED_ADMINS } from '../../lib/store';
import { Doctor, AdminUser, AdminDoctorMessage } from '../../types';

interface DoctorAdminMessagingViewProps {
  doctor: Doctor;
}

const MESSAGE_CATEGORIES: AdminDoctorMessage['category'][] = [
  'Clinical Consultation',
  'Resource Request',
  'Shift Advisory',
  'Administrative'
];

export const DoctorAdminMessagingView: React.FC<DoctorAdminMessagingViewProps> = ({ doctor }) => {
  const [messages, setMessages] = useState<AdminDoctorMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AdminDoctorMessage['category']>('Clinical Consultation');

  const activeAdmin: AdminUser = AUTHORIZED_ADMINS.main;

  const refreshMessages = () => {
    const conversation = store.getAdminDoctorConversation(activeAdmin.id, doctor.id);
    setMessages(conversation);
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const conv = store.getAdminDoctorConversation(activeAdmin.id, doctor.id);
      setMessages(conv);
    });
    return () => unsubscribe();
  }, [doctor.id, activeAdmin.id]);

  useEffect(() => {
    refreshMessages();
  }, [doctor.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    store.sendAdminDoctorMessage({
      sender_id: doctor.id,
      sender_name: doctor.full_name,
      sender_role: 'doctor',
      receiver_id: activeAdmin.id,
      receiver_name: activeAdmin.name,
      receiver_role: 'admin',
      admin_type: 'main',
      message: newMessageText.trim(),
      category: selectedCategory,
      conversation_id: `conv_${activeAdmin.id}_${doctor.id}`
    });

    setNewMessageText('');
  };

  return (
    <div className="w-full bg-[#0B1120] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[720px]">
      
      {/* Header Bar */}
      <div className="p-5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-b border-[#334155] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Direct Admin Communication Dispatch</h2>
            <p className="text-xs text-slate-400">
              1-to-1 secure communication line with Hospital Administration for clinical, operational, and supply needs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshMessages}
            className="px-3 py-1.5 rounded-xl bg-[#070B14] hover:bg-[#1E293B] border border-[#334155] text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Channel</span>
          </button>
        </div>
      </div>

      {/* Admin Recipient Profile Subheader */}
      <div className="p-4 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={activeAdmin.avatar_url} 
            alt={activeAdmin.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-400/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{activeAdmin.name}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                Hospital Administrator
              </span>
            </div>
            <p className="text-xs text-slate-400">{activeAdmin.designation}</p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          Official Email: {activeAdmin.email}
        </span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#070B14]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-14 h-14 rounded-full bg-[#1E293B] flex items-center justify-center text-slate-400 mb-3">
              <MessageSquare className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-300">No messages yet with {activeAdmin.name}</p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Send an inquiry, ICU transfer request, medical supply escalation, or schedule shift notice below.
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isFromDoctor = msg.sender_role === 'doctor';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isFromDoctor ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-slate-300">
                    {msg.sender_name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.2 rounded font-semibold ${
                    msg.category === 'Resource Request' 
                      ? 'bg-amber-500/20 text-amber-300' 
                      : msg.category === 'Clinical Consultation'
                      ? 'bg-sky-500/20 text-sky-300'
                      : msg.category === 'Shift Advisory'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {msg.category}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {msg.created_at}
                  </span>
                </div>

                <div
                  className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-md ${
                    isFromDoctor
                      ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-tr-none'
                      : 'bg-[#1E293B] text-slate-100 border border-[#334155] rounded-tl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Compose Form */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[#0F172A] border-t border-[#1E293B] space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Category:
          </span>
          {MESSAGE_CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white border-sky-500'
                  : 'bg-[#1E293B] text-slate-400 border-[#334155] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Message ${activeAdmin.name}...`}
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            className="flex-1 text-xs py-3 px-4 rounded-xl bg-[#070B14] border border-[#334155] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!newMessageText.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

    </div>
  );
};
