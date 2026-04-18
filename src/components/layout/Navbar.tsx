"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, UserCircle } from "lucide-react";
import type { Locale } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { CurrencySwitcher } from "@/components/shared/CurrencySwitcher";

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const currentLang = LANGUAGES.find((l) => l.code === locale)!;

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/salons", label: t("salons") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/95 backdrop-blur-md shadow-warm"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span
                className={`font-[var(--font-playfair)] text-2xl font-bold tracking-wider transition-colors duration-300 ${
                  scrolled ? "text-gold-dark" : "text-white"
                }`}
              >
                Siam
              </span>
              <span
                className={`font-[var(--font-playfair)] text-2xl font-light tracking-widest transition-colors duration-300 ${
                  scrolled ? "text-gold" : "text-gold-light"
                }`}
              >
                Luxe
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-[var(--font-montserrat)] text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-gold ${
                    scrolled ? "text-text-primary" : "text-white/90"
                  } ${pathname === link.href ? "text-gold" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Currency Switcher */}
              <CurrencySwitcher scrolled={scrolled} />

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className={`flex items-center gap-2 font-[var(--font-montserrat)] text-sm font-medium transition-colors duration-300 ${
                    scrolled ? "text-text-secondary" : "text-white/80"
                  }`}
                >
                  <span className="text-base">{currentLang.flag}</span>
                  <span>{currentLang.code.toUpperCase()}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 bg-white-soft rounded-xl shadow-warm-lg overflow-hidden border border-gold/10 min-w-[160px]"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => switchLocale(lang.code)}
                          className={`flex items-center gap-3 w-full px-4 py-3 text-left font-[var(--font-montserrat)] text-sm transition-colors hover:bg-cream ${
                            lang.code === locale
                              ? "text-gold font-semibold bg-cream/50"
                              : "text-text-primary"
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Account */}
              <Link
                href={user ? "/account" : "/account/login"}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  scrolled ? "text-text-secondary hover:text-gold-dark" : "text-white/70 hover:text-white"
                }`}
                aria-label={user ? t("myAccount") : t("login")}
              >
                <UserCircle className="w-5 h-5" />
              </Link>

              {/* CTA Button */}
              <Link
                href="/salons"
                className="font-[var(--font-montserrat)] text-sm font-semibold tracking-wide px-6 py-2.5 rounded-full bg-gold text-white transition-all duration-300 hover:bg-gold-dark hover:shadow-warm"
              >
                {t("viewSalons")}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 transition-colors ${
                scrolled ? "text-text-primary" : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-brown-deep/95 backdrop-blur-lg lg:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center justify-center h-full gap-8"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className={`font-[var(--font-playfair)] text-3xl font-light tracking-wide transition-colors ${
                      pathname === link.href ? "text-gold" : "text-white/90 hover:text-gold-light"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Currency Switcher */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-4"
              >
                <CurrencySwitcher scrolled={false} />
              </motion.div>

              {/* Mobile Language Switcher */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLocale(lang.code)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-[var(--font-montserrat)] text-sm transition-all ${
                      lang.code === locale
                        ? "bg-gold text-white"
                        : "text-white/60 hover:text-white border border-white/20"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </motion.div>

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/salons"
                  className="font-[var(--font-montserrat)] text-base font-semibold px-8 py-3 rounded-full bg-gold text-white hover:bg-gold-dark transition-all"
                >
                  {t("viewSalons")}
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
