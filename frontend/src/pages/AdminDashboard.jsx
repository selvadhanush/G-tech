import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Package, DollarSign, ShoppingBag, Plus, Edit2, Trash2, CheckCircle2, 
  Clock, RefreshCw, LogOut, X, Upload, Calendar, MapPin, ToggleLeft, ToggleRight, AlertCircle 
} from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('analytics'); // analytics, products, categories, orders, customers
  const [notify, setNotify] = useState({ text: '', type: 'success' });

  // Analytics Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Products State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Product Form Field States
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscountPrice, setProdDiscountPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodImageFiles, setProdImageFiles] = useState([]);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Category State
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [submittingCategory, setSubmittingCategory] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Customers State
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const showNotification = (text, type = 'success') => {
    setNotify({ text, type });
    setTimeout(() => setNotify({ text: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    document.title = "Admin Console | G-TECH Innovation";
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchAnalytics();
      loadActiveTabData();
    }
  }, [isAuthenticated, navigate, activeTab]);

  const fetchAnalytics = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch store analytics.', 'error');
    } finally {
      setLoadingStats(false);
    }
  };

  const loadActiveTabData = () => {
    if (activeTab === 'products') {
      fetchProducts();
      fetchCategories();
    }
    if (activeTab === 'categories') fetchCategories();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'customers') fetchCustomers();
  };

  // --- PRODUCTS CONTROLLER ---
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      showNotification('Error loading catalog products.', 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      showNotification('Error loading categories.', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleOpenProductCreate = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdDiscountPrice('');
    setProdStock('');
    setProdBrand('');
    setProdSku('');
    setProdCategoryId(categories[0]?.id || '');
    setProdIsFeatured(false);
    setProdImageFiles([]);
    setShowProductForm(true);
  };

  const handleOpenProductEdit = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdPrice(prod.price);
    setProdDiscountPrice(prod.discountPrice || '');
    setProdStock(prod.stock);
    setProdBrand(prod.brand);
    setProdSku(prod.sku);
    setProdCategoryId(prod.categoryId);
    setProdIsFeatured(prod.isFeatured);
    setProdImageFiles([]);
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock || !prodBrand || !prodSku || !prodCategoryId) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    setSubmittingProduct(true);
    const formData = new FormData();
    formData.append('name', prodName);
    formData.append('description', prodDesc);
    formData.append('price', Number(prodPrice));
    if (prodDiscountPrice) {
      formData.append('discountPrice', Number(prodDiscountPrice));
    }
    formData.append('stock', Number(prodStock));
    formData.append('brand', prodBrand);
    formData.append('sku', prodSku);
    formData.append('categoryId', prodCategoryId);
    formData.append('isFeatured', prodIsFeatured);

    for (let i = 0; i < prodImageFiles.length; i++) {
      formData.append('images', prodImageFiles[i]);
    }

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('Product details updated successfully.');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showNotification('Product added to catalog.');
      }
      setShowProductForm(false);
      fetchProducts();
      fetchAnalytics();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to save product details.', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showNotification('Product removed from catalog.');
      fetchProducts();
      fetchAnalytics();
    } catch (err) {
      showNotification('Failed to delete product.', 'error');
    }
  };

  // --- CATEGORIES CONTROLLER ---
  const handleOpenCategoryCreate = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setShowCategoryForm(true);
  };

  const handleOpenCategoryEdit = (cat) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setShowCategoryForm(true);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    if (!catName) {
      showNotification('Category name is required.', 'error');
      return;
    }

    setSubmittingCategory(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, { name: catName, description: catDesc });
        showNotification('Category updated.');
      } else {
        await api.post('/categories', { name: catName, description: catDesc });
        showNotification('Category created successfully.');
      }
      setShowCategoryForm(false);
      fetchCategories();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to save category.', 'error');
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category? All associated products may be affected.')) return;
    try {
      await api.delete(`/categories/${id}`);
      showNotification('Category deleted.');
      fetchCategories();
    } catch (err) {
      showNotification('Failed to delete category.', 'error');
    }
  };

  // --- ORDERS CONTROLLER ---
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (err) {
      showNotification('Failed to fetch orders.', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { orderStatus: status });
      showNotification(`Order status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      showNotification('Failed to update status.', 'error');
    }
  };

  const handleUpdatePaymentStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/payment`, { paymentStatus: status });
      showNotification(`Payment status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      showNotification('Failed to update payment status.', 'error');
    }
  };

  // --- CUSTOMERS CONTROLLER ---
  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const res = await api.get('/admin/users');
      setCustomers(res.data);
    } catch (err) {
      showNotification('Failed to fetch customers.', 'error');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleToggleUserStatus = async (id, isActive) => {
    try {
      await api.put(`/admin/users/${id}/status`, { isActive: !isActive });
      showNotification(isActive ? 'User account deactivated.' : 'User account activated.');
      fetchCustomers();
    } catch (err) {
      showNotification('Failed to toggle user status.', 'error');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* HEADER BANNER */}
      <header className="bg-secondary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl tracking-tight">G-TECH Portal</span>
            <span className="bg-primary px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Store Console</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition-all"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Alerts toast */}
        {notify.text && (
          <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl border text-xs font-bold flex items-center gap-2 ${
            notify.type === 'error' ? 'bg-red-50 text-primary border-red-100' : 'bg-green-50 text-green-700 border-green-100'
          }`}>
            <AlertCircle size={15} />
            <span>{notify.text}</span>
          </div>
        )}

        {/* TOP ANALYTICS COUNTERS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', count: `INR ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
            { label: 'Store Orders', count: stats.totalOrders, icon: ShoppingBag, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
            { label: 'Total Products', count: stats.totalProducts, icon: Package, color: 'bg-red-50 text-primary border-red-100' },
            { label: 'Active Users', count: stats.totalUsers, icon: Users, color: 'bg-amber-50 text-amber-600 border-amber-100' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">{item.label}</span>
                  <span className="text-xl font-extrabold text-secondary mt-1 block">
                    {loadingStats ? '...' : item.count}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${item.color}`}>
                  <Icon size={18} />
                </div>
              </div>
            );
          })}
        </section>

        {/* WORKSPACE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TAB SWITCHER */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-1.5">
            {[
              { id: 'analytics', label: 'Analytics Overview', icon: DollarSign },
              { id: 'products', label: 'Products Inventory', icon: Package },
              { id: 'categories', label: 'Product Categories', icon: Package },
              { id: 'orders', label: 'Store Orders', icon: ShoppingBag },
              { id: 'customers', label: 'Moderate Users', icon: Users }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white font-bold shadow-md shadow-primary/10'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <TabIcon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB WINDOW CONTENT */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 min-h-[500px]">
            
            {/* 1. ANALYTICS OVERVIEW */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-secondary">Analytics Overview</h2>
                  <p className="text-[10px] text-slate-400">Aggregated sales performance indicators</p>
                </div>
                
                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                  <DollarSign size={40} className="text-primary mb-3" />
                  <h4 className="font-extrabold text-secondary text-sm mb-1">E-Commerce Pipeline Online</h4>
                  <p className="text-slate-400 text-xs max-w-sm">
                    Orders and transactions verified via Razorpay checkout sync here instantly. Monitor inventory logs and active shopping lists from tabs.
                  </p>
                </div>
              </div>
            )}

            {/* 2. PRODUCTS INVENTORY */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-secondary">Products Inventory</h2>
                    <p className="text-[10px] text-slate-400">Manage listing prices, stock quantities, and media files</p>
                  </div>
                  <button
                    onClick={handleOpenProductCreate}
                    className="flex items-center gap-1 text-xs font-semibold bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg shadow-md transition-colors"
                  >
                    <Plus size={14} />
                    <span>New Product</span>
                  </button>
                </div>

                {loadingProducts ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-slate-50 rounded-xl" />
                    <div className="h-16 bg-slate-50 rounded-xl" />
                  </div>
                ) : products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400">
                          <th className="py-3 font-semibold">SKU / Model</th>
                          <th className="py-3 font-semibold">Brand & category</th>
                          <th className="py-3 font-semibold">Inventory Stock</th>
                          <th className="py-3 font-semibold">Price (INR)</th>
                          <th className="py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(prod => (
                          <tr key={prod.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-4 pr-3">
                              <span className="font-bold text-secondary block">{prod.name}</span>
                              <span className="font-mono text-[9px] text-slate-400 block mt-0.5">SKU: {prod.sku}</span>
                            </td>
                            <td className="py-4 pr-3 text-slate-500 font-semibold">
                              <span>{prod.brand}</span>
                              <span className="mx-1 text-slate-300">•</span>
                              <span className="text-[10px] uppercase font-bold text-slate-400">{prod.category?.name}</span>
                            </td>
                            <td className="py-4 pr-3">
                              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                                prod.stock === 0
                                  ? 'bg-red-50 text-red-600'
                                  : prod.stock <= 3
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'bg-green-50 text-green-600'
                              }`}>
                                {prod.stock} units
                              </span>
                            </td>
                            <td className="py-4 pr-3 font-bold text-secondary">
                              {prod.discountPrice ? (
                                <div className="flex flex-col">
                                  <span>{prod.discountPrice.toLocaleString()}</span>
                                  <span className="text-[9px] text-slate-400 line-through font-normal">{prod.price.toLocaleString()}</span>
                                </div>
                              ) : (
                                <span>{prod.price.toLocaleString()}</span>
                              )}
                            </td>
                            <td className="py-4 text-right space-x-1">
                              <button
                                onClick={() => handleOpenProductEdit(prod)}
                                className="p-1 border border-slate-200 hover:border-slate-300 rounded hover:bg-white text-slate-500 inline-block"
                                title="Edit Product"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1 border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded text-slate-400 hover:text-primary inline-block"
                                title="Delete Product"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs">No products in inventory.</p>
                  </div>
                )}

                {/* Product form modal dialog */}
                {showProductForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                      <div className="flex justify-between items-center bg-secondary text-white px-6 py-4">
                        <h3 className="font-extrabold text-sm">{editingProduct ? 'Edit Catalog Product' : 'Create Product Entry'}</h3>
                        <button onClick={() => setShowProductForm(false)} className="text-white/80 hover:text-white"><X size={18} /></button>
                      </div>
                      <form onSubmit={handleSubmitProduct} className="p-6 space-y-4 overflow-y-auto flex-grow">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Name *</label>
                            <input
                              type="text"
                              value={prodName}
                              onChange={(e) => setProdName(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                              placeholder="e.g. Dell Latitude 3420"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SKU Code *</label>
                            <input
                              type="text"
                              value={prodSku}
                              onChange={(e) => setProdSku(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                              placeholder="e.g. DELL-LAT-3420"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Brand Name *</label>
                            <input
                              type="text"
                              value={prodBrand}
                              onChange={(e) => setProdBrand(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                              placeholder="e.g. Dell"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category *</label>
                            <select
                              value={prodCategoryId}
                              onChange={(e) => setProdCategoryId(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                              required
                            >
                              <option value="">Select Category</option>
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={prodDesc}
                            onChange={(e) => setProdDesc(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            placeholder="Detailed technical specifications, processor, RAM, storage..."
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Base Price *</label>
                            <input
                              type="number"
                              value={prodPrice}
                              onChange={(e) => setProdPrice(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                              placeholder="Price in INR"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Discount Price</label>
                            <input
                              type="number"
                              value={prodDiscountPrice}
                              onChange={(e) => setProdDiscountPrice(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                              placeholder="Discount in INR"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stock Count *</label>
                            <input
                              type="number"
                              value={prodStock}
                              onChange={(e) => setProdStock(e.target.value)}
                              className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                              placeholder="Qty"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="prodIsFeatured"
                            checked={prodIsFeatured}
                            onChange={(e) => setProdIsFeatured(e.target.checked)}
                            className="rounded text-primary focus:ring-primary h-4 w-4 border-slate-300"
                          />
                          <label htmlFor="prodIsFeatured" className="text-xs font-bold text-slate-600 select-none cursor-pointer">
                            Feature this product on homepage catalog
                          </label>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Upload Product Images</label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setProdImageFiles(e.target.files)}
                            className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-slate-50 file:text-secondary hover:file:bg-slate-100"
                          />
                          <span className="text-[10px] text-slate-400 block mt-1">Upload up to 5 JPEG/PNG images. Uploading new images replaces existing.</span>
                        </div>

                        <div className="flex gap-2.5 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowProductForm(false)}
                            className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-3 rounded-xl text-xs transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingProduct}
                            className="w-1/2 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors disabled:opacity-75"
                          >
                            {submittingProduct ? 'Uploading...' : 'Save Product'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. PRODUCT CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-secondary">Product Categories</h2>
                    <p className="text-[10px] text-slate-400">Classify laptops, services, CCTV cameras, and networking gears</p>
                  </div>
                  <button
                    onClick={handleOpenCategoryCreate}
                    className="flex items-center gap-1 text-xs font-semibold bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg shadow-md transition-colors"
                  >
                    <Plus size={14} />
                    <span>New Category</span>
                  </button>
                </div>

                {loadingCategories ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-slate-50 rounded-xl" />
                  </div>
                ) : categories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map(cat => (
                      <div key={cat.id} className="bg-slate-50 p-4 border border-slate-200 rounded-2xl flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-secondary text-sm">{cat.name}</h4>
                          <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">{cat.description || 'No description added.'}</p>
                          <span className="text-[9px] bg-slate-200 font-mono text-slate-500 px-1.5 py-0.5 rounded inline-block mt-2 font-semibold select-all">
                            Slug: {cat.slug}
                          </span>
                        </div>
                        <div className="flex gap-1.5 ml-2">
                          <button
                            onClick={() => handleOpenCategoryEdit(cat)}
                            className="p-1.5 border border-slate-200 hover:border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-500"
                            title="Edit Category"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 border border-slate-200 hover:border-red-200 rounded bg-white hover:bg-red-50 text-slate-400 hover:text-primary"
                            title="Delete Category"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs">No categories configured yet.</p>
                  </div>
                )}

                {/* Category form modal */}
                {showCategoryForm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
                      <div className="flex justify-between items-center bg-secondary text-white px-6 py-4">
                        <h3 className="font-extrabold text-sm">{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
                        <button onClick={() => setShowCategoryForm(false)} className="text-white/80 hover:text-white"><X size={18} /></button>
                      </div>
                      <form onSubmit={handleSubmitCategory} className="p-6 space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category Name *</label>
                          <input
                            type="text"
                            value={catName}
                            onChange={(e) => setCatName(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            placeholder="e.g. Laptop Accessories"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={catDesc}
                            onChange={(e) => setCatDesc(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            placeholder="Brief details about category items..."
                          />
                        </div>

                        <div className="flex gap-2.5 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowCategoryForm(false)}
                            className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold py-3 rounded-xl text-xs transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingCategory}
                            className="w-1/2 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors disabled:opacity-75"
                          >
                            {submittingCategory ? 'Saving...' : 'Save Category'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. STORE ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-secondary">Store Orders</h2>
                  <p className="text-[10px] text-slate-400">Track shipment fulfillments and payment confirmation logs</p>
                </div>

                {loadingOrders ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-slate-50 rounded-xl" />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/10 hover:bg-white transition-all space-y-4">
                        
                        {/* Header details */}
                        <div className="flex flex-wrap gap-4 justify-between items-center border-b border-slate-100 pb-3">
                          <div className="text-xs font-semibold text-slate-500">
                            <span className="text-secondary font-bold mr-2">ID: #{order.id.slice(-8).toUpperCase()}</span>
                            <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex gap-2 items-center">
                            {/* Order Status Select */}
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg py-1 px-2.5 text-[10px] font-bold text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
                            >
                              <option value="PLACED">Placed</option>
                              <option value="PROCESSING">Processing</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>

                            {/* Payment Status Select */}
                            <select
                              value={order.paymentStatus}
                              onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg py-1 px-2.5 text-[10px] font-bold text-secondary focus:ring-1 focus:ring-primary focus:outline-none"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="SUCCESS">Success</option>
                              <option value="FAILED">Failed</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer & Address Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-500">
                          <div>
                            <span className="block text-secondary font-bold text-[10px] uppercase mb-1">Customer Info</span>
                            <span className="block text-secondary">{order.user?.name}</span>
                            <span className="block text-[11px] font-normal text-slate-400">{order.user?.email}</span>
                          </div>
                          
                          <div>
                            <span className="block text-secondary font-bold text-[10px] uppercase mb-1">Delivery Address</span>
                            <span>{order.address?.fullName}</span>
                            <p className="text-slate-400 font-medium leading-relaxed text-[11px] mt-0.5">
                              {order.address?.addressLine1}, {order.address?.city}, {order.address?.pincode}
                            </p>
                          </div>

                          <div className="text-right md:text-left">
                            <span className="block text-secondary font-bold text-[10px] uppercase mb-1">Payment Method</span>
                            <span className="block uppercase text-secondary font-extrabold">{order.paymentMethod}</span>
                            <span className="block text-primary font-extrabold text-sm mt-1">INR {order.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase mb-2">Order Items</span>
                          <div className="divide-y divide-slate-200/60">
                            {order.items.map(item => (
                              <div key={item.id} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                                <span className="font-bold text-secondary line-clamp-1">{item.product.name}</span>
                                <span className="text-slate-400 font-medium shrink-0 ml-4">Qty: {item.quantity} × INR {item.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs">No orders filed yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* 5. MODERATE USERS */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-secondary">Moderate Users</h2>
                  <p className="text-[10px] text-slate-400">Deactivate/activate customer accounts for security violations</p>
                </div>

                {loadingCustomers ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-slate-50 rounded-xl" />
                  </div>
                ) : customers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400">
                          <th className="py-3 font-semibold">User Details</th>
                          <th className="py-3 font-semibold">Role</th>
                          <th className="py-3 font-semibold">Joined Date</th>
                          <th className="py-3 font-semibold text-center">Status</th>
                          <th className="py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map(cust => (
                          <tr key={cust.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-4 pr-3">
                              <span className="font-bold text-secondary block">{cust.name}</span>
                              <span className="text-slate-400 text-[10px] block mt-0.5">{cust.email}</span>
                              <span className="text-slate-400 text-[10px] block">{cust.phone || 'No phone'}</span>
                            </td>
                            <td className="py-4 pr-3">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                cust.role === 'GTECH_ADMIN' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {cust.role}
                              </span>
                            </td>
                            <td className="py-4 pr-3 text-slate-400 font-medium">
                              {new Date(cust.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 text-center">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                cust.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                              }`}>
                                {cust.isActive ? 'Active' : 'Blocked'}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              {cust.role !== 'GTECH_ADMIN' ? (
                                <button
                                  onClick={() => handleToggleUserStatus(cust.id, cust.isActive)}
                                  className={`p-1.5 border rounded-lg transition-all hover:bg-slate-50 text-slate-500 inline-block ${
                                    cust.isActive ? 'hover:border-red-200 hover:text-primary' : 'hover:border-green-200 hover:text-green-600'
                                  }`}
                                  title={cust.isActive ? 'Block User' : 'Unblock User'}
                                >
                                  {cust.isActive ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
                                </button>
                              ) : (
                                <span className="text-slate-300 text-[10px] font-bold uppercase select-none">Console Owner</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xs">No registered customer accounts.</p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
