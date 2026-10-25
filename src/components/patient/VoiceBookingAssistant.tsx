import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Calendar, 
  Clock, 
  Stethoscope, 
  RotateCcw, 
  X, 
  ArrowRight,
  HelpCircle,
  Zap,
  MessageSquare,
  Activity
} from 'lucide-react';
import { Doctor, Appointment, Token } from '../../types';
import { store } from '../../lib/store';

interface VoiceBookingAssistantProps {
  onClose?: () => void;
  onBookingComplete?: (appointment: Appointment, token: Token) => void;
  initialDoctor?: Doctor | null;
  bookingForPatient?: {
    id: string;
    name: string;
    age?: number;
    phone?: string;
    blood_group?: string;
    health_issue?: string;
    relationship?: string;
  } | null;
}

export const VoiceBookingAssistant: React.FC<VoiceBookingAssistantProps> = ({
  onClose,
  onBookingComplete,
  initialDoctor,
  bookingForPatient
}) => {
  const doctors = store.doctors;
  const currentPatient = store.currentUser || store.patients[0];
  const targetPatientId = bookingForPatient?.id || currentPatient?.id || 'pat-1';
  const targetPatientName = bookingForPatient?.name || currentPatient?.full_name || 'Patient';

  // Selected State extracted from Voice
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(
    initialDoctor || doctors[0] || null
  );
  const [appointmentDate, setAppointmentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('10:30 AM');
  const [reason, setReason] = useState<string>('Routine consultation checkup');
  const [consultationType, setConsultationType] = useState<'In-Person' | 'Tele-Consultation'>('In-Person');

  // Voice Engine State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>('');
  const [lastSystemResponse, setLastSystemResponse] = useState<string>(
    `Welcome! I'm your Voice Booking Assistant. Say doctor's name or specialty (e.g. "Dr. Rajesh Sharma at 10:30 AM") to select.`
  );
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  const availableSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
    '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
      processVoiceInput(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  // Text-To-Speech Output Function
  const speakResponse = (text: string) => {
    setLastSystemResponse(text);
    if (!ttsEnabled || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Fallback for browsers without Web Speech API
      speakResponse("Microphone API not supported in this browser tab. You can use the Voice Command Buttons below!");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      try {
        setTranscript('');
        recognitionRef.current.start();
        setIsListening(true);
        speakResponse("I'm listening! Please state your preferred doctor, time slot, or say confirm booking.");
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Natural Language Voice Input Parser
  const processVoiceInput = (rawText: string) => {
    const text = rawText.toLowerCase().trim();
    if (!text) return;

    let matchedDoc: Doctor | null = null;
    let matchedSlot: string | null = null;
    let matchedDate: string | null = null;
    let isConfirmCommand = false;

    // 1. Doctor Matching
    for (const doc of doctors) {
      const lastName = doc.full_name.split(' ').pop()?.toLowerCase() || '';
      const firstName = doc.full_name.split(' ')[1]?.toLowerCase() || '';
      const dept = doc.department.toLowerCase();
      const spec = doc.specialization.toLowerCase();

      if (
        text.includes(doc.full_name.toLowerCase()) ||
        (lastName.length > 2 && text.includes(lastName)) ||
        (firstName.length > 2 && text.includes(firstName)) ||
        text.includes(dept) ||
        text.includes(spec)
      ) {
        matchedDoc = doc;
        break;
      }
    }

    if (matchedDoc && matchedDoc.id !== selectedDoctor?.id) {
      setSelectedDoctor(matchedDoc);
    }

    // 2. Time Slot Matching
    if (text.includes('9:00') || text.includes('9 am') || text.includes('nine am')) matchedSlot = '09:00 AM';
    else if (text.includes('9:30') || text.includes('nine thirty')) matchedSlot = '09:30 AM';
    else if (text.includes('10:00') || text.includes('10 am') || text.includes('ten am')) matchedSlot = '10:00 AM';
    else if (text.includes('10:30') || text.includes('ten thirty')) matchedSlot = '10:30 AM';
    else if (text.includes('11:00') || text.includes('11 am') || text.includes('eleven am')) matchedSlot = '11:00 AM';
    else if (text.includes('11:30') || text.includes('eleven thirty')) matchedSlot = '11:30 AM';
    else if (text.includes('2:00') || text.includes('2 pm') || text.includes('two pm')) matchedSlot = '02:00 PM';
    else if (text.includes('2:30') || text.includes('two thirty')) matchedSlot = '02:30 PM';
    else if (text.includes('3:00') || text.includes('3 pm') || text.includes('three pm')) matchedSlot = '03:00 PM';
    else if (text.includes('4:00') || text.includes('4 pm') || text.includes('four pm')) matchedSlot = '04:00 PM';

    if (matchedSlot) {
      setTimeSlot(matchedSlot);
    }

    // 3. Date Matching
    if (text.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchedDate = tomorrow.toISOString().split('T')[0];
      setAppointmentDate(matchedDate);
    } else if (text.includes('today')) {
      matchedDate = new Date().toISOString().split('T')[0];
      setAppointmentDate(matchedDate);
    }

    // 4. Consultation mode matching
    if (text.includes('video') || text.includes('tele') || text.includes('online')) {
      setConsultationType('Tele-Consultation');
    } else if (text.includes('in person') || text.includes('hospital') || text.includes('opd')) {
      setConsultationType('In-Person');
    }

    // 5. Symptoms/Reason extraction
    if (text.includes('for chest pain')) setReason('Chest discomfort & routine ECG check');
    else if (text.includes('for fever')) setReason('High fever and body ache');
    else if (text.includes('for checkup')) setReason('Routine health checkup');
    else if (text.includes('for headache')) setReason('Persistent headache and migraine');

    // 6. Confirmation Command Detection
    if (
      text.includes('confirm') || 
      text.includes('book now') || 
      text.includes('book it') || 
      text.includes('yes book') || 
      text.includes('proceed')
    ) {
      isConfirmCommand = true;
    }

    // Construct Vocal Response
    const activeDocName = matchedDoc ? matchedDoc.full_name : selectedDoctor?.full_name || 'Doctor';
    const activeSlotName = matchedSlot || timeSlot;

    if (isConfirmCommand) {
      executeVoiceBooking(matchedDoc || selectedDoctor, activeSlotName);
    } else if (matchedDoc || matchedSlot) {
      const msg = `Got it! Selected ${activeDocName} for ${activeSlotName}. Say "Confirm booking" to generate your OPD token!`;
      setLastSystemResponse(msg);
    }
  };

  // Execute Final Appointment & Token Generation
  const executeVoiceBooking = (docOverride?: Doctor | null, slotOverride?: string) => {
    const docToBook = docOverride || selectedDoctor || doctors[0];
    const slotToBook = slotOverride || timeSlot;

    if (!docToBook || !currentPatient) return;

    const { appointment, token } = store.bookAppointment({
      patient_id: targetPatientId,
      patient_name: targetPatientName,
      doctor_id: docToBook.id,
      appointment_date: appointmentDate,
      time_slot: slotToBook,
      reason,
      consultation_type: consultationType
    });

    setIsConfirmed(true);
    const confirmMsg = `🎉 OPD Token ${token.token_number} generated successfully for ${docToBook.full_name} at ${slotToBook}! Please check room ${token.room_no}.`;
    speakResponse(confirmMsg);

    if (onBookingComplete) {
      setTimeout(() => {
        onBookingComplete(appointment, token);
        if (onClose) onClose();
      }, 2000);
    }
  };

  // Sample Pre-baked Voice Trigger Commands for 1-Tap Voice Simulation
  const sampleVoiceCommands = [
    { label: 'Dr. Rajesh Sharma at 10:30 AM', query: 'Book Dr. Rajesh Sharma for cardiology at 10:30 AM tomorrow' },
    { label: 'Dr. Ananya Roy at 02:00 PM', query: 'Select Dr. Ananya Roy in Neurology at 2:00 PM for headache' },
    { label: 'Dr. Siddharth Verma at 11:00 AM', query: 'Book Orthopedics Dr. Siddharth Verma at 11:00 AM' },
    { label: 'Confirm Voice Booking', query: 'Confirm booking now' }
  ];

  return (
    <div className="bg-[#1E293B] text-[#F8FAFC] rounded-2xl border border-[#334155] shadow-2xl overflow-hidden max-w-xl w-full mx-auto animate-fade-in">
      
      {/* Voice Assistant Header */}
      <div className="bg-[#0F172A] p-5 border-b border-[#334155] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isListening 
              ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40 animate-pulse' 
              : 'bg-[#0EA5E9]/10 text-[#38BDF8] border-[#0EA5E9]/30'
          }`}>
            <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce text-[#10B981]' : 'text-[#38BDF8]'}`} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Voice-Controlled Booking Assistant
              <span className="text-[10px] bg-[#0EA5E9] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Voice AI
              </span>
            </h3>
            <p className="text-xs text-[#94A3B8]">Speak doctor name, slot, or reason to auto-fill booking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className="p-2 rounded-xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white"
            title={ttsEnabled ? 'Disable Voice Responses' : 'Enable Voice Responses'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-[#10B981]" /> : <VolumeX className="w-4 h-4 text-[#94A3B8]" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Microphone & Waveform Section */}
      <div className="p-6 bg-[#0F172A]/60 text-center space-y-4 border-b border-[#334155]">
        
        {/* Pulsing Mic Circle Button */}
        <div className="relative inline-block">
          {isListening && (
            <>
              <span className="absolute inset-0 rounded-full bg-[#10B981]/30 animate-ping"></span>
              <span className="absolute -inset-3 rounded-full bg-[#10B981]/15 animate-pulse"></span>
            </>
          )}

          <button
            onClick={toggleListening}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
              isListening
                ? 'bg-gradient-to-tr from-[#10B981] to-[#059669] text-white scale-105 ring-4 ring-[#10B981]/50'
                : 'bg-gradient-to-tr from-[#0EA5E9] to-[#0284C7] text-white hover:scale-105 ring-2 ring-[#0EA5E9]/40'
            }`}
          >
            <Mic className={`w-8 h-8 ${isListening ? 'animate-bounce' : ''}`} />
          </button>
        </div>

        <div>
          <p className="text-xs font-bold text-white uppercase tracking-wider">
            {isListening ? '🎙️ Listening... Speak Now!' : 'Click Microphone to Speak Voice Commands'}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1 max-w-sm mx-auto">
            Try saying: <strong className="text-[#38BDF8]">"Book Dr. Rajesh Sharma for cardiology at 10:30 AM"</strong> or <strong className="text-[#38BDF8]">"Confirm booking"</strong>
          </p>
        </div>

        {/* System Voice Feedback Banner */}
        <div className="p-3 bg-[#1E293B] border border-[#334155] rounded-xl text-xs text-[#F8FAFC] flex items-start gap-2.5 text-left shadow-xs">
          <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5 animate-spin" />
          <div>
            <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider block">Assistant Speech Feedback</span>
            <p className="font-medium">{lastSystemResponse}</p>
          </div>
        </div>

        {/* Live Speech Transcript */}
        {transcript && (
          <div className="p-2.5 bg-[#0F172A] border border-[#0EA5E9]/40 rounded-xl text-xs font-mono text-[#38BDF8] flex items-center justify-between">
            <span className="truncate">🗣️ Heard: "{transcript}"</span>
            <span className="text-[10px] bg-[#0EA5E9]/20 text-[#38BDF8] px-2 py-0.5 rounded font-bold uppercase">Live Voice</span>
          </div>
        )}
      </div>

      {/* Voice Extracted Booking Summary */}
      <div className="p-6 space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-[#334155]/60">
          <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#38BDF8]" /> Voice Extracted Booking State
          </span>
          <span className="text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
            Real-time Sync
          </span>
        </div>

        {/* Doctor Selection Preview */}
        <div>
          <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1">Selected Doctor</label>
          <div className="flex items-center justify-between p-3 bg-[#0F172A] border border-[#334155] rounded-xl">
            <div className="flex items-center gap-3">
              <img 
                src={selectedDoctor?.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'} 
                alt="" 
                className="w-10 h-10 rounded-xl object-cover border border-[#334155]"
              />
              <div>
                <p className="text-xs font-bold text-white">{selectedDoctor?.full_name}</p>
                <p className="text-[11px] text-[#38BDF8]">{selectedDoctor?.department} • Room {selectedDoctor?.room_no}</p>
              </div>
            </div>

            <select
              value={selectedDoctor?.id || ''}
              onChange={(e) => {
                const doc = doctors.find(d => d.id === e.target.value);
                if (doc) setSelectedDoctor(doc);
              }}
              className="text-[11px] bg-[#1E293B] text-slate-200 border border-[#334155] rounded-lg p-1.5 font-bold"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.full_name} ({d.department})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Time Slot Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1">Time Slot</label>
            <div className="p-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-xs font-bold text-[#38BDF8] flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#F59E0B]" /> {timeSlot}</span>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="text-[10px] bg-[#1E293B] text-slate-200 border border-[#334155] rounded p-1"
              >
                {availableSlots.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#94A3B8] uppercase mb-1">Appointment Date</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#0F172A] border border-[#334155] rounded-xl text-white font-bold"
            />
          </div>
        </div>

        {/* Sample Voice Triggers for 1-Click Simulation */}
        <div className="pt-2">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase block mb-1.5">
            ⚡ Quick Voice Simulation Presets (1-Tap Test):
          </span>
          <div className="grid grid-cols-2 gap-2">
            {sampleVoiceCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(cmd.query);
                  processVoiceInput(cmd.query);
                }}
                className="text-left text-[11px] p-2 bg-[#0F172A] hover:bg-[#334155] border border-[#334155] rounded-xl text-slate-300 font-semibold truncate transition-colors cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-[#F59E0B] shrink-0" />
                <span className="truncate">{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Voice Booking Action Button */}
        <div className="pt-2">
          <button
            onClick={() => executeVoiceBooking()}
            disabled={isConfirmed}
            className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isConfirmed
                ? 'bg-[#10B981] text-white cursor-default'
                : 'bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:brightness-110 text-white active:scale-95'
            }`}
          >
            {isConfirmed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" /> Voice Booking Confirmed! Token Generated
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" /> Speak "Confirm" or Click to Book Appointment
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
