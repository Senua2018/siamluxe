"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_LINE } from "@/lib/constants";
import {
  Phone,
  MessageCircle,
  Mail,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().default(""),
  message: z.string().min(10, "Message trop court (min. 10 caractères)"),
  preferred_language: z.string().default("fr"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactClient() {
  const t = useTranslations("contact");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      preferred_language: "fr",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setSending(true);
    try {
      const supabase = createClient();
      await supabase.from("contact_requests").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        channel: "form",
      });
      setSent(true);
      reset();
    } catch {
      // Silently fail — in production would show error
    }
    setSending(false);
  }

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gold/15 bg-cream/30 font-[var(--font-montserrat)] text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all";

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div
        ref={headerRef}
        className="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-brown-deep text-center"
      >
        <h1 className="font-[var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          {t("title")}
        </h1>
        <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold-light/60 to-transparent mb-4" />
        <p className="font-[var(--font-cormorant)] text-lg sm:text-xl text-white/60 max-w-lg mx-auto px-5">
          {t("subtitle")}
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          {/* Form */}
          <div className="bg-white-soft rounded-xl border border-gold/10 shadow-warm p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-50 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-[var(--font-playfair)] text-xl font-semibold text-text-primary mb-2">
                  {t("success")}
                </h3>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 font-[var(--font-montserrat)] text-sm font-semibold text-gold-dark hover:text-gold transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                      {t("name")} *
                    </label>
                    <input
                      {...register("name")}
                      className={inputClass}
                      placeholder="Jean Dupont"
                    />
                    {errors.name && (
                      <p className="font-[var(--font-montserrat)] text-[10px] text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                      {t("email")} *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className={inputClass}
                      placeholder="vous@email.com"
                    />
                    {errors.email && (
                      <p className="font-[var(--font-montserrat)] text-[10px] text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                      {t("phone")}
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className={inputClass}
                      placeholder="+66 812 345 678"
                    />
                  </div>
                  <div>
                    <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                      {t("preferredLanguage")}
                    </label>
                    <select {...register("preferred_language")} className={inputClass}>
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="ru">Русский</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                    {t("message")} *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    className={inputClass + " resize-y"}
                    placeholder="Votre message..."
                  />
                  {errors.message && (
                    <p className="font-[var(--font-montserrat)] text-[10px] text-red-500 mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-gold text-white font-[var(--font-montserrat)] text-sm font-semibold tracking-wide transition-all hover:bg-gold-dark hover:shadow-warm disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {t("send")}
                </button>
              </form>
            )}
          </div>

          {/* Direct contact sidebar */}
          <div className="space-y-4">
            <a
              href={`https://wa.me/${CONTACT_WHATSAPP.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-white-soft rounded-xl border border-gold/10 shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D366]/10">
                <Phone className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p className="font-[var(--font-montserrat)] text-sm font-semibold text-text-primary">
                  WhatsApp
                </p>
                <p className="font-[var(--font-montserrat)] text-xs text-text-secondary">
                  {CONTACT_WHATSAPP}
                </p>
              </div>
            </a>

            <a
              href={`https://line.me/ti/p/${CONTACT_LINE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-white-soft rounded-xl border border-gold/10 shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#00B900]/10">
                <MessageCircle className="w-5 h-5 text-[#00B900]" />
              </div>
              <div>
                <p className="font-[var(--font-montserrat)] text-sm font-semibold text-text-primary">
                  LINE
                </p>
                <p className="font-[var(--font-montserrat)] text-xs text-text-secondary">
                  @{CONTACT_LINE}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-4 p-5 bg-white-soft rounded-xl border border-gold/10 shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gold/10">
                <Mail className="w-5 h-5 text-gold-dark" />
              </div>
              <div>
                <p className="font-[var(--font-montserrat)] text-sm font-semibold text-text-primary">
                  Email
                </p>
                <p className="font-[var(--font-montserrat)] text-xs text-text-secondary">
                  {CONTACT_EMAIL}
                </p>
              </div>
            </a>

            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-gold/10 shadow-warm">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Bangkok,Thailand&zoom=12"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Bangkok"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
