import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Zap, Globe, ChevronRight, Star, TrendingUp,
  Users, CheckCircle, ArrowRight, Cpu, Lock, FileText, Menu, X
} from 'lucide-react';
import '../components/Components.css';
import './Pages.css';

const STATS = [
  { label: "Vetted African Talent", value: "8,500+", icon: Users },
  { label: "Kora Settlement Time", value: "< 3 min", icon: Zap },
  { label: "African Countries", value: "7+", icon: Globe },
  { label: "Escrow Success Rate", value: "99.8%", icon: TrendingUp },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Post a Job", desc: "Describe your project. Our AI helps structure milestones and deliverables clearly." },
  { step: "02", title: "Match & Lock Escrow", desc: "Connect with vetted African talent. Fund the Kora-powered escrow before work begins. Zero risk." },
  { step: "03", title: "AI Verifies Delivery", desc: "Talent submits work. Afrizend's AI reviews it against criteria, providing an objective confidence score." },
  { step: "04", title: "Instant Payout & Unlock", desc: "You approve. Kora instantly settles payment to the talent's local currency, and your download unlocks." },
];

const FEATURES = [
  { icon: Cpu, title: "AI Verification Engine", desc: "Objective review of deliverables — code, designs, writing. Reduces bias and accelerates the approval process.", color: "blue" },
  { icon: Lock, title: "Zero-Bypass Download Lock", desc: "Cryptographically enforced. Final deliverables cannot be downloaded until Kora confirms the escrow release.", color: "white" },
  { icon: Globe, title: "Permanent Virtual Accounts", desc: "Every talent gets a compliant, geo-block-free Kora virtual account. Receive USD/GBP, settle in local currency.", color: "blue" },
  { icon: ShieldCheck, title: "Programmable Escrow", desc: "Funds are visibly locked in Kora infrastructure. Guaranteed payment for talent, guaranteed work for clients.", color: "white" },
];

const TESTIMONIALS = [
  { name: "Iyinoluwa A.", role: "Senior Engineer · Lagos, Nigeria", quote: "Got paid in NGN exactly 2 minutes after my code was approved. No more 5-day SWIFT waits or locked PayPal accounts.", avatar: "IA", rating: 5 },
  { name: "Global Tech LLC", role: "Client · London, UK", quote: "The AI verification report gives us immense confidence. We hired 4 developers in Kenya and the escrow process was flawless.", avatar: "GT", rating: 5 },
  { name: "Praise M.", role: "UI Designer · Nairobi, Kenya", quote: "Seeing the escrow locked before I even open Figma changes everything. The trust level is incredible.", avatar: "PM", rating: 5 },
];

