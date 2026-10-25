import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PatientPortal } from './components/patient/PatientPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { AccessRestricted } from './components/AccessRestricted';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SupabaseModal } from './components/SupabaseModal';
import { AiConsultantChat } from './components/AiConsultantChat';
import { SplashScreen } from './components/SplashScreen';
import { CheckMedWelcomeAuth } from './components/auth/CheckMedWelcomeAuth';
import { store } from './lib/store';
import { Doctor, UserRole } from './types';
import { speakWelcomeToCheckmed } from './lib/sound';

export default function App() {
  const [isSplashActive, setIsSplashActive] = useState(true);

  const [activeView, setActiveView] = useState<string>('welcome');
  const [activeRole, setActiveRole] = useState<UserRole>(store.activeRole);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'doctor' | 'admin'>('login');
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(store.theme);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setActiveRole(store.activeRole);
      setTheme(store.theme);
    });
    return unsubscribe;
  }, []);

  const handleOpenAuth = (defaultTab: UserRole | 'login' | 'register' | 'doctor' | 'admin' = 'login') => {
    if (defaultTab === 'patient' || defaultTab === 'guest') {
      setAuthTab('login');
    } else if (defaultTab === 'doctor' || defaultTab === 'admin' || defaultTab === 'login' || defaultTab === 'register') {
      setAuthTab(defaultTab);
    } else {
      setAuthTab('login');
    }
    setIsAuthOpen(true);
  };

  const handleSelectDoctorFromLanding = (doctor: Doctor) => {
    setSelectedDoctorForBooking(doctor);
    store.setRole('patient');
    setActiveView('patient-portal');
  };

  const handleSwitchAccount = () => {
    store.switchAccount();
    setActiveView('welcome');
  };

  // Helper to determine authorized dashboard for a given role
  const getAuthorizedDashboard = (role: UserRole): string => {
    switch (role) {
      case 'patient': return 'patient-portal';
      case 'doctor': return 'doctor-dashboard';
      case 'admin': return 'admin-dashboard';
      case 'staff': return 'staff-dashboard';
      default: return 'welcome';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B14] text-[#F8FAFC] font-sans antialiased selection:bg-[#0EA5E9] selection:text-white">
      
      {/* Launch Splash Screen Animation */}
      {isSplashActive && (
        <SplashScreen
          onComplete={() => {
            setIsSplashActive(false);
            // Automatic role-based session determination after splash
            if (store.activeRole === 'patient') {
              setActiveView('patient-portal');
            } else if (store.activeRole === 'doctor') {
              setActiveView('doctor-dashboard');
            } else if (store.activeRole === 'admin') {
              setActiveView('admin-dashboard');
            } else if (store.activeRole === 'staff') {
              setActiveView('staff-dashboard');
            } else {
              setActiveView('welcome');
            }
          }}
        />
      )}

      {/* Opening CheckMed Welcome & Role Authentication Screen */}
      {!isSplashActive && activeView === 'welcome' && (
        <CheckMedWelcomeAuth
          onSuccessLogin={(role: UserRole, targetView?: string) => {
            if (role === 'patient') {
              setActiveView('patient-portal');
            } else if (role === 'doctor') {
              setActiveView('doctor-dashboard');
            } else if (role === 'admin') {
              setActiveView('admin-dashboard');
            } else if (role === 'staff') {
              setActiveView('staff-dashboard');
            } else {
              setActiveView(targetView || 'patient-portal');
            }
          }}
        />
      )}

      {/* Top Navigation Bar - render when exploring landing, patient portal, etc. */}
      {!isSplashActive && activeView !== 'welcome' && activeView !== 'admin-dashboard' && activeView !== 'doctor-dashboard' && activeView !== 'staff-dashboard' && (
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenAuth={handleOpenAuth}
          onOpenSupabase={() => setIsSupabaseOpen(true)}
          onSwitchAccount={handleSwitchAccount}
        />
      )}

      {/* Main View Container with Strict Role-Based Dashboard Protection */}
      {!isSplashActive && activeView !== 'welcome' && (
        <main className="flex-1">
          {activeView === 'landing' && (
            <LandingPage
              onOpenAuth={handleOpenAuth}
              onSelectDoctor={handleSelectDoctorFromLanding}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'patient-portal' && (
            <PatientPortal
              onOpenAuth={() => handleOpenAuth('login')}
              initialDoctor={selectedDoctorForBooking}
              setActiveView={setActiveView}
            />
          )}

          {/* Doctor Dashboard with Strict Zero-Trust Role Guard */}
          {activeView === 'doctor-dashboard' && (
            activeRole === 'doctor' ? (
              <DoctorDashboard
                onBackToHospital={() => setActiveView('landing')}
              />
            ) : (
              <AccessRestricted
                requiredRole="Doctor"
                currentRole={activeRole}
                attemptedDashboardName="Doctor Clinical Portal"
                onReturnToDashboard={() => setActiveView(getAuthorizedDashboard(activeRole))}
              />
            )
          )}

          {/* Admin Dashboard with Strict Zero-Trust Role Guard */}
          {activeView === 'admin-dashboard' && (
            activeRole === 'admin' ? (
              <AdminDashboard
                setActiveView={setActiveView}
              />
            ) : (
              <AccessRestricted
                requiredRole="Administrator"
                currentRole={activeRole}
                attemptedDashboardName="Hospital Administration Dashboard"
                onReturnToDashboard={() => setActiveView(getAuthorizedDashboard(activeRole))}
              />
            )
          )}

          {/* Staff Dashboard with Strict Zero-Trust Role Guard */}
          {activeView === 'staff-dashboard' && (
            activeRole === 'staff' ? (
              <StaffDashboard
                onBackToHospital={() => setActiveView('staff-dashboard')}
                setActiveView={setActiveView}
              />
            ) : (
              <AccessRestricted
                requiredRole="Hospital Staff"
                currentRole={activeRole}
                attemptedDashboardName="Staff Operations Workspace"
                onReturnToDashboard={() => setActiveView(getAuthorizedDashboard(activeRole))}
              />
            )
          )}
        </main>
      )}

      {/* Footer - render when exploring landing, patient portal, etc. */}
      {!isSplashActive && activeView !== 'welcome' && activeView !== 'admin-dashboard' && activeView !== 'doctor-dashboard' && activeView !== 'staff-dashboard' && (
        <Footer
          onOpenSupabase={() => setIsSupabaseOpen(true)}
          setActiveView={setActiveView}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authTab}
        onSuccess={() => {
          if (store.activeRole === 'admin') {
            setActiveView('admin-dashboard');
          } else if (store.activeRole === 'staff') {
            setActiveView('staff-dashboard');
          } else if (store.activeRole === 'doctor') {
            setActiveView('doctor-dashboard');
          } else {
            setActiveView('patient-portal');
          }
        }}
      />

      {/* Supabase Config & SQL Schema Modal */}
      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
      />

      {/* Floating AI Consultant Chat Box */}
      {!isSplashActive && activeView !== 'welcome' && activeView !== 'doctor-dashboard' && <AiConsultantChat />}

    </div>
  );
}
