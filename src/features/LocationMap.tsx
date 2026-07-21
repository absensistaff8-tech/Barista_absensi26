import { useState, useEffect } from "react";
import { MapPin, AlertCircle } from "lucide-react";
import { calculateDistance } from "../utils/geolocation";

interface LocationMapProps {
  outletLat: number;
  outletLng: number;
  outletRadius: number;
  onLocationVerified: (isValid: boolean, lat: number, lng: number) => void;
}

export function LocationMap({ outletLat, outletLng, outletRadius, onLocationVerified }: LocationMapProps) {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState<string>("");
  const [distance, setDistance] = useState<number | null>(null);

  const checkLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung di browser ini.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        const dist = calculateDistance(latitude, longitude, outletLat, outletLng);
        setDistance(dist);
        
        const isValid = dist <= outletRadius;
        onLocationVerified(isValid, latitude, longitude);
        setError("");
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin diberikan.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    checkLocation();
  }, []);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm w-full">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {error ? (
            <AlertCircle className="text-red-500" size={20} />
          ) : (
            <MapPin className="text-blue-500" size={20} />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">Status Lokasi</h4>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : distance !== null ? (
            <div className="space-y-1">
              <p className="text-gray-600">
                Jarak Anda dengan outlet: <span className="font-bold text-gray-900">{Math.round(distance)} meter</span>
              </p>
              {distance <= outletRadius ? (
                <p className="text-green-600 font-medium">âœ“ Berada di dalam jangkauan absensi ({outletRadius}m)</p>
              ) : (
                <p className="text-red-600 font-medium">âœ— Di luar jangkauan absensi (Maks: {outletRadius}m)</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Mencari lokasi Anda...</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
         <button onClick={checkLocation} className="text-blue-600 text-xs font-medium hover:underline">
            Perbarui Lokasi
         </button>
      </div>
    </div>
  );
}
