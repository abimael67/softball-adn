import type { ReactNode } from "react";
import { useMatchRoute } from "@tanstack/react-router";
import { Header } from "./header";
import { Footer } from "./footer";
import { AdminSidebar, AdminMobileNav } from "./admin-sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const matchRoute = useMatchRoute();
  const isAdmin = matchRoute({ to: "/admin", fuzzy: true });

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      {isAdmin && <AdminMobileNav />}
      <div className="flex flex-1 min-h-0">
        {isAdmin && <AdminSidebar />}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 h-full">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
