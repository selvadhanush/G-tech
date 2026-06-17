import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Key, Mail, User, Phone, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Register | G-TECH Innovation";
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Name, email, and password are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const result = await register(name.trim(), email.trim(), phone.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-primary/5 rounded-full blur-2xl" />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-secondary tracking-tight">Create Account</h1>
          <p className="text-slate-400 text-xs mt-1">Get started with G-TECH Innovation Store</p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-secondary text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
              <User className="absolute left-3.5 top-3.5 text-slate-400" size={14} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-secondary text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={14} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number (Optional)</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-secondary text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <Phone className="absolute left-3.5 top-3.5 text-slate-400" size={14} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-secondary text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
              <Key className="absolute left-3.5 top-3.5 text-slate-400" size={14} />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-primary border border-red-100 rounded-xl text-[11px] font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-70 mt-2"
          >
            {loading ? 'Registering...' : 'Sign Up'}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 pt-5">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
