// src/components/layout/Layout.tsx
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-muted text-foreground">
            <Sidebar />
            <div className="flex flex-col flex-1 lg:pl-64">
                <Header />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};
