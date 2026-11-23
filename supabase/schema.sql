-- ========================================================
-- NELLAI LALA SWEETS - SUPABASE DATABASE SCHEMA & RLS SETUP
-- Vedasandur, Tamil Nadu, India
-- ========================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    default_price NUMERIC(10, 2) NOT NULL DEFAULT 400.00,
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
-- Customers (public anon) can ONLY read categories
CREATE POLICY "Public Read Categories" 
ON public.categories FOR SELECT 
TO anon, authenticated 
USING (true);

-- Authenticated Shop Owners can manage categories
CREATE POLICY "Admin Insert Categories" 
ON public.categories FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admin Update Categories" 
ON public.categories FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Admin Delete Categories" 
ON public.categories FOR DELETE 
TO authenticated 
USING (true);

-- 5. RLS Policies for Products
-- Customers (public anon) can ONLY read products
CREATE POLICY "Public Read Products" 
ON public.products FOR SELECT 
TO anon, authenticated 
USING (true);

-- Authenticated Shop Owners can manage products
CREATE POLICY "Admin Insert Products" 
ON public.products FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admin Update Products" 
ON public.products FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Admin Delete Products" 
ON public.products FOR DELETE 
TO authenticated 
USING (true);

-- 6. Storage Bucket for Product Photographs
-- Run this in Supabase SQL Editor to set up public storage for product photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for images
CREATE POLICY "Public View Product Images" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'product-images');

-- Authenticated admin upload access
CREATE POLICY "Admin Upload Product Images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin Delete Product Images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');

