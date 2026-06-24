"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { AdminGuard } from "@/components/shared/admin-guard";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ArrowUpDown,
  Bell,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";

const navigationItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Transactions", href: "/admin/transactions", icon: ArrowUpDown },
  { name: "Push Notifications", href: "/admin/push-notifications", icon: Bell },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-gray-900 text-white">
            <span className="text-xl font-bold tracking-wider">NexaFX Admin</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? "bg-yellow-400 text-gray-950"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gray-900 text-white">
            <span className="text-xl font-bold tracking-wider">NexaFX Admin</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? "bg-yellow-400 text-gray-950"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Right side container */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg md:hidden transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="hidden md:block text-lg font-semibold text-gray-900">
                Dashboard Overview
              </h2>
            </div>

            {/* Admin User Topbar info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.toLowerCase() || "administrator"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-gray-950 font-bold border border-yellow-500">
                {user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-5 h-5" />}
              </div>
            </div>
          </header>

          {/* Main content scroll area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
