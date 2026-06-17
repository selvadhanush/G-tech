import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, User, Mail, Phone, Plus, Trash2, ShieldCheck, Package } from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // New address form state
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    document.title = "My Profile | G-TECH Innovation";
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
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
        isDefault: addresses.length === 0
      });

      setAddresses([...addresses, res.data]);
      setShowForm(false);
      
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

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (err) {
      alert('Failed to delete address.');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-secondary tracking-tight mb-8">Account Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* LEFT: User Profile Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <User size={36} className="text-primary" />
              </div>
              <h2 className="font-extrabold text-secondary text-lg">{user.name}</h2>
              <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">
                {user.role === 'GTECH_ADMIN' ? 'G-TECH Admin' : 'Customer'}
              </span>

              <div className="mt-8 text-left space-y-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-slate-400" />
                  <span className="text-secondary line-clamp-1">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-slate-400" />
                    <span className="text-secondary">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <ShieldCheck size={15} className="text-green-500" />
                  <span className="text-green-600">Active Profile</span>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/my-orders"
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    <Package size={14} />
                    <span>View My Orders</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Saved Addresses */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-secondary text-sm uppercase tracking-wider">
                  <MapPin size={16} className="text-primary" />
                  <span>Saved Addresses</span>
                </div>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-bold"
                  >
                    <Plus size={12} />
                    <span>Add New</span>
                  </button>
                )}
              </div>

              {/* Add Address Form inside widget */}
              {showForm ? (
                <form onSubmit={handleAddAddress} className="space-y-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-secondary uppercase mb-2">Create New Address</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="John Doe"
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
                      placeholder="e.g. Richie Street, Mount Road"
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
                        placeholder="Chennai"
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
                        placeholder="Tamil Nadu"
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
                        placeholder="600002"
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
                      onClick={() => setShowForm(false)}
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

              {/* Saved Address list display */}
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-slate-50 rounded-2xl" />
                  <div className="h-16 bg-slate-50 rounded-2xl" />
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-2xl border border-slate-100 flex items-start justify-between gap-4 bg-slate-50/20"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-secondary text-xs">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="bg-primary/10 text-primary text-[8px] font-bold px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ', '}
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                          Phone: {addr.phone}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-slate-400 hover:text-primary transition-colors p-1"
                        title="Delete Address"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-semibold mb-3">No addresses saved.</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
