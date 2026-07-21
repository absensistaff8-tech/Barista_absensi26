import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { Users, Building, Activity, FileText } from "lucide-react";

export function AdminDashboard() {
  const [user, setUser] = useState<{name: string} | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }
    const parsed = JSON.parse(userData);
    if (parsed.role !== "admin") {
      navigate("/barista");
      return;
    }
    setUser(parsed);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userName={user.name} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          {location.pathname === "/admin" ? (
            <AdminHome />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

function AdminHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Users} title="Total Karyawan" value="12" color="bg-blue-100 text-blue-600" />
        <DashboardCard icon={Building} title="Total Outlet" value="3" color="bg-purple-100 text-purple-600" />
        <DashboardCard icon={Activity} title="Absen Hari Ini" value="8" color="bg-green-100 text-green-600" />
        <DashboardCard icon={FileText} title="Laporan Pending" value="0" color="bg-orange-100 text-orange-600" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Ringkasan Hari Ini</h2>
        <div className="text-gray-500 text-sm text-center py-10">
          Silakan akses menu Laporan untuk melihat detail absensi.
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon: Icon, title, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
      <div className={`p-4 rounded-lg ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
