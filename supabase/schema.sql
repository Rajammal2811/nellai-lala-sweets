-- ========================================================
-- NELLAI LALA SWEETS - PRODUCTION SUPABASE DATABASE SCHEMA
-- Sri Murugan Vilas - Nellai Lala Sweets
-- Location: Vedasandur, Tamil Nadu, India
-- Phone: 99445 00030 / 88701 20110
-- ========================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    default_price NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT '1 kg',
    sort_order INTEGER NOT NULL DEFAULT 1,
    description_en TEXT,
    description_ta TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT '1 kg',
    is_available BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT NOT NULL,
    description_en TEXT,
    description_ta TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Categories
-- Customers (public anonymous) can ONLY read categories
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" 
ON public.categories FOR SELECT 
TO anon, authenticated 
USING (true);

-- Authenticated Shop Owners can manage categories
DROP POLICY IF EXISTS "Admin Insert Categories" ON public.categories;
CREATE POLICY "Admin Insert Categories" 
ON public.categories FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Update Categories" ON public.categories;
CREATE POLICY "Admin Update Categories" 
ON public.categories FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Delete Categories" ON public.categories;
CREATE POLICY "Admin Delete Categories" 
ON public.categories FOR DELETE 
TO authenticated 
USING (true);

-- 5. RLS Policies for Products
-- Customers (public anonymous) can ONLY read products
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" 
ON public.products FOR SELECT 
TO anon, authenticated 
USING (true);

-- Authenticated Shop Owners can manage products
DROP POLICY IF EXISTS "Admin Insert Products" ON public.products;
CREATE POLICY "Admin Insert Products" 
ON public.products FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Update Products" ON public.products;
CREATE POLICY "Admin Update Products" 
ON public.products FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Delete Products" ON public.products;
CREATE POLICY "Admin Delete Products" 
ON public.products FOR DELETE 
TO authenticated 
USING (true);

-- 6. Storage Bucket for Product Photographs
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for images
DROP POLICY IF EXISTS "Public View Product Images" ON storage.objects;
CREATE POLICY "Public View Product Images" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'product-images');

-- Authenticated admin upload access
DROP POLICY IF EXISTS "Admin Upload Product Images" ON storage.objects;
CREATE POLICY "Admin Upload Product Images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Delete Product Images" ON storage.objects;
CREATE POLICY "Admin Delete Product Images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');

-- 7. Clean out any legacy milk-sweets category if previously present
DELETE FROM public.categories WHERE id = 'milk-sweets';

-- 8. Seed EXACTLY SIX Confirmed Categories
INSERT INTO public.categories (id, name_en, name_ta, default_price, unit, sort_order, description_en, description_ta)
VALUES
  ('sweets', 'Sweets', 'ஸ்வீட்ஸ்', 400.00, '1 kg', 1, 'Traditional Indian sweets prepared with authentic time-honored recipes', 'பாரம்பரிய முறைப்படி சுவை மாறாமல் தயாரிக்கப்படும் இனிப்பு வகைகள்'),
  ('savories', 'Savories', 'காரம்', 400.00, '1 kg', 2, 'Crispy, crunchy authentic South Indian savory snacks', 'மொறுமொறுப்பான பாரம்பரிய கார வகைகள்'),
  ('special-sweets', 'Special Sweets', 'ஸ்பெஷல் ஸ்வீட்ஸ்', 500.00, '1 kg', 3, 'Exclusive festival delicacies crafted for celebrations', 'விசேஷ கொண்டாட்டங்களுக்கான தனித்துவமான ஸ்பெஷல் இனிப்புகள்'),
  ('ghee-sweets', 'Ghee Sweets', 'நெய் ஸ்வீட்ஸ்', 800.00, '1 kg', 4, 'Aromatic sweets prepared in 100% pure country cow ghee', '100% சுத்தமான பசு நெய்யில் மணக்க மணக்க தயாரிக்கப்படும் நெய் இனிப்புகள்'),
  ('potato-chips', 'Potato Chips', 'உருளைகிழங்கு சிப்ஸ்', 500.00, '1 kg', 5, 'Crispy wafer-thin potato chips prepared fresh with secret spices', 'மொறுமொறுப்பான உருளைக்கிழங்கு சிப்ஸ்'),
  ('cashew-cake', 'Cashew Cake', 'முந்திரி கேக்', 1000.00, '1 kg', 6, 'Royal delicacy made with premium grade whole cashews', 'உயர்தர முந்திரியில் நேர்த்தியாக தயாரிக்கப்படும் முந்திரி கேக் (Kaju Katli)')
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ta = EXCLUDED.name_ta,
  default_price = EXCLUDED.default_price,
  unit = EXCLUDED.unit,
  sort_order = EXCLUDED.sort_order,
  description_en = EXCLUDED.description_en,
  description_ta = EXCLUDED.description_ta;

