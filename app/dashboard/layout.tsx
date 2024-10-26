// app/dashboard/layout.tsx

"use client";

import DashboardSidebar from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full pt-16 lg:pt-20">
      <DashboardSidebar />
      <div className="flex-1 w-full p-6 lg:ml-64">{children}</div>
    </div>
  );
}
