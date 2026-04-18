import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { CurrencyProvider } from "@/components/shared/CurrencyProvider";
import { getOrganizationJsonLd } from "@/lib/structured-data";

const BASE_URL = "https://siamluxe.com";
const OG_IMAGE = "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1200&h=630&q=80&auto=format&fit=crop";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
        ru: "/ru",
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}`,
      siteName: "SiamLuxe",
      locale: locale === "fr" ? "fr_FR" : locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "SiamLuxe — Beauty Salons for Sale in Bangkok",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getOrganizationJsonLd()),
        }}
      />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <CurrencyProvider>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SmoothScroll>
        </CurrencyProvider>
      </NextIntlClientProvider>
    </>
  );
}
