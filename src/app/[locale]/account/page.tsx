import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountClient } from "./AccountClient";

export default async function AccountPage({
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
    redirect(`/${locale}/account/login`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: favorites } = await supabase
    .from("favorites")
    .select("salon_id, salons(*, salon_photos(*))")
    .eq("user_id", user.id);

  // Supabase infers joined relations as arrays; cast to match component props
  const typedFavorites = (favorites ?? []) as unknown as {
    salon_id: string;
    salons: import("@/types").Salon & { salon_photos: import("@/types").SalonPhoto[] };
  }[];

  return (
    <AccountClient
      user={user}
      profile={profile}
      favorites={typedFavorites}
      locale={locale}
    />
  );
}
