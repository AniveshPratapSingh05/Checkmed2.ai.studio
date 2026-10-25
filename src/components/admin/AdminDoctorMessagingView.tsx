import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  Stethoscope, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  FileText,
  Building2,
  RefreshCw
} from 'lucide-react';
import { store } from '../../lib/store';
import { Doctor, AdminUser, AdminDoctorMessage } from '../../types';

interface AdminDoctorMessagingViewProps {
  currentAdmin: AdminUser;
}

const MESSAGE_CATEGORIES: AdminDoctorMessage['category'][] = [
  'Clinical Consultation',
  'Resource Request',
  'Shift Advisory',
  'Administrative'
];

export const AdminDoctorMessagingView: React.FC<AdminDoctorMessagingViewProps> = ({ currentAdmin }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(store.doctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(store.doctors[0] || null);
  const [messages, setMessages] = useState<AdminDoctorMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AdminDoctorMessage['category']>('Clinical Consultation');
  const [doctorSearch, setDoctorSearch] = useState('');

  const refreshMessages = () => {
    if (!selectedDoctor) return;
    const conversation = store.getAdminDoctorConversation(currentAdmin.id, selectedDoctor.id);
    setMessages(conversation);
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setDoctors([...store.doctors]);
      if (selectedDoctor) {
        const refreshedConv = store.getAdminDoctorConversation(currentAdmin.id, selectedDoctor.id);
        setMessages(refreshedConv);
      }
    });
    return () => unsubscribe();
  }, [selectedDoctor, currentAdmin.id]);

  useEffect(() => {
    if (selectedDoctor) {
      refreshMessages();
    }
  }, [selectedDoctor]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedDoctor) return;

    store.sendAdminDoctorMessage({
      sender_id: currentAdmin.id,
      sender_name: currentAdmin.name,
      sender_role: 'admin',
      admin_type: currentAdmin.admin_type,
      receiver_id: selectedDoctor.id,
      receiver_name: selectedDoctor.full_name,
      receiver_role: 'doctor',
      message: newMessageText.trim(),
      category: selectedCategory,
      conversation_id: `conv_${currentAdmin.id}_${selectedDoctor.id}`
    });

    setNewMessageText('');
  };

  const filteredDoctors = doctors.filter(d => 
    d.full_name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    d.department?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const getUnreadCountForDoctor = (doctorId: string) => {
    return store.adminDoctorMessages.filter(
      m => m.sender_id === doctorId && m.receiver_id === currentAdmin.id && !m.is_read
    ).length;
  };

  return (
    <div className="w-full bg-[#0B1120] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[750px]">
      
      {/* Header Bar */}
      <div className="p-5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-b border-[#334155] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Private Doctor Communication Channel</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 border border-emerald-400/40 text-emerald-400">
                1-to-1 Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct administrative & clinical dispatch channel between <strong className="text-slate-200">{currentAdmin.name} (Hospital Administrator)</strong> and Hospital Doctors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshMessages}
            className="px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Doctor List (Left) + Chat Window (Right) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Sidebar: Doctor List */}
        <div className="w-full md:w-80 border-r border-[#1E293B] bg-[#070B14] flex flex-col">
          <div className="p-3 border-b border-[#1E293B]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctor by name / dept..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full text-xs py-2 pl-9 pr-3 rounded-xl bg-[#0F172A] border border-[#1E293B] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#1E293B]/60 p-2 space-y-1">
            {filteredDoctors.map(doc => {
              const isSelected = selectedDoctor?.id === doc.id;
              const unreadCount = getUnreadCountForDoctor(doc.id);

              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected 
                      ? 'bg-indigo-600/20 border border-indigo-500/50 shadow-md' 
                      : 'hover:bg-[#0F172A] border border-transparent'
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={doc.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'} 
                      alt={doc.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-[#334155]" 
                    />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#070B14] ${
                      doc.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {doc.full_name}
                      </p>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {doc.specialization || doc.department}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      Room: {doc.room_no || 'OPD-101'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area: Conversation Stream */}
        <div className="flex-1 flex flex-col bg-[#0B1120]">
          {selectedDoctor ? (
            <>
              {/* Doctor Conversation Header */}
              <div className="p-4 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedDoctor.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'} 
                    alt={selectedDoctor.full_name} 
                    className="w-11 h-11 rounded-full object-cover border border-sky-400/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{selectedDoctor.full_name}</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                        {selectedDoctor.department}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {selectedDoctor.qualification} • Shift: {selectedDoctor.shift_hours || '09:00 AM - 02:00 PM'} • Room: {selectedDoctor.room_no}
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    ID: {selectedDoctor.id}
                  </span>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <div className="w-14 h-14 rounded-full bg-[#1E293B] flex items-center justify-center text-slate-400 mb-3">
                      <MessageSquare className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-bold text-slate-300">No previous messages with {selectedDoctor.full_name}</p>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Start a secure 1-to-1 conversation regarding clinical updates, ICU transfers, schedule adjustments, or emergency protocols.
                    </p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isFromAdmin = msg.sender_role === 'admin';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isFromAdmin ? 'items-end' : 'items-start'}`}
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
                            isFromAdmin
                              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
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
                {/* Category Selector Chips */}
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
                          ? 'bg-indigo-600 text-white border-indigo-500'
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
                    placeholder={`Message ${selectedDoctor.full_name}...`}
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 text-xs py-3 px-4 rounded-xl bg-[#070B14] border border-[#334155] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessageText.trim()}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Select a doctor from the left to start direct private messaging.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
