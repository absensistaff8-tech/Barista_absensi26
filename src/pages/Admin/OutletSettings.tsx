import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";

export function OutletSettings() {
  const [outlets, setOutlets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOutlet, setEditingOutlet] = useState<any>(null);

  useEffect(() => {
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    try {
      const { data, error } = await supabase.from("outlets").select("*");
      if (!error && data) {
        setOutlets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOutlet) return;
    
    try {
      const updates = {
        name: editingOutlet.name,
        latitude: parseFloat(editingOutlet.latitude),
        longitude: parseFloat(editingOutlet.longitude),
        radius: parseInt(editingOutlet.radius, 10),
      };

      const { data: updated, error } = await supabase
        .from("outlets")
        .update(updates)
        .eq("id", editingOutlet.id)
        .select()
        .single();

      if (error) throw error;
      
      setOutlets(outlets.map(o => o.id === updated.id ? updated : o));
      setEditingOutlet(null);
    } catch (err) {
      alert("Gagal memperbarui outlet");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pengaturan Outlet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Daftar Outlet</h2>
          {loading ? (
            <div className="text-gray-500">Memuat...</div>
          ) : (
            <div className="space-y-3">
              {outlets.map((outlet) => (
                <div key={outlet.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setEditingOutlet({...outlet})}>
                  <h3 className="font-semibold text-gray-900">{outlet.name}</h3>
                  <div className="text-sm text-gray-500 mt-1 space-y-1">
                    <p>Lat: {outlet.latitude}</p>
                    <p>Lng: {outlet.longitude}</p>
                    <p>Radius: {outlet.radius} meter</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Edit Outlet</h2>
          {editingOutlet ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <InputField 
                label="Nama Outlet" 
                value={editingOutlet.name} 
                onChange={(e) => setEditingOutlet({...editingOutlet, name: e.target.value})}
                required
              />
              <InputField 
                label="Latitude" 
                type="number" step="any"
                value={editingOutlet.latitude} 
                onChange={(e) => setEditingOutlet({...editingOutlet, latitude: e.target.value})}
                required
              />
              <InputField 
                label="Longitude" 
                type="number" step="any"
                value={editingOutlet.longitude} 
                onChange={(e) => setEditingOutlet({...editingOutlet, longitude: e.target.value})}
                required
              />
              <InputField 
                label="Radius (meter)" 
                type="number"
                value={editingOutlet.radius} 
                onChange={(e) => setEditingOutlet({...editingOutlet, radius: e.target.value})}
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingOutlet(null)}>Batal</Button>
                <Button type="submit">Simpan Perubahan</Button>
              </div>
            </form>
          ) : (
            <div className="text-gray-500 text-sm text-center py-10">
              Pilih outlet di sebelah kiri untuk mengedit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
