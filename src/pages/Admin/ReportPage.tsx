import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { formatTime, formatDate } from "../../utils/timeFormatter";

export function ReportPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("attendances")
        .select("*, users(name)")
        .order("clock_in_time", { ascending: false });
        
      if (!error && data) {
        const formattedReports = data.map(att => ({
          id: att.id,
          userId: att.user_id,
          userName: att.users?.name || "Unknown",
          clockInTime: att.clock_in_time,
          clockOutTime: att.clock_out_time,
          photoUrl: att.photo_url,
          status: att.status
        }));
        setReports(formattedReports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Laporan Absensi</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barista</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam Masuk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam Pulang</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto Selfie</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(report.clockInTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{formatTime(report.clockInTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.clockOutTime ? formatTime(report.clockOutTime) : "Belum absen pulang"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.photoUrl ? (
                        <img src={report.photoUrl} alt="Selfie" className="h-10 w-10 rounded object-cover border border-gray-200" />
                      ) : "-"}
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada data absensi</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
