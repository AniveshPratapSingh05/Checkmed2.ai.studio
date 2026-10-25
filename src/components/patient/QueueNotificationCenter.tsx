import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Trash2, 
  CheckCheck, 
  Clock, 
  Zap, 
  Sparkles, 
  MapPin, 
  Volume2, 
  VolumeX,
  Play
} from 'lucide-react';
import { QueueToastNotification } from '../../types';
import { store } from '../../lib/store';

interface QueueNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToQueue?: () => void;
}

export const QueueNotificationCenter: React.FC<QueueNotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigateToQueue
}) => {
  const [notifications, setNotifications] = useState<QueueToastNotification[]>(store.queueNotifications);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(store.soundEnabled);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setNotifications([...store.queueNotifications]);
      setSoundEnabled(store.soundEnabled);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#1E293B] text-[#F8FAFC] h-full shadow-2xl border-l border-[#334155] flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-5 border-b border-[#334155] flex items-center justify-between bg-[#0F172A]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#0EA5E9]/10 text-[#38BDF8] border border-[#0EA5E9]/30">
              <Bell className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Queue Alerts & Toasts
                <span className="text-xs bg-[#0EA5E9] text-white px-2 py-0.5 rounded-full font-bold">
                  {notifications.length}
                </span>
              </h2>
              <p className="text-[11px] text-[#94A3B8]">Real-time live OPD token approaching alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => store.toggleSound()}
              className="p-1.5 rounded-xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white"
              title="Toggle Alert Sounds"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#10B981]" /> : <VolumeX className="w-4 h-4 text-[#94A3B8]" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of Notification History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all ${
                  n.type === 'now_serving'
                    ? 'bg-[#0F172A] border-[#10B981] ring-1 ring-[#10B981]/40'
                    : n.type === 'approaching'
                    ? 'bg-[#0F172A] border-[#F59E0B]/50'
                    : 'bg-[#0F172A] border-[#334155]'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]/50">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      n.type === 'now_serving'
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                        : n.type === 'approaching'
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                        : 'bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/40'
                    }`}>
                      {n.title}
                    </span>
                    <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-md border ${
                      n.type === 'now_serving'
                        ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50 animate-pulse flex items-center gap-1'
                        : 'bg-[#0F172A] text-[#38BDF8] border-[#334155]'
                    }`}>
                      {n.tokenNumber}
                      {n.type === 'now_serving' && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-80"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] font-mono">{n.timestamp}</span>
                </div>

                <div className="mt-2 space-y-1">
                  <p className="text-xs text-white font-semibold">{n.message}</p>
                  <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1">
                    <span className="flex items-center gap-1 text-[#38BDF8] font-bold">
                      <MapPin className="w-3 h-3 text-[#38BDF8]" /> Room {n.roomNo}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Zap className="w-3 h-3 text-[#F59E0B]" /> {n.processingSpeedMinsPerPatient}m/pt speed
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-[#94A3B8] space-y-3">
              <Bell className="w-10 h-10 text-[#38BDF8] mx-auto opacity-50" />
              <p className="text-sm font-bold text-white">No queue notifications yet</p>
              <p className="text-xs text-[#94A3B8] max-w-xs mx-auto">
                Notifications will automatically trigger here as your token approaches the doctor's room.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#334155] bg-[#0F172A] space-y-2">
          <button
            onClick={() => {
              store.simulateApproachingTokenAlert();
            }}
            className="w-full py-2.5 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:brightness-110 cursor-pointer"
          >
            <Play className="w-4 h-4" /> Simulate Live Token Approaching Toast
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => store.clearAllQueueNotifications()}
              className="flex-1 py-2 bg-[#1E293B] border border-[#334155] text-[#94A3B8] hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
            <button
              onClick={() => {
                onClose();
                if (onNavigateToQueue) onNavigateToQueue();
              }}
              className="flex-1 py-2 bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] hover:bg-[#10B981]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" /> View Queue Board
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
