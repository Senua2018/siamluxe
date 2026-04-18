"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, AlertCircle, User } from "lucide-react";

type Mode = "login" | "register";

export default function AccountLoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("nav");
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const supabase = createClient();

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, preferred_language: locale },
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSuccess("Compte créé ! Vérifiez votre email pour confirmer votre inscription.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/${locale}/account`);
    router.refresh();
  }

  const inputClass =
    "w-full pl-10 pr-4 py-2.5 rounded-lg border border-gold/15 bg-cream/50 font-[var(--font-montserrat)] text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5 pt-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-[var(--font-playfair)] text-3xl font-bold">
              <span className="text-gold-dark">Siam</span>
              <span className="text-gold font-light">Luxe</span>
            </h1>
          </Link>
        </div>

        {/* Toggle mode */}
        <div className="flex bg-white-soft rounded-full p-1 mb-6 border border-gold/10">
          <button
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-full font-[var(--font-montserrat)] text-xs font-semibold transition-all ${
              mode === "login"
                ? "bg-gold text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t("login")}
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2 rounded-full font-[var(--font-montserrat)] text-xs font-semibold transition-all ${
              mode === "register"
                ? "bg-gold text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Card */}
        <div className="bg-white-soft rounded-xl shadow-warm border border-gold/10 p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-[var(--font-montserrat)] text-xs">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-lg bg-green-50 border border-green-200 text-green-700">
              <span className="font-[var(--font-montserrat)] text-xs">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="vous@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={inputClass + " pr-10"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary/50 hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gold text-white font-[var(--font-montserrat)] text-sm font-semibold tracking-wide transition-all hover:bg-gold-dark hover:shadow-warm disabled:opacity-50"
            >
              {loading
                ? "Chargement..."
                : mode === "login"
                ? t("login")
                : "Créer mon compte"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
