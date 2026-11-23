import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Product } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface MenuContextType {
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  isSyncing: boolean;
  isUsingMockData: boolean;
  error: string | null;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  availabilityFilter: 'all' | 'available_only';
  setAvailabilityFilter: (filter: 'all' | 'available_only') => void;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  toggleAvailability: (id: string) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshData: () => Promise<void>;
  resetToDefaultMenu: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const LOCAL_STORAGE_PRODUCTS_KEY = 'nellai_products_cache';
const LOCAL_STORAGE_CATEGORIES_KEY = 'nellai_categories_cache';

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(!isSupabaseConfigured);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available_only'>('all');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    if (isSupabaseConfigured) {
      try {
        const [catRes, prodRes] = await Promise.all([
          supabase.from('categories').select('*').order('sort_order', { ascending: true }),
          supabase.from('products').select('*').order('created_at', { ascending: false }),
        ]);

        if (catRes.error) throw catRes.error;
        if (prodRes.error) throw prodRes.error;

        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data as Category[]);
        } else {
          // If Supabase table is empty, seed it with initial categories
          setCategories(INITIAL_CATEGORIES);
        }

        if (prodRes.data && prodRes.data.length > 0) {
          setProducts(prodRes.data as Product[]);
        } else {
          // Seed with initial products
          setProducts(INITIAL_PRODUCTS);
        }
        setIsUsingMockData(false);
      } catch (err: any) {
        console.warn('Supabase fetch failed, falling back to local cached data:', err.message);
        loadLocalFallback();
      }
    } else {
      loadLocalFallback();
    }
    setIsLoading(false);
  };

  const loadLocalFallback = () => {
    setIsUsingMockData(true);
    const cachedProducts = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    const cachedCategories = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);

    if (cachedProducts) {
      try {
        setProducts(JSON.parse(cachedProducts));
      } catch {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }

    if (cachedCategories) {
      try {
        setCategories(JSON.parse(cachedCategories));
      } catch {
        setCategories(INITIAL_CATEGORIES);
        localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      }
    } else {
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    }
  };

  useEffect(() => {
    loadData();

    // Set up Supabase Realtime subscription if configured
    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('menu-realtime-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => {
            // Auto refresh products when owner updates
            refreshData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const refreshData = async () => {
    setIsSyncing(true);
    await loadData();
    setIsSyncing(false);
  };

  // Add Product
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<{ success: boolean; error?: string }> => {
    const newId = 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newProduct: Product = {
      ...productData,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) throw error;
        setProducts(prev => [newProduct, ...prev]);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    } else {
      const updated = [newProduct, ...products];
      setProducts(updated);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
      return { success: true };
    }
  };

  // Update Product
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<{ success: boolean; error?: string }> => {
    const timestamp = new Date().toISOString();
    const cleanUpdates = { ...updates, updated_at: timestamp };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('products').update(cleanUpdates).eq('id', id);
        if (error) throw error;
        setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...cleanUpdates } : p)));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    } else {
      const updated = products.map(p => (p.id === id ? { ...p, ...cleanUpdates } : p));
      setProducts(updated);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
      return { success: true };
    }
  };

  // Toggle Availability
  const toggleAvailability = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const target = products.find(p => p.id === id);
    if (!target) return { success: false, error: 'Product not found' };

    const newStatus = !target.is_available;
    return updateProduct(id, { is_available: newStatus });
  };

  // Delete Product
  const deleteProduct = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        setProducts(prev => prev.filter(p => p.id !== id));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    } else {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
      return { success: true };
    }
  };

  // Reset to Defaults (Useful for shop owner or demo test)
  const resetToDefaultMenu = async (): Promise<void> => {
    if (!isSupabaseConfigured) {
      setProducts(INITIAL_PRODUCTS);
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    }
  };

  return (
    <MenuContext.Provider
      value={{
        categories,
        products,
        isLoading,
        isSyncing,
        isUsingMockData,
        error,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        availabilityFilter,
        setAvailabilityFilter,
        addProduct,
        updateProduct,
        toggleAvailability,
        deleteProduct,
        refreshData,
        resetToDefaultMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within MenuProvider');
  return context;
};
