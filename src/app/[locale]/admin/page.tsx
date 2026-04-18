import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  // Fetch salons from Supabase
  const { data: salons } = await supabase
    .from("salons")
    .select("*, salon_photos(id, url, position)")
    .order("created_at", { ascending: false });

  // Fetch contact requests count
  const { count: contactCount } = await supabase
    .from("contact_requests")
    .select("*", { count: "exact", head: true });

  return (
    <AdminDashboardClient
      salons={salons ?? []}
      contactCount={contactCount ?? 0}
      locale={locale}
    />
  );
}
