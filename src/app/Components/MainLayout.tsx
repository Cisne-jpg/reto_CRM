// MainLayout.tsx
'use client';

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [ownerName, setOwnerName] = useState<string | null>(null);

  // Carga inicial
  useEffect(() => {
    setIsMounted(true);
    const storedName = localStorage.getItem("ownerName");
    setOwnerName(storedName);
    setIsSidebarOpen(
      !!storedName && !["/Login", "/", "/Signup"].includes(pathname)
    );
  }, [pathname]);

  const hideComponents = ["/Login", "/", "/Signup"].includes(pathname);
  const showHeaderNavbar = !!ownerName && !hideComponents;

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex flex-1">
        {/* NavBar lateral */}
        {showHeaderNavbar && (
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <NavBar />
          </aside>
        )}

        {/* Contenido principal */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            showHeaderNavbar && isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          {/* Header */}
          {showHeaderNavbar && (
            <Header
              onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
              isSidebarOpen={isSidebarOpen}
              ownerName={ownerName}
            />
          )}

          {/* Main */}
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>

          {/* Footer */}
          {!hideComponents && <Footer />}
        </div>
      </div>
    </div>
  );
}
