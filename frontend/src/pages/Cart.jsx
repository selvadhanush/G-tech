import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartTax,
    shippingCharge,
    cartTotal
  } = useCart();

  const handleQtyChange = (productId, currentQty, amount, stock) => {
    const target = currentQty + amount;
    if (target < 1) return;
    if (target > stock) {
      alert(`Only ${stock} items available in stock.`);
      return;
    }
    updateCartQuantity(productId, target);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading && cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-secondary tracking-tight mb-8">Shopping Cart</h1>

        {cart.length > 0 ? (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            
            {/* LEFT: Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-50 flex-shrink-0"
                  />

                  {/* Title and brand */}
                  <div className="flex-grow min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      {item.brand}
                    </span>
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-bold text-secondary text-sm hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <span className="text-xs font-semibold text-slate-500 block mt-1">
                      INR {item.price.toLocaleString()} each
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => handleQtyChange(item.productId, item.quantity, -1, item.stock)}
                      className="px-2.5 py-1 text-slate-500 font-bold hover:bg-slate-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-extrabold text-secondary">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.productId, item.quantity, 1, item.stock)}
                      className="px-2.5 py-1 text-slate-500 font-bold hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total Price */}
                  <div className="text-right min-w-[80px]">
                    <span className="font-extrabold text-sm text-secondary block">
                      INR {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-slate-400 hover:text-primary transition-colors p-1 mt-1 inline-block"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Price calculations */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-6">
                <h3 className="font-bold text-secondary text-sm uppercase tracking-wider mb-6 pb-4 border-b border-slate-100">
                  Order Summary
                </h3>

                <div className="space-y-4 text-xs font-semibold text-slate-500 pb-6 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-secondary">INR {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="text-secondary">INR {cartTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping fee</span>
                    <span className="text-secondary">INR {shippingCharge.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-6 mb-8">
                  <span className="text-sm font-bold text-secondary">Estimated Total</span>
                  <span className="text-2xl font-extrabold text-secondary">INR {cartTotal.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </button>

                <div className="mt-4 text-center">
                  <Link to="/products" className="text-[10px] text-primary hover:underline font-bold">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 max-w-lg mx-auto">
            <ShoppingBag className="mx-auto text-slate-300 mb-4 animate-bounce" size={48} />
            <h3 className="font-bold text-lg text-secondary mb-1">Your cart is empty</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-8">
              Looks like you haven't added any laptops, networking gears, or other computer components to your cart yet.
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-8 py-3 rounded-xl transition-all shadow-md inline-block"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
