import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Key, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Login | G-TECH Innovation";
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Username/Email and password are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const result = await login(username.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="bg-secondary-dark min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-secondary p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-primary/5 rounded-full blur-2xl" />

        <div className="text-center mb-8">
          <span className="inline-flex p-3 bg-red-950/40 text-primary border border-primary/25 rounded-2xl mb-4">
            <ShieldAlert size={28} />
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">G-TECH Portal</h1>
          <p className="text-slate-400 text-xs mt-1">Authorized Administrator Access Only</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">Username or Email</label>
            <div className="relative">
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <User className="absolute left-3.5 top-3 text-slate-500" size={14} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <Key className="absolute left-3.5 top-3 text-slate-500" size={14} />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/40 text-primary border border-primary/20 rounded-xl text-[11px] font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-xs shadow-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800 pt-6">
          <p className="text-[10px] text-slate-500">
            Forgot credentials? Please contact system support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
