import React, { useState } from 'react';
import api from '../utils/axiosInstance';
import { LogIn, UserPlus, ShieldCheck, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAction = async () => {
        setLoading(true);
        setError('');
        try {
            const resp = await api.post('/api/auth/login', {
                email: formData.email,
                password: formData.password
            });
            localStorage.setItem('token', resp.data.token);
            localStorage.setItem('user', JSON.stringify(resp.data.user));
            localStorage.setItem('role', resp.data.user.role);
            window.location.href = '/';
        } catch (e) {
            setError(e.response?.data?.message || 'Authentication error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8 overflow-hidden relative font-sans">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-transparent to-blue-900/40 opacity-50 pointer-events-none"></div>

            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700 pointer-events-none"></div>

            <div className="w-full max-w-xl bg-white/5 backdrop-blur-3xl border border-white/10 p-12 lg:p-16 flex flex-col gap-10 relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[40px] animate-in zoom-in-95 duration-700">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold text-white tracking-tight">Welcome Back</h1>
                        <p className="text-emerald-400 mt-2 text-sm">Sign in to your account</p>
                    </div>
                </div>

                {error && <div className="p-4 bg-red-600/20 border border-red-500/50 rounded-2xl text-red-400 text-sm font-medium text-center animate-in slide-in-from-top-4">{error}</div>}

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2 group">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-4 group-focus-within:text-emerald-400 transition-colors">Email Address</label>
                        <div className="relative">
                            <input
                                className="w-full !bg-white/5 border border-white/10 focus:border-emerald-600 rounded-[20px] p-4 pl-12 !text-white font-medium transition-all outline-none"
                                placeholder="Enter your email"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 group">
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-4 group-focus-within:text-emerald-400 transition-colors">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                className="w-full !bg-white/5 border border-white/10 focus:border-emerald-600 rounded-[20px] p-4 pl-12 !text-white font-medium transition-all outline-none"
                                placeholder="Enter your password"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    <button
                        onClick={handleAction}
                        disabled={loading}
                        className="w-full bg-white text-black py-4 text-sm font-bold rounded-[30px] hover:bg-emerald-600 hover:text-white transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group/btn overflow-hidden relative"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {loading ? 'Processing...' : <><LogIn size={18} /> Sign In</>}
                        </span>
                        <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    </button>
                    <p className="text-center text-sm font-medium text-white/60">
                        Contact administration to create an account.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
