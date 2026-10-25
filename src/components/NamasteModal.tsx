import React, { useState, useEffect } from 'react';
import { Sparkles, HeartPulse, UserPlus, ArrowRight, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface NamasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const NamasteModal: React.FC<NamasteModalProps> = ({
  isOpen,
  onClose,
  onOpenSignUp
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#1E293B] text-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#38BDF8]/40 overflow-hidden relative transform transition-all scale-100">
        
        {/* Glow Header */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 text-center border-b border-[#334155] relative">
          {/* Hands Folded Emoji & Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0EA5E9]/15 border border-[#38BDF8]/40 mb-3 shadow-lg shadow-[#0EA5E9]/20 text-3xl">
            🙏
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-xs uppercase tracking-widest font-black text-[#38BDF8]">Checkmed Healthcare Network</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Namaste! <span className="text-[#38BDF8] font-normal">(नमस्ते)</span>
          </h2>
          <p className="text-xs text-[#CBD5E1] mt-2 max-w-sm mx-auto leading-relaxed">
            Welcome to Checkmed Hospital Portal. Integrated emergency ICU beds, live ambulance GPS tracking & queue tokens for Kanpur, Gorakhpur, Prayagraj, Varanasi & Lucknow.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#0F172A] border border-[#334155] flex items-start gap-2.5">
              <span className="text-base">🚑</span>
              <div>
                <p className="font-bold text-white">Live GPS Ambulance</p>
                <p className="text-[10px] text-[#94A3B8]">Real-time route & ETA</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0F172A] border border-[#334155] flex items-start gap-2.5">
              <span className="text-base">🏥</span>
              <div>
                <p className="font-bold text-white">ICU & Bed Tracking</p>
                <p className="text-[10px] text-[#94A3B8]">Verified ventilator status</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0F172A] border border-[#334155] flex items-start gap-2.5">
              <span className="text-base">🎫</span>
              <div>
                <p className="font-bold text-white">Live OPD Tokens</p>
                <p className="text-[10px] text-[#94A3B8]">Zero waiting time</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0F172A] border border-[#334155] flex items-start gap-2.5">
              <span className="text-base">🩸</span>
              <div>
                <p className="font-bold text-white">Blood Bank & Meds</p>
                <p className="text-[10px] text-[#94A3B8]">Regional inventory lock</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-[#0284C7] hover:to-[#0369A1] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-[#0EA5E9]/25 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4 text-white" />
              Sign Up / Create Patient Account
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-[#0F172A] hover:bg-[#334155] text-[#CBD5E1] font-bold text-xs rounded-xl border border-[#334155] transition-all cursor-pointer text-center"
            >
              Continue to Hospital Directory & Live Portal ➔
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
