import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Cpu, Shield, Network, Eye } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Our Services | G-TECH Innovation Laptop, Network & CCTV Support";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Browse computer, networking, and security services offered by G-TECH Innovation. Certified motherboard repairs, custom PC configuration, office structured cabling.");
    }
  }, []);

  const serviceCategories = [
    {
      title: 'Laptop Services',
      subtitle: 'Repair, Upgrades & Software Configurations',
      icon: Cpu,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
      description: 'Expert repair services for all major laptop brands (Dell, HP, Lenovo, Asus, Acer, Apple Macbook). We address complex chip-level faults and component replacements.',
      details: [
        'Motherboard and IC chip-level diagnostics & repair',
        'Broken screen panel and hinge replacements',
        'Speed optimization: SSD installations & RAM upgrades',
        'Genuine battery, keyboard, & power adapter replacement',
        'Operating system installation (Windows/Mac) & virus removal'
      ],
      benefits: ['Free basic inspection diagnostics', 'Same-day turnaround for standard issues', '90-day warranty on installed spare parts'],
    },
    {
      title: 'Desktop Services',
      subtitle: 'Custom Rig Building & Hardware Troubleshooting',
      icon: Shield,
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800',
      description: 'Whether you need a heavy-duty workstation for video editing, a high-FPS gaming desktop, or standard office computing terminals, we configure them to your budget.',
      details: [
        'Custom desktop PC assembly matching client specifications',
        'Power Supply Unit (PSU) and motherboard diagnostic repairs',
        'Thermal paste re-application and cooling fan optimization',
        'Data recovery from damaged hard drives and SSDs',
        'Regular preventative maintenance, dust cleaning & optimization'
      ],
      benefits: ['Tailored component suggestions', 'Burn-in hardware stability testing', 'Full original component manufacturer warranties'],
    },
    {
      title: 'Networking Solutions',
      subtitle: 'Structured Cabling, Router Configurations & WiFi Routing',
      icon: Network,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
      description: 'End-to-end local area network (LAN) setups and configurations for residential properties, shops, and multi-floor corporate offices across Chennai.',
      details: [
        'Structured Cat6/Cat6A cabling and network rack installations',
        'Dual-WAN router setup and secure firewall configurations',
        'High-density corporate wireless WiFi access point (AP) routing',
        'Network troubleshooting: solving IP conflicts & speed drops',
        'Virtual Private Network (VPN) setups for secure remote workflows'
      ],
      benefits: ['Neat structured cable labelling', 'Optimized wireless signal coverage maps', 'On-site post-installation support SLAs'],
    },
    {
      title: 'CCTV Installation & Maintenance',
      subtitle: 'IP surveillance networks, DVR/NVR setups & AMCs',
      icon: Eye,
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
      description: 'Robust commercial security camera solutions to secure your retail shops, warehouses, residential complexes, and offices with round-the-clock remote video access.',
      details: [
        'High definition Analog and IP Camera installs (dome, bullet, PTZ)',
        'DVR/NVR device setup, configuration & hard drive storage upgrades',
        'Remote mobile applications routing for live viewing worldwide',
        'Surveillance power supply units (SMPS) & wiring replacements',
        'Annual Maintenance Contracts (AMC) for commercial properties'
      ],
      benefits: ['Blind-spot-free angle layouts', 'Cloud backup setup support', '24/7 mobile monitoring access guidance'],
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">Services Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary mt-3 mb-4">G-TECH Innovation Solutions</h1>
          <p className="text-base text-slate-500">
            Professional sales and certified servicing support. Select a category below to submit a custom service request.
          </p>
        </div>

        {/* Services Listings */}
        <div className="space-y-20">
          {serviceCategories.map((service, idx) => {
            const IconComponent = service.icon;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={service.title}
                className={`flex flex-col lg:flex-row gap-10 lg:gap-16 items-stretch ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Visual Area */}
                <div className="w-full lg:w-1/2">
                  <div className="relative rounded-3xl overflow-hidden shadow-lg h-80 sm:h-96 lg:h-full min-h-[350px] border-4 border-white">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/20 to-transparent flex items-end p-8">
                      <div className="text-white flex items-center gap-3">
                        <div className="p-3 bg-primary rounded-xl">
                          <IconComponent size={24} />
                        </div>
                        <div>
                          <h2 className="font-bold text-xl text-white">{service.title}</h2>
                          <p className="text-slate-300 text-xs">{service.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Area */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between py-2">
                  <div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">{service.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{service.description}</p>
                    
                    {/* Details checklist */}
                    <div className="mb-6">
                      <h4 className="font-bold text-xs text-secondary uppercase tracking-wider mb-3">Key Solutions Provided:</h4>
                      <ul className="grid grid-cols-1 gap-2.5">
                        {service.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex gap-2.5 items-start text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits tag lines */}
                    <div className="mb-8 p-4 bg-slate-100 rounded-2xl border border-slate-200/50">
                      <h4 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest mb-2.5">Why Servicing With Us is Premium:</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {service.benefits.map((benefit, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-1.5 text-xs text-secondary font-semibold">
                            <Check size={14} className="text-green-600 shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA Request Button */}
                  <button
                    onClick={() => navigate('/contact', { state: { preferredService: service.title } })}
                    className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95 text-center text-sm"
                  >
                    Request {service.title}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Services;
