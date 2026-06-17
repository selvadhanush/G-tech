import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, CheckCircle, ArrowRight, ShieldCheck, Tag, Award, Users, Star, MessageSquare, Laptop, Monitor, Network, Shield } from 'lucide-react';
import api from '../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEO updates
  useEffect(() => {
    document.title = "G-TECH Innovation | Laptop, Desktop, Networking & CCTV Solutions Chennai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Your trusted technology partner in Chennai for Laptop Repair, Desktop building, WiFi networking and security CCTV installation. Genuine parts and expert technicians.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, testRes] = await Promise.all([
          api.get('/projects'),
          api.get('/testimonials')
        ]);
        // Get first 3 of each
        setProjects(projRes.data.slice(0, 3));
        setTestimonials(testRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // WhatsApp click handler
  const handleWhatsAppClick = () => {
    const phoneNumber = '919363706040';
    const message = 'Hello G-TECH Innovation, I am interested in your services and would like a free consultation.';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const services = [
    {
      title: 'Laptop Sales & Service',
      desc: 'Expert chip-level repairing, panel replacements, OS installations, and boot issues resolving.',
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Desktop Sales & Service',
      desc: 'Custom assembled gaming & office PCs, hardware upgrading, maintenance and troubleshooting.',
      icon: Monitor,
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Networking Solutions',
      desc: 'Cat6 structured cabling, switch configs, router routing, and secure WiFi coverage setups.',
      icon: Network,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'CCTV Installation',
      desc: 'Top-tier high definition IP/analog security system designs with mobile monitoring and AMCs.',
      icon: Shield,
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const features = [
    { title: 'Expert Technicians', desc: 'Highly skilled, certified engineers dedicated to quality repair.', icon: ShieldCheck },
    { title: 'Affordable Pricing', desc: 'Fair, transparent rates with zero hidden inspection charges.', icon: Tag },
    { title: 'Genuine Products', desc: '100% original vendor parts with official company warranties.', icon: Award },
    { title: 'Fast Support', desc: 'Same-day diagnostics and immediate turnaround on services.', icon: Users }
  ];

  return (
    <div className="bg-mesh min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left side text */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-subtle text-primary mb-5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Your Chennai Technology Service Partner
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-secondary tracking-tight leading-none mb-6">
                  Your Trusted Partner for <br />
                  <span className="text-primary text-glow">Laptop, Desktop, Networking</span> & CCTV Solutions
                </h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Professional technology sales, hardware repair, network setup and security integration services for homes and businesses across Chennai. Located conveniently at Mount Road Richie Street.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <a
                    href="tel:04435395138"
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all active:scale-95 text-sm"
                  >
                    <Phone size={18} />
                    Call Now: 044 – 3539 5138
                  </a>
                  <button
                    onClick={handleWhatsAppClick}
                    className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/35 transition-all active:scale-95 text-sm"
                  >
                    WhatsApp Us
                  </button>
                  <Link
                    to="/contact"
                    className="flex items-center gap-1.5 bg-secondary hover:bg-secondary-light text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-sm"
                  >
                    Free Consultation
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right side graphic */}
            <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-5">
              <motion.div
                className="relative mx-auto w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800"
                  alt="G-TECH innovation laptop and network repairing shop Chennai"
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-sm font-semibold text-accent mb-1">Visit our Chennai Hub</p>
                    <h3 className="font-bold text-lg">Vijaya Lakshmi Complex, Richie Street</h3>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES OVERVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-secondary sm:text-4xl mb-4">Our Technology Expertise</h2>
            <p className="text-base text-slate-500">
              We provide full lifecycle service support, from consulting and product sales to expert hardware repairs and complex deployments.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {services.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2.5 text-primary shadow-sm h-10 w-10 flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                  </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-secondary mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                  </div>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-semibold transition-colors mt-auto"
                  >
                    View Details
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )})}
          </motion.div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left side text */}
            <div className="lg:col-span-5 mb-12 lg:mb-0">
              <h2 className="text-3xl font-extrabold text-secondary sm:text-4xl mb-4">Why Businesses Trust G-TECH</h2>
              <p className="text-base text-slate-500 mb-6 leading-relaxed">
                As a leading IT and security company in Chennai, we stand out by providing reliable, top-tier technician support alongside genuine vendor parts. Our client-focused approach keeps downtime to a minimum.
              </p>
              <ul className="space-y-3">
                {['Direct response from engineers - no middleman', 'High-quality equipment sourced from tier-1 manufacturers', 'Fast diagnostics with quick local dispatch in Chennai'].map((txt, index) => (
                  <li key={index} className="flex gap-2 items-start text-sm text-slate-600">
                    <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{txt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feat, index) => {
                  const Icon = feat.icon;
                  return (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4">
                      <div className="p-3 bg-red-50 text-primary rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-secondary mb-1">{feat.title}</h3>
                        <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-secondary sm:text-4xl mb-3">Completed Works</h2>
              <p className="text-slate-500 max-w-xl text-sm">
                Take a look at some of G-TECH's recent deployments in surveillance camera installations, office LAN installations, and system upgrades.
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-bold text-sm mt-4 md:mt-0 transition-colors"
            >
              See All Projects
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse bg-slate-50 rounded-2xl h-80 border border-slate-100" />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all group">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <span className="absolute top-4 right-4 bg-secondary text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded uppercase">
                      {proj.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{proj.location}</span>
                    <h3 className="font-bold text-base text-secondary mt-1 mb-2 leading-snug">{proj.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{proj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p>No project works seeded yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">Reviews</span>
            <h2 className="text-3xl font-extrabold text-secondary sm:text-4xl mt-3 mb-4">What Our Clients Say</h2>
            <p className="text-base text-slate-500">
              Customer satisfaction is our ultimate goal. Here are the latest feedbacks from our residential and commercial clients in Chennai.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse bg-white rounded-2xl h-48 shadow-sm" />
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test) => (
                <div key={test.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-full relative">
                  <div>
                    <div className="flex gap-1 text-amber-500 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} fill={i < test.rating ? "currentColor" : "none"} className={i < test.rating ? "text-amber-500" : "text-slate-300"} />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm italic leading-relaxed mb-6">"{test.review}"</p>
                  </div>
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="font-bold text-sm text-secondary">{test.customerName}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{new Date(test.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p>No customer reviews yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. CONTACT CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-secondary rounded-3xl overflow-hidden relative shadow-2xl p-8 sm:p-12 lg:p-16 text-center text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

            <h2 className="text-3xl font-extrabold sm:text-4xl mb-4 text-white">Need Quick Repairs or Free Consultation?</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              Don't let tech issues stall your operations. Send a query to our Richie Street complex team or call us directly. We will get back to you with custom diagnostics options immediately.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-colors text-sm"
              >
                Submit Service Request
              </Link>
              <a
                href="tel:04435395138"
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold px-8 py-4 rounded-xl shadow-lg transition-colors text-sm"
              >
                Call: 044 – 3539 5138
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