function FloatingCard({ children, className = "", delay = 0 }) {
  return (
    <div className={`glass-panel p-4 animate-float ${className}`} style={{ animationDelay: `${delay}s`, borderRadius: '16px' }}>
      {children}
    </div>
  );
}

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="landing-page-modern">
      {/* Dynamic Nav */}
      <nav className={`landing-nav-fixed ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo-group">
            <div className="logo-icon">
              <Zap size={18} color="var(--bg-color)" fill="var(--bg-color)" />
            </div>
            <h2>Afri<span className="text-gradient-blue">zend</span></h2>
          </div>

          <div className="nav-links hidden-mobile">
            <a href="#how-it-works" className="nav-item">How It Works</a>
            <a href="#features" className="nav-item">Features</a>
            <a href="#testimonials" className="nav-item">Testimonials</a>
          </div>

          <div className="nav-actions">
            <Link to="/dashboard/freelancer" className="btn btn-ghost hidden-mobile">Talent Login</Link>
            <Link to="/dashboard/client" className="btn btn-primary">Hire Talent</Link>
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-modern">
        <div className="hero-grid-bg"></div>

        {/* Floating UI Elements */}
        <div className="floating-ui-group hidden-mobile">
          <FloatingCard className="float-card-1" delay={0.2}>
            <div className="float-content">
              <div className="status-dot online"></div>
              <div>
                <div className="float-label">Kora Settlement</div>
                <div className="float-value text-success">+₦ 850,000.00</div>
              </div>
              <CheckCircle size={24} color="var(--success-color)" />
            </div>
          </FloatingCard>

          <FloatingCard className="float-card-2" delay={1.5}>
            <div className="float-label mb-1">AI Verification</div>
            <div className="flex-center-gap">
              <Cpu size={16} color="var(--primary-color)" />
              <span className="float-value">98% Confidence</span>
            </div>
            <div className="meter-bar mt-2">
              <div className="meter-fill" style={{ width: "98%" }}></div>
            </div>
          </FloatingCard>

          <FloatingCard className="float-card-3" delay={0.8}>
            <div className="float-label">Escrow Status</div>
            <div className="flex-center-gap mt-1">
              <Lock size={16} color="var(--text-secondary)" />
              <span className="float-value">$2,400 Locked</span>
            </div>
          </FloatingCard>
        </div>

        <div className="hero-content">
          <div className="badge badge-blue mb-xl animate-fade-up flex-center-gap mx-auto">
            <ShieldCheck size={14} />
            MVP v1.0 · Powered by Kora
          </div>

          <h1 className="hero-title-large animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Pan-African Talent.<br />
            <span className="text-gradient-blue">Global Payment Infrastructure.</span>
          </h1>

          <p className="hero-subtitle-large animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Vetted African talent + AI Verification + Kora-Powered Instant Multi-Currency Payouts. Work globally. Get paid locally. Zero geo-blocks.
          </p>

          <div className="hero-cta-group animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/dashboard/client" className="btn btn-primary btn-xl">
              Hire Elite African Talent <ArrowRight size={20} />
            </Link>
            <Link to="/dashboard/freelancer" className="btn btn-outline btn-xl">
              Apply as Talent
            </Link>
          </div>

          <div className="hero-trust-badges animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {["Instant Settlement", "AI Deliverable Checks", "Zero Hidden Fees"].map((text, i) => (
              <span key={i} className="trust-badge">
                <CheckCircle size={16} color="var(--primary-color)" /> {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section relative z-10 px-lg">
        <div className="container">
          <div className="stats-container">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="stat-box">
                <Icon size={24} color="var(--primary-color)" className="mb-md mx-auto" />
                <div className="stat-box-value">{value}</div>
                <div className="stat-box-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-2xl px-lg relative">
        <div className="container">
          <div className="section-header-center">
            <div className="badge badge-blue mb-md">The Workflow</div>
            <h2 className="section-title-large">Trust-first. Friction-last.</h2>
            <p className="section-subtitle">A seamless four-layer stack bridging the Africa-global work corridor.</p>
          </div>

          <div className="grid-4-col">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="step-card card glass-panel card-hover">
                <div className="step-watermark">{step}</div>
                <div className="badge badge-blue mb-md">{step}</div>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-2xl px-lg">
        <div className="container">
          <div className="section-header-center">
            <div className="badge mb-md" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Core Features</div>
            <h2 className="section-title-large">
              Engineered for <span className="text-gradient-blue">Certainty.</span>
            </h2>
          </div>

          <div className="grid-2-col">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="feature-box card glass-panel card-hover">
                <div className={`feature-icon-wrapper ${color}`}>
                  <Icon size={24} color={color === 'blue' ? 'var(--primary-color)' : '#ffffff'} />
                </div>
                <div>
                  <h3 className="feature-title">{title}</h3>
                  <p className="feature-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-2xl px-lg">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-title-large">The MVP Proof.</h2>
          </div>
          <div className="grid-3-col">
            {TESTIMONIALS.map(({ name, role, quote, avatar, rating }) => (
              <div key={name} className="testimonial-card card glass-panel">
                <div className="stars flex gap-xs mb-md">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={16} fill="var(--primary-color)" color="var(--primary-color)" />
                  ))}
                </div>
                <p className="testimonial-quote">"{quote}"</p>
                <div className="testimonial-author mt-auto pt-md flex items-center gap-md">
                  <div className="avatar-small">{avatar}</div>
                  <div>
                    <div className="author-name">{name}</div>
                    <div className="author-role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-2xl px-lg pb-4xl">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="cta-box">
            <h2 className="cta-title">Ready to bridge the gap?</h2>
            <p className="cta-desc">
              Join the vetted African talent pool or hire elite professionals with absolute payment certainty.
            </p>
            <div className="cta-buttons">
              <Link to="/dashboard/freelancer" className="btn btn-primary btn-xl">
                Start as Talent <ChevronRight size={20} />
              </Link>
              <Link to="/dashboard/client" className="btn btn-outline btn-xl">
                Hire Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-modern">
        <div className="flex-center-gap mb-md">
          <div className="logo-icon-small">
            <Zap size={14} color="var(--bg-color)" fill="var(--bg-color)" />
          </div>
          <span className="font-bold">Afrizend</span>
        </div>
        <p className="footer-text">© 2026 Afrizend · Pan-African Talent × Global Payment Infrastructure</p>
        <p className="footer-subtext mt-sm">Powered by Kora API · Designed for MVP v1.0</p>
      </footer>
    </div>
  );
};

export default LandingPage;
