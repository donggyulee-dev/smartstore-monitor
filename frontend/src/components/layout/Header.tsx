// src/components/layout/Header.tsx
import { RefreshCw, Bell } from "lucide-react";

export const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between bg-background border-b px-6 py-3">
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <div className="flex items-center gap-4">
                <button title="Refresh" className="hover:text-primary transition">
                    <RefreshCw size={18} />
                </button>
                <button title="Notifications" className="hover:text-primary transition">
                    <Bell size={18} />
                </button>
            </div>
        </header>
    );
};
