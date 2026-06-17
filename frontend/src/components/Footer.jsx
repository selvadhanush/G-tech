import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                G-TECH<span className="text-primary">.</span>
              </span>
              <span className="bg-primary text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded uppercase">
                Innovation
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted technological service partner in Chennai. Delivering genuine parts, certified engineering expertise, and fast-turnaround laptop, desktop, network, and security services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="hover:text-primary transition-colors p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="hover:text-primary transition-colors p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400" aria-label="Instagram">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase border-l-4 border-primary pl-3">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Services Catalog', path: '/services' },
                { name: 'Projects Completed', path: '/projects' },
                { name: 'Customer Testimonials', path: '/testimonials' },
                { name: 'Get in Touch', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-primary transition-colors flex items-center gap-1 group">
                    <ChevronRight size={14} className="text-slate-500 group-hover:text-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase border-l-4 border-primary pl-3">Services</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Laptop Repairs & Support', path: '/services' },
                { name: 'Custom Desktop Building', path: '/services' },
                { name: 'Office Network Infrastructure', path: '/services' },
                { name: 'CCTV Installation & AMCs', path: '/services' }
              ].map((serv, index) => (
                <li key={index}>
                  <Link to={serv.path} className="hover:text-primary transition-colors flex items-center gap-1 group">
                    <ChevronRight size={14} className="text-slate-500 group-hover:text-primary transition-colors" />
                    {serv.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase border-l-4 border-primary pl-3">Contact Us</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="text-primary shrink-0" />
                <span className="text-slate-400">
                  1st Floor, Vijaya Lakshmi Complex,<br />
                  #12, Athipattan Street,<br />
                  Richie Street, Mount Road,<br />
                  Chennai - 600002
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-primary shrink-0" />
                <a href="tel:04435395138" className="hover:text-primary transition-colors text-slate-400">
                  044-35395138
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-primary shrink-0" />
                <a href="tel:+919363706040" className="hover:text-primary transition-colors text-slate-400">
                  +91 9363706040
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={16} className="text-primary shrink-0" />
                <a href="mailto:reach2gtech@gmail.com" className="hover:text-primary transition-colors text-slate-400">
                  reach2gtech@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {currentYear} G-TECH Innovation. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/login" className="hover:text-primary transition-colors">Admin Login</Link>
            <span>&bull;</span>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
