// components/dashboard-sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import AppLogo from "@/components/logo";
import Image from "next/image";
import { Button } from "./ui/button";
import { signOutAction } from "@/app/actions";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Details", href: "/details" },
    { name: "Chat", href: "/chat" },
    { name: "Profile", href: "/profile" },
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
        <div className="mt-auto mx-auto p-6">
          <Image
            src="/logo/white-logo.svg"
            alt="dark-mode-logo"
            width={60}
            height={60}
          />
        </div>
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

        <div className="flex justify-center mt-4">
          <ThemeSwitcher />
          <form action={signOutAction}>
            <Button
              type="submit"
              className="block py-2 px-4 rounded-lg text-center bg-neutral-800 text-gray-300 hover:bg-lime-500 hover:text-white"
            >
              Sign out
            </Button>
          </form>
        </div>
      </nav>
    </div>
  );
}
