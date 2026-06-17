import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, CheckCircle, Clock, FileText, Wrench } from 'lucide-react';
import api from '../utils/api';

const LeadTrackingModal = ({ isOpen, onClose, initialRequestId = '' }) => {
  const [requestId, setRequestId] = useState(initialRequestId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [leadDetails, setLeadDetails] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!requestId.trim()) {
      setError('Please enter a valid Request ID.');
      return;
    }

    setLoading(true);
    setError('');
    setLeadDetails(null);

    try {
      const response = await api.get(`/contacts/track/${requestId.trim()}`);
      setLeadDetails(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Request ID not found. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    { name: 'Submitted', icon: FileText, desc: 'Your request has been received.' },
    { name: 'Reviewing', icon: Clock, desc: 'Our technicians are evaluating your requirements.' },
    { name: 'Resolved', icon: CheckCircle, desc: 'Service completed and verified.' }
  ];

  const getStatusIndex = (currentStatus) => {
    return statusSteps.findIndex(step => step.name.toLowerCase() === currentStatus?.toLowerCase());
  };

  const currentStatusIndex = leadDetails ? getStatusIndex(leadDetails.status) : -1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm">
      <motion.div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-secondary text-white px-6 py-4">
          <div>
            <h3 className="font-bold text-lg">Track Service Request</h3>
            <p className="text-xs text-secondary-gray">Real-time status updates for Chennai repairs</p>
          </div>
          <button
            onClick={() => {
              onClose();
              setLeadDetails(null);
              setError('');
            }}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleTrack} className="flex gap-2 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Enter 36-char Request ID (UUID)..."
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 shadow-md disabled:opacity-70"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <motion.div
              className="p-3 bg-red-50 text-primary text-xs rounded-lg border border-red-100 mb-4"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Stepper display */}
          <AnimatePresence mode="wait">
            {leadDetails ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Customer Name</span>
                      <span className="font-semibold text-secondary">{leadDetails.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Service Requested</span>
                      <span className="font-semibold text-secondary">{leadDetails.service}</span>
                    </div>
                  </div>
                </div>

                <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 ml-4 py-2">
                  {statusSteps.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx <= currentStatusIndex;
                    const isActive = idx === currentStatusIndex;

                    return (
                      <div key={step.name} className="relative">
                        {/* Dot marker */}
                        <div
                          className={`absolute -left-[35px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                            isActive
                              ? 'bg-primary border-primary text-white scale-110 shadow-md shadow-primary/30'
                              : isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-white border-slate-300 text-slate-400'
                          }`}
                        >
                          <Icon size={12} />
                        </div>
                        {/* Detail text */}
                        <div>
                          <h4
                            className={`font-semibold text-sm ${
                              isActive ? 'text-primary font-bold' : 'text-secondary'
                            }`}
                          >
                            {step.name}
                          </h4>
                          <p className="text-xs text-slate-500">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              !loading && !error && (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">Enter your service ticket ID above to trace the repair work status.</p>
                  <p className="text-xs mt-1">Found in your email notification or booking screen.</p>
                </div>
              )
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default LeadTrackingModal;
