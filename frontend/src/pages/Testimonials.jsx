import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    document.title = "Client Testimonials | Reviews | G-TECH Innovation";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Read reviews and ratings from G-TECH Innovation customers. High rating laptop repair and CCTV surveillance installs in Richie Street Chennai.");
    }
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await api.get('/testimonials');
      setTestimonials(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !review.trim()) {
      setFormError('Name and review content are required.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    setSubmitSuccess(false);

    try {
      await api.post('/testimonials', {
        customerName: customerName.trim(),
        rating,
        review: review.trim()
      });
      setCustomerName('');
      setReview('');
      setRating(5);
      setSubmitSuccess(true);
      // Refresh list
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">Reviews</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary mt-3 mb-4">Customer Testimonials</h1>
          <p className="text-base text-slate-500">
            Read comments from Chennai clients or share your own servicing experience with our computer repairs and CCTV configurations.
          </p>
        </div>

        {/* Layout split: Left is Reviews List, Right is Submit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" />
              Latest Feedback ({testimonials.length})
            </h2>

            {error && (
              <div className="p-4 bg-red-50 text-primary border border-red-100 rounded-xl flex items-center gap-2">
                <AlertCircle size={18} />
                <span className="text-xs font-semibold">{error}</span>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse bg-white rounded-2xl h-36 border border-slate-100 shadow-sm" />
                ))}
              </div>
            ) : testimonials.length > 0 ? (
              <div className="space-y-4">
                {testimonials.map((test) => (
                  <div key={test.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-sm text-secondary">{test.customerName}</h3>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(test.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < test.rating ? "currentColor" : "none"} className={i < test.rating ? "text-amber-500" : "text-slate-300"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs italic leading-relaxed">
                      "{test.review}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-400">
                <p className="text-sm">No reviews submitted yet. Be the first one!</p>
              </div>
            )}
          </div>

          {/* Submit Review Form */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-28">
            <h2 className="text-lg font-bold text-secondary mb-2">Write a Review</h2>
            <p className="text-slate-500 text-xs mb-6">Your feedback helps G-TECH continue providing premium computer services across Chennai.</p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">Your Name / Company</label>
                <input
                  type="text"
                  placeholder="e.g. Anand Kumar (Orion Tech)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">Rating (Stars)</label>
                <div className="flex gap-1.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="p-0.5 hover:scale-115 transition-transform"
                      title={`${starVal} Star`}
                    >
                      <Star size={24} fill={starVal <= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">Your Review Feedback</label>
                <textarea
                  rows={4}
                  placeholder="Share details of your laptop repair, cctv install, or networking solution experience..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                  required
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-primary rounded-lg text-xs flex items-center gap-1.5 border border-red-100">
                  <AlertCircle size={14} />
                  <span>{formError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-xs flex items-center gap-1.5 border border-green-100">
                  <CheckCircle size={14} />
                  <span>Thank you! Your review has been submitted successfully.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors disabled:opacity-75"
              >
                {submitting ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Testimonials;
