-- ============================================
-- SiamLuxe — Row Level Security Policies
-- ============================================

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- PROFILES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can view profiles (for display names, avatars)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile (e.g., change roles)
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (public.is_admin());

-- ============================================
-- SALONS
-- ============================================
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;

-- Anyone can view published salons
CREATE POLICY "Published salons are viewable by everyone"
  ON salons FOR SELECT
  USING (status = 'published');

-- Admins can view all salons (including drafts)
CREATE POLICY "Admins can view all salons"
  ON salons FOR SELECT
  USING (public.is_admin());

-- Admins can insert salons
CREATE POLICY "Admins can insert salons"
  ON salons FOR INSERT
  WITH CHECK (public.is_admin());

-- Admins can update salons
CREATE POLICY "Admins can update salons"
  ON salons FOR UPDATE
  USING (public.is_admin());

-- Admins can delete salons
CREATE POLICY "Admins can delete salons"
  ON salons FOR DELETE
  USING (public.is_admin());

-- ============================================
-- SALON PHOTOS
-- ============================================
ALTER TABLE salon_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can view photos (they belong to viewable salons)
CREATE POLICY "Photos are viewable by everyone"
  ON salon_photos FOR SELECT
  USING (true);

-- Admins can manage photos
CREATE POLICY "Admins can insert photos"
  ON salon_photos FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update photos"
  ON salon_photos FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete photos"
  ON salon_photos FOR DELETE
  USING (public.is_admin());

-- ============================================
-- FAVORITES
-- ============================================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CONTACT REQUESTS
-- ============================================
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact request
CREATE POLICY "Anyone can insert contact requests"
  ON contact_requests FOR INSERT
  WITH CHECK (true);

-- Admins can view all contact requests
CREATE POLICY "Admins can view contact requests"
  ON contact_requests FOR SELECT
  USING (public.is_admin());

-- Users can view their own contact requests
CREATE POLICY "Users can view own contact requests"
  ON contact_requests FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- TESTIMONIALS
-- ============================================
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view visible testimonials
CREATE POLICY "Visible testimonials are viewable by everyone"
  ON testimonials FOR SELECT
  USING (visible = true);

-- Admins can view all testimonials
CREATE POLICY "Admins can view all testimonials"
  ON testimonials FOR SELECT
  USING (public.is_admin());

-- Admins can manage testimonials
CREATE POLICY "Admins can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete testimonials"
  ON testimonials FOR DELETE
  USING (public.is_admin());
