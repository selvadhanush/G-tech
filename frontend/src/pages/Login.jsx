import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Key, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    document.title = "Login | G-TECH Innovation";
    if (isAuthenticated && user) {
      if (user.role === 'GTECH_ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    }
  }, [isAuthenticated, user, navigate, redirectPath]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Email and password are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      // AuthContext will update user state, which triggers redirect in useEffect
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
          <h1 className="text-3xl font-extrabold text-secondary tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-xs mt-1">Sign in to your G-TECH Innovation account</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-secondary text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={14} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-[10px] text-primary hover:underline font-bold">
                Forgot Password?
              </Link>
            </div>
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
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-bold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
