import React, { useState, useEffect, useRef } from 'react';
import { 
  Truck, 
  Navigation, 
  Phone, 
  MapPin, 
  Activity, 
  Gauge, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Radio, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Hospital, 
  RotateCcw,
  Zap,
  CheckCircle2,
  PhoneCall,
  PhoneOff,
  User,
  Mic,
  FastForward,
  Compass,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import { Ambulance, CityName } from '../types';
import { store } from '../lib/store';
import { AmbulanceDriverCallModal } from './patient/AmbulanceDriverCallModal';

// City Hospitals Data
const CITY_HOSPITALS: Record<string, { name: string; city: CityName; lat: number; lng: number }> = {
  'Varanasi': { name: 'Sir Sunderlal Hospital (IMS BHU)', city: 'Varanasi', lat: 25.2677, lng: 82.9913 },
  'Lucknow': { name: "King George's Medical University (KGMU)", city: 'Lucknow', lat: 26.8687, lng: 80.9168 },
  'Kanpur': { name: 'GSVM Medical College & LLL Hospital', city: 'Kanpur', lat: 26.4716, lng: 80.3204 },
  'Gorakhpur': { name: 'AIIMS Gorakhpur Super Specialty Center', city: 'Gorakhpur', lat: 26.7323, lng: 83.4287 },
  'Allahabad (Prayagraj)': { name: 'MLN Medical College & SRN Hospital', city: 'Allahabad (Prayagraj)', lat: 25.4358, lng: 81.8463 }
};

// Route Coordinates for 2D Map Canvas (Normalized 0..1000 coordinate space)
// Point 0: Ambulance Base/Station -> Point 1: Patient Home -> Point 2: Hospital Emergency Hub
interface Waypoint {
  x: number;
  y: number;
}

const ROUTE_POINTS: Waypoint[] = [
  { x: 120, y: 480 }, // Start: Ambulance Dispatch Base
  { x: 210, y: 430 },
  { x: 300, y: 360 },
  { x: 390, y: 320 },
  { x: 460, y: 270 }, // Midpoint: Patient House (Arrival Point #1)
  { x: 540, y: 230 },
  { x: 630, y: 190 },
  { x: 740, y: 240 },
  { x: 830, y: 290 },
  { x: 910, y: 350 }  // End: Hospital Emergency Trauma Center (Arrival Point #2)
];

const TOTAL_TRIP_SECONDS = 15; // 15 Seconds Virtual Journey
const PATIENT_PICKUP_SECOND = 7.5; // Reaches patient at 7.5s (Halfway mark)

interface AmbulanceGpsTrackerProps {
  selectedCity?: CityName | 'All';
  preselectedHospital?: string;
  autoOpenBookingModal?: boolean;
  onClose?: () => void;
}

export const AmbulanceGpsTracker: React.FC<AmbulanceGpsTrackerProps> = ({
  selectedCity = 'All',
  preselectedHospital,
  onClose
}) => {
  const [ambulances] = useState<Ambulance[]>(store.ambulances);
  
  // Selected Ambulance
  const [selectedAmbId, setSelectedAmbId] = useState<string>(() => {
    if (preselectedHospital) {
      const match = store.ambulances.find(a => a.hospital_name?.toLowerCase().includes(preselectedHospital.toLowerCase()));
      if (match) return match.id;
    }
    return store.ambulances[0]?.id || 'amb-vns-1';
  });

  const selectedAmb = ambulances.find(a => a.id === selectedAmbId) || ambulances[0] || {
    id: 'amb-vns-1',
    vehicle_number: 'UP-65-AMB-108',
    driver_name: 'Ramesh Yadav',
    driver_phone: '+91 98765 43210',
    status: 'On Emergency Duty',
    hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
    city: 'Varanasi',
    equipment: 'Ventilator, Defibrillator, Multipara Monitor, ECG'
  };

  const [activeCity, setActiveCity] = useState<CityName>(
    selectedAmb.city || (selectedCity === 'All' ? 'Varanasi' : selectedCity)
  );

  // Simulation Timeline State (0 to 120 seconds)
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 5x for easy testing
  const [sirenActive, setSirenActive] = useState<boolean>(false);
  const [taskCompleted, setTaskCompleted] = useState<boolean>(false);
  const [patientBoarded, setPatientBoarded] = useState<boolean>(false);

  // Driver Call Modal State
  const [isCallingDriver, setIsCallingDriver] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState<number>(0);

  // Audio Context Ref for Real-time Siren Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenOscRef = useRef<OscillatorNode | null>(null);
  const sirenGainRef = useRef<GainNode | null>(null);
  const sirenLfoRef = useRef<OscillatorNode | null>(null);

  // Voice utterance spoken tracker to prevent repetition
  const spokenCompletedRef = useRef<boolean>(false);
  const sirenTriggeredAtPatientRef = useRef<boolean>(false);

  // Helper to start realistic emergency siren
  const startSiren = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (sirenOscRef.current) return; // already playing

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      // Dual-tone frequency sweep 650Hz to 1050Hz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(1.5, ctx.currentTime); // 1.5 sweeps per second

      lfoGain.gain.setValueAtTime(220, ctx.currentTime); // Amplitude of sweep
      lfo.connect(osc.frequency);

      gain.gain.setValueAtTime(0.08, ctx.currentTime); // Soft comfortable volume

      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start();
      osc.start();

      sirenOscRef.current = osc;
      sirenGainRef.current = gain;
      sirenLfoRef.current = lfo;
      setSirenActive(true);
    } catch {
      // audio synthesis fallback
      setSirenActive(true);
    }
  };

  // Helper to stop siren
  const stopSiren = () => {
    try {
      if (sirenOscRef.current) {
        sirenOscRef.current.stop();
        sirenOscRef.current.disconnect();
        sirenOscRef.current = null;
      }
      if (sirenLfoRef.current) {
        sirenLfoRef.current.stop();
        sirenLfoRef.current.disconnect();
        sirenLfoRef.current = null;
      }
      if (sirenGainRef.current) {
        sirenGainRef.current.disconnect();
        sirenGainRef.current = null;
      }
      setSirenActive(false);
    } catch {
      setSirenActive(false);
    }
  };

  // Announce "Task Completed" using SpeechSynthesis
  const speakTaskCompleted = () => {
    if (spokenCompletedRef.current) return;
    spokenCompletedRef.current = true;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('Task completed. Patient reached hospital safely.');
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // speech fallback
    }
  };

  // Main Simulation Loop (100ms step for ultra-smooth 15-second tracking)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && elapsedTime < TOTAL_TRIP_SECONDS) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
          const next = Math.min(prev + (0.1 * playbackSpeed), TOTAL_TRIP_SECONDS);
          return next;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, elapsedTime, playbackSpeed]);

  // Handle Arrival Triggers (Patient Home Arrival at 7.5s, Hospital Arrival at 15s)
  useEffect(() => {
    // 1. Patient Reached Check (at 7.5s)
    if (elapsedTime >= PATIENT_PICKUP_SECOND && elapsedTime < PATIENT_PICKUP_SECOND + 2.5) {
      setPatientBoarded(true);
      if (!sirenTriggeredAtPatientRef.current) {
        sirenTriggeredAtPatientRef.current = true;
        startSiren();
      }
    } else if (elapsedTime >= PATIENT_PICKUP_SECOND + 2.5 && elapsedTime < TOTAL_TRIP_SECONDS) {
      setPatientBoarded(true);
    }

    // 2. Hospital Arrival Check (at 15s)
    if (elapsedTime >= TOTAL_TRIP_SECONDS) {
      setIsPlaying(false);
      setTaskCompleted(true);
      stopSiren();
      speakTaskCompleted();
    }
  }, [elapsedTime]);

  // Clean up Audio on unmount
  useEffect(() => {
    return () => {
      stopSiren();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Call Driver Timer
  useEffect(() => {
    let callTimer: NodeJS.Timeout | null = null;
    if (isCallingDriver && callStatus === 'ringing') {
      const ringTimeout = setTimeout(() => {
        setCallStatus('connected');
      }, 2000);
      return () => clearTimeout(ringTimeout);
    }
    if (isCallingDriver && callStatus === 'connected') {
      callTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (callTimer) clearInterval(callTimer);
    };
  }, [isCallingDriver, callStatus]);

  // Calculate Positions & Physics Metrics
  // Phase 1: 0 to 60s -> moving towards Patient
  // Phase 2: 60s to 120s -> moving towards Hospital
  const progressRatio = elapsedTime / TOTAL_TRIP_SECONDS; // 0..1
  
  // Calculate dynamic distances
  let distanceToPatientKm = 0;
  let distanceToHospitalKm = 0;
  let currentSpeedKmh = 0;
  let currentHeadingDeg = 45;
  let currentAmbX = ROUTE_POINTS[0].x;
  let currentAmbY = ROUTE_POINTS[0].y;

  const patientPointIndex = 4; // index in ROUTE_POINTS
  const patientWaypoint = ROUTE_POINTS[patientPointIndex];
  const hospitalWaypoint = ROUTE_POINTS[ROUTE_POINTS.length - 1];

  if (elapsedTime <= PATIENT_PICKUP_SECOND) {
    // Phase 1: Moving to Patient
    const phaseRatio = elapsedTime / PATIENT_PICKUP_SECOND; // 0 to 1
    // Interpolate points along first half
    const segmentCount = patientPointIndex;
    const currentSegmentIndex = Math.min(Math.floor(phaseRatio * segmentCount), segmentCount - 1);
    const subRatio = (phaseRatio * segmentCount) - currentSegmentIndex;

    const p1 = ROUTE_POINTS[currentSegmentIndex];
    const p2 = ROUTE_POINTS[currentSegmentIndex + 1];

    currentAmbX = p1.x + (p2.x - p1.x) * subRatio;
    currentAmbY = p1.y + (p2.y - p1.y) * subRatio;

    // Heading
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    currentHeadingDeg = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;

    // Distance to Patient smoothly decreases from 4.8 km to 0.0 km
    distanceToPatientKm = Math.max(0, Number((4.8 * (1 - phaseRatio)).toFixed(2)));
    
    // Distance to Hospital (Patient to Hospital is 6.5 km)
    distanceToHospitalKm = Number((6.5 + distanceToPatientKm).toFixed(2));

    // Dynamic Speed Deceleration as it approaches Patient Home
    if (phaseRatio < 0.6) {
      // Cruising fast
      currentSpeedKmh = 72 + Math.sin(elapsedTime * 2) * 4;
    } else if (phaseRatio < 0.85) {
      // Decelerating
      currentSpeedKmh = Math.max(28, Math.round(72 - ((phaseRatio - 0.6) / 0.25) * 42));
    } else if (phaseRatio < 0.98) {
      // Slowing down for parking
      currentSpeedKmh = Math.max(12, Math.round(28 - ((phaseRatio - 0.85) / 0.13) * 18));
    } else {
      // Arrived at gate
      currentSpeedKmh = 0;
    }
  } else {
    // Phase 2: Moving from Patient to Hospital
    const phaseRatio = (elapsedTime - PATIENT_PICKUP_SECOND) / (TOTAL_TRIP_SECONDS - PATIENT_PICKUP_SECOND); // 0 to 1
    const remainingPoints = ROUTE_POINTS.slice(patientPointIndex);
    const segmentCount = remainingPoints.length - 1;
    const currentSegmentIndex = Math.min(Math.floor(phaseRatio * segmentCount), segmentCount - 1);
    const subRatio = (phaseRatio * segmentCount) - currentSegmentIndex;

    const p1 = remainingPoints[currentSegmentIndex];
    const p2 = remainingPoints[currentSegmentIndex + 1];

    currentAmbX = p1.x + (p2.x - p1.x) * subRatio;
    currentAmbY = p1.y + (p2.y - p1.y) * subRatio;

    // Heading
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    currentHeadingDeg = (Math.atan2(dy, dx) * 180 / Math.PI) + 90;

    distanceToPatientKm = 0;
    distanceToHospitalKm = Math.max(0, Number((6.5 * (1 - phaseRatio)).toFixed(2)));

    // Deceleration towards Hospital Trauma Gate
    if (phaseRatio < 0.7) {
      currentSpeedKmh = 78 + Math.sin(elapsedTime * 3) * 3;
    } else if (phaseRatio < 0.92) {
      currentSpeedKmh = Math.max(30, Math.round(78 - ((phaseRatio - 0.7) / 0.22) * 46));
    } else if (phaseRatio < 0.99) {
      currentSpeedKmh = Math.max(10, Math.round(30 - ((phaseRatio - 0.92) / 0.07) * 20));
    } else {
      currentSpeedKmh = 0;
    }
  }

  // Reset Trip Handler
  const handleResetTrip = () => {
    stopSiren();
    spokenCompletedRef.current = false;
    sirenTriggeredAtPatientRef.current = false;
    setElapsedTime(0);
    setIsPlaying(true);
    setTaskCompleted(false);
    setPatientBoarded(false);
  };

  // Jump to Patient Arrival
  const handleJumpToPatient = () => {
    setElapsedTime(7.0);
    setIsPlaying(true);
  };

  // Jump to Hospital Arrival
  const handleJumpToHospital = () => {
    setElapsedTime(14.2);
    setIsPlaying(true);
  };

  // Format seconds to ss.s / mm:ss
  const formatTime = (secs: number) => {
    const s = Math.min(15, secs);
    return `${s.toFixed(1)}s`;
  };

  return (
    <div className="w-full bg-[#0B1120] text-white rounded-3xl border border-[#334155] shadow-2xl overflow-hidden flex flex-col space-y-4 p-4 sm:p-6 font-sans">
      
      {/* 1. TOP HEADER CONTROLS BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#334155]/80 pb-4">
        
        {/* Title & Back Navigation */}
        <div className="flex items-center gap-3">
          {/* < Exit / Back Button for easy return to Dashboard */}
          <button
            id="btn-gps-exit-dashboard"
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                window.dispatchEvent(new CustomEvent('nav-to-dashboard'));
              }
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-[#0284C7]/40 ring-2 ring-[#38BDF8]/60 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            title="Wapas Dashboard me jayein (Exit GPS Tracker)"
          >
            <ChevronLeft className="w-5 h-5 stroke-[3] -ml-0.5" />
            <span className="font-extrabold tracking-wide">Back</span>
          </button>

          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30 text-white animate-pulse shrink-0">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                Emergency GPS Dispatch & Live Tracking
              </h2>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/40 items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Satellite 24x7
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Assigned Vehicle: <strong className="text-white font-mono">{selectedAmb.vehicle_number}</strong> • Driver: <strong className="text-[#38BDF8]">{selectedAmb.driver_name}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons: Siren, Call Driver, Playback */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Driver Call Button */}
          <button
            onClick={() => {
              setIsCallingDriver(true);
              setCallStatus('ringing');
              setCallDuration(0);
            }}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
            title="Call Ambulance Driver Directly"
          >
            <Phone className="w-4 h-4 animate-bounce" />
            <span>Call Driver ({selectedAmb.driver_name})</span>
          </button>

          {/* Siren Button */}
          <button
            onClick={() => {
              if (sirenActive) stopSiren();
              else startSiren();
            }}
            className={`px-3.5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md ${
              sirenActive
                ? 'bg-rose-600 text-white ring-2 ring-rose-400 animate-pulse shadow-rose-600/50'
                : 'bg-[#1E293B] text-slate-300 hover:text-white border border-[#334155]'
            }`}
          >
            {sirenActive ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{sirenActive ? 'Siren Active (ON)' : 'Test Siren'}</span>
          </button>

          {/* Play / Pause Trip Simulation */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-2.5 rounded-2xl bg-[#1E293B] hover:bg-[#334155] text-white font-black text-xs border border-[#334155] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{isPlaying ? 'Pause Trip' : 'Resume Trip'}</span>
          </button>

          {/* Playback Speed Multiplier */}
          <div className="flex items-center rounded-2xl bg-[#0F172A] border border-[#334155] p-1">
            {[1, 2, 4].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Fast Jumps for instant test */}
          <button
            onClick={handleJumpToPatient}
            className="px-2.5 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] text-[11px] text-amber-400 font-bold transition-all cursor-pointer flex items-center gap-1"
            title="Fast forward to patient home arrival"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Patient Gate</span>
          </button>

          <button
            onClick={handleJumpToHospital}
            className="px-2.5 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] text-[11px] text-emerald-400 font-bold transition-all cursor-pointer flex items-center gap-1"
            title="Fast forward to hospital trauma center arrival"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Hospital Gate</span>
          </button>

          {/* Reset Trip */}
          <button
            onClick={handleResetTrip}
            className="p-2.5 rounded-2xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] transition-all cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. DEDICATED TELEMETRY HUD (STRICTLY OUTSIDE THE MAP CANVAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Distance to Patient */}
        <div className={`p-4 rounded-3xl border transition-all ${
          elapsedTime <= PATIENT_PICKUP_SECOND
            ? 'bg-gradient-to-br from-amber-500/20 to-[#0F172A] border-amber-400 ring-1 ring-amber-400/40 shadow-lg shadow-amber-500/10'
            : 'bg-[#1E293B]/70 border-[#334155]'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Distance to Patient Home
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {elapsedTime <= PATIENT_PICKUP_SECOND ? `ETA: ${Math.max(0, Math.round(PATIENT_PICKUP_SECOND - elapsedTime))}s` : '✓ Picked Up'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">
              {distanceToPatientKm.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-amber-400">Kilometers</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium mt-1">
            {elapsedTime < PATIENT_PICKUP_SECOND 
              ? (distanceToPatientKm < 1.0 ? '🚨 Approaching House - Decelerating' : 'En route to Patient Address') 
              : '✅ Patient inside & on Monitor'}
          </p>
        </div>

        {/* Metric 2: Distance to Hospital */}
        <div className={`p-4 rounded-3xl border transition-all ${
          elapsedTime > PATIENT_PICKUP_SECOND
            ? 'bg-gradient-to-br from-emerald-500/20 to-[#0F172A] border-emerald-400 ring-1 ring-emerald-400/40 shadow-lg shadow-emerald-500/10'
            : 'bg-[#1E293B]/70 border-[#334155]'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Hospital className="w-3.5 h-3.5" /> Distance to Hospital Hub
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ETA: {Math.max(0, Math.round(TOTAL_TRIP_SECONDS - elapsedTime))}s
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">
              {distanceToHospitalKm.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-emerald-400">Kilometers</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium mt-1">
            {taskCompleted 
              ? '🏁 Task Completed - Admitted to ICU' 
              : (elapsedTime > PATIENT_PICKUP_SECOND ? 'Transporting to Emergency Trauma Ward' : 'Destination Hospital Standby')}
          </p>
        </div>

        {/* Metric 3: Live Speedometer with Dynamic Deceleration */}
        <div className="p-4 rounded-3xl bg-[#1E293B] border border-[#38BDF8]/40 shadow-lg shadow-[#0284C7]/10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#38BDF8] flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" /> Live Speedometer
            </span>
            <span className="text-[10px] font-bold text-slate-400">GPS Telemetry</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">
              {Math.round(currentSpeedKmh)}
            </span>
            <span className="text-sm font-bold text-[#38BDF8]">KM / HOUR</span>
          </div>
          <div className="w-full bg-[#0F172A] rounded-full h-1.5 mt-2 overflow-hidden border border-[#334155]">
            <div 
              className={`h-full transition-all duration-300 ${
                currentSpeedKmh > 50 ? 'bg-emerald-400' : (currentSpeedKmh > 20 ? 'bg-amber-400' : 'bg-rose-400')
              }`}
              style={{ width: `${Math.min(100, (currentSpeedKmh / 90) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Trip Timer & Phase */}
        <div className="p-4 rounded-3xl bg-[#1E293B] border border-purple-400/40 shadow-lg shadow-purple-500/10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 15-Sec Live Journey
            </span>
            <span className="text-[10px] font-mono text-purple-300 font-bold">
              {formatTime(elapsedTime)} / 15.0s
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">
              {taskCompleted ? 'COMPLETED' : (elapsedTime < PATIENT_PICKUP_SECOND ? 'PHASE 1: PICKUP' : 'PHASE 2: HOSPITAL')}
            </span>
          </div>
          <p className="text-[11px] text-purple-300 font-bold mt-1 flex items-center gap-1.5">
            {taskCompleted ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Voice: "Task Completed"
              </span>
            ) : (
              <span>Progress: {Math.round(progressRatio * 100)}% Completed</span>
            )}
          </p>
        </div>

      </div>

      {/* 3. CLEAN 2D GPS VECTOR MAP CANVAS (STRICTLY ZERO TEXT OVERLAYS ON TOP OF MAP) */}
      <div className="relative w-full h-[450px] sm:h-[520px] rounded-3xl bg-[#090D16] border border-[#38BDF8]/40 shadow-2xl overflow-hidden">
        
        {/* SVG Interactive Canvas */}
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full object-cover select-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="gpsGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.8" strokeOpacity="0.4" />
            </pattern>

            {/* Glowing Gradient for Route Line */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Map Background */}
          <rect width="1000" height="600" fill="#070B14" />
          <rect width="1000" height="600" fill="url(#gpsGrid)" />

          {/* City Arteries & Street Networks (Geometric Background Roads) */}
          <g stroke="#172338" strokeWidth="6" strokeLinecap="round">
            <line x1="50" y1="200" x2="950" y2="200" />
            <line x1="50" y1="400" x2="950" y2="400" />
            <line x1="250" y1="50" x2="250" y2="550" />
            <line x1="500" y1="50" x2="500" y2="550" />
            <line x1="750" y1="50" x2="750" y2="550" />
            <circle cx="500" cy="300" r="180" fill="none" stroke="#131C2E" strokeWidth="8" />
            <circle cx="500" cy="300" r="320" fill="none" stroke="#101827" strokeWidth="4" />
          </g>

          {/* Secondary Connecting City Streets */}
          <g stroke="#1C2B42" strokeWidth="2.5" strokeDasharray="6 4">
            <line x1="100" y1="100" x2="900" y2="500" />
            <line x1="100" y1="500" x2="900" y2="100" />
          </g>

          {/* ACTIVE GPS NAVIGATION ROUTE PATH (Curved Smooth Path) */}
          <path
            d={`M ${ROUTE_POINTS.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlow)"
            strokeOpacity="0.85"
          />

          {/* Pulsing Animated Route Tracer Line */}
          <path
            d={`M ${ROUTE_POINTS.map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="12 12"
            className="animate-pulse"
          />

          {/* STARTING POINT: Ambulance Station Base */}
          <g transform={`translate(${ROUTE_POINTS[0].x}, ${ROUTE_POINTS[0].y})`}>
            <circle r="16" fill="#0284C7" fillOpacity="0.2" />
            <circle r="8" fill="#0284C7" />
          </g>

          {/* TARGET 1: PATIENT HOME (Waypoint Index 4) */}
          <g transform={`translate(${patientWaypoint.x}, ${patientWaypoint.y})`}>
            {/* Radar Pulsing Rings */}
            <circle r="36" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.4" className="animate-ping" />
            <circle r="22" fill="#F59E0B" fillOpacity="0.2" />
            {/* Visual Residential Marker Pin (No Text) */}
            <circle r="12" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
            {/* House Icon graphic */}
            <path d="M -5 3 L -5 -2 L 0 -6 L 5 -2 L 5 3 Z" fill="#000000" />
          </g>

          {/* TARGET 2: HOSPITAL EMERGENCY TRAUMA CENTER (End Point) */}
          <g transform={`translate(${hospitalWaypoint.x}, ${hospitalWaypoint.y})`}>
            {/* Radar Rings */}
            <circle r="42" fill="none" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.3" className="animate-ping" />
            <circle r="26" fill="#10B981" fillOpacity="0.2" />
            {/* Hospital Cross Pin (No Text) */}
            <circle r="15" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
            {/* Red Cross */}
            <path d="M -2 -7 L 2 -7 L 2 -2 L 7 -2 L 7 2 L 2 2 L 2 7 L -2 7 L -2 2 L -7 2 L -7 -2 L -2 -2 Z" fill="#FFFFFF" />
          </g>

          {/* MOVING AMBULANCE VEHICLE MARKER WITH DYNAMIC ROTATION */}
          <g transform={`translate(${currentAmbX}, ${currentAmbY}) rotate(${currentHeadingDeg})`}>
            
            {/* Sonar Beacon Wave */}
            <circle r="28" fill="none" stroke="#EF4444" strokeWidth="2" strokeOpacity="0.6" className="animate-ping" />
            
            {/* Strobe Light Flares */}
            <circle cx="-6" cy="-14" r="5" fill="#EF4444" className="animate-pulse" />
            <circle cx="6" cy="-14" r="5" fill="#38BDF8" className="animate-pulse" />

            {/* Ambulance Body Chassis */}
            <rect x="-11" y="-20" width="22" height="40" rx="5" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
            
            {/* Windshield */}
            <rect x="-8" y="-16" width="16" height="8" rx="2" fill="#0284C7" />

            {/* Red Siren Strobe Bar */}
            <rect x="-6" y="-6" width="12" height="4" rx="1" fill={sirenActive ? '#EF4444' : '#64748B'} />

            {/* Medical Red Cross on Roof */}
            <path d="M -1.5 -1 L 1.5 -1 L 1.5 5 L -1.5 5 Z M -4 1.5 L 4 1.5 L 4 2.5 L -4 2.5 Z" fill="#EF4444" />
          </g>

        </svg>

        {/* Floating Compass Rose in bottom right corner (pure icon) */}
        <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#0F172A]/80 backdrop-blur-md border border-[#334155] flex items-center justify-center text-[#38BDF8] shadow-lg pointer-events-none">
          <Compass className="w-7 h-7 animate-spin" style={{ animationDuration: '24s' }} />
        </div>

        {/* Floating Live Signal Pulse Indicator in top left corner (pure icon) */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A]/80 backdrop-blur-md border border-[#334155] text-emerald-400 text-xs font-mono font-bold pointer-events-none">
          <Radio className="w-4 h-4 animate-pulse text-rose-500" />
          <span>GPS 108 LIVE</span>
        </div>

      </div>

      {/* 4. DRIVER DETAILS & ACTIVE DISPATCH SUMMARY PANEL */}
      <div className="bg-[#1E293B] rounded-3xl p-5 border border-[#334155] flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Driver Profile */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white font-black text-lg shadow-md">
            {selectedAmb.driver_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-white">{selectedAmb.driver_name}</h4>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                Certified Paramedic
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Phone: <span className="text-[#38BDF8] font-bold">{selectedAmb.driver_phone}</span> • Vehicle: <span className="text-white font-bold">{selectedAmb.vehicle_number}</span>
            </p>
          </div>
        </div>

        {/* Direct Call & Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <a
            href={`tel:${selectedAmb.driver_phone.replace(/\s+/g, '')}`}
            className="px-4 py-2.5 rounded-2xl bg-[#0F172A] hover:bg-[#334155] border border-[#334155] text-white font-black text-xs transition-all flex items-center gap-2 shadow-sm"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Direct Phone Call</span>
          </a>

          <button
            onClick={() => {
              setIsCallingDriver(true);
              setCallStatus('ringing');
              setCallDuration(0);
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-black text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>Intercom Call Driver</span>
          </button>
        </div>

      </div>

      {/* 5. IN-APP INTERCOM VOICE CALL MODAL */}
      <AmbulanceDriverCallModal
        isOpen={isCallingDriver}
        onClose={() => setIsCallingDriver(false)}
        ambulance={selectedAmb}
      />

    </div>
  );
};
