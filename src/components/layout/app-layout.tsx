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
    <div className="flex min-h-screen flex-col">
      <Header />
      {isAdmin && <AdminMobileNav />}
      <div className="flex flex-1">
        {isAdmin && <AdminSidebar />}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
