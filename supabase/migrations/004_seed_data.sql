-- ============================================
-- SiamLuxe — Seed Data (Demo Salons & Testimonials)
-- Run this AFTER creating an admin user in Supabase Auth
-- ============================================

-- SALONS
INSERT INTO salons (id, slug, status, price_thb, price_eur, surface_sqm, district, address, latitude, longitude, title_fr, title_en, title_ru, description_fr, description_en, description_ru, categories, amenities, contact_whatsapp, contact_line, contact_email, featured) VALUES
(
  'a1b2c3d4-0001-4000-8000-000000000001',
  'luxe-spa-sukhumvit',
  'published',
  2800000, 72000, 120,
  'Sukhumvit', 'Sukhumvit Soi 24, Bangkok',
  13.7225, 100.5688,
  'Luxe Spa & Massage — Sukhumvit',
  'Luxe Spa & Massage — Sukhumvit',
  'Люкс Спа и Массаж — Сукхумвит',
  'Magnifique spa de 120m² situé au cœur de Sukhumvit Soi 24, à proximité du BTS Phrom Phong. 6 salles de massage privées entièrement équipées, réception élégante, zone d''attente avec service thé. Personnel qualifié de 8 thérapeutes inclus. Clientèle fidèle d''expatriés et touristes. Décoration haut de gamme récemment rénovée. Bail commercial de 3 ans restant avec option de renouvellement.',
  'Beautiful 120sqm spa located in the heart of Sukhumvit Soi 24, near BTS Phrom Phong. 6 fully equipped private massage rooms, elegant reception, waiting area with tea service. Qualified staff of 8 therapists included. Loyal clientele of expats and tourists. Recently renovated upscale decor. 3-year commercial lease remaining with renewal option.',
  'Прекрасный спа-салон площадью 120м², расположенный в самом сердце Сукхумвит Сой 24, рядом с BTS Phrom Phong. 6 полностью оборудованных приватных массажных комнат, элегантная стойка ресепшн, зона ожидания с чайным сервисом.',
  '{spa,massage}',
  '{aircon,wifi,equipment_included,staff_included,private_rooms,reception}',
  '+66812345678', 'siamluxe', 'contact@siamluxe.com',
  true
),
(
  'a1b2c3d4-0002-4000-8000-000000000002',
  'nail-art-studio-thonglor',
  'published',
  1500000, 38500, 65,
  'Thonglor', 'Thonglor Soi 13, Bangkok',
  13.7300, 100.5850,
  'Nail Art Studio Premium — Thonglor',
  'Premium Nail Art Studio — Thonglor',
  'Премиум Студия Маникюра — Тонглор',
  'Studio de nail art tendance de 65m² dans le quartier branché de Thonglor. 8 postes de manucure/pédicure, zone de nail art avec éclairage professionnel, coin attente cosy. Équipement complet inclus (UV, matériel gel, vernis haut de gamme). Clientèle jeune et fidèle, forte présence Instagram.',
  'Trendy 65sqm nail art studio in the hip Thonglor district. 8 manicure/pedicure stations, nail art zone with professional lighting, cozy waiting corner. Complete equipment included (UV, gel supplies, premium polish). Young and loyal clientele, strong Instagram presence.',
  'Модная студия нейл-арта площадью 65м² в стильном районе Тонглор. 8 мест для маникюра/педикюра, зона нейл-арта с профессиональным освещением, уютная зона ожидания.',
  '{nails}',
  '{aircon,wifi,equipment_included,staff_included}',
  '+66812345678', 'siamluxe', 'contact@siamluxe.com',
  true
),
(
  'a1b2c3d4-0003-4000-8000-000000000003',
  'thai-massage-center-silom',
  'published',
  3500000, 90000, 180,
  'Silom', 'Silom Soi 6, Bangkok',
  13.7260, 100.5340,
  'Centre de Massage Thaï — Silom',
  'Thai Massage Center — Silom',
  'Центр Тайского Массажа — Силом',
  'Grand centre de massage thaï traditionnel de 180m² sur Silom Soi 6. 10 espaces de massage (dont 4 privés), salle commune style traditionnel thaïlandais, zone d''herbes et aromathérapie. Emplacement stratégique entre BTS Sala Daeng et MRT Silom. Clientèle mixte touristes/business. Équipe de 12 masseurs/masseuses certifiés. Licence Wat Pho.',
  'Large 180sqm traditional Thai massage center on Silom Soi 6. 10 massage areas (including 4 private), traditional Thai-style common room, herbal and aromatherapy zone. Strategic location between BTS Sala Daeng and MRT Silom. Mixed tourist/business clientele. Team of 12 certified massage therapists. Wat Pho licensed.',
  'Большой центр традиционного тайского массажа площадью 180м² на Силом Сой 6. 10 зон для массажа (включая 4 приватных), общая комната в традиционном тайском стиле, зона травяной ароматерапии.',
  '{massage}',
  '{aircon,wifi,equipment_included,staff_included,private_rooms,shower,reception,storage}',
  '+66812345678', 'siamluxe', 'contact@siamluxe.com',
  true
),
(
  'a1b2c3d4-0004-4000-8000-000000000004',
  'beauty-lounge-asoke',
  'published',
  4200000, 108000, 200,
  'Asoke', 'Asoke Montri Road, Bangkok',
  13.7380, 100.5610,
  'Beauty Lounge Multi-services — Asoke',
  'Multi-service Beauty Lounge — Asoke',
  'Мультисервисный Бьюти Лаунж — Асоке',
  'Espace beauté complet de 200m² au cœur d''Asoke. Coiffure, soins du visage, massage, ongles — tout en un. 15 postes de travail, 3 cabines privées, espace VIP. Design contemporain, équipement dernier cri. Clientèle haut de gamme d''expatriés et femmes d''affaires. Bail de 5 ans, excellent retour sur investissement.',
  'Complete 200sqm beauty space in the heart of Asoke. Hair, facial care, massage, nails — all in one. 15 workstations, 3 private cabins, VIP area. Contemporary design, state-of-the-art equipment. High-end clientele of expats and businesswomen. 5-year lease, excellent ROI.',
  'Полное бьюти-пространство площадью 200м² в самом сердце Асоке. Парикмахерская, уход за лицом, массаж, маникюр — всё в одном. 15 рабочих мест, 3 приватные кабины, VIP-зона.',
  '{multi,hair,nails,massage}',
  '{aircon,wifi,parking,equipment_included,staff_included,private_rooms,shower,reception,storage}',
  '+66812345678', 'siamluxe', 'contact@siamluxe.com',
  true
),
(
  'a1b2c3d4-0005-4000-8000-000000000005',
  'zen-wellness-ekkamai',
  'published',
  1900000, 49000, 95,
  'Ekkamai', 'Ekkamai Soi 10, Bangkok',
  13.7220, 100.5870,
  'Zen Wellness & Sauna — Ekkamai',
  'Zen Wellness & Sauna — Ekkamai',
  'Зен Велнес и Сауна — Экамай',
  'Concept wellness unique de 95m² à Ekkamai : sauna traditionnel, hammam, massages aux herbes thaïlandaises. Ambiance zen avec jardin intérieur et fontaine. 4 cabines de soins, 1 sauna, 1 hammam. Concept original très bien noté sur Google Maps (4.8★). Idéal pour un entrepreneur passionné de bien-être.',
  'Unique 95sqm wellness concept in Ekkamai: traditional sauna, steam room, Thai herbal massages. Zen atmosphere with indoor garden and fountain. 4 treatment rooms, 1 sauna, 1 steam room. Original concept highly rated on Google Maps (4.8★).',
  'Уникальная велнес-концепция площадью 95м² в Экамае: традиционная сауна, хаммам, тайские травяные массажи. Атмосфера дзен с внутренним садом и фонтаном.',
  '{sauna,spa,massage}',
  '{aircon,wifi,equipment_included,private_rooms,shower}',
  '+66812345678', 'siamluxe', 'contact@siamluxe.com',
  false
);

