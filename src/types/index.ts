export interface Category {
  id: string;
  name_en: string;
  name_ta: string;
  default_price: number;
  unit: string;
  sort_order: number;
  description_en?: string;
  description_ta?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name_en: string;
  name_ta: string;
  price: number;
  unit: string;
  is_available: boolean;
  image_url: string;
  description_en?: string;
  description_ta?: string;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShopInfo {
  name_en: string;
  name_ta: string;
  tagline_en: string;
  tagline_ta: string;
  location_en: string;
  location_ta: string;
  address_en: string;
  address_ta: string;
  phone: string;
  phone_secondary?: string;
  whatsapp?: string;
  timing_en: string;
  timing_ta: string;
  google_maps_url?: string;
}
