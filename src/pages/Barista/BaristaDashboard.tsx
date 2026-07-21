import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, Clock, Calendar } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Button } from "../../components/Button";
import { supabase } from "../../utils/supabase";
import { formatDate, formatTime } from "../../utils/timeFormatter";

export function BaristaDashboard() {
  const [user, setUser] = useState<{id?: string, name: string} | null>(null);
  const [activeAttendance, setActiveAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchStatus(parsedUser.id);
  }, [navigate]);

  const fetchStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("attendances")
        .select("*")
        .eq("user_id", userId)
        .is("clock_out_time", null)
        .order("clock_in_time", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setActiveAttendance({
          id: data.id,
          clockInTime: data.clock_in_time,
          status: data.status,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

  const now = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name || ""} />
      
      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center mt-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <Clock size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{formatTime(now.toISOString())}</h2>
          <p className="text-gray-500 flex items-center justify-center gap-1 mt-1 text-sm">
            <Calendar size={14} />
            {formatDate(now.toISOString())}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Status Shift</h3>
          
          {activeAttendance ? (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 text-sm">
                Anda sudah Absen Masuk pada <strong>{formatTime(activeAttendance.clockInTime)}</strong>
              </div>
              <Button 
                variant="danger" 
                className="w-full flex items-center justify-center gap-2 h-12 text-lg"
                onClick={() => navigate("/barista/clock-out")}
              >
                <LogOut size={20} />
                Absen Pulang
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 text-sm text-center">
                Anda belum melakukan absensi masuk hari ini.
              </div>
              <Button 
                className="w-full flex items-center justify-center gap-2 h-12 text-lg bg-blue-600"
                onClick={() => navigate("/barista/clock-in")}
              >
                <LogIn size={20} />
                Absen Masuk
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
