import { Lock, User } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import useAuthStore from '../store/authStore';

const ViewlyLogin = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            const response =await login({ email, password });

            const user = response.data.user;

            setUser(user);
            navigate('/');
        } catch (error) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0e0e] p-4 font-sans text-white">
            <div className="w-full max-w-[480px] bg-[#1a1919] border border-[#2a2929] rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#ffb3a7] mb-2">Viewly</h1>
                    <h2 className="text-lg font-medium text-white">Sign in to your account</h2>
                    <p className="text-sm text-[#a0a0a0] mt-1">Welcome back to the premiere streaming experience.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider">
                            EMAIL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666]">
                                <User />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#252424] border border-[#333] rounded-lg py-3 pl-10 pr-4 text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#ffb3a7] transition-all"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="block text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider">
                                PASSWORD
                            </label>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666]">
                                <Lock />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#252424] border border-[#333] rounded-lg py-3 pl-10 pr-10 text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#ffb3a7] transition-all"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    {loading && <p className="text-sm text-[#ffb3a7] mt-2">Logging in...</p>}
                    {error && <p className="text-sm text-[#ff6b6b] mt-2">{error}</p>}
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full cursor-pointer bg-[#ffb3a7] text-[#1a1919] font-bold py-3 rounded-lg hover:bg-[#ffc5bc] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1919] focus:ring-[#ffb3a7]"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[#2a2929] text-center">
                    <p className="text-sm text-[#a0a0a0]">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="text-[#ffb3a7] font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViewlyLogin;
