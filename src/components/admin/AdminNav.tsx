"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Plus, LogOut, Home } from "lucide-react";

interface AdminNavProps {
  locale: string;
  userEmail: string;
  isAdmin: boolean;
}

export function AdminNav({ locale, userEmail, isAdmin }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/salons/new", label: "Nouveau salon", icon: Plus },
  ];

  return (
    <div className="fixed top-20 left-0 right-0 z-30 bg-white-soft/95 backdrop-blur-md border-b border-gold/10 shadow-warm">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-12">
          {/* Links */}
          <div className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-[var(--font-montserrat)] text-xs font-medium transition-colors ${
                  pathname === href
                    ? "bg-gold/10 text-gold-dark"
                    : "text-text-secondary hover:text-text-primary hover:bg-cream"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg font-[var(--font-montserrat)] text-xs text-text-secondary hover:text-text-primary hover:bg-cream transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voir le site</span>
            </Link>

            <span className="font-[var(--font-montserrat)] text-[10px] text-text-secondary/60 hidden sm:inline">
              {userEmail}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg font-[var(--font-montserrat)] text-xs text-red-600/70 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
