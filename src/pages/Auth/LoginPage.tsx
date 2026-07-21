import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee } from "lucide-react";
import { InputField } from "../../components/InputField";
import { Button } from "../../components/Button";
import { supabase } from "../../utils/supabase";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Get user role from custom users table (optional, but good if you have roles)
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      // If no custom user table is found, default to 'barista', or you can read from auth metadata
      const userObj = userData || { id: authData.user.id, email: authData.user.email, role: "barista", name: email.split('@')[0] };

      localStorage.setItem("user", JSON.stringify(userObj));
      
      if (userObj.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/barista");
      }
    } catch (err: any) {
      setError(err.message || "Gagal login. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-blue-600">
          <Coffee size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Barista Noid Coffee
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masuk ke akun Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
                {error}
              </div>
            )}
            
            <InputField
              id="email"
              type="email"
              label="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="barista@example.com"
            />

            <InputField
              id="password"
              type="password"
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            />

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 text-center mt-4">
              Demo Accounts:<br/>
              Admin: admin@example.com <br/>
              Barista: barista@example.com <br/>
              (Password bebas)
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
