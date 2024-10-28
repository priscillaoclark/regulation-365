// components/dashboard-sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Overview", href: "/dashboard/overview" },
    { name: "Profile", href: "/dashboard/profile" },
    { name: "Chat", href: "/dashboard/chat" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform lg:translate-x-0 lg:w-64 bg-neutral-800 text-white z-40`}
    >
      {/* Toggle button for small screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-4 text-white focus:outline-none"
      >
        ☰
      </button>

      <nav className="flex flex-col p-6 space-y-4">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <span
              className={`block py-2 px-4 rounded-lg text-center ${
                pathname === item.href
                  ? "bg-lime-500 text-white"
                  : "text-gray-300 hover:bg-lime-500 hover:text-white"
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
