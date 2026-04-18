"use client";

import { useTranslations } from "next-intl";
import { Phone, MessageCircle, Mail } from "lucide-react";

interface ContactSidebarProps {
  whatsapp?: string;
  line?: string;
  email?: string;
  salonTitle: string;
}

export function ContactSidebar({
  whatsapp,
  line,
  email,
  salonTitle,
}: ContactSidebarProps) {
  const t = useTranslations("salon");

  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace("+", "")}?text=${encodeURIComponent(
        `Bonjour, je suis intéressé(e) par le salon "${salonTitle}" sur SiamLuxe.`
      )}`
    : null;
  const lineLink = line ? `https://line.me/ti/p/${line}` : null;
  const mailLink = email
    ? `mailto:${email}?subject=${encodeURIComponent(
        `Intérêt pour ${salonTitle} — SiamLuxe`
      )}`
    : null;

  return (
    <>
      {/* Desktop Sidebar Card */}
      <div className="hidden lg:block sticky top-28">
        <div className="bg-white-soft rounded-xl border border-gold/10 shadow-warm p-6">
          <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-1">
            {t("contact")}
          </h3>
          <div className="w-10 h-px bg-gradient-to-r from-gold/50 to-transparent mb-5" />

          <div className="flex flex-col gap-3">
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#25D366] text-white font-[var(--font-montserrat)] text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-[#1da851] hover:shadow-warm"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </a>
            )}

            {lineLink && (
              <a
                href={lineLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#00B900] text-white font-[var(--font-montserrat)] text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-[#009900] hover:shadow-warm"
              >
                <MessageCircle className="w-4 h-4" />
                LINE
              </a>
            )}

            {mailLink && (
              <a
                href={mailLink}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gold text-white font-[var(--font-montserrat)] text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-gold-dark hover:shadow-warm"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white-soft/95 backdrop-blur-md border-t border-gold/15 shadow-[0_-4px_20px_rgba(60,43,31,0.08)] safe-area-pb">
        <div className="flex items-center gap-2 px-4 py-3">
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full bg-[#25D366] text-white font-[var(--font-montserrat)] text-xs font-bold tracking-wide"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          )}
          {lineLink && (
            <a
              href={lineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full bg-[#00B900] text-white font-[var(--font-montserrat)] text-xs font-bold tracking-wide"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              LINE
            </a>
          )}
          {mailLink && (
            <a
              href={mailLink}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full bg-gold text-white font-[var(--font-montserrat)] text-xs font-bold tracking-wide"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </a>
          )}
        </div>
      </div>
    </>
  );
}
