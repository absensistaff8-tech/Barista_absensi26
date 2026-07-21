import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";

interface NavbarProps {
  userName: string;
}

export function Navbar({ userName }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          BA
        </div>
        <span className="font-semibold text-gray-900 hidden sm:block">Barista Attendance</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserIcon size={16} />
          <span>{userName}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
