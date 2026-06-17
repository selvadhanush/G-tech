import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Tag, ShoppingCart, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  
  const [actionStatus, setActionStatus] = useState({}); // { productId: 'added' / 'error' }

  const { addToCart } = useCart();

  useEffect(() => {
    document.title = "Products Catalog | G-TECH Innovation";
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products')
      ]);
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching catalog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on sort change
  useEffect(() => {
    if (!loading) {
      handleFilterSubmit();
    }
  }, [sort, selectedCategory, selectedBrand]);

  const handleQuickAdd = async (product) => {
    setActionStatus({ ...actionStatus, [product.id]: 'loading' });
    const res = await addToCart(product, 1);
    
    if (res.success) {
      setActionStatus({ ...actionStatus, [product.id]: 'added' });
      setTimeout(() => {
        setActionStatus(prev => ({ ...prev, [product.id]: null }));
      }, 2000);
    } else {
      setActionStatus({ ...actionStatus, [product.id]: 'error' });
      alert(res.message);
      setTimeout(() => {
        setActionStatus(prev => ({ ...prev, [product.id]: null }));
      }, 2500);
    }
  };

  const uniqueBrands = [...new Set(products.map(p => p.brand))];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-secondary sm:text-4xl">G-TECH Technology Store</h1>
          <p className="text-slate-500 text-sm mt-1">Browse premium laptops, custom desktops, WiFi routers, and surveillance security cameras.</p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          
          {/* 1. FILTER SIDEBAR (Desktop) */}
          <div className="hidden lg:block bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
            <div className="flex items-center gap-2 font-bold text-secondary text-sm uppercase tracking-wider mb-6 pb-4 border-b border-slate-100">
              <SlidersHorizontal size={16} className="text-primary" />
              <span>Filters</span>
            </div>

            <form onSubmit={handleFilterSubmit} className="space-y-6">
              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Search Catalog</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search model, specs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pl-9 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <Search className="absolute left-3 top-3 text-slate-400" size={14} />
                </div>
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Brand Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">All Brands</option>
                  {uniqueBrands.map((brand, idx) => (
                    <option key={idx} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price filter */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Price range (INR)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary-light text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95"
              >
                Apply Filters
              </button>
            </form>
          </div>

          {/* 2. PRODUCT GRID CONTAINER */}
          <div className="lg:col-span-3">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8">
              <div className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-secondary">{products.length}</span> technological products
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">Sort By:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">Newest Additions</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A-Z</option>
                </select>
              </div>
            </div>

            {/* Catalog Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-2xl h-80" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(prod => {
                  const hasDiscount = prod.discountPrice && prod.discountPrice < prod.price;
                  const discountPct = hasDiscount ? Math.round(((prod.price - prod.discountPrice) / prod.price) * 100) : 0;
                  const activePrice = hasDiscount ? prod.discountPrice : prod.price;

                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative h-44 bg-slate-50 overflow-hidden">
                        <img
                          src={prod.imageUrls[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800'}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        
                        {/* Featured Tag */}
                        {prod.isFeatured && (
                          <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">
                            Featured
                          </span>
                        )}

                        {/* Discount Tag */}
                        {hasDiscount && (
                          <span className="absolute top-3 right-3 bg-[#25D366] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">
                            -{discountPct}% OFF
                          </span>
                        )}

                        {/* Out of stock tag */}
                        {prod.stock === 0 && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-slate-800 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded shadow-md">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content block */}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                            <span>{prod.brand}</span>
                            <span>•</span>
                            <span>{prod.category?.name}</span>
                          </div>
                          
                          <Link
                            to={`/products/${prod.id}`}
                            className="font-bold text-sm text-secondary hover:text-primary transition-colors line-clamp-1 block mb-2"
                          >
                            {prod.name}
                          </Link>
                          
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                            {prod.description}
                          </p>
                        </div>

                        {/* Pricing and Action row */}
                        <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                          <div>
                            {hasDiscount ? (
                              <div className="flex flex-col">
                                <span className="text-slate-400 line-through text-[10px]">INR {prod.price.toLocaleString()}</span>
                                <span className="font-extrabold text-sm text-secondary">INR {prod.discountPrice.toLocaleString()}</span>
                              </div>
                            ) : (
                              <span className="font-extrabold text-sm text-secondary">INR {prod.price.toLocaleString()}</span>
                            )}
                          </div>

                          <button
                            onClick={() => handleQuickAdd(prod)}
                            disabled={prod.stock === 0 || actionStatus[prod.id] === 'loading'}
                            className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                              actionStatus[prod.id] === 'added'
                                ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                                : 'bg-slate-50 border-slate-200 text-secondary hover:bg-primary hover:border-primary hover:text-white'
                            }`}
                          >
                            {actionStatus[prod.id] === 'added' ? <CheckCircle size={15} /> : <ShoppingCart size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100">
                <SlidersHorizontal className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="font-bold text-lg text-secondary mb-1">No products found</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">We couldn't find any products matching your search or filters. Try adjusting your selections.</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('');
                    setSelectedBrand('');
                    setMinPrice('');
                    setMaxPrice('');
                    setSort('newest');
                    fetchInitialData();
                  }}
                  className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
