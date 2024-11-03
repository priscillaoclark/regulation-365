"use client";

import DashboardSidebar from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-background dark:bg-neutral-950 text-foreground">
      <DashboardSidebar />
      <div className="flex-1 w-full p-6 lg:ml-64">{children}</div>
    </div>
  );
}
