import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/auth';
import { setToken } from '../api/axios';
import useAuthStore from '../store/authStore';
import { getErrorMessage } from '../utils/format';
import Spinner from '../components/Spinner';

const Login = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            const response = await login({ email, password });
            // Secure cookies can't be stored over http://localhost, so we keep the
            // access token client-side and send it as a Bearer header.
            setToken(response.data.accessToken);
            setUser(response.data.user);
            navigate(from, { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, 'Invalid email or password.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-[480px] bg-surface-container border border-surface-container-high rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <Link to="/" className="font-headline-lg text-primary font-black inline-block mb-2">Viewly</Link>
                    <h2 className="font-title-md text-on-surface">Sign in to your account</h2>
                    <p className="font-meta-sm text-on-surface-variant mt-1">
                        Welcome back to the premiere streaming experience.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="email" className="font-label-xs text-on-surface-variant uppercase block">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                                <Mail className="size-5" aria-hidden="true" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-surface-container-high border border-surface-container-highest rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors font-body-md"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="font-label-xs text-on-surface-variant uppercase block">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                                <Lock className="size-5" aria-hidden="true" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-surface-container-high border border-surface-container-highest rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors font-body-md"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {error && <p className="font-meta-sm text-error">{error}</p>}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full cursor-pointer bg-primary text-on-primary font-title-md py-3 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-60 flex items-center justify-center gap-sm"
                    >
                        {loading && <Spinner className="size-5" />}
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-surface-container-high text-center">
                    <p className="font-meta-sm text-on-surface-variant">
                        Don't have an account?{' '}
                        <Link to="/auth/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
