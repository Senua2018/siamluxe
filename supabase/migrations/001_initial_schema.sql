-- ============================================
-- SiamLuxe — Initial Database Schema
-- ============================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'fr' CHECK (preferred_language IN ('fr', 'en', 'ru')),
  nationality TEXT,
  role TEXT DEFAULT 'visitor' CHECK (role IN ('visitor', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'fr')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 2. SALONS
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  price_usd NUMERIC,
  price_thb NUMERIC,
  price_eur NUMERIC,
  monthly_revenue_usd NUMERIC,
  rooms_count INTEGER,
  surface_sqm NUMERIC,
  district TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  title_fr TEXT NOT NULL,
  title_en TEXT,
  title_ru TEXT,
  description_fr TEXT,
  description_en TEXT,
  description_ru TEXT,
  categories TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  contact_whatsapp TEXT,
  contact_line TEXT,
  contact_email TEXT,
  video_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_salons_status ON salons(status);
CREATE INDEX idx_salons_district ON salons(district);
CREATE INDEX idx_salons_featured ON salons(featured) WHERE featured = true;
CREATE INDEX idx_salons_slug ON salons(slug);

CREATE TRIGGER salons_updated_at
  BEFORE UPDATE ON salons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 3. SALON PHOTOS
CREATE TABLE salon_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_salon_photos_salon ON salon_photos(salon_id);

-- 4. FAVORITES
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, salon_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- 5. CONTACT REQUESTS
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id),
  user_id UUID REFERENCES profiles(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  channel TEXT CHECK (channel IN ('whatsapp', 'line', 'email', 'form')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contact_requests_salon ON contact_requests(salon_id);

-- 6. TESTIMONIALS
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_nationality TEXT,
  author_avatar_url TEXT,
  quote_fr TEXT NOT NULL,
  quote_en TEXT,
  quote_ru TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  position INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
