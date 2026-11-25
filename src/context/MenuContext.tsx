import React, { createContext, useContext, useState, useMemo } from 'react';
import { Category, Product } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/initialData';

interface MenuContextType {
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  availabilityFilter: 'all' | 'available_only';
  setAvailabilityFilter: (filter: 'all' | 'available_only') => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Static, reliable, high-performance local menu data
  const categories = useMemo(() => INITIAL_CATEGORIES, []);
  const products = useMemo(() => INITIAL_PRODUCTS, []);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available_only'>('all');

  return (
    <MenuContext.Provider
      value={{
        categories,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        availabilityFilter,
        setAvailabilityFilter,
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
