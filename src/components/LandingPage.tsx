import React from 'react';
import {
  ArrowRight,
  Award,
  Bell,
  Brain,
  Check,
  Globe,
  Heart,
  Moon,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { useDarkMode } from '../hooks/useDarkMode';

interface LandingPageProps {
  onGetStarted: () => void;
}

const featureTiles = [
  {
    icon: Brain,
    title: 'AI Mentorship',
    description:
      'Context-aware guidance that understands your goals, strengths, and constraints to keep you progressing.',
  },
  {
    icon: Target,
    title: 'Adaptive Roadmaps',
    description:
      'Milestones tailored to your timeline with reminders, check-ins, and nudges that feel like a personal coach.',
  },
  {
    icon: Award,
    title: 'Opportunity Match',
    description:
      'Curated scholarships, jobs, grants, and fellowships matched to your profile with clarity on why they fit.',
  },
  {
    icon: Users,
    title: 'Peer Power',
    description:
      'A private circle of ambitious doers to trade accountability, templates, and support in real time.',
  },
  {
    icon: Bell,
    title: 'Deadline Radar',
    description:
      'Smart notifications that prioritise what you must act on next, so you never miss a critical date again.',
  },
  {
    icon: TrendingUp,
    title: 'Career Capital',
    description:
      'Actionable rituals to sharpen your portfolio, CV, and online footprint for global opportunities.',
  },
];

const benefits = [
  'Accelerate your shortlisting chances with laser-focused applications.',
  'Receive weekly nudges that keep your roadmap alive without overwhelm.',
  'Access peer-reviewed templates, resources, and community wisdom.',
  'Showcase measurable progress to mentors, funders, and employers.',
  'Sync every action across mobile and web for continuity on the go.',
  'Gain confidence with AI-assisted interview, essay, and pitch practice.',
];

const testimonials = [
  {
    name: 'Amara K.',
    role: 'Mastercard Scholar',
    quote:
      'Edutu translated my ambitious goal into a daily ritual. I stayed consistent, submitted early, and won my dream scholarship.',
    accent: 'bg-brand-500',
  },
  {
    name: 'Kwame A.',
    role: 'Software Engineer',
    quote:
      'The adaptive roadmap and weekly nudges kept me shipping. Six months later, I landed a remote role I once thought impossible.',
    accent: 'bg-accent-500',
  },
  {
    name: 'Fatima M.',
    role: 'Community Leader',
    quote:
      'The mix of AI guidance and human community is unmatched. Every opportunity now feels within reach, not a distant dream.',
    accent: 'bg-success',
  },
];

const steps = [
  {
    label: 'Tell us your ambition',
    description:
      'Pinpoint the outcomes you care about most and the timeframe you are working with.',
  },
  {
    label: 'Receive your adaptive roadmap',
    description:
      'We stitch together milestones, opportunities, and rituals that fit your life and bandwidth.',
  },
  {
    label: 'Stay accountable on autopilot',
    description:
      'Edutu keeps you nudged, resourced, and in conversation with peers until you cross the finish line.',
  },
];

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen bg-surface-body text-strong transition-theme ${isDarkMode ? 'dark' : ''}`}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-[-18rem] h-[28rem] blur-3xl opacity-60 bg-gradient-to-br from-brand-500 to-accent-400 dark:opacity-40" />

        {/* Top app bar */}
        <header className="flex items-center justify-between px-4 pt-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-brand-600 text-inverse flex items-center justify-center shadow-soft">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm text-muted uppercase tracking-wide">Edutu</p>
              <h1 className="text-xl font-semibold text-strong">Ambition, On Track.</h1>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className="h-12 w-12 rounded-full border border-subtle bg-surface-layer flex items-center justify-center shadow-soft transition-theme hover:bg-surface-elevated"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Hero */}
        <section className="px-4 pt-12 pb-16 max-w-6xl mx-auto">
          <div className="md:flex md:items-end md:justify-between md:gap-12">
            <div className="space-y-6 md:max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-surface-layer border border-brand-200 rounded-full px-4 py-2 shadow-soft">
                <Sparkles size={16} className="text-brand-600" />
                <span className="text-sm font-medium text-muted">Built for ambitious African visionaries</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                An AI co-pilot that keeps your career moves consistent.
              </h2>
              <p className="text-lg md:text-xl text-soft">
                Plan, execute, and celebrate every milestone of your scholarship, job, or venture journey — with
                personalised roadmaps, smart nudges, and a community that has your back.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 max-w-md">
                <Button size="lg" className="w-full sm:w-auto justify-center" onClick={onGetStarted}>
                  Start building now
                  <ArrowRight size={18} />
                </Button>
                <button
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-subtle text-soft bg-surface-layer shadow-soft hover:bg-surface-elevated transition-theme"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  {isDarkMode ? 'Try light mode' : 'Try dark mode'}
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <Check className="text-success" size={16} />
                  No credit card needed
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Globe size={16} className="text-accent-500" />
                  Available across Africa
                </div>
              </div>
            </div>

            <div className="mt-12 md:mt-0 md:w-72">
              <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-brand-600/90 via-brand-500 to-accent-500 text-inverse shadow-elevated border-transparent">
                <div className="text-sm uppercase tracking-wide opacity-70">Weekly snapshot</div>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm opacity-80">Roadmap consistency</p>
                    <p className="text-3xl font-semibold">92%</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-80">Opportunities saved</span>
                    <span className="text-lg font-semibold">14</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-80">Deadlines met</span>
                    <span className="text-lg font-semibold">8 / 9</span>
                  </div>
                </div>
                <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
              </Card>
            </div>
          </div>
        </section>
      </div>

      {/* Feature grid */}
      <section className="px-4 py-16 bg-surface-layer">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-semibold">Everything you need to ship momentum</h3>
            <p className="text-lg text-soft max-w-2xl mx-auto">
              A cohesive system of AI guidance, human accountability, and adaptive workflows optimised for small screens
              and busy schedules.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureTiles.map((feature) => (
              <Card key={feature.title} className="h-full p-6 space-y-4 hover:shadow-elevated">
                <div className="h-12 w-12 rounded-xl bg-surface-brand text-brand-600 flex items-center justify-center">
                  <feature.icon size={22} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-strong">{feature.title}</h4>
                  <p className="text-soft text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 py-16 bg-surface-body">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-semibold">How the journey feels on mobile</h3>
            <p className="text-lg text-soft">
              Designed for the moments between classes, commutes, and late-night deep work.
            </p>
          </div>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.label}
                className="flex flex-col sm:flex-row sm:items-start sm:gap-6 bg-surface-layer border border-subtle rounded-2xl p-5 shadow-soft"
              >
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-100 text-brand-600 font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="mt-4 sm:mt-0 space-y-2">
                  <h4 className="text-xl font-semibold">{step.label}</h4>
                  <p className="text-soft text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-16 bg-surface-layer">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-3 text-center">
            <h3 className="text-3xl font-semibold">Why ambitious doers stay with Edutu</h3>
            <p className="text-lg text-soft max-w-2xl mx-auto">
              A rhythm of action, reflection, and celebration that keeps every move rewarding.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 bg-surface-layer border border-subtle rounded-2xl px-4 py-3 shadow-soft"
              >
                <div className="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center">
                  <Check size={16} />
                </div>
                <p className="text-sm font-medium text-strong leading-snug">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 bg-surface-body">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-semibold">Stories from fellow builders</h3>
            <p className="text-lg text-soft">Momentum compounds when you stay consistent with the right rituals.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="h-full p-6 space-y-4 hover:shadow-elevated">
                <div className={`h-12 w-12 rounded-full ${testimonial.accent} text-inverse flex items-center justify-center`}>
                  {testimonial.name.split(' ').map((chunk) => chunk[0]).join('')}
                </div>
                <blockquote className="text-soft text-sm leading-relaxed">
                  “{testimonial.quote}”
                </blockquote>
                <div>
                  <p className="text-sm font-semibold text-strong">{testimonial.name}</p>
                  <p className="text-xs text-muted">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 text-inverse p-10 shadow-elevated overflow-hidden">
          <div className="space-y-4 text-center">
            <h3 className="text-3xl font-semibold">It is time to give your ambition the structure it deserves.</h3>
            <p className="text-lg opacity-90">
              Join thousands of African trailblazers keeping their momentum alive with Edutu.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-white text-brand-600 hover:bg-accent-100 hover:text-brand-700 shadow-elevated"
              >
                Start free
                <Zap size={18} />
              </Button>
              <button className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/50 text-inverse hover:bg-white/10 transition-theme">
                <Heart size={16} />
                See community wins
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-4 pb-8">
        <div className="max-w-6xl mx-auto border-t border-neutral-200 dark:border-neutral-800 pt-6 text-sm text-muted flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>© {new Date().getFullYear()} Edutu. Built proudly in Africa.</span>
          <span className="flex items-center gap-2">
            <Globe size={14} />
            Stay curious. Stay generous. Stay ready.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