-- SALON PHOTOS (Unsplash URLs as placeholders — replace with Supabase Storage URLs in production)
INSERT INTO salon_photos (salon_id, storage_path, url, position) VALUES
-- Salon 1: Luxe Spa Sukhumvit
('a1b2c3d4-0001-4000-8000-000000000001', 'salon-1/photo-1.jpg', 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80&auto=format&fit=crop', 0),
('a1b2c3d4-0001-4000-8000-000000000001', 'salon-1/photo-2.jpg', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop', 1),
('a1b2c3d4-0001-4000-8000-000000000001', 'salon-1/photo-3.jpg', 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80&auto=format&fit=crop', 2),
('a1b2c3d4-0001-4000-8000-000000000001', 'salon-1/photo-4.jpg', 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80&auto=format&fit=crop', 3),
-- Salon 2: Nail Art Thonglor
('a1b2c3d4-0002-4000-8000-000000000002', 'salon-2/photo-1.jpg', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80&auto=format&fit=crop', 0),
('a1b2c3d4-0002-4000-8000-000000000002', 'salon-2/photo-2.jpg', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80&auto=format&fit=crop', 1),
('a1b2c3d4-0002-4000-8000-000000000002', 'salon-2/photo-3.jpg', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80&auto=format&fit=crop', 2),
('a1b2c3d4-0002-4000-8000-000000000002', 'salon-2/photo-4.jpg', 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&q=80&auto=format&fit=crop', 3),
-- Salon 3: Thai Massage Silom
('a1b2c3d4-0003-4000-8000-000000000003', 'salon-3/photo-1.jpg', 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&q=80&auto=format&fit=crop', 0),
('a1b2c3d4-0003-4000-8000-000000000003', 'salon-3/photo-2.jpg', 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80&auto=format&fit=crop', 1),
('a1b2c3d4-0003-4000-8000-000000000003', 'salon-3/photo-3.jpg', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80&auto=format&fit=crop', 2),
('a1b2c3d4-0003-4000-8000-000000000003', 'salon-3/photo-4.jpg', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80&auto=format&fit=crop', 3),
-- Salon 4: Beauty Lounge Asoke
('a1b2c3d4-0004-4000-8000-000000000004', 'salon-4/photo-1.jpg', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop', 0),
('a1b2c3d4-0004-4000-8000-000000000004', 'salon-4/photo-2.jpg', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&auto=format&fit=crop', 1),
('a1b2c3d4-0004-4000-8000-000000000004', 'salon-4/photo-3.jpg', 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&q=80&auto=format&fit=crop', 2),
('a1b2c3d4-0004-4000-8000-000000000004', 'salon-4/photo-4.jpg', 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80&auto=format&fit=crop', 3),
-- Salon 5: Zen Wellness Ekkamai
('a1b2c3d4-0005-4000-8000-000000000005', 'salon-5/photo-1.jpg', 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80&auto=format&fit=crop', 0),
('a1b2c3d4-0005-4000-8000-000000000005', 'salon-5/photo-2.jpg', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80&auto=format&fit=crop', 1),
('a1b2c3d4-0005-4000-8000-000000000005', 'salon-5/photo-3.jpg', 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&q=80&auto=format&fit=crop', 2),
('a1b2c3d4-0005-4000-8000-000000000005', 'salon-5/photo-4.jpg', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop', 3);

-- TESTIMONIALS
INSERT INTO testimonials (author_name, author_nationality, author_avatar_url, quote_fr, quote_en, quote_ru, rating, position, visible) VALUES
(
  'Pierre Dubois', 'Français',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop&crop=face',
  'Grâce à SiamLuxe, j''ai trouvé mon spa idéal à Sukhumvit en moins de 3 semaines. L''accompagnement était exceptionnel, du premier contact jusqu''à la signature. Je recommande vivement.',
  'Thanks to SiamLuxe, I found my ideal spa in Sukhumvit in less than 3 weeks. The support was exceptional, from the first contact to the signing. Highly recommended.',
  'Благодаря SiamLuxe я нашёл свой идеальный спа в Сукхумвит менее чем за 3 недели. Сопровождение было исключительным.',
  5, 0, true
),
(
  'Sarah Mitchell', 'British',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80&auto=format&fit=crop&crop=face',
  'Professionnalisme et transparence. L''équipe m''a aidé à comprendre les aspects légaux thaïlandais et à négocier un prix juste. Mon nail salon à Thonglor est un succès !',
  'Professionalism and transparency. The team helped me understand Thai legal aspects and negotiate a fair price. My nail salon in Thonglor is a success!',
  'Профессионализм и прозрачность. Команда помогла мне разобраться в тайских юридических аспектах.',
  5, 1, true
),
(
  'Анатолий Петров', 'Русский',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&auto=format&fit=crop&crop=face',
  'Service en russe impeccable. J''avais des doutes sur l''investissement à Bangkok, mais SiamLuxe a tout clarifié. Mon centre de massage tourne à plein régime depuis 6 mois.',
  'Impeccable service in Russian. I had doubts about investing in Bangkok, but SiamLuxe clarified everything. My massage center has been running at full capacity for 6 months.',
  'Безупречный сервис на русском языке. У меня были сомнения по поводу инвестиций в Бангкок, но SiamLuxe всё разъяснил. Мой массажный центр работает на полную мощность уже 6 месяцев.',
  5, 2, true
),
(
  'Marie Laurent', 'Française',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80&auto=format&fit=crop&crop=face',
  'Une expérience cinq étoiles. La sélection des salons est vraiment triée sur le volet. On sent le sérieux et l''expertise locale. Merci SiamLuxe !',
  'A five-star experience. The salon selection is truly hand-picked. You can feel the seriousness and local expertise. Thank you SiamLuxe!',
  'Пятизвёздочный опыт. Подбор салонов действительно тщательный. Чувствуется серьёзность и местная экспертиза. Спасибо SiamLuxe!',
  5, 3, true
);
