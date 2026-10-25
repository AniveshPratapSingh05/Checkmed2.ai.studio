import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Clock, 
  Sparkles, 
  MapPin, 
  Zap, 
  Bell, 
  Play, 
  Volume2, 
  ChevronRight, 
  User, 
  ArrowRight,
  Sliders,
  CheckCircle2,
  QrCode
} from 'lucide-react';
import { Token, Patient, Doctor } from '../../types';
import { store } from '../../lib/store';

interface LiveQueueViewProps {
  tokens: Token[];
  currentPatient?: Patient | null;
  onOpenQrPass?: () => void;
}

export const LiveQueueView: React.FC<LiveQueueViewProps> = ({ tokens, currentPatient = null, onOpenQrPass }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(store.doctors);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(store.soundEnabled);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setDoctors([...store.doctors]);
      setSoundEnabled(store.soundEnabled);
    });
    return unsubscribe;
  }, []);

  const patientTokens = currentPatient 
    ? tokens.filter(t => t.patient_id === currentPatient.id)
    : [];

  return (
    <div className="space-y-6">
      
      {/* Patient's Active Queue Token Display & Interactive Controls */}
      <div className="bg-[#1E293B] text-[#F8FAFC] rounded-2xl p-6 shadow-xl border border-[#334155] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0EA5E9]/10 text-[#38BDF8] text-xs font-bold border border-[#0EA5E9]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8] animate-spin" />
              <span>Real-Time Live Queue & Approaching Toast System</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">OPD Token Queue & Toast Alerts</h2>
            <p className="text-xs text-[#94A3B8]">
              Track your OPD token in real-time. Dynamic queue speed calculations notify you automatically with toast alerts as your turn approaches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenQrPass && (
              <button
                onClick={onOpenQrPass}
                className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <QrCode className="w-4 h-4 text-amber-300" />
                <span>Reception QR Check-In</span>
              </button>
            )}

            <button
              onClick={() => store.simulateApproachingTokenAlert(currentPatient?.id)}
              className="px-4 py-2 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Simulate Token Approaching Toast</span>
            </button>

            <button
              onClick={() => store.toggleSound()}
              className="p-2 bg-[#0F172A] border border-[#334155] text-[#38BDF8] rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#1E293B]"
              title="Toggle Audio Notification Chime"
            >
              <Volume2 className={`w-4 h-4 ${soundEnabled ? 'text-[#10B981]' : 'text-slate-500'}`} />
              <span>{soundEnabled ? 'Chime ON' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Doctor Queue Processing Speed Controllers */}
        <div className="mt-6 p-4 rounded-xl bg-[#0F172A] border border-[#334155]">
          <div className="flex items-center justify-between pb-3 border-b border-[#334155]/60 mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Doctor Processing Speeds & Queue Pace
              </span>
            </div>
            <span className="text-[11px] text-[#94A3B8]">
              Adjusting speeds updates estimated wait times and triggers approaching toast alerts.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {doctors.slice(0, 3).map(doc => {
              const speed = store.getDoctorQueueSpeed(doc.id);
              const pace = speed <= 4 ? 'Fast (⚡)' : speed <= 8 ? 'Normal (⏱️)' : 'Slow (🐢)';

              return (
                <div key={doc.id} className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{doc.full_name}</p>
                      <p className="text-[10px] text-[#94A3B8]">{doc.department} - {doc.room_no}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full border border-[#F59E0B]/30">
                      {pace}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-slate-300 font-mono">
                      Speed: <strong>{speed} mins/pt</strong>
                    </span>

                    <div className="flex items-center gap-1">
                      {[3, 5, 8].map(s => (
                        <button
                          key={s}
                          onClick={() => store.setDoctorQueueSpeed(doc.id, s)}
                          className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                            speed === s
                              ? 'bg-[#0EA5E9] text-white border-[#0EA5E9]'
                              : 'bg-[#0F172A] text-[#94A3B8] border-[#334155] hover:text-white'
                          }`}
                        >
                          {s}m
                        </button>
                      ))}

                      <button
                        onClick={() => store.callNextToken(doc.id)}
                        className="ml-2 px-2 py-1 bg-[#10B981] hover:bg-[#059669] text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-xs"
                        title="Advance Queue (Call Next Token)"
                      >
                        Call Next <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Token Cards for Current Patient */}
        <div className="mt-6 pt-6 border-t border-[#334155]">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#38BDF8]" /> Your OPD Tokens ({patientTokens.length})
          </h3>

          {patientTokens.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patientTokens.map(token => {
                const isApproaching = token.status === 'Waiting' && (token.queue_position <= 3 || token.estimated_time_mins <= 15);

                return (
                  <div 
                    key={token.id}
                    className={`p-5 rounded-2xl border transition-all relative ${
                      token.status === 'Serving' 
                        ? 'bg-[#0F172A] border-[#10B981] ring-2 ring-[#10B981]/50 shadow-lg' 
                        : isApproaching
                        ? 'bg-[#0F172A] border-[#F59E0B] ring-1 ring-[#F59E0B]/30'
                        : 'bg-[#0F172A] border-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#38BDF8]">{token.department}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        token.status === 'Serving'
                          ? 'bg-[#10B981] text-white animate-pulse'
                          : isApproaching
                          ? 'bg-[#F59E0B] text-slate-900 font-black animate-pulse'
                          : 'bg-[#334155] text-[#94A3B8]'
                      }`}>
                        {token.status === 'Serving' ? (
                          'NOW SERVING - PROCEED TO ROOM'
                        ) : isApproaching ? (
                          <>
                            <Bell className="w-3 h-3 text-slate-900" />
                            APPROACHING - READY SOON
                          </>
                        ) : (
                          token.status
                        )}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-3xl font-black font-mono tracking-tight transition-all ${
                            token.status === 'Serving'
                              ? 'text-[#10B981] animate-pulse drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                              : isApproaching
                              ? 'text-[#F59E0B] animate-pulse'
                              : 'text-[#F8FAFC]'
                          }`}>
                            {token.token_number}
                          </p>

                          {token.status === 'Serving' && (
                            <span className="relative flex h-3.5 w-3.5" title="Now Serving - Your Turn!">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-80"></span>
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#10B981] border border-white/20"></span>
                            </span>
                          )}

                          {isApproaching && token.status !== 'Serving' && (
                            <span className="relative flex h-2.5 w-2.5" title="Turn Approaching Soon">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F59E0B]"></span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#94A3B8] font-medium mt-1">{token.doctor_name}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-[#94A3B8]">Consultation Room</p>
                        <p className="text-lg font-bold text-[#38BDF8] flex items-center gap-1 justify-end">
                          <MapPin className="w-4 h-4 text-[#38BDF8]" /> {token.room_no}
                        </p>
                      </div>
                    </div>

                    {token.status === 'Waiting' && (
                      <div className="mt-4 pt-3 border-t border-[#334155] flex flex-wrap items-center justify-between gap-2 text-xs text-[#94A3B8]">
                        {token.estimated_time_mins > 0 ? (
                          <span className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1 rounded-lg border border-[#334155]">
                            <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                            Est. Wait: <strong className="text-white font-mono font-black">~{token.estimated_time_mins} mins</strong>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Next in Line
                          </span>
                        )}
                        <span className="bg-[#1E293B] px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#38BDF8] border border-[#334155] ml-auto">
                          Position: #{token.queue_position} in line
                        </span>
                      </div>
                    )}

                    {token.status === 'Serving' && (
                      <div className="mt-4 p-2.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl text-xs font-bold text-[#10B981] text-center">
                        📢 Doctor is calling Token {token.token_number}! Please report to {token.room_no}.
                      </div>
                    )}

                    {onOpenQrPass && (
                      <div className="mt-3 pt-2 border-t border-[#334155]/60 flex items-center justify-end">
                        <button
                          onClick={onOpenQrPass}
                          className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-sky-400/30 text-sky-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-sky-400"
                        >
                          <QrCode className="w-3.5 h-3.5 text-amber-300" />
                          <span>Show Reception Scan Pass</span>
                        </button>
                      </div>
                    )}

                    {isApproaching && (
                      <div className="mt-3 p-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl text-[11px] font-bold text-[#F59E0B] flex items-center justify-between">
                        <span>🔔 Toast Alert Sent! Position #{token.queue_position} in line.</span>
                        <span className="underline cursor-pointer" onClick={() => store.evaluateQueueToasts(true)}>
                          Re-trigger Chime
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-[#94A3B8] space-y-2">
              <Ticket className="w-10 h-10 text-[#38BDF8] mx-auto opacity-80" />
              <p className="text-sm font-bold text-[#F8FAFC]">No active OPD tokens for current patient.</p>
              <p className="text-xs text-[#94A3B8]">Click 'Simulate Token Approaching Toast' above to test the live toast alert!</p>
            </div>
          )}
        </div>
      </div>

      {/* Hospital-Wide OPD Live Queue Board */}
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Hospital-Wide OPD Queue Monitor</h3>
            <p className="text-xs text-[#94A3B8]">Live monitor across all active OPD consulting rooms.</p>
          </div>

          <button
            onClick={() => store.evaluateQueueToasts(true)}
            className="px-3 py-1.5 bg-[#0F172A] border border-[#334155] hover:border-[#0EA5E9] text-[#38BDF8] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Re-evaluate Toast Triggers
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.length > 0 ? (
            tokens.map(t => (
              <div 
                key={t.id}
                className="p-4 rounded-xl border border-[#334155] bg-[#0F172A] flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold font-mono transition-all flex items-center gap-1.5 ${
                      t.status === 'Serving'
                        ? 'text-[#10B981] animate-pulse font-extrabold drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'text-[#38BDF8]'
                    }`}>
                      {t.token_number}
                      {t.status === 'Serving' && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-80"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                        </span>
                      )}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'Serving' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 animate-pulse' :
                      t.status === 'Waiting' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30' :
                      'bg-[#334155] text-[#94A3B8]'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#F8FAFC]">{t.patient_name}</p>
                  <p className="text-[11px] text-[#94A3B8]">{t.doctor_name} ({t.department})</p>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Room</span>
                  <span className="text-xs font-bold text-[#38BDF8] bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 px-2 py-1 rounded-md">
                    {t.room_no}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#94A3B8] col-span-full py-6 text-center">No active queue tokens in the system.</p>
          )}
        </div>
      </div>

    </div>
  );
};
