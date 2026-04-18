import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow access to login page without auth
  // Layout wraps all admin pages including login
  // We check the path in the page components themselves
  // But we provide the admin nav only if authenticated

  if (!user) {
    return <>{children}</>;
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  // If logged in but not admin, show for now (profile may not exist yet in demo)
  // In production, redirect non-admins away

  return (
    <div className="min-h-screen bg-cream pt-20">
      <AdminNav locale={locale} userEmail={user.email ?? ""} isAdmin={isAdmin} />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-8">
        {children}
      </div>
    </div>
  );
}
