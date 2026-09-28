import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, clearAuthErrors } from '../redux/authSlice';
import { X, Mail, Lock, User, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const AuthModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, validationErrors } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(clearAuthErrors());
    }
  }, [isOpen, activeTab, dispatch]);

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    dispatch(clearAuthErrors());
  };

  const getFieldError = (fieldName) => {
    if (!validationErrors || !Array.isArray(validationErrors)) return null;
    const err = validationErrors.find(
      (e) => e.path === fieldName || e.param === fieldName || e.field === fieldName
    );
    return err ? err.msg || err.message : null;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(loginData));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Logged in successfully!');
      onClose();
    } else if (loginUser.rejected.match(result)) {
      toast.error(result.payload?.message || 'Login failed.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(registerData));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Please sign in with your credentials.');
      setActiveTab('login');
      setLoginData({ email: registerData.email, password: '' });
    } else if (registerUser.rejected.match(result)) {
      toast.error(result.payload?.message || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X size={20} />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-800">
          <button
            className={`flex-1 py-2.5 font-semibold text-center text-sm transition border-b-2 cursor-pointer ${
              activeTab === 'login'
                ? 'text-indigo-400 border-indigo-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
            onClick={() => handleTabChange('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2.5 font-semibold text-center text-sm transition border-b-2 cursor-pointer ${
              activeTab === 'register'
                ? 'text-indigo-400 border-indigo-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
            onClick={() => handleTabChange('register')}
          >
            Create Account
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <h2 className="text-xl font-bold text-white">Welcome Back</h2>
              <p className="text-slate-400 text-xs mt-1">Enter your credentials to manage your store</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="login-email" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Mail size={14} className="text-slate-400" /> Email Address
              </label>
              <input
                type="email"
                id="login-email"
                placeholder="user@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
              {getFieldError('email') && (
                <p className="text-red-400 text-xs mt-0.5">{getFieldError('email')}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="login-password" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Lock size={14} className="text-slate-400" /> Password
              </label>
              <input
                type="password"
                id="login-password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              {getFieldError('password') && (
                <p className="text-red-400 text-xs mt-0.5">{getFieldError('password')}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form className="space-y-3.5" onSubmit={handleRegisterSubmit}>
            <div>
              <h2 className="text-xl font-bold text-white">Create Account</h2>
              <p className="text-slate-400 text-xs mt-1">Register to create, update, and delete products</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="reg-name" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <User size={14} className="text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                id="reg-name"
                placeholder="John Doe"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
              />
              {getFieldError('name') && (
                <p className="text-red-400 text-xs mt-0.5">{getFieldError('name')}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="reg-email" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Mail size={14} className="text-slate-400" /> Email Address
              </label>
              <input
                type="email"
                id="reg-email"
                placeholder="user@example.com"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
              {getFieldError('email') && (
                <p className="text-red-400 text-xs mt-0.5">{getFieldError('email')}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="reg-password" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Lock size={14} className="text-slate-400" /> Password
              </label>
              <input
                type="password"
                id="reg-password"
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
              {getFieldError('password') && (
                <p className="text-red-400 text-xs mt-0.5">{getFieldError('password')}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="reg-confirmPassword" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <ShieldCheck size={14} className="text-slate-400" /> Confirm Password
              </label>
              <input
                type="password"
                id="reg-confirmPassword"
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({ ...registerData, confirmPassword: e.target.value })
                }
                required
              />
              {getFieldError('confirmPassword') && (
                <p className="text-red-400 text-xs mt-0.5">{getFieldError('confirmPassword')}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <UserPlus size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
