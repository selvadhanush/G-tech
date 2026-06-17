import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, PhoneCall, ClipboardCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LeadTrackingModal from './LeadTrackingModal';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  const activeStyle = "text-primary font-semibold border-b-2 border-primary pb-1";
  const inactiveStyle = "text-secondary-light hover:text-primary transition-colors pb-1";

  return (
    <>
      <nav className="sticky top-0 z-40 w-full glassmorphism shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-secondary">
                  G-TECH<span className="text-primary">.</span>
                </span>
                <span className="hidden sm:inline-block bg-primary text-white text-[10px] font-bold tracking-widest px-2 py-0.5 rounded uppercase">
                  Innovation
                </span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setTrackingOpen(true)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-secondary hover:bg-secondary-light text-white px-4 py-2.5 rounded-lg shadow-md transition-all active:scale-95"
              >
                <ClipboardCheck size={14} />
                Track Repair
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-200 transition-colors"
                  >
                    <Shield size={14} className="text-primary" />
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-primary p-2 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <a
                  href="tel:04435395138"
                  className="flex items-center gap-1.5 text-xs font-semibold bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg shadow-md transition-all active:scale-95"
                >
                  <PhoneCall size={14} />
                  Call Support
                </a>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden gap-2">
              <button
                onClick={() => setTrackingOpen(true)}
                className="p-2 text-secondary hover:text-primary transition-colors"
                title="Track Request"
              >
                <ClipboardCheck size={20} />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-secondary hover:text-primary hover:bg-slate-100 focus:outline-none transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-lg py-4 px-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "text-primary font-bold text-lg"
                      : "text-secondary-light hover:text-primary transition-colors text-lg"
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTrackingOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-secondary hover:bg-secondary-light text-white py-3 rounded-lg shadow transition-colors"
              >
                <ClipboardCheck size={16} />
                Track Repair Request
              </button>

              {isAuthenticated ? (
                <div className="flex gap-2">
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-grow flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 text-slate-800 font-semibold py-3 rounded-lg text-sm"
                  >
                    <Shield size={16} className="text-primary" />
                    Admin Panel
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="p-3 bg-red-50 text-primary border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <a
                  href="tel:04435395138"
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold bg-primary hover:bg-primary-dark text-white py-3 rounded-lg shadow transition-colors"
                >
                  <PhoneCall size={16} />
                  Call G-TECH Support
                </a>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Reusable Lead tracking Modal */}
      <LeadTrackingModal isOpen={trackingOpen} onClose={() => setTrackingOpen(false)} />
    </>
  );
};

export default Navbar;
