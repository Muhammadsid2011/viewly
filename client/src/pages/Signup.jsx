import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, AtSign, Mail, Lock } from "lucide-react";
import useAuthStore from '../store/authStore';
import { register } from '../api/auth';
import { setToken } from '../api/axios';
import { getErrorMessage } from '../utils/format';
import Spinner from '../components/Spinner';

const FIELDS = [
  { key: 'fullName', label: 'Full name', icon: User, placeholder: 'Enter your full name', type: 'text' },
  { key: 'username', label: 'Username', icon: AtSign, placeholder: 'Choose a username', type: 'text' },
  { key: 'email', label: 'Email address', icon: Mail, placeholder: 'Enter your email', type: 'email' },
  { key: 'password', label: 'Password', icon: Lock, placeholder: 'Create a password', type: 'password' },
];

export default function Signup() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState({ username: "", email: "", fullName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await register(form);
      // Store the access token for Bearer auth (secure cookies don't persist on http localhost).
      setToken(response.data.accessToken);
      setUser(response.data.user);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Could not create your account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[500px] bg-surface-container border border-surface-container-high rounded-2xl p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="font-headline-lg text-primary font-black inline-block mb-2">Viewly</Link>
          <h2 className="font-title-md text-on-surface">Create your account</h2>
          <p className="font-meta-sm text-on-surface-variant mt-1">Join the premiere streaming experience.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {FIELDS.map((field) => (
            <div key={field.key} className="space-y-2">
              <label htmlFor={field.key} className="font-label-xs text-on-surface-variant uppercase block">
                {field.label}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <field.icon className="size-5" aria-hidden="true" />
                </div>
                <input
                  id={field.key}
                  value={form[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-surface-container-high border border-surface-container-highest text-on-surface rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant font-body-md"
                />
              </div>
            </div>
          ))}

          {error && <p className="font-meta-sm text-error">{error}</p>}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-primary text-on-primary font-title-md py-3.5 rounded-lg hover:bg-primary-container transition-colors mt-2 disabled:opacity-60 flex items-center justify-center gap-sm"
          >
            {loading && <Spinner className="size-5" />}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-surface-container-high text-center">
          <p className="font-meta-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
