import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setErrors({});

    let error: Error | null = null;

    try {
      const client = getSupabaseClient();
      const signOutResponse = await client.auth.signOut();

      if (signOutResponse.error) {
        throw signOutResponse.error;
      }

      const { data, error: authError } = await client.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });
      error = authError ?? (data.session ? null : new Error('No authenticated session was returned.'));
    } catch (requestError) {
      error = requestError instanceof Error ? requestError : new Error('Unable to sign in right now.');
    }

    if (error) {
      setLoading(false);
      setErrors({ form: error.message });
      return;
    }

    setSuccess(true);
    const from = (location.state as { from?: string } | null)?.from;
    navigate(from || '/profile', { replace: true });
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-sm font-bold font-display">SGR</span>
          </div>
          <h1 className="font-display text-xl font-bold text-ink">Welcome back</h1>
          <p className="text-sm text-muted mt-1">Sign in to your SGR Arena account</p>
        </div>

        <div className="bg-surface rounded-xl border border-edge p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-success-light rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-sm font-semibold text-ink">Signed in successfully!</p>
              <p className="text-xs text-muted mt-1">Redirecting to your profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && <p className="text-xs text-danger" role="alert">{errors.form}</p>}
              <div>
                <label className="text-xs font-medium text-ink mb-1 block">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                  placeholder="you@example.com"
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-bg focus:outline-none focus:border-primary transition-colors ${errors.email ? 'border-danger' : 'border-edge'}`}
                />
                {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-ink mb-1 block">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })); }}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-bg focus:outline-none focus:border-primary transition-colors ${errors.password ? 'border-danger' : 'border-edge'}`}
                />
                {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                  <input type="checkbox" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} className="accent-primary" />
                  Remember me
                </label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</> : 'Sign In'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">Create account</Link>
        </p>
      </div>
    </div>
  );
}
