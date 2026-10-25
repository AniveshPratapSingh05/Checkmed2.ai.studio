import React, { useState, useEffect } from 'react';
import { Doctor, DoctorNotification } from '../../types';
import { store } from '../../lib/store';
import { 
  Bell, ChevronDown, Check, Clock, Calendar, ArrowLeft, 
  Activity, Shield, User, Heart, Stethoscope, AlertCircle, CheckCircle2, LogOut,
  Sun, Moon 
} from 'lucide-react';

interface DoctorHeaderProps {
  doctor: Doctor;
  allDoctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
  onBackToHospital: () => void;
  onOpenNotifications?: () => void;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  doctor,
  allDoctors,
  onSelectDoctor,
  onBackToHospital
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(store.theme);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTheme(store.theme);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }) + ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Doctor Notifications
  const docNotifications = store.doctorNotifications.filter(
    n => !n.doctor_id || n.doctor_id === doctor.id
  );
  const unreadCount = docNotifications.filter(n => !n.read).length;

  const handleStatusChange = (status: Doctor['status']) => {
    store.updateDoctorAvailability(doctor.id, status);
    setShowStatusMenu(false);
  };

  const getStatusBadge = (status: Doctor['status']) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400 animate-pulse',
          label: 'Available (In OPD)'
        };
      case 'In Consultation':
        return {
          bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          label: 'In Consultation'
        };
      case 'On Break':
        return {
          bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          dot: 'bg-blue-400',
          label: 'On Break'
        };
      case 'Off Duty':
        return {
          bg: 'bg-red-500/20 text-red-400 border-red-500/30',
          dot: 'bg-red-400',
          label: 'Off Duty'
        };
      default:
        return {
          bg: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          dot: 'bg-slate-400',
          label: status
        };
    }
  };

  const statusConfig = getStatusBadge(doctor.status);

  return (
    <header className="bg-[#0F172A] border-b border-[#334155] sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Greeting & Doctor Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
              {doctor.avatar_url ? (
                <img
                  src={doctor.avatar_url}
                  alt={doctor.full_name}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{doctor.full_name.replace('Dr. ', '').charAt(0)}</span>
              )}
            </div>
            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0F172A] ${statusConfig.dot}`} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                🙏 Namaste, {doctor.full_name.startsWith('Dr.') ? doctor.full_name : `Dr. ${doctor.full_name}`}
              </h1>
              <span className="hidden md:inline text-xs font-bold text-emerald-400/80">• CheckMed Doctor Clinical Portal</span>
              <span className="text-emerald-400 text-xs font-mono font-semibold px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                {doctor.id}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400 mt-0.5">
              <span className="text-emerald-300 font-medium flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                {doctor.specialization} ({doctor.department})
              </span>
              <span>•</span>
              <span className="text-slate-300">Room: <strong>{doctor.room_no || 'OPD-102'}</strong></span>
              <span>•</span>
              <span className="text-slate-400 hidden lg:inline">{doctor.qualification || 'MBBS, MD'}</span>
            </div>
          </div>
        </div>

        {/* Right: Availability Toggle & Notifications */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto md:ml-0">
          
          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusMenu(!showStatusMenu);
                setShowNotifications(false);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${statusConfig.bg}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
              <span className="hidden sm:inline">{statusConfig.label}</span>
              <span className="sm:hidden">{doctor.status}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showStatusMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60">
                  Set Availability Status
                </div>
                {(['Available', 'In Consultation', 'On Break', 'Off Duty'] as Doctor['status'][]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className="w-full px-3 py-2 text-left hover:bg-[#334155] flex items-center justify-between text-slate-200 transition"
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${st === 'Available' ? 'bg-emerald-400' : st === 'In Consultation' ? 'bg-amber-400' : st === 'On Break' ? 'bg-blue-400' : 'bg-red-400'}`} />
                      {st}
                    </span>
                    {doctor.status === st && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowStatusMenu(false);
              }}
              className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] transition relative"
              title="Doctor Notifications"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-4 py-2 flex items-center justify-between border-b border-slate-700/60">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    Doctor Clinical Alerts ({unreadCount} new)
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => store.markAllDoctorNotificationsAsRead(doctor.id)}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                  {docNotifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs">
                      No notifications for this doctor profile.
                    </div>
                  ) : (
                    docNotifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => store.markDoctorNotificationAsRead(n.id)}
                        className={`p-3 hover:bg-[#334155]/60 transition cursor-pointer flex items-start gap-2.5 ${
                          !n.read ? 'bg-blue-500/5' : ''
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-amber-400 ring-4 ring-amber-400/20' : 'bg-slate-600'}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{n.title}</span>
                            <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-300 text-xs mt-0.5">{n.message}</p>
                          {n.priority === 'Critical' && (
                            <span className="text-[11px] text-rose-400 mt-1 inline-block font-semibold">
                              Urgent Patient Alert &rarr;
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* System Theme Toggle Button */}
          <button
            id="btn-doctor-theme-toggle"
            onClick={() => store.toggleTheme()}
            className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-amber-400 hover:text-amber-300 transition-all cursor-pointer shadow-md flex items-center justify-center group shrink-0"
            title={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Doctor Back Button */}
          <button
            id="btn-doctor-header-back"
            onClick={onBackToHospital}
            className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] hover:border-emerald-500/40 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Back</span>
          </button>

          {/* Doctor Logout Button */}
          <button
            id="btn-doctor-header-logout"
            onClick={() => {
              store.switchAccount();
              window.location.reload();
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
            title="Log Out of Doctor Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>

        </div>

      </div>

      {/* Secondary Bar: Live Time and Doctor Verification Seal */}
      <div className="bg-[#0B1120] px-4 sm:px-6 py-1.5 border-t border-[#1E293B] flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-slate-300">{currentTime || 'Loading live time...'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <Shield className="w-3 h-3 text-emerald-400" />
            Verified Medical Practitioner
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">
            Hospital: {doctor.hospital_name || 'Sir Sunderlal Hospital (IMS BHU)'}
          </span>
        </div>
      </div>
    </header>
  );
};
