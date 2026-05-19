import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { KeyRound, Mail, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const { user, login, error, setError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    setLocalError('');
  }, [setError]);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please enter administrative credentials.');
      return;
    }
    setLocalError('');

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role !== 'admin') {
        setLocalError('Unauthorized access: Standard users are restricted from the Administrative Panel.');
      }
    } catch (err) {
      // Handled by AuthContext state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 font-sans select-none">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
        
        {/* Brand/Heading */}
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-5 shadow-xs border border-green-100">
            <ShieldCheck size={24} className="stroke-[2]" />
          </div>
          <h2 className="text-3xl font-light text-slate-900 tracking-tight">Administrative Panel</h2>
          <p className="mt-2 text-sm text-slate-700 font-normal">Secure Verification Authority</p>
        </div>

        {/* Error Alerts */}
        {(localError || error) && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-sm animate-pulse">
            <ShieldAlert size={18} className="shrink-0 stroke-[2] mt-0.5 text-red-600" />
            <div>
              <span className="font-normal">Security Restrict:</span> {localError || error}
            </div>
          </div>
        )}

        {/* Form panel */}
        <form onSubmit={handleLoginSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-700">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm font-normal"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-700">
                  <KeyRound size={16} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm font-normal"
                />
              </div>
            </div>

          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-sm font-normal rounded-xl text-white bg-green-600 hover:bg-green-500 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 cursor-pointer shadow-lg shadow-green-500/10"
          >
            {loading ? 'Authenticating Admin...' : 'Authenticate Access'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <span className="text-slate-700 font-normal">Are you an applicant? </span>
          <Link to="/login" className="font-normal text-green-600 hover:text-green-500 hover:underline transition-colors duration-150">
            Go to User Portal
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
