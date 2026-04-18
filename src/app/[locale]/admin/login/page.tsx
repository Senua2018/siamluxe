"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold">
            <span className="text-gold-dark">Siam</span>
            <span className="text-gold font-light">Luxe</span>
          </h1>
          <p className="font-[var(--font-montserrat)] text-xs tracking-[0.2em] uppercase text-text-secondary mt-2">
            Administration
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white-soft rounded-xl shadow-warm border border-gold/10 p-8">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-6 rounded-full bg-gold/10">
            <Lock className="w-5 h-5 text-gold-dark" />
          </div>

          <h2 className="font-[var(--font-playfair)] text-xl font-semibold text-text-primary text-center mb-6">
            Connexion Admin
          </h2>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-[var(--font-montserrat)] text-xs">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gold/15 bg-cream/50 font-[var(--font-montserrat)] text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
                  placeholder="admin@siamluxe.com"
                />
              </div>
            </div>

            {/* Password */}
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gold/15 bg-cream/50 font-[var(--font-montserrat)] text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary/50 hover:text-text-secondary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gold text-white font-[var(--font-montserrat)] text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-gold-dark hover:shadow-warm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
