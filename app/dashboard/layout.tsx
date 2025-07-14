import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { DashboardSiteHeader } from "@/app/dashboard/_components/dashboard-site-header";
import { DashboardAppSidebar } from "@/app/dashboard/_components/dashbpard-app-sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardAppSidebar variant="inset" />
      <SidebarInset>
        <DashboardSiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
