import React, { useEffect } from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';

const About = () => {
  useEffect(() => {
    document.title = "About Us | G-TECH Innovation Chennai";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Learn more about G-TECH Innovation. Established at Vijaya Lakshmi Complex Richie Street Chennai, we deliver premium computer sales and security services.");
    }
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">Who We Are</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary mt-3 mb-4">About G-TECH Innovation</h1>
          <p className="text-base text-slate-500">
            A premium technology services company, providing end-to-end hardware, networking, and surveillance solutions across Chennai.
          </p>
        </div>

        {/* Company Intro & Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-6 border-b-2 border-primary/20 pb-3">Our Journey</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Established in the tech hub of Chennai - Richie Street, G-TECH Innovation has grown to become a trusted service node for hundreds of retail customers and commercial enterprises alike. We specialized initially in high-grade chip-level laptop repairs and custom-assembled desktop builds.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              As technology evolved, we expanded our capabilities to supply full-stack office network infrastructures and advanced CCTV video surveillance integrations. We prioritize quality engineering and genuine manufacturer component parts, backing our service with solid warranty assurances.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-md h-72 lg:h-96">
            <img
              src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800"
              alt="G-tech network installation service Chennai"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-secondary text-white p-8 sm:p-10 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-3">Our Mission</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To empower homes and corporate offices throughout Chennai by offering fast-turnaround, cost-efficient, and top-tier computer maintenance and security integrations. We strive to provide transparent diagnostics directly from engineers, ensuring peace of mind for every client.
            </p>
          </div>
          <div className="bg-white text-secondary p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <h3 className="text-xl font-bold text-secondary mb-4 border-l-4 border-primary pl-3">Our Vision</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              To be recognized as Chennai's premier, single-point hub for laptop repairs, custom PC configuration, secure enterprise routing networks, and closed-circuit television cameras. We aim to scale our services while keeping client-first trust and product authenticity as our core foundations.
            </p>
          </div>
        </div>

        {/* Why Customers Trust Us */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-secondary text-center mb-12">The Pillars of Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Genuine Spares Only', desc: 'We strictly install original replacement screens, keyboards, SSDs, and camera modules.', icon: ShieldCheck },
              { title: 'Richie Street Presence', desc: 'Located right in the heart of Chennai\'s electronic market for faster sourcing.', icon: MapPin },
              { title: 'AMC Contracts Offered', desc: 'Annual maintenance contracts for corporate clients to maintain zero downtime.', icon: Award },
              { title: 'Quick Turnaround', desc: '90% of basic laptop and desktop repairs are completed within 24 to 48 hours.', icon: Clock }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                  <div className="p-3 bg-red-50 text-primary rounded-xl mb-4">
                    <Icon size={24} />
                  </div>
                  <h4 className="font-bold text-base text-secondary mb-2">{pillar.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Info Overview */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">G-TECH Innovation Chennai</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Visit our service centre or dial our hotline for inquiries. Free diagnostics inspections are available at our walk-in location.
              </p>
            </div>
            <div className="flex gap-4">
              <MapPin size={24} className="text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm text-white">Office Address</h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  1st Floor, Vijaya Lakshmi Complex,<br />
                  #12, Athipattan Street, Richie Street,<br />
                  Mount Road, Chennai - 600002
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3 items-center">
                <Phone size={16} className="text-primary shrink-0" />
                <a href="tel:04435395138" className="hover:text-primary transition-colors text-slate-300 text-xs">
                  044-35395138 (Landline)
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={16} className="text-primary shrink-0" />
                <a href="tel:+919363706040" className="hover:text-primary transition-colors text-slate-300 text-xs">
                  +91 9363706040 (Mobile)
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail size={16} className="text-primary shrink-0" />
                <a href="mailto:reach2gtech@gmail.com" className="hover:text-primary transition-colors text-slate-300 text-xs">
                  reach2gtech@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
