import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, MapPin, FileText } from "lucide-react";
import { clsx } from "clsx";

export function Sidebar() {
  const links = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/employees", icon: Users, label: "Karyawan" },
    { to: "/admin/outlets", icon: MapPin, label: "Outlet" },
    { to: "/admin/reports", icon: FileText, label: "Laporan" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block h-[calc(100vh-60px)] sticky top-[60px]">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
