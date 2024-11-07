import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Image from "next/image";
import { signOutAction } from "@/app/actions";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-2", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname === item.href
              ? "bg-lime-500 text-white"
              : "text-muted-foreground hover:bg-lime-500/20 hover:text-lime-500"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export default function DashboardSidebar() {
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Details",
      href: "/details",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Major Regulations",
      href: "/reg-chat",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <User className="h-4 w-4" />,
    },
  ];

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <MobileSidebar />
        </SheetContent>
      </Sheet>
      <aside className="fixed hidden lg:flex h-screen w-64 flex-col border-r">
        <DesktopSidebar />
      </aside>
    </>
  );
}

function SidebarContent() {
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Details",
      href: "/details",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: "Major Regulations",
      href: "/reg-chat",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <User className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-14 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logo/black-logo.svg"
            alt="Logo"
            width={30}
            height={30}
            className="dark:hidden"
          />
          <Image
            src="/logo/white-logo.svg"
            alt="Logo"
            width={30}
            height={30}
            className="hidden dark:block"
          />
          <span className="text-lg font-semibold">Regulation 365</span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <SidebarNav items={navItems} />
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center justify-between gap-2">
          <ThemeSwitcher />
          <form action={signOutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function MobileSidebar() {
  return <SidebarContent />;
}

function DesktopSidebar() {
  return <SidebarContent />;
}
