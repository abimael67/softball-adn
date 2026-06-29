import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AppProviders } from "@/providers/app-providers";
import { AppLayout } from "@/components/layout";
import { Toaster } from "@/components/ui/toast";
import "@/app.css";

function RootComponent() {
  return (
    <AppProviders>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster />
    </AppProviders>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
