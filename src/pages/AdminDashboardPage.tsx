import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { Product } from '../types';
import { Logo } from '../components/Logo';
import { 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  AlertTriangle, 
  Save, 
  X, 
  RefreshCw,
  Search,
  Check,
  Eye,
  ShieldCheck,
  Database
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout, isMockAuth } = useAuth();
  const { 
    categories, 
    products, 
    addProduct, 
    updateProduct, 
    toggleAvailability, 
    deleteProduct, 
    refreshData,
    resetToDefaultMenu,
    isSyncing 
  } = useMenu();

  const navigate = useNavigate();

  // Search & Filter in Admin
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category_id: 'milk-sweets',
    name_en: '',
    name_ta: '',
    price: 600,
    unit: '1 kg',
    is_available: true,
    image_url: '',
    description_en: '',
    description_ta: '',
    is_featured: false,
  });

  // Modal State for Delete Confirmation
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Status message
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      category_id: categories[0]?.id || 'sweets',
      name_en: '',
      name_ta: '',
      price: categories[0]?.default_price || 400,
      unit: '1 kg',
      is_available: true,
      image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
      description_en: '',
      description_ta: '',
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      category_id: product.category_id,
      name_en: product.name_en,
      name_ta: product.name_ta,
      price: product.price,
      unit: product.unit || '1 kg',
      is_available: product.is_available,
      image_url: product.image_url,
      description_en: product.description_en || '',
      description_ta: product.description_ta || '',
      is_featured: Boolean(product.is_featured),
    });
    setIsModalOpen(true);
  };

  // Image file upload handler (converts file to base64 Data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showNotification('Image size should be under 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({ ...prev, image_url: event.target!.result as string }));
        showNotification('Product photo uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save product (Add or Edit)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_en.trim() || !formData.name_ta.trim()) {
      showNotification('Please enter both English and Tamil names', 'error');
      return;
    }

    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, {
        category_id: formData.category_id,
        name_en: formData.name_en.trim(),
        name_ta: formData.name_ta.trim(),
        price: Number(formData.price),
        unit: formData.unit,
        is_available: formData.is_available,
        image_url: formData.image_url.trim(),
        description_en: formData.description_en.trim(),
        description_ta: formData.description_ta.trim(),
        is_featured: formData.is_featured,
      });

      if (res.success) {
        showNotification(`Updated "${formData.name_en}" successfully!`);
        setIsModalOpen(false);
      } else {
        showNotification(res.error || 'Failed to update', 'error');
      }
    } else {
      const res = await addProduct({
        category_id: formData.category_id,
        name_en: formData.name_en.trim(),
        name_ta: formData.name_ta.trim(),
        price: Number(formData.price),
        unit: formData.unit,
        is_available: formData.is_available,
        image_url: formData.image_url.trim(),
        description_en: formData.description_en.trim(),
        description_ta: formData.description_ta.trim(),
        is_featured: formData.is_featured,
      });

      if (res.success) {
        showNotification(`Added new product "${formData.name_en}"!`);
        setIsModalOpen(false);
      } else {
        showNotification(res.error || 'Failed to add product', 'error');
      }
    }
  };

  // Instant 1-click availability toggle
  const handleToggle = async (product: Product) => {
    const res = await toggleAvailability(product.id);
    if (res.success) {
      const newStatus = !product.is_available;
      showNotification(
        `Marked "${product.name_en}" as ${newStatus ? 'AVAILABLE' : 'UNAVAILABLE'}`
      );
    } else {
      showNotification('Failed to toggle status', 'error');
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!productToDelete) return;
    const res = await deleteProduct(productToDelete.id);
    if (res.success) {
      showNotification(`Deleted "${productToDelete.name_en}"`);
      setProductToDelete(null);
    } else {
      showNotification(res.error || 'Failed to delete', 'error');
    }
  };

  // Filtered products list in dashboard
  const displayedProducts = products.filter(p => {
    if (adminCategory !== 'all' && p.category_id !== adminCategory) return false;
    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase().trim();
      return (
        p.name_en.toLowerCase().includes(q) ||
        p.name_ta.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const availableCount = products.filter(p => p.is_available).length;
  const unavailableCount = products.filter(p => !p.is_available).length;

  return (
    <div className="min-h-screen bg-[#F6F3EE] pb-20">
      
      {/* ======================================================== */}
      {/* 1. ADMIN HEADER                                           */}
      {/* ======================================================== */}
      <header className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 text-white border-b-2 border-gold-500/40 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Logo size="sm" showPlaceholderNotice={false} />
            <div>
              <div className="font-tamil font-bold text-gold-300 text-sm">
                நெல்லை லாலா ஸ்வீட்ஸ் • நிர்வாக பலகை
              </div>
              <h1 className="font-serif font-bold text-white text-base">
                Owner Admin Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sync Status Badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-burgundy-800/80 border border-gold-500/30 text-stone-200">
              <Database className="w-3.5 h-3.5 text-gold-400" />
              <span>{isMockAuth ? 'Local Demo Mode' : 'Live Supabase Connected'}</span>
            </div>

            {/* View Customer Menu link */}
            <Link
              to="/menu"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-burgundy-800 hover:bg-burgundy-700 text-gold-300 text-xs font-medium flex items-center gap-1 border border-gold-500/30 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Customer Menu</span>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors border border-red-700/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-fadeIn">
          <div className={`px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border ${
            notification.type === 'success'
              ? 'bg-emerald-800 text-white border-emerald-500'
              : 'bg-red-800 text-white border-red-500'
          }`}>
            {notification.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* ======================================================== */}
        {/* 2. STATS OVERVIEW CARDS                                   */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Menu Items
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-burgundy-950 mt-1">
              {products.length}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Active products</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 mt-1">
              {availableCount}
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-1">In shop today</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm bg-gradient-to-br from-white to-red-50/30">
            <div className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
              <span>Unavailable</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-700 mt-1">
              {unavailableCount}
            </div>
            <div className="text-[11px] text-red-700/80 mt-1">Out of stock</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gold-200 shadow-sm bg-gradient-to-br from-white to-gold-50/30">
            <div className="text-xs font-bold text-gold-900 uppercase tracking-wider">
              Categories
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gold-800 mt-1">
              {categories.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Traditional sections</div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. LOGO RULE INFO BANNER                                  */}
        {/* ======================================================== */}
        <div className="p-4 rounded-2xl bg-burgundy-950 text-white border-2 border-gold-500/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-500/20 text-gold-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gold-300 text-sm">
                Original Logo Rule / அசல் லோகோ விபரம்
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                A temporary placeholder is currently active. When the original shop logo file is provided, simply place it in <code>/public/logo-placeholder.svg</code> or replace it without modifying proportions or colors.
              </p>
            </div>
          </div>
          {isMockAuth && (
            <button
              onClick={() => resetToDefaultMenu()}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-burgundy-800 hover:bg-burgundy-700 text-xs text-stone-300 border border-stone-600 transition-colors"
              title="Reset products back to standard prompt values"
            >
              Reset Initial Menu Data
            </button>
          )}
        </div>

        {/* ======================================================== */}
        {/* 4. ACTIONS & FILTERS BAR                                  */}
        {/* ======================================================== */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search in Admin */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={adminSearch}
              onChange={e => setAdminSearch(e.target.value)}
              placeholder="Search products by name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
            <select
              value={adminCategory}
              onChange={e => setAdminCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name_en} ({c.name_ta})
                </option>
              ))}
            </select>

            {/* Add Product Button */}
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-burgundy-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product (புதிய தயாரிப்பு)</span>
            </button>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 5. PRODUCTS TABLE / LIST                                  */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-burgundy-950 text-gold-300 border-b border-gold-500/30 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Photo</th>
                  <th className="py-3.5 px-4">Tamil Name</th>
                  <th className="py-3.5 px-4">English Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price / Unit</th>
                  <th className="py-3.5 px-4 text-center">Availability (Click to Toggle)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {displayedProducts.map(product => {
                  const cat = categories.find(c => c.id === product.category_id);
                  return (
                    <tr 
                      key={product.id}
                      className="hover:bg-cream-50/60 transition-colors"
                    >
                      {/* Photo Thumbnail */}
                      <td className="py-3 px-4">
                        <img
                          src={product.image_url || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80'}
                          alt={product.name_en}
                          className="w-12 h-12 object-cover rounded-xl border border-stone-200 shadow-xs"
                        />
                      </td>

                      {/* Tamil Name */}
                      <td className="py-3 px-4 font-tamil font-bold text-sm text-burgundy-950">
                        {product.name_ta}
                      </td>

                      {/* English Name */}
                      <td className="py-3 px-4 font-serif font-semibold text-stone-800 text-sm">
                        {product.name_en}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                          {cat?.name_en || product.category_id}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-bold text-sm text-burgundy-900">
                        ₹{product.price} <span className="text-[11px] text-stone-500 font-normal">/ {product.unit || '1 kg'}</span>
                      </td>

                      {/* One-Click Availability Status Switch */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(product)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                            product.is_available
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
                          }`}
                          title="Click to toggle availability on live customer menu"
                        >
                          {product.is_available ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Available (கிடைக்கும்)</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              <span>Unavailable (இல்லை)</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Edit & Delete Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-burgundy-900 hover:bg-stone-100 transition-colors"
                            title="Edit product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* ======================================================== */}
      {/* 6. ADD / EDIT PRODUCT MODAL                               */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-gold-500/40 my-8 animate-scaleUp">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="font-tamil font-bold text-xl text-burgundy-950">
                {editingProduct ? 'பொருளை திருத்தவும் (Edit Product)' : 'புதிய தயாரிப்பை சேர்க்கவும் (Add Product)'}
              </h3>
              <p className="text-xs text-stone-500">
                All changes reflect automatically on the customer QR digital menu.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Category selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Category (பிரிவு)
                </label>
                <select
                  value={formData.category_id}
                  onChange={e => {
                    const selectedCat = categories.find(c => c.id === e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      category_id: e.target.value,
                      // auto fill category default price if user hasn't typed custom
                      price: selectedCat ? selectedCat.default_price : prev.price
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name_en} – {c.name_ta} (Default: ₹{c.default_price}/kg)
                    </option>
                  ))}
                </select>
              </div>

              {/* Names: Tamil and English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Tamil Product Name (தமிழ் பெயர்) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_ta}
                    onChange={e => setFormData({ ...formData, name_ta: e.target.value })}
                    placeholder="எ.கா. பால்கோவா"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-tamil text-stone-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    English Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="e.g. Palkova"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Price & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={10}
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Unit / Quantity
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="1 kg"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Product Photograph (Upload or Image URL) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Product Photograph (தயாரிப்பு புகைப்படம்)
                </label>
                
                <div className="flex items-center gap-3">
                  <img
                    src={formData.image_url || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80'}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-xl border border-stone-300 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="Paste Image URL or upload below"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer border border-stone-300 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Tamil Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description_ta}
                    onChange={e => setFormData({ ...formData, description_ta: e.target.value })}
                    placeholder="சுருக்கமான விளக்கம்..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-tamil text-stone-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    English Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description_en}
                    onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                    placeholder="Brief description..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Availability & Featured Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={e => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-stone-800">
                    Mark Available in Shop (கிடைக்கும்)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-gold-600 rounded border-stone-300 focus:ring-gold-500"
                  />
                  <span className="text-xs font-bold text-stone-800">
                    Featured on Home Page (சிறப்பு வகை)
                  </span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-burgundy-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:from-gold-400 hover:to-gold-500"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Changes' : 'Publish to Digital Menu'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. DELETE CONFIRMATION MODAL                              */}
      {/* ======================================================== */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="font-tamil font-bold text-lg text-burgundy-950">
              பொருளை நீக்கவா?
            </h4>
            <p className="text-xs text-stone-600">
              Are you sure you want to delete <strong>"{productToDelete.name_en}"</strong>? This will remove it permanently from the customer menu.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
