import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  PhoneCall, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  User, 
  ShieldAlert, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Truck, 
  MessageSquare, 
  Sparkles,
  MapPin,
  Languages
} from 'lucide-react';
import { Ambulance } from '../../types';

interface AmbulanceDriverCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambulance?: {
    driver_name: string;
    driver_phone: string;
    vehicle_number?: string;
    vehicle_no?: string;
    type?: string;
    hospital_name?: string;
    location?: string;
    currentEtaMinutes?: number;
  } | Ambulance | null;
  initialQuestion?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'driver';
  text: string;
  textEn?: string;
  timestamp: string;
}

export const AmbulanceDriverCallModal: React.FC<AmbulanceDriverCallModalProps> = ({
  isOpen,
  onClose,
  ambulance,
  initialQuestion
}) => {
  const driverName = ambulance?.driver_name || 'Ramesh Yadav';
  const driverPhone = ambulance?.driver_phone || '+91 98765 43210';
  const vehicleNo = ('vehicle_number' in (ambulance || {})) 
    ? (ambulance as any).vehicle_number 
    : (ambulance as any)?.vehicle_no || 'DL-01-EM-4029';
  const vehicleType = ambulance?.type || 'Advance ICU Life Support';
  const hospital = ambulance?.hospital_name || 'Checkmed Central Emergency';

  const [languageMode, setLanguageMode] = useState<'hindi' | 'english'>('hindi');
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isDriverSpeaking, setIsDriverSpeaking] = useState<boolean>(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Play realistic phone ringtone using Web Audio API
  const startRingingTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const playRingBurst = () => {
        if (!ctx || ctx.state === 'closed') return;
        
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        // Standard telephone ring frequency mix (400Hz + 450Hz)
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(400, ctx.currentTime);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(450, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + 1.2);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.3);
        osc2.stop(ctx.currentTime + 1.3);
      };

      playRingBurst();
      ringIntervalRef.current = setInterval(playRingBurst, 3000);
    } catch {
      // Audio context fallback
    }
  };

  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  // Play Radio / Walkie Talkie Beep Sound
  const playRadioBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // ignore
    }
  };

  // Speak driver's dialogue using clean SpeechSynthesis
  const speakDriverVoice = (textToSpeak: string, lang: 'hindi' | 'english' = languageMode) => {
    if (!isSpeakerOn) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        playRadioBeep();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const voices = window.speechSynthesis.getVoices();
        
        if (lang === 'hindi') {
          // Find Hindi voice
          const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.lang.includes('hi_IN'));
          if (hiVoice) {
            utterance.voice = hiVoice;
            utterance.lang = hiVoice.lang;
          } else {
            const inVoice = voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
            if (inVoice) {
              utterance.voice = inVoice;
              utterance.lang = inVoice.lang;
            }
          }
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
        } else {
          // English voice
          const enVoice = voices.find(v => (v.lang.includes('en-IN') || v.lang.includes('en-US') || v.lang.includes('en-GB')));
          if (enVoice) {
            utterance.voice = enVoice;
            utterance.lang = enVoice.lang;
          }
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
        }

        utterance.volume = 1.0;

        utterance.onstart = () => {
          setIsDriverSpeaking(true);
        };

        utterance.onend = () => {
          setIsDriverSpeaking(false);
        };

        utterance.onerror = () => {
          setIsDriverSpeaking(false);
        };

        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 120);
      }
    } catch {
      setIsDriverSpeaking(false);
    }
  };

  // Initialize Call Flow
  useEffect(() => {
    if (!isOpen) return;

    setCallStatus('ringing');
    setCallDuration(0);
    setIsDriverSpeaking(false);
    setMessages([]);

    startRingingTone();

    // Driver picks up after 2 seconds
    const connectTimer = setTimeout(() => {
      stopRingtone();
      setCallStatus('connected');

      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const userPrompt = languageMode === 'hindi'
        ? `नमस्ते ${driverName} जी, सब ठीक है न? आप कब तक पहुँच रहे हैं?`
        : `Hello Driver ${driverName}, is everything alright? When will you reach?`;

      setMessages([
        {
          id: '1',
          sender: 'user',
          text: userPrompt,
          timestamp: timeNow
        }
      ]);

      // Driver Immediate Clear Response
      setTimeout(() => {
        const driverReply = languageMode === 'hindi'
          ? "आप बिलकुल चिंता मत कीजिए, मरीज़ समय पर सुरक्षित अस्पताल पहुँच जाएगा। हमारा सायरन चालू है और रास्ता पूरी तरह साफ़ है।"
          : "Please do not worry at all, the patient will reach the hospital safely and on time! Emergency siren is on and we are proceeding rapidly.";

        setMessages(prev => [
          ...prev,
          {
            id: '2',
            sender: 'driver',
            text: driverReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        speakDriverVoice(driverReply, languageMode);
      }, 700);

    }, 2000);

    return () => {
      clearTimeout(connectTimer);
      stopRingtone();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, languageMode]);

  // Duration clock
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isDriverSpeaking]);

  const handleAskQuestion = (userText: string, driverReply: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'user',
        text: userText,
        timestamp: timeNow
      }
    ]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'driver',
          text: driverReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speakDriverVoice(driverReply, languageMode);
    }, 600);
  };

  const handleEndCall = () => {
    stopRingtone();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#0F172A] border border-[#38BDF8]/40 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-[#1E293B] via-[#152038] to-[#0F172A] p-4 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase text-slate-300 tracking-wider">
              Emergency Direct Intercom
            </span>
          </div>

          {/* Language Mode Toggle */}
          <div className="flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl border border-[#334155]">
            <button
              onClick={() => setLanguageMode('hindi')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                languageMode === 'hindi'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी (Hindi)
            </button>
            <button
              onClick={() => setLanguageMode('english')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                languageMode === 'english'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Driver Profile & Visualizer Strip */}
        <div className="p-5 bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-b border-[#334155]/80 text-center relative overflow-hidden">
          
          {/* Pulsating Signal Rings when ringing */}
          <div className="relative mx-auto w-24 h-24 mb-3">
            <div className={`w-full h-full rounded-full bg-gradient-to-tr from-sky-500 via-blue-600 to-emerald-400 p-1 flex items-center justify-center shadow-xl shadow-sky-500/20 ${
              isDriverSpeaking ? 'ring-4 ring-emerald-400/80 animate-pulse' : ''
            }`}>
              <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center text-white overflow-hidden relative">
                <User className="w-12 h-12 text-sky-400" />
                {isDriverSpeaking && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <Radio className="w-8 h-8 text-emerald-400 animate-spin" />
                  </div>
                )}
              </div>
            </div>
            
            {callStatus === 'ringing' && (
              <div className="absolute -inset-2 rounded-full border-2 border-sky-400 animate-ping opacity-60 pointer-events-none" />
            )}
          </div>

          <h3 className="text-xl font-black text-white flex items-center justify-center gap-2">
            <span>{driverName}</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
              On Duty Driver
            </span>
          </h3>
          
          <p className="text-xs text-sky-300 font-mono mt-0.5 font-bold">
            {vehicleNo} • {vehicleType}
          </p>

          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-red-400" /> Stationed at: <strong className="text-white font-medium">{hospital}</strong>
          </p>

          {/* Call Status / Timer indicator */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {callStatus === 'ringing' && (
              <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 animate-pulse">
                <PhoneCall className="w-3.5 h-3.5 animate-bounce" /> Connecting Driver Line...
              </span>
            )}

            {callStatus === 'connected' && (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Connected • {formatDuration(callDuration)}
                </span>
                
                {isDriverSpeaking ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-bold bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/50">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Speaking...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                    Channel Open
                  </span>
                )}
              </div>
            )}

            {callStatus === 'ended' && (
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full">
                Call Ended
              </span>
            )}
          </div>

          {/* Realtime Audio Waveform Visualizer */}
          {callStatus === 'connected' && (
            <div className="mt-3 flex items-center justify-center gap-1 h-5">
              {[40, 70, 95, 60, 85, 100, 75, 45, 90, 65, 35, 80, 55, 95, 40].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isDriverSpeaking 
                      ? 'bg-emerald-400 animate-pulse' 
                      : 'bg-sky-500/30'
                  }`}
                  style={{
                    height: isDriverSpeaking ? `${Math.max(6, (height * Math.random()) + 5)}px` : '4px',
                    animationDelay: `${i * 0.08}s`
                  }}
                />
              ))}
            </div>
          )}

        </div>

        {/* Live Audio Dialogue Subtitle Transcript */}
        <div 
          ref={chatScrollRef}
          className="p-4 space-y-3 overflow-y-auto max-h-[220px] bg-[#0A0F1D]/80 border-b border-[#334155]"
        >
          {messages.length === 0 && callStatus === 'ringing' && (
            <div className="text-center py-6 text-slate-500 text-xs italic">
              Connecting with emergency ambulance team...
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-bold text-slate-400">
                  {msg.sender === 'user' ? 'You (Caller)' : `Driver ${driverName}`}
                </span>
                <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
              </div>
              
              <div
                className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-none font-medium'
                    : 'bg-[#1E293B] text-emerald-200 border border-emerald-500/30 rounded-tl-none font-semibold'
                }`}
              >
                {msg.sender === 'driver' && (
                  <p className="text-[10px] text-amber-300 font-bold uppercase mb-0.5 flex items-center gap-1">
                    <Radio className="w-3 h-3" /> Driver Audio Response
                  </p>
                )}
                "{msg.text}"
              </div>
            </div>
          ))}

          {isDriverSpeaking && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pl-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Driver is speaking now...</span>
            </div>
          )}
        </div>

        {/* Quick Conversation Questions */}
        {callStatus === 'connected' && (
          <div className="p-3 bg-[#0F172A] border-b border-[#334155]">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-sky-400" /> Tap to Ask Driver ({languageMode === 'hindi' ? 'शुद्ध हिन्दी' : 'English'}):
            </p>
            
            <div className="flex flex-wrap gap-1.5">
              {languageMode === 'hindi' ? (
                <>
                  <button
                    onClick={() => handleAskQuestion(
                      "सब ठीक है न? मरीज़ को कोई परेशानी तो नहीं होगी?",
                      "आप बिलकुल चिंता मत कीजिए, मरीज़ समय पर सुरक्षित पहुँच जाएगा! हमारे साथ आपातकालीन पैरामेडिक टीम मौजूद है।"
                    )}
                    className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-sky-500/30 text-sky-200 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" /> "सब ठीक है न?"
                  </button>

                  <button
                    onClick={() => handleAskQuestion(
                      "आप अभी कहाँ तक पहुँचे हैं?",
                      "हम मुख्य बाईपास से निकल चुके हैं और अगले 3 से 4 मिनट में आपके पते पर पहुँच रहे हैं।"
                    )}
                    className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-200 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    📍 "कहाँ तक पहुँचे?"
                  </button>

                  <button
                    onClick={() => handleAskQuestion(
                      "क्या एम्बुलेंस में ऑक्सीजन और आईसीयू सुविधा तैयार है?",
                      "हाँ, ऑक्सीजन सिलेंडर, वेंटिलेटर और जीवन रक्षक दवाइयाँ पूरी तरह तैयार हैं।"
                    )}
                    className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-200 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    🩺 "ऑक्सीजन तैयार है?"
                  </button>

                  <button
                    onClick={() => handleAskQuestion(
                      "क्या रास्ते में कोई ट्रैफ़िक की समस्या है?",
                      "जी नहीं, आपातकालीन ग्रीन कॉरिडोर सक्रिय है, हम बिना किसी रुकावट के तीव्र गति से आ रहे हैं।"
                    )}
                    className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-200 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    🚦 "ट्रैफ़िक तो नहीं है?"
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAskQuestion(
                      "Is everything under control? Will we reach on time?",
                      "Do not worry at all! The patient will reach the hospital on time safely. Paramedics are actively monitoring."
                    )}
                    className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-sky-500/30 text-sky-200 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" /> "Is everything fine?"
                  </button>

                  <button
                    onClick={() => handleAskQuestion(
                      "What is your current location and ETA?",
                      "We have crossed the main expressway and are arriving at your location in approximately 3 to 4 minutes."
                    )}
                    className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-200 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    📍 "Current ETA?"
                  </button>

                  <button
                    onClick={() => handleAskQuestion(
                      "Is oxygen and life support ready in the vehicle?",
                      "Yes, high-flow oxygen, ventilator support, and emergency medical kits are fully prepared."
                    )}
                    className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-200 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    🩺 "Oxygen ready?"
                  </button>

                  <button
                    onClick={() => handleAskQuestion(
                      "Is there any traffic delay on the route?",
                      "Negative, the emergency traffic green-corridor is active and our route is completely clear."
                    )}
                    className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-200 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                  >
                    🚦 "Any traffic?"
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Bottom Call Controls */}
        <div className="p-4 bg-[#1E293B]/80 flex items-center justify-around">
          
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
              isMuted 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-[#0F172A] text-slate-300 hover:text-white border border-[#334155]'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5 text-amber-300" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call Button (Big Red) */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 transition-transform active:scale-90 cursor-pointer"
            title="End Emergency Call"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => {
              const nextState = !isSpeakerOn;
              setIsSpeakerOn(nextState);
              if (!nextState && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
              isSpeakerOn 
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
                : 'bg-[#0F172A] text-slate-400 border border-[#334155]'
            }`}
            title={isSpeakerOn ? 'Turn Off Speaker' : 'Turn On Speaker'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5 text-sky-400" /> : <VolumeX className="w-5 h-5" />}
          </button>

        </div>

      </div>
    </div>
  );
};
