import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, MapPin, CreditCard } from 'lucide-react';
import api from '../utils/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "My Orders | G-TECH Innovation";
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching my orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-50 text-green-600';
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-600';
      case 'PROCESSING':
        return 'bg-purple-50 text-purple-600';
      case 'PLACED':
        return 'bg-yellow-50 text-yellow-600';
      case 'CANCELLED':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold text-secondary tracking-tight mb-8">My Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Header section */}
                <div className="bg-slate-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-b border-slate-100">
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 text-xs text-slate-500 font-semibold">
                    <div>
                      <span className="block uppercase text-[9px] text-slate-400 mb-0.5">Order Placed</span>
                      <span className="text-secondary flex items-center gap-1">
                        <Calendar size={13} />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="block uppercase text-[9px] text-slate-400 mb-0.5">Total Amount</span>
                      <span className="text-primary font-bold">INR {order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="block uppercase text-[9px] text-slate-400 mb-0.5">Order ID</span>
                      <span className="text-secondary uppercase">#{order.id.slice(-8)}</span>
                    </div>
                  </div>

                  <span className={`self-start sm:self-auto text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                {/* Items and Details */}
                <div className="p-6">
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <img
                          src={item.product.imageUrls[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=200'}
                          alt=""
                          className="w-16 h-16 object-cover rounded-xl bg-slate-50"
                        />
                        <div className="flex-grow min-w-0">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            {item.product.brand}
                          </span>
                          <h4 className="font-bold text-secondary text-sm line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-xs text-slate-500 mt-1 block">
                            Qty: {item.quantity} × INR {item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address summary */}
                  <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
                    <div className="flex gap-2">
                      <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                      <div>
                        <span className="block text-secondary font-bold text-xs mb-1">Shipping Details</span>
                        <span>{order.address?.fullName}</span>
                        <p className="text-slate-400 font-medium mt-0.5 leading-relaxed">
                          {order.address?.addressLine1}, {order.address?.addressLine2 && order.address?.addressLine2 + ', '}
                          {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <CreditCard size={16} className="text-slate-400 flex-shrink-0" />
                      <div>
                        <span className="block text-secondary font-bold text-xs mb-1">Payment Method</span>
                        <span className="uppercase text-secondary">{order.paymentMethod}</span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">Payment Status:</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            order.paymentStatus === 'SUCCESS' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 max-w-lg mx-auto">
            <Package className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="font-bold text-lg text-secondary mb-1">No orders yet</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto mb-8">
              You haven't placed any orders with us. Once you checkout, you can track their shipment statuses right here.
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-8 py-3 rounded-xl transition-all shadow-md inline-block"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
