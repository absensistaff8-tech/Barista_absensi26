import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { CameraCapture } from "../../features/CameraCapture";
import { LocationMap } from "../../features/LocationMap";
import { Button } from "../../components/Button";
import { supabase } from "../../utils/supabase";

export function ClockInPage() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string>("");
  const [locationValid, setLocationValid] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClockIn = async () => {
    if (!photo || !locationValid || !locationCoords) return;
    
    setLoading(true);
    setError("");
    
    try {
      const userData = localStorage.getItem("user");
      if (!userData) throw new Error("User not found");
      const user = JSON.parse(userData);

      const newAttendance = {
        user_id: user.id,
        clock_in_time: new Date().toISOString(),
        photo_url: photo,
        status: "present"
      };

      const { error: insertError } = await supabase
        .from("attendances")
        .insert([newAttendance]);

      if (insertError) throw insertError;

      navigate("/barista");
    } catch (err: any) {
      setError(err.message || "Gagal absen masuk");
      setLoading(false);
    }
  };

  // Mock outlet data for demo
  const outlet = { lat: -6.200000, lng: 106.816666, radius: 1000000 }; // Large radius for demo

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-4 py-4 border-b flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate("/barista")} className="p-1 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-semibold text-lg text-gray-900">Absen Masuk</h1>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-medium text-gray-900 mb-4">1. Validasi Lokasi</h2>
          <LocationMap 
            outletLat={outlet.lat} 
            outletLng={outlet.lng} 
            outletRadius={outlet.radius}
            onLocationVerified={(valid, lat, lng) => {
              setLocationValid(valid);
              setLocationCoords({lat, lng});
            }}
          />
        </section>

        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-medium text-gray-900 mb-4">2. Foto Selfie</h2>
          <CameraCapture onCapture={setPhoto} />
        </section>
        
        <div className="pt-4">
          <Button 
            className="w-full h-12 text-lg" 
            disabled={!photo || !locationValid || loading}
            onClick={handleClockIn}
          >
            {loading ? "Memproses..." : "Konfirmasi Absen Masuk"}
          </Button>
          {!locationValid && (
            <p className="text-xs text-red-500 text-center mt-2">Anda harus berada di area outlet untuk absen.</p>
          )}
        </div>
      </main>
    </div>
  );
}