-- 7. Seed Initial Categories
INSERT INTO public.categories (id, name_en, name_ta, default_price, unit, sort_order, description_en, description_ta)
VALUES
  ('sweets', 'Sweets', 'ஸ்வீட்ஸ்', 400.00, '1 kg', 1, 'Traditional Indian sweets made with pure sugar and time-honored recipes', 'பாரம்பரிய முறைப்படி சுவை மாறாமல் தயாரிக்கப்படும் இனிப்பு வகைகள்'),
  ('savories', 'Savories', 'காரம்', 400.00, '1 kg', 2, 'Crispy, crunchy and authentic South Indian savory snacks', 'மொறுமொறுப்பான, நாவில் கரையும் பாரம்பரிய கார வகைகள்'),
  ('special-sweets', 'Special Sweets', 'ஸ்பெஷல் ஸ்வீட்ஸ்', 500.00, '1 kg', 3, 'Exclusive festival specials crafted for celebration', 'விசேஷ கொண்டாட்டங்களுக்கான தனித்துவமான ஸ்பெஷல் இனிப்புகள்'),
  ('milk-sweets', 'Milk Sweets', 'மில்க் ஸ்வீட்ஸ்', 600.00, '1 kg', 4, 'Rich sweets crafted from pure farm-fresh condensed milk', 'பசும்பாலின் சுவையோடு நாவில் கரையும் சுவையான பால் இனிப்புகள்'),
  ('ghee-sweets', 'Ghee Sweets', 'நெய் ஸ்வீட்ஸ்', 800.00, '1 kg', 5, 'Aromatic sweets prepared in 100% pure country cow ghee', '100% சுத்தமான பசு நெய்யில் மணக்க மணக்க தயாரிக்கப்படும் நெய் இனிப்புகள்'),
  ('potato-chips', 'Potato Chips', 'உருளைகிழங்கு சிப்ஸ்', 500.00, '1 kg', 6, 'Thinly sliced crispy farm-fresh potato chips', 'மொறுமொறுப்பான உருளைக்கிழங்கு சிப்ஸ் - சால்ட் & மசாலா சுவைகளில்'),
  ('cashew-cake', 'Cashew Cake', 'முந்திரி கேக்', 1000.00, '1 kg', 7, 'Melt-in-mouth royal cashew cake made with premium cashews', 'உயர்தர முந்திரியில் நேர்த்தியாக தயாரிக்கப்படும் முந்திரி கேக்')
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Initial Products (Including Section 5 requirements)
INSERT INTO public.products (id, category_id, name_en, name_ta, price, unit, is_available, image_url, description_en, description_ta, is_featured)
VALUES
  ('milk-palkova', 'milk-sweets', 'Palkova', 'பால்கோவா', 600.00, '1 kg', true, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80', 'Rich slow-cooked caramelized milk sweet', 'சுத்தமான பசும்பாலில் சுண்டி எடுக்கப்பட்ட பாரம்பரிய சுவையான பால்கோவா', true),
  ('milk-chocolate-roll', 'milk-sweets', 'Chocolate Roll', 'சாக்லேட் ரோல்', 600.00, '1 kg', true, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', 'Velvety condensed milk roll blended with rich cocoa chocolate', 'பால் கோவாவும் சாக்லேட்டும் இணைந்த குழந்தைகள் விரும்பும் சுவை', true),
  ('milk-gova-roll', 'milk-sweets', 'Gova Roll', 'கோவா ரோல்', 600.00, '1 kg', true, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80', 'Soft milk khoya fudge roll layered with cardamom', 'ஏலக்காய் மணத்துடன் மென்மையாக சுருட்டப்பட்ட பாரம்பரிய கோவா ரோல்', false),
  ('sweet-mysore-pak', 'sweets', 'Mysore Pak', 'மைசூர் பாக்', 400.00, '1 kg', true, 'https://images.unsplash.com/photo-1505253758473-96b46deae6cd?w=600&auto=format&fit=crop&q=80', 'Traditional porous gram flour sweet delicately soaked in syrup', 'பாரம்பரிய முறையில் கடலை மாவில் தயாரிக்கப்பட்ட சுவையான மைசூர் பாக்', true),
  ('sweet-laddu', 'sweets', 'Boondi Laddu', 'பூந்தி லட்டு', 400.00, '1 kg', true, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80', 'Golden aromatic pearls of boondi infused with cardamom', 'முந்திரி, ஏலக்காய் நறுமணத்துடன் பொன்னிற பூந்தி லட்டு', true),
  ('savory-special-mixture', 'savories', 'Special Mixture', 'ஸ்பெஷல் மிக்ஸர்', 400.00, '1 kg', true, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80', 'Crispy blend of boondi, sev, peanuts, curry leaves', 'வேர்க்கடலை, பொட்டுக்கடலை, கறிவேப்பிலை மணக்கும் மிக்ஸர்', true),
  ('ghee-pure-mysore-pak', 'ghee-sweets', 'Pure Ghee Mysore Pak', 'சுத்த நெய் மைசூர் பாக்', 800.00, '1 kg', true, 'https://images.unsplash.com/photo-1505253758473-96b46deae6cd?w=600&auto=format&fit=crop&q=80', 'Melt-in-mouth soft texture cooked in 100% cow ghee', '100% தூய பசு நெய்யில் நாவில் கரையும் நெய் மைசூர் பாக்', true),
  ('chips-classic-salt', 'potato-chips', 'Classic Salt Potato Chips', 'உருளைக்கிழங்கு உப்பு சிப்ஸ்', 500.00, '1 kg', true, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80', 'Ultra-thin crisp wafers lightly tossed with pure rock salt', 'மொறுமொறுப்பான உருளைக்கிழங்கு சிப்ஸ்', true),
  ('chips-spicy-masala', 'potato-chips', 'Spicy Masala Potato Chips', 'உருளைக்கிழங்கு மசாலா சிப்ஸ்', 500.00, '1 kg', true, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&auto=format&fit=crop&q=80', 'Crispy wafer chips dusted with traditional chili blend', 'காரசாரமான சுவையான மசாலா உருளைக்கிழங்கு சிப்ஸ்', true),
  ('cashew-cake-kaju-katli', 'cashew-cake', 'Cashew Cake (Kaju Katli)', 'முந்திரி கேக் (காஜு கத்லி)', 1000.00, '1 kg', true, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80', 'Diamond-cut royal delicacy made with 100% premium cashews', 'உயர்தர முழு முந்திரி பருப்பில் நேர்த்தியாக செய்யப்பட்ட முந்திரி கேக்', true)
ON CONFLICT (id) DO NOTHING;