-- 9. Seed Confirmed Products (Palkova, Chocolate Roll, Gova Roll under Sweets at ₹400/kg)
-- Remove any legacy invented mock items
DELETE FROM public.products WHERE id NOT IN (
  'sweet-palkova',
  'sweet-chocolate-roll',
  'sweet-gova-roll',
  'savory-standard',
  'special-sweet-standard',
  'ghee-sweet-standard',
  'potato-chips-standard',
  'cashew-cake-standard'
);

INSERT INTO public.products (id, category_id, name_en, name_ta, price, unit, is_available, image_url, description_en, description_ta, is_featured)
VALUES
  ('sweet-palkova', 'sweets', 'Palkova', 'பால்கோவா', 400.00, '1 kg', true, '/product-placeholder.svg', 'Rich traditional caramelized milk sweet', 'சுத்தமான பசும்பாலில் சுண்டி எடுக்கப்பட்ட பாரம்பரிய சுவையான பால்கோவா', true),
  ('sweet-chocolate-roll', 'sweets', 'Chocolate Roll', 'சாக்லேட் ரோல்', 400.00, '1 kg', true, '/product-placeholder.svg', 'Soft milk roll blended with rich cocoa chocolate', 'பால் கோவாவும் சாக்லேட்டும் இணைந்த குழந்தைகள் விரும்பும் சுவை', true),
  ('sweet-gova-roll', 'sweets', 'Gova Roll', 'கோவா ரோல்', 400.00, '1 kg', true, '/product-placeholder.svg', 'Soft milk khoya fudge roll layered with cardamom', 'ஏலக்காய் மணத்துடன் மென்மையாக சுருட்டப்பட்ட பாரம்பரிய கோவா ரோல்', true),
  ('savory-standard', 'savories', 'Savories', 'காரம்', 400.00, '1 kg', true, '/product-placeholder.svg', 'Assorted fresh traditional South Indian savory snacks', 'நாவில் கரையும் மொறுமொறுப்பான பாரம்பரிய கார பலகாரங்கள்', true),
  ('special-sweet-standard', 'special-sweets', 'Special Sweets', 'ஸ்பெஷல் ஸ்வீட்ஸ்', 500.00, '1 kg', true, '/product-placeholder.svg', 'Special festival sweets and seasonal celebration delicacies', 'விசேஷ கொண்டாட்டங்களுக்கான தனித்துவமான ஸ்பெஷல் இனிப்புகள்', true),
  ('ghee-sweet-standard', 'ghee-sweets', 'Ghee Sweets', 'நெய் ஸ்வீட்ஸ்', 800.00, '1 kg', true, '/product-placeholder.svg', 'Royal sweets prepared strictly in 100% pure cow ghee', '100% தூய நாட்டுப் பசு நெய்யில் தயாரிக்கப்படும் நெய் இனிப்புகள்', true),
  ('potato-chips-standard', 'potato-chips', 'Potato Chips', 'உருளைகிழங்கு சிப்ஸ்', 500.00, '1 kg', true, '/product-placeholder.svg', 'Crispy wafer-thin farm potato chips', 'மொறுமொறுப்பாக சீவப்பட்டு வறுத்த சுவையான உருளைக்கிழங்கு சிப்ஸ்', true),
  ('cashew-cake-standard', 'cashew-cake', 'Cashew Cake', 'முந்திரி கேக்', 1000.00, '1 kg', true, '/product-placeholder.svg', 'Royal delicacy made with 100% premium quality cashews (Kaju Katli)', 'உயர்தர முழு முந்திரி பருப்பில் நேர்த்தியாக செய்யப்பட்ட முந்திரி கேக்', true)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name_en = EXCLUDED.name_en,
  name_ta = EXCLUDED.name_ta,
  price = EXCLUDED.price,
  unit = EXCLUDED.unit,
  is_available = EXCLUDED.is_available,
  image_url = EXCLUDED.image_url,
  description_en = EXCLUDED.description_en,
  description_ta = EXCLUDED.description_ta,
  is_featured = EXCLUDED.is_featured;
