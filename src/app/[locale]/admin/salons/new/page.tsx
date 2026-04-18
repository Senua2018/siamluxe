import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SalonForm } from "@/components/admin/SalonForm";

export default async function NewSalonPage({
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

  return (
    <div>
      <h1 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary pt-14">
        Nouveau Salon
      </h1>
      <div className="w-12 h-px bg-gradient-to-r from-gold/50 to-transparent mt-2 mb-2" />
      <SalonForm />
    </div>
  );
}
