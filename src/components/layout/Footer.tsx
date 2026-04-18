"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_LINE } from "@/lib/constants";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-brown-deep text-white/80">
      {/* Gold separator line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <span className="font-[var(--font-playfair)] text-2xl font-bold tracking-wider text-gold-light">
                Siam
              </span>
              <span className="font-[var(--font-playfair)] text-2xl font-light tracking-widest text-gold/80">
                Luxe
              </span>
            </div>
            <p className="font-[var(--font-cormorant)] text-base leading-relaxed text-white/60 max-w-xs">
              {t("description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-[var(--font-montserrat)] text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-6">
              {t("navigation")}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: nav("home") },
                { href: "/salons", label: nav("salons") },
                { href: "/about", label: nav("about") },
                { href: "/contact", label: nav("contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-[var(--font-cormorant)] text-base text-white/60 hover:text-gold-light transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-[var(--font-montserrat)] text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-6">
              {t("contact")}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 text-white/60 hover:text-gold-light transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-gold/60" />
                  <span className="font-[var(--font-cormorant)] text-base">{CONTACT_EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${CONTACT_WHATSAPP.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-gold-light transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 text-gold/60" />
                  <span className="font-[var(--font-cormorant)] text-base">WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://line.me/ti/p/${CONTACT_LINE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-gold-light transition-colors duration-300"
                >
                  <MessageCircle className="w-4 h-4 text-gold/60" />
                  <span className="font-[var(--font-cormorant)] text-base">LINE</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-[var(--font-montserrat)] text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-6">
              {t("legal")}
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="font-[var(--font-cormorant)] text-base text-white/60 cursor-default">
                  {t("privacy")}
                </span>
              </li>
              <li>
                <span className="font-[var(--font-cormorant)] text-base text-white/60 cursor-default">
                  {t("terms")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-[var(--font-montserrat)] text-xs text-white/40 tracking-wide">
              &copy; {new Date().getFullYear()} SiamLuxe. {t("rights")}
            </p>
            <div className="flex items-center gap-1">
              <span className="font-[var(--font-montserrat)] text-xs text-white/30 tracking-wide">
                Bangkok, Thailand
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
