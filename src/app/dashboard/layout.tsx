import { Suspense } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { InfoCurrentPage } from "@/components/info-current-page";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="hidden lg:block">
        <Suspense fallback={<div className="w-64" />}>
          <Sidebar />
        </Suspense>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          userName="Alexandre Talles Oliveira Ferreira"
          userRole="Administrador"
          notificationCount={27}
        />
        <main className="flex-1 overflow-x-hidden">

          <div className="p-6 lg:p-8">
            <Suspense fallback={<div className="h-20" />}>
              <InfoCurrentPage />
            </Suspense>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
