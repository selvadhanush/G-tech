import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShoppingBag, CheckCircle, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addingStatus, setAddingStatus] = useState(null); // 'loading', 'success'

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      document.title = `${res.data.name} | G-TECH Innovation`;
    } catch (error) {
      console.error('Error fetching product detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingStatus('loading');
    const res = await addToCart(product, quantity);
    
    if (res.success) {
      setAddingStatus('success');
      setTimeout(() => setAddingStatus(null), 2000);
    } else {
      setAddingStatus(null);
      alert(res.message);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const res = await addToCart(product, quantity);
    if (res.success) {
      navigate('/cart');
    } else {
      alert(res.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-secondary mb-2">Product Not Found</h2>
        <p className="text-slate-500 text-xs mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all">
          Back to Store
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const activePrice = hasDiscount ? product.discountPrice : product.price;
  const imageUrls = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800'];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary font-semibold transition-colors">
            <ArrowLeft size={14} />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Product Layout Grid */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8 lg:grid lg:grid-cols-2 lg:gap-x-10">
          
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative h-[300px] sm:h-[450px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
              <img
                src={imageUrls[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="bg-slate-800 text-white text-xs font-extrabold uppercase px-4 py-1.5 rounded-xl shadow-md">
                    Out of Stock
                  </span>
                </div>
              )}
              {hasDiscount && (
                <span className="absolute top-4 right-4 bg-[#25D366] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-sm">
                  {discountPct}% OFF
                </span>
              )}
            </div>

            {/* Sub-images carousel/grid */}
            {imageUrls.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {imageUrls.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-16 rounded-xl overflow-hidden border-2 bg-slate-50 transition-all ${
                      idx === activeImageIdx ? 'border-primary' : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product specs and checkout options */}
          <div className="mt-8 lg:mt-0 flex flex-col justify-between">
            <div>
              {/* Category, Brand, SKU */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                <span>{product.brand}</span>
                <span>•</span>
                <span>{product.category?.name}</span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Product title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight mb-4">
                {product.name}
              </h1>

              {/* Pricing section */}
              <div className="mb-6 pb-6 border-b border-slate-100 flex items-center gap-4">
                {hasDiscount ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-secondary">INR {product.discountPrice.toLocaleString()}</span>
                    <span className="text-sm text-slate-400 line-through">INR {product.price.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-2xl font-extrabold text-secondary">INR {product.price.toLocaleString()}</span>
                )}

                {/* Stock Indicator */}
                {product.stock > 0 ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    product.stock <= 3 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {product.stock <= 3 ? `Only ${product.stock} units left!` : 'In Stock'}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Product Description</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Value propositions */}
              <div className="grid grid-cols-3 gap-2 py-4 px-3 bg-slate-50 rounded-2xl mb-8">
                <div className="flex flex-col items-center text-center p-2">
                  <ShieldCheck size={20} className="text-primary mb-1.5" />
                  <span className="text-[9px] font-bold text-secondary">1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <RefreshCw size={20} className="text-primary mb-1.5" />
                  <span className="text-[9px] font-bold text-secondary">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center text-center p-2">
                  <Truck size={20} className="text-primary mb-1.5" />
                  <span className="text-[9px] font-bold text-secondary">Free Shipping</span>
                </div>
              </div>
            </div>

            {/* Actions block */}
            <div className="space-y-4">
              {product.stock > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Qty:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-1.5 text-slate-500 font-bold hover:bg-slate-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-extrabold text-secondary">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="px-3 py-1.5 text-slate-500 font-bold hover:bg-slate-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingStatus === 'loading'}
                  className={`w-full font-bold py-3.5 rounded-xl text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 border shadow-sm ${
                    addingStatus === 'success'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-slate-50 border-slate-200 text-secondary hover:bg-slate-100'
                  }`}
                >
                  {addingStatus === 'success' ? (
                    <>
                      <CheckCircle size={15} />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={15} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={15} />
                  <span>Buy It Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
