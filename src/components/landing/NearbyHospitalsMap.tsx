import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow, 
  Pin, 
  useMap, 
  useMapsLibrary,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation, 
  Building2, 
  Compass, 
  AlertCircle, 
  Search, 
  CheckCircle2, 
  Star, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Phone, 
  Sparkles, 
  Shield, 
  Cross,
  Activity,
  Layers,
  Stethoscope
} from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export interface NearbyPlaceItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'hospital' | 'clinic' | 'general';
  isOpen?: boolean | null;
  rating?: number;
  userRatingsTotal?: number;
  distanceKm?: number;
}

// Calculate Haversine distance
function computeHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Subcomponent that executes Places searches and Routes rendering once Google Maps is mounted
interface MapControllerProps {
  center: { lat: number; lng: number };
  userPos: { lat: number; lng: number } | null;
  places: NearbyPlaceItem[];
  selectedPlace: NearbyPlaceItem | null;
  onSelectPlace: (place: NearbyPlaceItem | null) => void;
  onPlacesFound: (places: NearbyPlaceItem[]) => void;
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
  searchType: 'all' | 'hospital' | 'clinic';
}

const MapController: React.FC<MapControllerProps> = ({
  center,
  userPos,
  places,
  selectedPlace,
  onSelectPlace,
  onPlacesFound,
  isSearching,
  setIsSearching,
  searchType
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Fetch nearby places when map or center changes
  const fetchNearbyPlaces = useCallback(async () => {
    if (!placesLib || !center) return;

    setIsSearching(true);
    const searchCenter = { lat: center.lat, lng: center.lng };

    try {
      // 1. Attempt Places API (New) Place.searchNearby or Place.searchByText
      if (placesLib.Place && typeof placesLib.Place.searchByText === 'function') {
        const query = searchType === 'hospital' 
          ? 'hospitals' 
          : searchType === 'clinic' 
          ? 'medical clinics' 
          : 'hospitals and clinics';

        const { places: fetchedPlaces } = await placesLib.Place.searchByText({
          textQuery: query,
          locationBias: searchCenter,
          fields: ['id', 'displayName', 'formattedAddress', 'location', 'regularOpeningHours', 'rating', 'userRatingCount', 'types'],
          maxResultCount: 15
        });

        if (fetchedPlaces && fetchedPlaces.length > 0) {
          const items: NearbyPlaceItem[] = fetchedPlaces
            .filter(p => p.location)
            .map(p => {
              const pLat = typeof p.location?.lat === 'function' ? p.location.lat() : (p.location as any)?.lat || 0;
              const pLng = typeof p.location?.lng === 'function' ? p.location.lng() : (p.location as any)?.lng || 0;
              
              const isClinic = p.types?.some((t: string) => t.includes('clinic') || t.includes('doctor')) && !p.types?.some((t: string) => t.includes('hospital'));
              const distanceKm = userPos 
                ? computeHaversineDistance(userPos.lat, userPos.lng, pLat, pLng)
                : computeHaversineDistance(searchCenter.lat, searchCenter.lng, pLat, pLng);

              return {
                id: p.id || `${pLat}-${pLng}`,
                name: (typeof p.displayName === 'string' ? p.displayName : (p.displayName as any)?.text) || 'Medical Center',
                address: p.formattedAddress || 'Nearby Healthcare Facility',
                lat: pLat,
                lng: pLng,
                type: isClinic ? 'clinic' : 'hospital',
                isOpen: (p.regularOpeningHours as any)?.openNow ?? (p as any).currentOpeningHours?.openNow ?? null,
                rating: p.rating,
                userRatingsTotal: p.userRatingCount,
                distanceKm
              };
            });

          items.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
          onPlacesFound(items);
          setIsSearching(false);
          return;
        }
      }

      // 2. Fallback to classic PlacesService (Places library)
      if (window.google?.maps?.places?.PlacesService && map) {
        const dummyDiv = document.createElement('div');
        const service = new window.google.maps.places.PlacesService(dummyDiv);
        
        const request: google.maps.places.PlaceSearchRequest = {
          location: new window.google.maps.LatLng(searchCenter.lat, searchCenter.lng),
          radius: 8000,
          type: searchType === 'clinic' ? 'doctor' : 'hospital',
          keyword: searchType === 'clinic' ? 'clinic' : 'hospital'
        };

        service.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const items: NearbyPlaceItem[] = results.map(r => {
              const rLat = r.geometry?.location?.lat() || 0;
              const rLng = r.geometry?.location?.lng() || 0;
              const isClinic = (r.types?.includes('doctor') || r.types?.includes('health')) && !r.types?.includes('hospital');
              const distanceKm = userPos 
                ? computeHaversineDistance(userPos.lat, userPos.lng, rLat, rLng)
                : computeHaversineDistance(searchCenter.lat, searchCenter.lng, rLat, rLng);

              return {
                id: r.place_id || `${rLat}-${rLng}`,
                name: r.name || 'Medical Center',
                address: r.vicinity || 'Local Area',
                lat: rLat,
                lng: rLng,
                type: isClinic ? 'clinic' : 'hospital',
                isOpen: r.opening_hours?.isOpen ? r.opening_hours.isOpen() : null,
                rating: r.rating,
                userRatingsTotal: r.user_ratings_total,
                distanceKm
              };
            });

            items.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
            onPlacesFound(items);
          } else {
            onPlacesFound([]);
          }
          setIsSearching(false);
        });
      } else {
        setIsSearching(false);
      }
    } catch (err) {
      console.warn('Places search notice:', err);
      setIsSearching(false);
    }
  }, [placesLib, map, center, userPos, searchType, onPlacesFound, setIsSearching]);

  useEffect(() => {
    fetchNearbyPlaces();
  }, [fetchNearbyPlaces]);

  // Center map when selected place changes
  useEffect(() => {
    if (map && selectedPlace) {
      map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
      map.setZoom(15);
    }
  }, [map, selectedPlace]);

  // Compute driving route if selected place and user position exist
  useEffect(() => {
    if (!routesLib || !map || !userPos || !selectedPlace) {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
      return;
    }

    // Clear previous route
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    if (routesLib.Route && typeof routesLib.Route.computeRoutes === 'function') {
      routesLib.Route.computeRoutes({
        origin: userPos,
        destination: { lat: selectedPlace.lat, lng: selectedPlace.lng },
        travelMode: 'DRIVING',
        fields: ['path', 'distanceMeters', 'durationMillis', 'viewport']
      }).then(({ routes }) => {
        if (routes?.[0]) {
          const newPolylines = routes[0].createPolylines();
          newPolylines.forEach(p => {
            p.setOptions({
              strokeColor: '#0EA5E9',
              strokeWeight: 5,
              strokeOpacity: 0.85
            });
            p.setMap(map);
          });
          polylinesRef.current = newPolylines;
        }
      }).catch(() => {
        // Safe failover if route computation is not permitted
      });
    }

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [routesLib, map, userPos, selectedPlace]);

  return (
    <>
      {/* User Location Marker (Pulse Effect) */}
      {userPos && (
        <AdvancedMarker 
          position={userPos}
          title="Your Current Location"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-sky-500/30 animate-ping" />
            <div className="relative w-7 h-7 rounded-full bg-[#0284C7] border-2 border-white shadow-xl flex items-center justify-center text-white">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          </div>
        </AdvancedMarker>
      )}

      {/* Hospital & Clinic Markers */}
      {places.map(place => {
        const isSelected = selectedPlace?.id === place.id;
        const isHospital = place.type === 'hospital';

        return (
          <AdvancedMarker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => onSelectPlace(place)}
            title={place.name}
            zIndex={isSelected ? 50 : 10}
          >
            <div className={`p-1.5 rounded-2xl shadow-xl transition-transform cursor-pointer border ${
              isSelected 
                ? 'scale-125 ring-4 ring-sky-400 bg-white border-sky-500 text-sky-900 shadow-2xl'
                : isHospital
                ? 'bg-rose-600 border-rose-400 text-white hover:scale-110'
                : 'bg-emerald-600 border-emerald-400 text-white hover:scale-110'
            }`}>
              {isHospital ? (
                <Building2 className={`w-5 h-5 ${isSelected ? 'text-rose-600' : 'text-white'}`} />
              ) : (
                <Activity className={`w-5 h-5 ${isSelected ? 'text-emerald-600' : 'text-white'}`} />
              )}
            </div>
          </AdvancedMarker>
        );
      })}

      {/* Selected Marker InfoWindow */}
      {selectedPlace && (
        <InfoWindow
          position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
          onCloseClick={() => onSelectPlace(null)}
          maxWidth={320}
        >
          <div className="p-1 text-slate-900 font-sans space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                selectedPlace.type === 'hospital' 
                  ? 'bg-rose-100 text-rose-700' 
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedPlace.type === 'hospital' ? 'Hospital' : 'Clinic'}
              </span>
              {selectedPlace.isOpen !== null && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  selectedPlace.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {selectedPlace.isOpen ? 'Open Now' : 'Closed'}
                </span>
              )}
            </div>

            <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
              {selectedPlace.name}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
              {selectedPlace.address}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-700 pt-1 border-t border-slate-200">
              {selectedPlace.rating && (
                <span className="font-bold flex items-center gap-1 text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {selectedPlace.rating} {selectedPlace.userRatingsTotal ? `(${selectedPlace.userRatingsTotal})` : ''}
                </span>
              )}
              {selectedPlace.distanceKm !== undefined && (
                <span className="font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  {selectedPlace.distanceKm} km away
                </span>
              )}
            </div>

            <div className="pt-1">
              <a
                href={userPos 
                  ? `https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lng}&destination=${selectedPlace.lat},${selectedPlace.lng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name + ' ' + selectedPlace.address)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all text-center no-underline"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions in Google Maps</span>
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

// Preset Medical Cities for Quick Location Switching
const PRESET_CITIES = [
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Gorakhpur', lat: 26.7606, lng: 83.3732 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Prayagraj', lat: 25.4358, lng: 81.8463 },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 }
];

export const NearbyHospitalsMap: React.FC = () => {
  // Permission & Interaction state:
  // 'idle': before user clicks allow location or manual
  // 'requesting': browser prompt active
  // 'granted': user location active
  // 'denied': location rejected or error
  const [permissionState, setPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);

  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 25.3176, lng: 82.9739 }); // Default Varanasi
  const [currentCityLabel, setCurrentCityLabel] = useState<string>('Your Location');

  const [places, setPlaces] = useState<NearbyPlaceItem[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlaceItem | null>(null);
  const [searchFilter, setSearchFilter] = useState<'all' | 'hospital' | 'clinic'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [manualQuery, setManualQuery] = useState('');
  const [isMapUnavailable, setIsMapUnavailable] = useState(false);

  // Request browser geolocation on explicit user interaction
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setPermissionState('denied');
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setPermissionState('requesting');
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoordinates(coords);
        setMapCenter(coords);
        setCurrentCityLabel('Your Current Location');
        setPermissionState('granted');
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setPermissionState('denied');
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location access was not granted.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError('Location information is currently unavailable.');
        } else if (error.code === error.TIMEOUT) {
          setLocationError('Location request timed out.');
        } else {
          setLocationError('Location access was not granted.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000
      }
    );
  };

  // Manual search handler
  const handleManualSearch = (queryCity?: string, customCoords?: { lat: number; lng: number }) => {
    const targetQuery = queryCity || manualQuery;
    if (!targetQuery.trim() && !customCoords) return;

    if (customCoords) {
      setMapCenter(customCoords);
      setCurrentCityLabel(targetQuery || 'Selected Medical Zone');
      setPermissionState('granted');
      return;
    }

    // Check if query matches any preset city
    const match = PRESET_CITIES.find(c => c.name.toLowerCase() === targetQuery.trim().toLowerCase());
    if (match) {
      setMapCenter({ lat: match.lat, lng: match.lng });
      setCurrentCityLabel(`${match.name} Healthcare Zone`);
      setPermissionState('granted');
    } else {
      // Default to query-based center or trigger text query search
      setCurrentCityLabel(targetQuery);
      setPermissionState('granted');
    }
  };

  const filteredPlaces = places.filter(p => {
    if (searchFilter === 'all') return true;
    return p.type === searchFilter;
  });

  return (
    <section id="nearby-hospitals-section" className="py-16 bg-[#0B1120] border-t border-[#334155] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-bold shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="tracking-wide uppercase">Real-Time Geolocation Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2.5">
              Nearby Hospitals & Clinics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1.5 max-w-2xl leading-relaxed">
              Locate emergency medical centers, multispecialty hospitals, and outpatient clinics closest to you with live distance and turn-by-turn Google Maps navigation.
            </p>
          </div>

          {/* Location status badge */}
          {permissionState === 'granted' && (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-[#1E293B] border border-sky-500/40 text-xs font-bold text-sky-300 flex items-center gap-2 shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentCityLabel}</span>
              </div>
              <button
                onClick={handleRequestLocation}
                className="p-2.5 rounded-2xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
                title="Recalculate Current Location"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 1. INITIAL PERMISSION GATE (Lazy-loaded, does not load Google Maps beforehand) */}
        {permissionState === 'idle' && (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1E293B] to-[#121D2F] border border-[#334155] text-center max-w-3xl mx-auto shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-sky-500/20 ring-4 ring-sky-400/20">
              <Navigation className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Find Hospitals Near You
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Allow browser location permission to automatically discover real hospitals, emergency trauma units, and clinics within 10 km of your current position.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="btn-allow-location-access"
                onClick={handleRequestLocation}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:brightness-110 text-white font-black text-sm rounded-2xl shadow-xl shadow-sky-600/30 ring-2 ring-sky-400/50 flex items-center justify-center gap-2.5 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Navigation className="w-4 h-4 text-white" />
                <span>Allow Location Access</span>
              </button>

              <button
                onClick={() => setPermissionState('denied')}
                className="w-full sm:w-auto px-6 py-4 bg-[#0F172A] hover:bg-[#1E293B] border border-[#334155] text-slate-300 font-bold text-sm rounded-2xl transition-all cursor-pointer"
              >
                <span>Search Manually</span>
              </button>
            </div>

            {/* Quick Cities Grid */}
            <div className="pt-4 border-t border-[#334155]/80">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Or jump to major hospital clusters
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {PRESET_CITIES.map(city => (
                  <button
                    key={city.name}
                    onClick={() => handleManualSearch(city.name, { lat: city.lat, lng: city.lng })}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0F172A] hover:bg-sky-950/60 border border-[#334155] hover:border-sky-500/50 text-xs font-semibold text-slate-300 hover:text-sky-300 transition-all cursor-pointer"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. REQUESTING STATE */}
        {permissionState === 'requesting' && (
          <div className="p-10 rounded-3xl bg-[#1E293B] border border-sky-500/40 text-center max-w-md mx-auto shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-sky-400 border-t-transparent animate-spin mx-auto" />
            <h4 className="text-base font-bold text-white">
              Requesting Location Permission...
            </h4>
            <p className="text-xs text-slate-300">
              Please click "Allow" in your browser prompt to pinpoint nearby medical facilities.
            </p>
          </div>
        )}

        {/* 3. DENIED / MANUAL SEARCH FALLBACK */}
        {permissionState === 'denied' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#1E293B] border border-amber-500/40 max-w-2xl mx-auto shadow-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">
                  {locationError || 'Location access was not granted.'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You can still locate hospitals and clinics by searching for any city or neighborhood manually.
                </p>
              </div>
            </div>

            {/* Manual Search Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleManualSearch();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Enter city, district or area (e.g. Varanasi, Lucknow, New Delhi)..."
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-3.5 rounded-xl bg-[#0F172A] border border-[#334155] focus:ring-2 focus:ring-sky-400 text-white placeholder-slate-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search Manually</span>
              </button>
            </form>

            {/* Quick Cities */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                Popular Healthcare Hubs:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_CITIES.map(city => (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => handleManualSearch(city.name, { lat: city.lat, lng: city.lng })}
                    className="px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#334155] border border-[#334155] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleRequestLocation}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer"
              >
                Try enabling location permission again
              </button>
            </div>
          </div>
        )}

        {/* 4. ACTIVE MAP VIEW (When Permission is Granted or Manual Location Picked) */}
        {permissionState === 'granted' && (
          <div className="space-y-4">
            
            {/* Filter Pills & Status Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#1E293B] p-3.5 rounded-2xl border border-[#334155]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSearchFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    searchFilter === 'all'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-[#0F172A] text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All Facilities ({places.length})</span>
                </button>

                <button
                  onClick={() => setSearchFilter('hospital')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    searchFilter === 'hospital'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-[#0F172A] text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hospitals ({places.filter(p => p.type === 'hospital').length})</span>
                </button>

                <button
                  onClick={() => setSearchFilter('clinic')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    searchFilter === 'clinic'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-[#0F172A] text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Clinics ({places.filter(p => p.type === 'clinic').length})</span>
                </button>
              </div>

              {/* Search status */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                {isSearching ? (
                  <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Searching Google Places...
                  </span>
                ) : (
                  <span>
                    Found <strong className="text-white">{filteredPlaces.length}</strong> medical locations
                  </span>
                )}
              </div>
            </div>

            {/* API Key Missing Fallback Banner */}
            {!hasValidKey && (
              <div className="p-6 rounded-2xl bg-[#1E293B] border border-sky-500/40 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <Shield className="w-5 h-5" />
                  <span>Google Maps Platform Key Required for Live Map Rendering</span>
                </div>
                <p className="text-xs text-slate-300">
                  To display the interactive map and live place markers, add your Google Maps API key in AI Studio Secrets:
                </p>
                <ol className="text-xs text-slate-300 list-decimal list-inside space-y-1 bg-[#0F172A] p-3 rounded-xl border border-[#334155]">
                  <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right corner)</li>
                  <li>Select <strong>Secrets</strong></li>
                  <li>Type <code className="text-sky-300 font-mono">GOOGLE_MAPS_PLATFORM_KEY</code> and press <strong>Enter</strong></li>
                  <li>Paste your API key and press <strong>Enter</strong></li>
                </ol>
              </div>
            )}

            {/* Error fallback */}
            {isMapUnavailable && (
              <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Map is temporarily unavailable.</h4>
                <p className="text-xs text-slate-300">Please check your internet connection or Google Maps credentials.</p>
              </div>
            )}

            {/* Main Interactive Grid: Map + List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Interactive Map (7 cols on large screens) */}
              <div className="lg:col-span-7 h-[450px] sm:h-[550px] lg:h-[620px] rounded-3xl overflow-hidden border border-[#334155] shadow-2xl relative bg-[#070B14]">
                {hasValidKey ? (
                  <APIProvider 
                    apiKey={API_KEY} 
                    version="weekly"
                    onError={() => setIsMapUnavailable(true)}
                  >
                    <Map
                      defaultCenter={mapCenter}
                      defaultZoom={13}
                      center={mapCenter}
                      mapId="DEMO_MAP_ID"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                      gestureHandling="greedy"
                      disableDefaultUI={false}
                    >
                      <MapController
                        center={mapCenter}
                        userPos={userCoordinates}
                        places={filteredPlaces}
                        selectedPlace={selectedPlace}
                        onSelectPlace={setSelectedPlace}
                        onPlacesFound={setPlaces}
                        isSearching={isSearching}
                        setIsSearching={setIsSearching}
                        searchType={searchFilter}
                      />
                    </Map>
                  </APIProvider>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#0F172A] to-[#070B14] space-y-4">
                    <Building2 className="w-12 h-12 text-sky-400" />
                    <h4 className="text-base font-bold text-white">Google Maps Interactive Canvas</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Map will render here once <code className="text-sky-300">GOOGLE_MAPS_PLATFORM_KEY</code> is configured.
                    </p>
                  </div>
                )}

                {/* Map Legend Overlay */}
                <div className="absolute bottom-4 left-4 bg-[#0F172A]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#334155] text-[11px] font-bold text-slate-300 flex items-center gap-3 shadow-lg">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> You
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Hospital
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Clinic
                  </span>
                </div>
              </div>

              {/* Sidebar List of Nearby Hospitals & Clinics (5 cols on large screens) */}
              <div className="lg:col-span-5 flex flex-col h-[450px] sm:h-[550px] lg:h-[620px] bg-[#1E293B] rounded-3xl border border-[#334155] shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="p-4 border-b border-[#334155] flex items-center justify-between bg-[#152033]">
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-sky-400" />
                      <span>Nearby Healthcare Directory</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Showing {filteredPlaces.length} verified facilities
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-300 bg-sky-500/20 px-2.5 py-1 rounded-lg border border-sky-400/30">
                    Live Distance
                  </span>
                </div>

                {/* Scrollable list of items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#334155]/60">
                  {filteredPlaces.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-400">
                        {isSearching ? 'Scanning nearby healthcare establishments...' : 'No facilities found for the selected filter.'}
                      </p>
                    </div>
                  ) : (
                    filteredPlaces.map(place => {
                      const isSelected = selectedPlace?.id === place.id;
                      const isHospital = place.type === 'hospital';

                      return (
                        <div
                          key={place.id}
                          onClick={() => setSelectedPlace(place)}
                          className={`pt-3 first:pt-0 p-3 rounded-2xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-sky-950/60 border border-sky-400 shadow-lg'
                              : 'hover:bg-[#0F172A] border border-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                  isHospital
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                }`}>
                                  {isHospital ? 'Hospital' : 'Clinic'}
                                </span>

                                {place.isOpen !== null && (
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    place.isOpen
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-rose-500/20 text-rose-300'
                                  }`}>
                                    {place.isOpen ? 'Open Now' : 'Closed'}
                                  </span>
                                )}
                              </div>

                              <h4 className="font-extrabold text-xs sm:text-sm text-white line-clamp-1">
                                {place.name}
                              </h4>

                              <p className="text-[11px] text-slate-400 line-clamp-1">
                                {place.address}
                              </p>
                            </div>

                            {/* Distance Badge */}
                            {place.distanceKm !== undefined && (
                              <div className="text-right shrink-0">
                                <span className="inline-block px-2.5 py-1 rounded-xl bg-[#0F172A] border border-[#334155] text-xs font-black text-sky-300 shadow-xs">
                                  {place.distanceKm} km
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#334155]/60 text-[11px]">
                            {place.rating ? (
                              <div className="flex items-center gap-1 text-amber-400 font-bold">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>{place.rating}</span>
                                {place.userRatingsTotal && (
                                  <span className="text-slate-500">({place.userRatingsTotal})</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500">Facility Verified</span>
                            )}

                            <a
                              href={userCoordinates
                                ? `https://www.google.com/maps/dir/?api=1&origin=${userCoordinates.lat},${userCoordinates.lng}&destination=${place.lat},${place.lng}`
                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>Get Directions</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom action banner */}
                <div className="p-3.5 bg-[#121D2F] border-t border-[#334155] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    Powered by Google Maps Platform
                  </span>
                  <button
                    onClick={() => {
                      setPermissionState('denied');
                      setManualQuery('');
                    }}
                    className="text-sky-400 hover:text-sky-300 font-bold text-[11px] cursor-pointer"
                  >
                    Change City / Search
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
