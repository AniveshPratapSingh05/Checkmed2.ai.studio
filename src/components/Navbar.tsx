import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  User, 
  UserPlus,
  ShieldCheck, 
  Database, 
  PhoneCall, 
  Users, 
  Activity, 
  LogOut, 
  ChevronDown,
  Menu,
  X,
  Laptop,
  Bell,
  Zap,
  Stethoscope,
  Sun,
  Moon,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { store } from '../lib/store';
import { UserRole, Patient } from '../types';
import { QueueToastContainer } from './patient/QueueToastContainer';
import { QueueNotificationCenter } from './patient/QueueNotificationCenter';

interface NavbarProps {
  onOpenAuth: (defaultRole?: UserRole) => void;
  onOpenSupabase: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onSwitchAccount?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenSupabase,
  activeView,
  setActiveView,
  onSwitchAccount
}) => {
  const [role, setRole] = useState<UserRole>(store.activeRole);
  const [currentUser, setCurrentUser] = useState<Patient | null>(store.currentUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [showQueueCenter, setShowQueueCenter] = useState(false);
  const [notificationCount, setNotificationCount] = useState<number>(store.queueNotifications.length);
  const [theme, setTheme] = useState<'dark' | 'light'>(store.theme);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setRole(store.activeRole);
      setCurrentUser(store.currentUser);
      setNotificationCount(store.queueNotifications.length);
      setTheme(store.theme);
    });
    return unsubscribe;
  }, []);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#0B1120]/90 backdrop-blur-2xl border-b border-[#334155]/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Top-Left Back Button */}
          <div className="flex items-center gap-3">
            {activeView === 'patient-portal' && (
              <button
                id="patient-header-top-back-btn"
                onClick={() => setActiveView('landing')}
                className="px-3.5 py-2 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] hover:border-sky-500/40 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Back to Landing Overview"
              >
                <ArrowLeft className="w-4 h-4 text-sky-400" />
                <span>Back</span>
              </button>
            )}

            <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => setActiveView('landing')}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white font-black text-lg shadow-xl shadow-[#0284C7]/40 ring-2 ring-[#38BDF8]/50 group-hover:scale-105 transition-all">
                <HeartPulse className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                    Checkmed<span className="text-[#38BDF8]">.</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-black bg-gradient-to-r from-[#EF4444]/30 via-[#F59E0B]/30 to-[#0EA5E9]/30 text-[#FBBF24] border border-[#F59E0B]/60 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm shadow-[#F59E0B]/20">
                    <Zap className="w-2.5 h-2.5 text-[#FBBF24] fill-[#FBBF24]" />
                    <span>By Late X</span>
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Multi-Specialty Smart Hospital Network
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#1E293B]/90 p-1.5 rounded-2xl border border-[#334155] shadow-xl backdrop-blur-md">
            <button
              id="nav-home-btn"
              onClick={() => setActiveView('landing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'landing' 
                  ? 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white shadow-lg shadow-[#0284C7]/40 ring-1 ring-[#38BDF8]' 
                  : 'text-slate-300 hover:text-white hover:bg-[#334155]/70'
              }`}
            >
              <Activity className="w-4 h-4 text-[#38BDF8]" />
              Overview
            </button>
            <button
              id="nav-map-btn"
              onClick={() => {
                if (activeView !== 'landing') {
                  setActiveView('landing');
                  setTimeout(() => {
                    const el = document.getElementById('nearby-hospitals-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                } else {
                  const el = document.getElementById('nearby-hospitals-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-black text-sky-300 hover:text-white hover:bg-[#334155]/70 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#38BDF8]" />
              Nearby Hospitals (Map)
            </button>
            <button
              id="nav-patient-btn"
              onClick={() => {
                store.setRole('patient');
                setActiveView('patient-portal');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                role === 'patient' && activeView.startsWith('patient')
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/40 ring-1 ring-emerald-400' 
                  : 'text-slate-300 hover:text-white hover:bg-[#334155]/70'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              Patient Portal
            </button>
          </nav>

          {/* Action Tools & User Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* System-Wide Theme Toggle Button */}
            <button
              id="btn-theme-toggle"
              onClick={() => store.toggleTheme()}
              className="relative p-2.5 rounded-2xl bg-[#1E293B] border border-[#334155] text-amber-400 hover:text-amber-300 hover:bg-[#334155] hover:border-amber-400/50 transition-all cursor-pointer group shadow-md flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Live Queue Toast & Bell Notifications */}
            <button
              id="btn-queue-notifications"
              onClick={() => setShowQueueCenter(true)}
              className="relative p-2.5 rounded-2xl bg-[#1E293B] border border-[#334155] text-[#38BDF8] hover:bg-[#334155] hover:border-[#38BDF8]/60 transition-all cursor-pointer group shadow-md"
              title="View OPD Live Queue Notifications"
            >
              <Bell className="w-4 h-4 text-[#38BDF8] group-hover:scale-110 transition-transform" />
              {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0F172A] shadow-md shadow-amber-400/50 animate-bounce">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Database & Supabase Connect */}
            <button
              id="btn-supabase-setup"
              onClick={onOpenSupabase}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-sky-300 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 rounded-2xl transition-all cursor-pointer shadow-sm hover:border-sky-400"
              title="View Supabase Config & Export SQL Schema"
            >
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Database / SQL</span>
            </button>

            {/* Emergency Hotline */}
            <a 
              href="tel:108" 
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-rose-600 to-rose-500 border border-rose-400/50 rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-rose-600/30 ring-1 ring-rose-400/40"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white animate-bounce" />
              <span>ER: 108</span>
            </a>

            {/* Patient Auth / User Badge */}
            {role === 'patient' && currentUser ? (
              <div className="relative">
                <button
                  id="btn-user-dropdown"
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#1E293B] border border-[#38BDF8]/40 text-white hover:bg-[#334155] transition-all text-xs font-bold cursor-pointer shadow-md"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center font-black text-[11px] shadow-sm">
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate font-black">{currentUser.full_name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#38BDF8]" />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#1E293B] rounded-2xl shadow-2xl border border-[#38BDF8]/40 py-2 z-50 animate-scale-up">
                    <div className="px-4 py-2 border-b border-[#334155]">
                      <p className="text-xs font-black text-white">{currentUser.full_name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-black text-[#38BDF8] bg-[#0284C7]/20 px-2 py-0.5 rounded-md border border-[#38BDF8]/40">
                        Blood: {currentUser.blood_group} | Age: {currentUser.age}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveView('patient-portal');
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-white hover:bg-[#334155] flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
                      My Health Dashboard
                    </button>
                    <button
                      onClick={() => {
                        if (onSwitchAccount) {
                          onSwitchAccount();
                        } else {
                          store.switchAccount();
                          setActiveView('welcome');
                        }
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 border-t border-[#334155] mt-1 cursor-pointer font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Switch Account / Role
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-switch-account-header"
                  onClick={() => {
                    if (onSwitchAccount) {
                      onSwitchAccount();
                    } else {
                      store.switchAccount();
                      setActiveView('welcome');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-2xl transition-all cursor-pointer shadow-sm"
                  title="Switch to another role or account"
                >
                  <span>🔄 Role Portal</span>
                </button>
                <button
                  id="btn-login-modal"
                  onClick={() => onOpenAuth('login' as any)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-slate-200 hover:text-white bg-[#1E293B] hover:bg-[#334155] border border-[#334155] rounded-2xl transition-all cursor-pointer shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-[#38BDF8]" />
                  Login
                </button>
                <button
                  id="btn-signup-modal"
                  onClick={() => onOpenAuth('register' as any)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 rounded-2xl shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/40 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              id="btn-mobile-quick-theme-toggle"
              onClick={() => store.toggleTheme()}
              className="p-2.5 rounded-2xl bg-[#1E293B] border border-[#334155] text-amber-400 hover:bg-[#334155] cursor-pointer shadow-md flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-400" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-[#1E293B] text-slate-300 hover:text-white hover:bg-[#334155] border border-[#334155] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#334155] bg-[#0F172A] px-4 py-4 space-y-3 shadow-2xl">
          {/* Mobile Theme Toggle Button */}
          <button
            id="btn-mobile-theme-toggle"
            onClick={() => store.toggleTheme()}
            className="w-full py-3 text-xs font-black text-amber-300 bg-amber-500/10 rounded-2xl border border-amber-400/40 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:bg-amber-500/20"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to High-Contrast Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Switch to Dark Mode</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setActiveView('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm font-black text-white rounded-2xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] flex items-center gap-2.5 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-[#38BDF8]" />
            Overview & Landing
          </button>
          <button
            onClick={() => {
              if (activeView !== 'landing') {
                setActiveView('landing');
                setTimeout(() => {
                  const el = document.getElementById('nearby-hospitals-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              } else {
                const el = document.getElementById('nearby-hospitals-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm font-black text-sky-300 rounded-2xl bg-sky-950/50 hover:bg-sky-900/50 border border-sky-500/40 flex items-center gap-2.5 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#38BDF8]" />
            Nearby Hospitals & Clinics (Map)
          </button>
          <button
            onClick={() => {
              store.setRole('patient');
              setActiveView('patient-portal');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm font-black text-white rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center gap-2.5 shadow-lg shadow-emerald-600/30 cursor-pointer"
          >
            <Users className="w-4 h-4 text-white" />
            Patient Portal
          </button>
          <div className="pt-2 border-t border-[#334155] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenSupabase();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-xs font-black text-sky-300 bg-sky-500/10 rounded-2xl border border-sky-400/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Database className="w-4 h-4 text-sky-400" />
              Database / Supabase Setup
            </button>
            <a
              href="tel:108"
              className="w-full py-3 text-xs font-black text-white bg-rose-600 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30"
            >
              <PhoneCall className="w-4 h-4" />
              Call Emergency ER 108
            </a>
          </div>
        </div>
      )}

      {/* Floating Live Toast Notification Container - Only on patient portal/landing, not in Admin Dashboard */}
      {activeView !== 'admin-dashboard' && (
        <QueueToastContainer
          activeView={activeView}
          onNavigateToQueue={() => {
            store.setRole('patient');
            setActiveView('patient-portal');
          }}
        />
      )}

      {/* Full Queue Notification Center Drawer */}
      <QueueNotificationCenter
        isOpen={showQueueCenter}
        onClose={() => setShowQueueCenter(false)}
        onNavigateToQueue={() => {
          store.setRole('patient');
          setActiveView('patient-portal');
        }}
      />
    </header>
  );
};
