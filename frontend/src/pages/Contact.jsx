import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, MessageCircle, Clipboard, CheckCircle, Copy, AlertTriangle } from 'lucide-react';
import api from '../utils/api';

const Contact = () => {
  const routerLocation = useLocation();
  const [requestId, setRequestId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-populate service if redirected from Services page
  const preferredService = routerLocation.state?.preferredService || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: preferredService || 'Laptop Services',
      message: ''
    }
  });

  useEffect(() => {
    document.title = "Contact Us | G-TECH Innovation Richie Street Chennai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Submit a service request to G-TECH Innovation Chennai. Get diagnostic estimates for laptop repairs, desktop builds, networking setups, and CCTV configs.");
    }
  }, []);

  // Update form values if redirected with a state
  useEffect(() => {
    if (preferredService) {
      setValue('service', preferredService);
    }
  }, [preferredService, setValue]);

  const onSubmitForm = async (data) => {
    setSubmitting(true);
    setErrorMsg('');
    setRequestId('');
    try {
      const response = await api.post('/contacts', data);
      setRequestId(response.data.requestId);
      reset();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit service request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (!requestId) return;
    navigator.clipboard.writeText(requestId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // WhatsApp shortcut handler
  const handleWhatsAppChat = () => {
    const number = '919363706040';
    const text = 'Hello G-TECH Innovation,\nI am looking for quick support.';
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">Contact</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary mt-3 mb-4">Get in Touch</h1>
          <p className="text-base text-slate-500">
            Submit a repair ticket, request a quote, or drop by our service node at Vijaya Lakshmi Complex Richie Street.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Contact Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info Cards */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-secondary border-b border-slate-100 pb-3">Company Details</h2>
              
              <div className="flex gap-4">
                <MapPin className="text-primary shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-xs text-secondary uppercase tracking-wider">Address</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    1st Floor, Vijaya Lakshmi Complex,<br />
                    #12, Athipattan Street, Richie Street,<br />
                    Mount Road, Chennai - 600002
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <Phone className="text-primary shrink-0" size={18} />
                <div>
                  <h4 className="font-semibold text-xs text-secondary uppercase tracking-wider">Hotlines</h4>
                  <p className="text-slate-500 text-xs mt-1">
                    <a href="tel:04435395138" className="hover:text-primary transition-colors">044-35395138</a>
                    <span className="mx-2 text-slate-300">|</span>
                    <a href="tel:+919363706040" className="hover:text-primary transition-colors">+91 9363706040</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <Mail className="text-primary shrink-0" size={18} />
                <div>
                  <h4 className="font-semibold text-xs text-secondary uppercase tracking-wider">Email Address</h4>
                  <p className="text-slate-500 text-xs mt-1">
                    <a href="mailto:reach2gtech@gmail.com" className="hover:text-primary transition-colors">reach2gtech@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-72">
              <iframe
                title="G-TECH Innovation Richie Street Chennai Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.2917711417066!2d80.2647893148231!3d13.067341290793134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m2sck!2sRichie%20St%252C%20Mount%20Road%252C%20Chennai%252C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1625215091214!5m2!1sen!2sin"
                className="w-full h-full rounded-2xl border-0"
                allowFullScreen=""
                loading="lazy"
              />
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="tel:+919363706040"
                className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-colors"
              >
                <Phone size={14} />
                Call Mobile
              </a>
              <button
                onClick={handleWhatsAppChat}
                className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-colors"
              >
                <MessageCircle size={14} />
                WhatsApp Chat
              </button>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-secondary mb-2">Submit Service Ticket</h2>
            <p className="text-slate-500 text-xs mb-6">Fill in details. Our support team will register your ticket, generate a tracking ID, and contact you.</p>

            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    {...register('name', { required: 'Name is required' })}
                    className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs ${
                      errors.name ? 'border-primary' : 'border-slate-300'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-primary mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit Mobile Number"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9+\s-]{10,15}$/,
                        message: 'Enter a valid phone number (10-15 digits)'
                      }
                    })}
                    className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs ${
                      errors.phone ? 'border-primary' : 'border-slate-300'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-primary mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">Email Address *</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Enter a valid email address'
                    }
                  })}
                  className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs ${
                    errors.email ? 'border-primary' : 'border-slate-300'
                  }`}
                />
                {errors.email && <p className="text-[10px] text-primary mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">Service Required *</label>
                <select
                  {...register('service', { required: 'Preferred service is required' })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs bg-white"
                >
                  <option value="Laptop Services">Laptop Sales & Service</option>
                  <option value="Desktop Services">Desktop Sales & Service</option>
                  <option value="Networking Solutions">Networking Solutions</option>
                  <option value="CCTV Services">CCTV Installation & Maintenance</option>
                  <option value="Other">Other IT Hardware Assistance</option>
                </select>
                {errors.service && <p className="text-[10px] text-primary mt-1">{errors.service.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">Describe your issue / requirements *</label>
                <textarea
                  rows={5}
                  placeholder="Specify model numbers if applicable (e.g. Dell Inspiron screen blinking, office needs 8 CCTV cameras)..."
                  {...register('message', { required: 'Message body cannot be empty' })}
                  className={`w-full px-3.5 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs ${
                    errors.message ? 'border-primary' : 'border-slate-300'
                  }`}
                />
                {errors.message && <p className="text-[10px] text-primary mt-1">{errors.message.message}</p>}
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-primary text-xs flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg transition-colors text-sm disabled:opacity-70"
              >
                {submitting ? 'Submitting Request...' : 'Submit Request'}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Success Modal */}
      {requestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl text-center space-y-6">
            <div className="mx-auto w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle size={32} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-secondary">Request Submitted!</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Thank you. We have received your query. A dedicated technician will call you shortly. Use the Request ID below to track your ticket status.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
              <code className="text-xs text-secondary font-mono break-all select-all flex-grow text-left">
                {requestId}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg shrink-0 transition-colors flex items-center justify-center"
                title="Copy Request ID"
              >
                {copied ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>
            {copied && <span className="text-[10px] text-green-600 font-bold block">Copied to clipboard!</span>}

            <button
              onClick={() => setRequestId('')}
              className="w-full bg-secondary hover:bg-secondary-light text-white font-bold py-3 rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
