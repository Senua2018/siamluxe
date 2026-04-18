"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, MapPin, Globe, ShieldCheck, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FAQ_ITEMS = [
  {
    q: {
      fr: "Comment fonctionne l'achat d'un salon via SiamLuxe ?",
      en: "How does buying a salon through SiamLuxe work?",
      ru: "Как работает покупка салона через SiamLuxe?",
    },
    a: {
      fr: "Parcourez notre catalogue, contactez-nous pour les salons qui vous intéressent, nous organisons une visite, et nous vous accompagnons dans toutes les démarches jusqu'à la finalisation de la vente.",
      en: "Browse our catalog, contact us about salons that interest you, we arrange a visit, and we support you through all procedures until the sale is finalized.",
      ru: "Просмотрите наш каталог, свяжитесь с нами по интересующим салонам, мы организуем визит и сопроводим вас на всех этапах до завершения сделки.",
    },
  },
  {
    q: {
      fr: "Un étranger peut-il posséder un salon en Thaïlande ?",
      en: "Can a foreigner own a salon in Thailand?",
      ru: "Может ли иностранец владеть салоном в Таиланде?",
    },
    a: {
      fr: "Oui, via plusieurs structures légales (société thaïlandaise, bail commercial long terme, Board of Investment). Notre équipe juridique vous guide vers la solution la plus adaptée à votre situation.",
      en: "Yes, through several legal structures (Thai company, long-term commercial lease, Board of Investment). Our legal team guides you to the most suitable solution for your situation.",
      ru: "Да, через несколько правовых структур (тайская компания, долгосрочная коммерческая аренда, Board of Investment). Наша юридическая команда подберёт оптимальное решение для вашей ситуации.",
    },
  },
  {
    q: {
      fr: "Quels sont les coûts annexes à prévoir ?",
      en: "What additional costs should I expect?",
      ru: "Какие дополнительные расходы следует ожидать?",
    },
    a: {
      fr: "Outre le prix d'achat : frais de transfert (environ 2%), frais juridiques, éventuelle rénovation, licence d'exploitation. Nous détaillons tous les coûts en toute transparence avant tout engagement.",
      en: "Besides the purchase price: transfer fees (about 2%), legal fees, potential renovation, operating license. We detail all costs with full transparency before any commitment.",
      ru: "Помимо цены покупки: сборы за передачу (около 2%), юридические расходы, возможный ремонт, лицензия на деятельность. Мы подробно описываем все расходы с полной прозрачностью.",
    },
  },
  {
    q: {
      fr: "SiamLuxe prend-il une commission ?",
      en: "Does SiamLuxe take a commission?",
      ru: "Берёт ли SiamLuxe комиссию?",
    },
    a: {
      fr: "Notre commission est incluse dans le prix affiché. Pas de frais cachés ni de surprises. Le prix que vous voyez est le prix que vous payez.",
      en: "Our commission is included in the displayed price. No hidden fees or surprises. The price you see is the price you pay.",
      ru: "Наша комиссия включена в указанную цену. Никаких скрытых платежей. Цена, которую вы видите — это цена, которую вы платите.",
    },
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gold/10">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="font-[var(--font-playfair)] text-base sm:text-lg font-medium text-text-primary pr-4 group-hover:text-gold-dark transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 font-[var(--font-cormorant)] text-base text-text-secondary leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AboutClient() {
  const t = useTranslations("about");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30 });
  const missionRef = useScrollReveal<HTMLDivElement>({ y: 30 });
  const whyRef = useScrollReveal<HTMLDivElement>({ y: 30 });
  const faqRef = useScrollReveal<HTMLDivElement>({ y: 30 });

  // Detect locale from translations (hack: check if mission text contains specific language patterns)
  const locale = t("mission") === "Notre Mission" ? "fr" : t("mission") === "Our Mission" ? "en" : "ru";

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div
        ref={headerRef}
        className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 bg-brown-deep text-center overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-3xl px-5">
          <h1 className="font-[var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("title")}
          </h1>
          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold-light/60 to-transparent mb-4" />
          <p className="font-[var(--font-cormorant)] text-lg sm:text-xl text-white/60">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 sm:py-20">
        {/* Mission */}
        <section ref={missionRef} className="mb-16">
          <h2 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            {t("mission")}
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-gold/60 to-transparent mb-6" />
          <p className="font-[var(--font-cormorant)] text-lg text-text-secondary leading-relaxed">
            {t("missionText")}
          </p>
        </section>

        {/* Why Bangkok */}
        <section ref={whyRef} className="mb-16">
          <h2 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            {t("whyBangkok")}
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-gold/60 to-transparent mb-6" />
          <p className="font-[var(--font-cormorant)] text-lg text-text-secondary leading-relaxed mb-8">
            {t("whyBangkokText")}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, value: "22M+", label: locale === "fr" ? "Touristes/an" : locale === "en" ? "Tourists/year" : "Туристов/год" },
              { icon: Globe, value: "180+", label: locale === "fr" ? "Nationalités" : locale === "en" ? "Nationalities" : "Национальностей" },
              { icon: MapPin, value: "15+", label: locale === "fr" ? "Quartiers expats" : locale === "en" ? "Expat districts" : "Экспат-районов" },
              { icon: ShieldCheck, value: "4.8★", label: "Google Rating" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white-soft rounded-xl border border-gold/10 p-5 text-center">
                <Icon className="w-6 h-6 text-gold mx-auto mb-2" strokeWidth={1.5} />
                <p className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary">{value}</p>
                <p className="font-[var(--font-montserrat)] text-[10px] font-medium tracking-wider uppercase text-text-secondary mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section ref={faqRef}>
          <h2 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            {t("faq")}
          </h2>
          <div className="w-12 h-px bg-gradient-to-r from-gold/60 to-transparent mb-6" />

          <div className="bg-white-soft rounded-xl border border-gold/10 px-6 sm:px-8">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                question={item.q[locale as keyof typeof item.q] || item.q.fr}
                answer={item.a[locale as keyof typeof item.a] || item.a.fr}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
