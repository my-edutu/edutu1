import React, { useState } from 'react';
import {
  Apple,
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  Lock,
  Sparkles,
  User,
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

interface AuthScreenProps {
  onGetStarted: (userData: { name: string; age: number }) => void;
}

const socialProviders = [
  {
    name: 'Continue with Google',
    accent: 'bg-gradient-to-r from-[#4285F4] to-[#3367D6] text-white',
    icon: Sparkles,
  },
  {
    name: 'Continue with Microsoft',
    accent: 'bg-neutral-900 text-inverse',
    icon: AtSign,
  },
  {
    name: 'Continue with Apple',
    accent: 'bg-neutral-800 text-inverse',
    icon: Apple,
  },
];

const identities = [
  { name: 'Amara Okafor', age: 22 },
  { name: 'Kwame Asante', age: 24 },
  { name: 'Fatima Hassan', age: 21 },
  { name: 'Chidi Nwosu', age: 23 },
  { name: 'Zara Mwangi', age: 20 },
  { name: 'Kofi Mensah', age: 25 },
];

const AuthScreen: React.FC<AuthScreenProps> = ({ onGetStarted }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
  });

  const handleSocialAuth = () => {
    const profile = identities[Math.floor(Math.random() * identities.length)];
    onGetStarted(profile);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'login') {
      handleSocialAuth();
      return;
    }

    if (formData.name && formData.age) {
      onGetStarted({ name: formData.name, age: parseInt(formData.age, 10) });
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  return (
    <div className="min-h-screen bg-surface-body text-strong px-4 py-10 flex flex-col">
      <div className="max-w-md w-full mx-auto space-y-8">
        <header className="space-y-4 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-brand-600 text-inverse flex items-center justify-center shadow-soft">
            <Sparkles size={22} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">
              {mode === 'login' ? 'Welcome back to Edutu' : 'Create your Edutu account'}
            </h1>
            <p className="text-soft">
              {mode === 'login'
                ? 'Stay accountable, synced, and inspired. Sign in to continue where you left off.'
                : 'Unlock personalised roadmaps, smart reminders, and a high-trust community designed for mobile.'}
            </p>
          </div>
        </header>

        <section className="space-y-3">
          {socialProviders.map((provider) => (
            <button
              key={provider.name}
              onClick={handleSocialAuth}
              className={`w-full rounded-2xl px-4 py-3 flex items-center justify-center gap-3 font-medium transition-transform hover:scale-[1.01] active:scale-[0.99] ${provider.accent}`}
            >
              <provider.icon size={18} />
              {provider.name}
            </button>
          ))}
        </section>

        <div className="flex items-center gap-4 text-xs text-muted">
          <div className="h-px flex-1 bg-border-subtle" />
          <span>or continue with email</span>
          <div className="h-px flex-1 bg-border-subtle" />
        </div>

        <Card className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="full-name" className="text-sm font-medium text-muted">
                  Full name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="full-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    className="w-full rounded-2xl border border-subtle bg-surface-layer px-11 py-3 text-sm focus-visible:border-brand-400 focus-visible:shadow-focus"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted">
                Email address
              </label>
              <div className="relative">
                <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className="w-full rounded-2xl border border-subtle bg-surface-layer px-11 py-3 text-sm focus-visible:border-brand-400 focus-visible:shadow-focus"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-muted">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  className="w-full rounded-2xl border border-subtle bg-surface-layer px-11 py-3 text-sm focus-visible:border-brand-400 focus-visible:shadow-focus"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-strong transition-theme"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium text-muted">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min="16"
                  max="30"
                  placeholder="Your age"
                  value={formData.age}
                  onChange={(event) => setFormData({ ...formData, age: event.target.value })}
                  className="w-full rounded-2xl border border-subtle bg-surface-layer px-4 py-3 text-sm focus-visible:border-brand-400 focus-visible:shadow-focus"
                  required
                />
              </div>
            )}

            <div className="py-1">
              <Button type="submit" className="w-full justify-center">
                {mode === 'login' ? 'Sign in and continue' : 'Create account and continue'}
                <ArrowRight size={18} className="ml-1" />
              </Button>
            </div>
          </form>

          {mode === 'login' && (
            <div className="text-center">
              <button className="text-sm text-brand-600 hover:underline">Forgot password?</button>
            </div>
          )}
        </Card>

        <div className="text-center text-sm text-muted">
          {mode === 'login' ? "Don't have an account yet?" : 'Already using Edutu?'}
          <button onClick={toggleMode} className="ml-2 text-brand-600 hover:underline font-medium">
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
