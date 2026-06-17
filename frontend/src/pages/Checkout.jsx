import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MapPin, Plus, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartSubtotal, cartTax, shippingCharge, cartTotal, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD or ONLINE
  
  // New address form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [formError, setFormError] = useState('');

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null); // order object
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    document.title = "Secure Checkout | G-TECH Innovation";
    if (cart.length === 0) {
      navigate('/cart');
    } else {
      fetchAddresses();
    }
  }, [cart, navigate]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data);
      const defaultAddr = res.data.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (res.data.length > 0) {
        setSelectedAddressId(res.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      const res = await api.post('/addresses', {
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        country: 'India',
        isDefault: addresses.length === 0 // Default if it's the first
      });

      setAddresses([...addresses, res.data]);
      setSelectedAddressId(res.data.id);
      setShowAddForm(false);
      
      // Reset form
      setFullName('');
      setPhone('');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPincode('');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving address.');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setOrderError('Please select a shipping address.');
      return;
    }

    setLoading(true);
    setOrderError('');

    try {
      const res = await api.post('/orders', {
        addressId: selectedAddressId,
        paymentMethod
      });

      const { order, razorpayOrder } = res.data;

      if (paymentMethod === 'COD') {
        // Success
        setOrderSuccess(order);
        clearCart();
        setLoading(false);
      } else {
        // Razorpay Online Flow
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setOrderError('Razorpay SDK failed to load. Are you online?');
          setLoading(false);
          return;
        }

        // Fetch Razorpay key from backend or fallback to placeholder
        // Usually, Razorpay key_id is public. We can read it from a configuration or use VITE env.
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_id',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'G-TECH Innovation',
          description: 'Payment for Order #' + order.id.slice(-8),
          image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=200',
          order_id: razorpayOrder.id,
          handler: async (response) => {
            // Verify signature
            try {
              const verifyRes = await api.post('/payment/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                setOrderSuccess(verifyRes.data.order);
                clearCart();
              } else {
                setOrderError('Payment verification failed.');
              }
            } catch (verErr) {
              setOrderError('Verification failed: ' + (verErr.response?.data?.message || 'Server error.'));
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: order.address?.fullName || '',
            contact: order.address?.phone || ''
          },
          theme: {
            color: '#A81C1C' // G-TECH Red brand accent
          },
          modal: {
            ondismiss: () => {
              setOrderError('Payment cancelled by user.');
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Order processing failed.');
      setLoading(false);
    }
  };

  // SUCCESS LAYOUT
  if (orderSuccess) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4">
        <div className="max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl mx-auto text-center">
          <CheckCircle2 className="mx-auto text-green-500 mb-6 animate-bounce" size={64} />
          <h1 className="text-2xl font-extrabold text-secondary tracking-tight mb-2">Order Confirmed!</h1>
          <p className="text-slate-400 text-xs mb-6">
            Thank you for shopping with G-TECH. Your order #{orderSuccess.id.slice(-8).toUpperCase()} has been placed successfully.
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl mb-8 text-left space-y-2 text-xs font-semibold text-slate-500">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="text-secondary">{orderSuccess.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-secondary">{orderSuccess.orderStatus}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
              <span>Total Paid:</span>
              <span className="text-primary">INR {orderSuccess.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/my-orders"
              className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md"
            >
              Track Your Order
            </Link>
            <Link
              to="/products"
              className="block w-full bg-slate-100 hover:bg-slate-200 text-secondary font-bold py-3 rounded-xl text-xs transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back link */}
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary font-semibold transition-colors">
            <ArrowLeft size={14} />
            <span>Review Cart</span>
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold text-secondary tracking-tight mb-8">Secure Checkout</h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          
          {/* LEFT: Address, Payment selection */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. SHIPPING ADDRESS */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-secondary text-sm uppercase tracking-wider">
                  <MapPin size={16} className="text-primary" />
                  <span>1. Shipping Address</span>
                </div>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-bold"
                  >
                    <Plus size={12} />
                    <span>Add New</span>
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {showAddForm ? (
                <form onSubmit={handleCreateAddress} className="space-y-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-secondary uppercase mb-2">New Address Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="e.g. John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="e.g. 9876543210"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Address Line 1</label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                      placeholder="e.g. #12, Athipattan Street"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                      placeholder="e.g. Ritchie Street, Mount Road"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Chennai"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Tamil Nadu"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary"
                        placeholder="e.g. 600002"
                        required
                      />
                    </div>
                  </div>

                  {formError && (
                    <p className="text-[10px] text-primary font-bold text-center">{formError}</p>
                  )}

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-secondary text-[10px] font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : null}

              {/* Address selector options */}
              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        selectedAddressId === addr.id
                          ? 'border-primary bg-slate-50/55'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-secondary text-xs">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ', '}
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                      <div className="text-[10px] font-bold text-secondary mt-3">
                        Phone: {addr.phone}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-semibold mb-3">No shipping addresses saved yet.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Add Your First Address
                  </button>
                </div>
              )}
            </div>

            {/* 2. PAYMENT METHODS */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-secondary text-sm uppercase tracking-wider">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>2. Payment Option</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-primary focus:ring-primary h-4 w-4 border-slate-300"
                    />
                    <div>
                      <span className="font-bold text-secondary text-xs block">Cash on Delivery (COD)</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Pay in cash or UPI upon home delivery.</span>
                    </div>
                  </div>
                </label>

                {/* Razorpay Online */}
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="ONLINE"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={() => setPaymentMethod('ONLINE')}
                      className="text-primary focus:ring-primary h-4 w-4 border-slate-300"
                    />
                    <div>
                      <span className="font-bold text-secondary text-xs block">UPI / Net Banking / Card</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Pay securely online using Razorpay payment gateway.</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT: Cart summaries */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-6">
              <h3 className="font-bold text-secondary text-sm uppercase tracking-wider mb-6 pb-4 border-b border-slate-100">
                Order Items
              </h3>

              <div className="space-y-4 max-h-[200px] overflow-y-auto pb-4 mb-4 border-b border-slate-100">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center justify-between">
                    <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-slate-50" />
                    <div className="flex-grow min-w-0">
                      <span className="font-bold text-secondary text-[11px] line-clamp-1 block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 block">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-secondary text-xs">
                      INR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-3 text-xs font-semibold text-slate-500 pb-4 border-b border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-secondary">INR {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="text-secondary">INR {cartTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping charge</span>
                  <span className="text-secondary">INR {shippingCharge.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-4 mb-6">
                <span className="text-xs font-bold text-secondary">Grand Total</span>
                <span className="text-xl font-extrabold text-secondary">INR {cartTotal.toLocaleString()}</span>
              </div>

              {orderError && (
                <div className="p-3 bg-red-50 border border-red-100 text-primary text-[10px] font-bold rounded-xl text-center mb-4 flex items-center justify-center gap-1.5">
                  <AlertCircle size={14} />
                  <span>{orderError}</span>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || addresses.length === 0}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Processing Order...' : paymentMethod === 'COD' ? 'Place COD Order' : 'Pay via Razorpay'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
