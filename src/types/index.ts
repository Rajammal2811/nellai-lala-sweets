export interface Category {
  id: string;
  name_en: string;
  name_ta: string;
  standard_price_info?: string;
  sort_order: number;
  description_en?: string;
  description_ta?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name_en: string;
  name_ta: string;
  price: number | null; // null if unconfirmed -> displays 'Price on request'
  unit?: string; // e.g. '1 kg', 'piece'
  is_available: boolean;
  image_url: string;
  description_en?: string;
  description_ta?: string;
  is_featured?: boolean;
}

export interface ShopInfo {
  name_en: string;
  name_ta: string;
  brand_en: string;
  brand_ta: string;
  tagline_en: string;
  tagline_ta: string;
  location_en: string;
  location_ta: string;
  phone: string;
  phone_secondary: string;
  whatsapp: string;
}
