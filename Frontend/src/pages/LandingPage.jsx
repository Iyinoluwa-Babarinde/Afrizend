"use client";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Zap, Globe, Shield, ChevronRight, Star, TrendingUp, Users, CheckCircle, ArrowRight, Cpu, Lock, Wifi, BarChart2, Menu, X } from "lucide-react";

const STATS = [
    { label: "Vetted Tech Talent", value: "15,000+", icon: Users },
    { label: "Escrow Release Speed", value: "< 5 sec", icon: Zap },
    { label: "African Tech Hubs", value: "28+", icon: Globe },
    { label: "FX Fee Spread", value: "< 0.5%", icon: TrendingUp },
];

const HOW_IT_WORKS = [
    { step: "01", title: "Draft Project Scope", desc: "AI auto-generates milestones, acceptance conditions, and technical requirements instantly based on your inputs." },
    { step: "02", title: "Semantic Skill Pairing", desc: "Advanced AI scoring matches and ranks the top 3 verified engineers suited precisely for your stack." },
    { step: "03", title: "Secure Kora Escrow", desc: "Lock contract funds in a secure multi-currency escrow vault. Visible to both parties before coding begins." },
    { step: "04", title: "Autonomous AI Settlement", desc: "AI models inspect actual code submissions. Upon approval, funds settle directly into local banks instantly." },
];

const FEATURES = [
    { icon: Cpu, title: "AI Code Auditing", desc: "Autonomous verifications check deliverables against technical specifications automatically to ensure supreme quality.", color: "blue" },
    { icon: Lock, title: "Secure Deliverable Protection", desc: "Platform-enforced file locks prevent code downloads until payouts are approved. Zero risk of non-payment.", color: "cyan" },
    { icon: Globe, title: "Kora Virtual Rails", desc: "Direct API channels map payments to NGN, KES, GHS, and ZAR instant local bank routes with near-zero spreads.", color: "blue" },
    { icon: Wifi, title: "Real-Time Metered Consultations", desc: "Interactive live rooms streaming payments on a per-second billing system. Pay only for the exact help you get.", color: "cyan" },
    { icon: Shield, title: "Verifiable Escrow Vaults", desc: "Clear, absolute visibility of funding proofs locked in smart wallets before starting a single task.", color: "blue" },
    { icon: BarChart2, title: "Reputational Ledger", desc: "Multidimensional trust scores tracking delivery rates, code standards, and client feedback over time.", color: "cyan" },
];

const TESTIMONIALS = [
    { name: "Amara Osei", role: "Software Architect · Accra, Ghana", quote: "Praise the AI audits! Payments settle in local bank accounts under 5 seconds. I don't have to wait 14 business days anymore.", avatar: "AO", rating: 5 },
    { name: "Sarah Chen", role: "Venture Partner · Apex Dev Labs", quote: "Finding premium African builders used to take weeks. With the semantic matching and automated escrows, it takes minutes.", avatar: "SC", rating: 5 },
    { name: "Dr. Ngozi Adeyemi", role: "AI Researcher · Lagos, Nigeria", quote: "The time-metered consulting room is brilliant. I charge foreign startups in USD and instantly settle locally via Kora.", avatar: "NA", rating: 5 },
];

