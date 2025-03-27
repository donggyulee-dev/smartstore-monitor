// src/components/layout/Sidebar.tsx
import { Home, BarChart2, Package, AlertTriangle } from "lucide-react";

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r">
      <div className="p-6 text-xl font-bold">SmartStore Monitor</div>
      <nav className="px-4 space-y-2">
        <SidebarItem icon={<Home size={18} />} label="Dashboard" />
        <SidebarItem icon={<BarChart2 size={18} />} label="Analytics" />
        <SidebarItem icon={<Package size={18} />} label="Inventory" />
        <SidebarItem icon={<AlertTriangle size={18} />} label="Alerts" />
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition">
      {icon}
      <span>{label}</span>
    </div>
  );
};
