# SiamLuxe

Marketplace premium de salons de beaute a vendre a Bangkok. Site vitrine multilingue (FR/EN/RU) ciblant les expatries et investisseurs internationaux.

## Stack

- **Framework** : Next.js 16 (App Router)
- **Styling** : Tailwind CSS 4
- **Animations** : GSAP (ScrollTrigger, parallax) + Framer Motion (transitions)
- **Backend** : Supabase (PostgreSQL, Auth, Storage, RLS)
- **i18n** : next-intl (fr, en, ru)
- **Fonts** : Playfair Display, Cormorant Garamond, Montserrat
- **Smooth Scroll** : Lenis
- **Carousel** : Embla Carousel

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Creer un fichier `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
```

## Base de donnees

Les migrations SQL sont dans `supabase/migrations/` :

1. `001_initial_schema.sql` — Tables (profiles, salons, salon_photos, favorites, contact_requests, testimonials)
2. `002_rls_policies.sql` — Row Level Security
3. `003_storage.sql` — Buckets photos et videos
4. `004_seed_data.sql` — Donnees de demo (5 salons, 4 temoignages)

## Deploiement Vercel

1. Connecter le repo GitHub a Vercel
2. Configurer les variables d'environnement Supabase dans les settings Vercel
3. La region de deploiement est configuree sur Singapore (`sin1`) dans `vercel.json` pour la proximite avec Bangkok
4. Vercel detecte automatiquement Next.js — aucune config build supplementaire requise

## Structure

```
src/
  app/[locale]/        Pages (home, salons, about, contact, account, admin)
  components/          Composants React (layout, home, salons, admin, ui, shared)
  lib/                 Supabase clients, utilitaires, constantes, structured data
  hooks/               Hooks custom (scroll reveal, favoris)
  messages/            Traductions (fr.json, en.json, ru.json)
  types/               Types TypeScript
  styles/              CSS global + variables
```