function FloatingCard({ children, className = "", delay = 0 }) {
    return (<div className={`glass rounded-2xl p-4 animate-float ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>);
}

export default function LandingPage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (<div style={{ background: "hsl(222 47% 4%)", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            transition: "all 0.3s",
            background: scrolled ? "hsl(222 47% 4% / 0.95)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled ? "1px solid hsl(220 20% 16%)" : "none",
        }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div className="logo-icon-small" style={{ width: 24, height: 24, background: "linear-gradient(135deg, hsl(260 85% 60%), hsl(195 100% 60%))", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={14} color="#050505" fill="#050505" />
                </div>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "white" }}>Afri<span className="text-gradient-blue">zend</span></span>
              </div>
            </Link>
          </div>

          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="hidden-mobile">
            {["How It Works", "Features","Developers Experience", "Launch"].map(item => (<a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} style={{ color: "hsl(220 15% 65%)", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "white")} onMouseLeave={e => (e.currentTarget.style.color = "hsl(220 15% 65%)")}>
                {item}
              </a>))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <Link to="/auth/login" className="btn btn-ghost btn-sm" style={{ color: "hsl(220 15% 65%)" }}>Log in</Link>
            <Link to="/auth/register" className="btn btn-primary btn-sm">Get Started</Link>
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "none", background: "none", border: "none", color: "white", cursor: "pointer", padding: 4 }}>
              {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg" style={{
        padding: "160px 1.5rem 100px",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, hsl(222 47% 4%) 0%, hsl(222 47% 2%) 100%)",
      }}>
        {/* Subtle grid lines/boxes overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(to right, hsl(220 20% 16% / 0.15) 1px, transparent 1px), linear-gradient(to bottom, hsl(220 20% 16% / 0.15) 1px, transparent 1px)",
          backgroundSize: "45px 45px",
          opacity: 0.75,
          pointerEvents: "none"
        }}/>

        {/* Floating UI cards */}
        <div style={{ position: "absolute", top: 140, right: "8%", opacity: 0.85 }}>
          <FloatingCard delay={0.4}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="status-dot online"/>
              <div>
                <div style={{ fontSize: "0.75rem", color: "hsl(220 15% 65%)" }}>Settlement Disbursed</div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "white", fontSize: "1rem" }}>+$1,200.00</div>
              </div>
              <CheckCircle size={20} color="hsl(145 65% 42%)"/>
            </div>
          </FloatingCard>
        </div>

        <div style={{ position: "absolute", bottom: 160, left: "5%", opacity: 0.85 }}>
          <FloatingCard delay={1.2}>
            <div style={{ fontSize: "0.72rem", color: "hsl(220 15% 65%)", marginBottom: 4 }}>AI Match Score</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Cpu size={14} color="hsl(260 85% 72%)"/>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "white" }}>96% match</span>
            </div>
            <div className="meter-bar" style={{ marginTop: 8, width: 140 }}>
              <div className="meter-fill" style={{ width: "96%", background: "linear-gradient(90deg, hsl(260 85% 60%), hsl(195 100% 60%))" }}/>
            </div>
          </FloatingCard>
        </div>

        <div style={{ position: "absolute", top: 200, left: "3%", opacity: 0.7 }}>
          <FloatingCard delay={0.8}>
            <div style={{ fontSize: "0.72rem", color: "hsl(220 15% 65%)" }}>Live Consultation</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: 4 }}>
              <div className="status-dot online animate-blink"/>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "white" }}>12:34 · $15.04</span>
            </div>
          </FloatingCard>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div className="badge badge-blue" style={{ marginBottom: "1.5rem", display: "inline-flex", background: "hsl(260 85% 60% / 0.15)", color: "hsl(260 85% 72%)", borderColor: "hsl(260 85% 60% / 0.25)" }}>
            <Zap size={10}/>
            Powered by Kora API · Global Escrow & Settlements
          </div>

          <h1 className="font-heading animate-fade-up" style={{
            fontSize: "clamp(2.5rem, 6.5vw, 4.8rem)", fontWeight: 800,
            lineHeight: 1.08, letterSpacing: "-0.04em", color: "white", marginBottom: "1.5rem"
        }}>
            Connecting Elite African<br />
            <span className="text-gradient-blue" style={{ background: "linear-gradient(135deg, hsl(260 85% 72%), hsl(195 100% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Builders to Global Projects</span><br />
            Seamlessly.
          </h1>

          <p className="animate-fade-up" style={{
            animationDelay: "100ms", fontSize: "1.125rem", color: "hsl(220 15% 65%)",
            maxWidth: 600, margin: "0 auto 2.5rem", lineHeight: 1.75
        }}>
            Hire verified tech builders instantly. Protect deliverables via smart Kora escrow vaults. Automatically verify submissions using custom AI reviewers, cashing out locally in seconds.
            <strong style={{ color: "white" }}> No delays. No invoices. Direct trust.</strong>
          </p>

          <div className="animate-fade-up stagger" style={{ animationDelay: "200ms", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/auth/register?role=employer" className="btn btn-primary btn-lg" style={{ gap: "0.5rem" }}>
              Hire Global Talent <ArrowRight size={18}/>
            </Link>
            <Link to="/auth/register?role=freelancer" className="btn btn-ghost btn-lg">
              Start Earning Globally
            </Link>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
            {["Verifiable trust pools", "Zero payment friction", "Settlements in seconds"].map(t => (<span key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "hsl(220 15% 65%)", fontSize: "0.8rem" }}>
                <CheckCircle size={13} color="hsl(145 65% 42%)"/> {t}
              </span>))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1px", background: "hsl(220 20% 16%)", border: "1px solid hsl(220 20% 16%)", borderRadius: 16, overflow: "hidden"
          }}>
            {STATS.map(({ label, value, icon: Icon }) => (<div key={label} className="metric-card" style={{ background: "hsl(220 14% 8%)", padding: "2rem 1.5rem", textAlign: "center" }}>
                <Icon size={20} color="hsl(260 85% 72%)" style={{ margin: "0 auto 0.75rem" }}/>
                <div className="font-heading" style={{ fontSize: "2rem", fontWeight: 800, color: "white", letterSpacing: "-0.03em" }}>{value}</div>
                <div style={{ fontSize: "0.8rem", color: "hsl(220 15% 65%)", marginTop: 4 }}>{label}</div>
              </div>))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: "100px 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="badge badge-blue" style={{ marginBottom: "1rem", display: "inline-flex", background: "hsl(260 85% 60% / 0.15)", color: "hsl(260 85% 72%)", borderColor: "hsl(260 85% 60% / 0.25)" }}>How It Works</div>
            <h2 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Secure. Audited. Instant.
            </h2>
            <p style={{ color: "hsl(220 15% 65%)", marginTop: "0.75rem", maxWidth: 500, margin: "0.75rem auto 0" }}>
              From initial project draft to local payouts — automated, safe, and transparent.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {HOW_IT_WORKS.map(({ step, title, desc }) => (<div key={step} className="card card-hover" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{
                position: "absolute", top: -10, right: -10,
                fontFamily: "var(--font-heading)", fontSize: "5rem", fontWeight: 900,
                color: "hsl(260 85% 60% / 0.06)", lineHeight: 1, userSelect: "none"
            }}>{step}</div>
                <div className="badge badge-blue" style={{ marginBottom: "1rem", display: "inline-flex", background: "hsl(260 85% 60% / 0.15)", color: "hsl(260 85% 72%)", borderColor: "hsl(260 85% 60% / 0.25)" }}>{step}</div>
                <h3 className="font-heading" style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "hsl(220 15% 65%)", lineHeight: 1.65 }}>{desc}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "0 1.5rem 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="badge badge-cyan" style={{ marginBottom: "1rem", display: "inline-flex" }}>Features</div>
            <h2 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", fontWeight: 800, letterSpacing: "-0.03em" }}>
              A New Era for<br /><span className="text-gradient-blue" style={{ background: "linear-gradient(135deg, hsl(260 85% 72%), hsl(195 100% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Global Collaboration</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (<div key={title} className="card card-hover" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{
                width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                background: color === "blue" ? "hsl(260 85% 60% / 0.15)" : "hsl(195 100% 60% / 0.12)",
                border: `1px solid ${color === "blue" ? "hsl(260 85% 60% / 0.25)" : "hsl(195 100% 60% / 0.2)"}`,
            }}>
                  <Icon size={20} color={color === "blue" ? "hsl(260 85% 72%)" : "hsl(195 100% 60%)"}/>
                </div>
                <div>
                  <h3 className="font-heading" style={{ fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "0.4rem" }}>{title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "hsl(220 15% 65%)", lineHeight: 1.65 }}>{desc}</p>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "0 1.5rem 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 id="developers-experience" className="font-heading" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "white", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Developer Experiences
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {TESTIMONIALS.map(({ name, role, quote, avatar, rating }) => (<div key={name} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "0.25rem" }}>
                  {Array.from({ length: rating }).map((_, i) => <Star key={i} size={14} color="hsl(38 92% 50%)" fill="hsl(38 92% 50%)"/>)}
                </div>
                <p style={{ fontSize: "0.9rem", color: "hsl(220 15% 75%)", lineHeight: 1.7, fontStyle: "italic" }}>&ldquo;{quote}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "auto" }}>
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: "0.75rem", background: "linear-gradient(135deg, hsl(260 85% 60%), hsl(195 100% 60%))" }}>{avatar}</div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "white" }}>{name}</div>
                    <div style={{ fontSize: "0.75rem", color: "hsl(220 15% 55%)" }}>{role}</div>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 1.5rem 100px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            borderRadius: 24, padding: "4rem 2rem", textAlign: "center",
            background: "linear-gradient(135deg, hsl(260 85% 60% / 0.15), hsl(195 100% 60% / 0.08))",
            border: "1px solid hsl(260 85% 60% / 0.25)",
            boxShadow: "0 0 80px hsl(260 85% 60% / 0.12)",
        }}>
            <h2 id="launch" className="font-heading" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "white", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
              Launch Your Next Project
            </h2>
            <p style={{ color: "hsl(220 15% 65%)", maxWidth: 460, margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Join 15,000+ elite engineers and forward-thinking startups collaborating on the world's most secure builder network.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/auth/register?role=freelancer" className="btn btn-primary btn-lg" style={{ background: "linear-gradient(135deg, hsl(260 85% 60%), hsl(260 85% 45%))" }}>
                Start as Freelancer <ChevronRight size={18}/>
              </Link>
              <Link to="/auth/register?role=employer" className="btn btn-outline btn-lg" style={{ color: "hsl(260 85% 72%)", borderColor: "hsl(260 85% 60% / 0.5)" }}>
                Hire Global Talent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid hsl(220 20% 16%)", padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <div className="logo-icon-small" style={{ width: 24, height: 24, background: "linear-gradient(135deg, hsl(260 85% 60%), hsl(195 100% 60%))", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={14} color="#050505" fill="#050505" />
          </div>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "white" }}>Afri<span className="text-gradient-blue" style={{ background: "linear-gradient(135deg, hsl(260 85% 72%), hsl(195 100% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>zend</span></span>
        </div>
        <p style={{ color: "hsl(220 15% 45%)", fontSize: "0.8rem" }}>
          © 2026 Afrizend · Vetted talent pipelines, autonomous escrows, and instant FX rails.
        </p>
        <p style={{ color: "hsl(220 15% 35%)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
          Powered by Kora API Payment Infrastructure and Autonomous Vetting Ledger Services
        </p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>);
}
