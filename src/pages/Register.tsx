import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!form.confirm) errs.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setErrors({});

    let data: { session: unknown } = { session: null };
    let error: Error | null = null;

    try {
      const response = await getSupabaseClient().auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: { full_name: form.name.trim() },
        },
      });
      data = response.data;
      error = response.error;
    } catch (requestError) {
      error = requestError instanceof Error ? requestError : new Error('Unable to create your account right now.');
    }

    if (error) {
      setLoading(false);
      setErrors({ form: error.message });
      return;
    }

    if (data.session) {
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || '/profile', { replace: true });
      return;
    }

    setLoading(false);
    setSuccessMessage('Check your email to confirm your account before signing in.');
    setSuccess(true);
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
    { key: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
    { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password' },
  ] as const;

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];
  const strengthColors = ['', 'bg-danger', 'bg-warning', 'bg-success'];

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-sm font-bold font-display">SGR</span>
          </div>
          <h1 className="font-display text-xl font-bold text-ink">Create your account</h1>
          <p className="text-sm text-muted mt-1">Join the SGR Arena community</p>
        </div>

        <div className="bg-surface rounded-xl border border-edge p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-success-light rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-sm font-semibold text-ink">Account created!</p>
              <p className="text-xs text-muted mt-1">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && <p className="text-xs text-danger" role="alert">{errors.form}</p>}
              {fields.map(field => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-ink mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={e => { setForm(f => ({ ...f, [field.key]: e.target.value })); setErrors(er => ({ ...er, [field.key]: '' })); }}
                    placeholder={field.placeholder}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-bg focus:outline-none focus:border-primary transition-colors ${errors[field.key] ? 'border-danger' : 'border-edge'}`}
                  />
                  {field.key === 'password' && form.password.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwStrength ? strengthColors[pwStrength] : 'bg-edge'}`} />
                        ))}
                      </div>
                      <span className={`text-[10px] font-medium ${pwStrength === 1 ? 'text-danger' : pwStrength === 2 ? 'text-warning' : 'text-success'}`}>{strengthLabels[pwStrength]}</span>
                    </div>
                  )}
                  {errors[field.key] && <p className="text-xs text-danger mt-1">{errors[field.key]}</p>}
                </div>
              ))}
              <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</> : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
