"use client";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../components/Logo";
import { Globe, Shield, ChevronRight, Star, TrendingUp, Users, CheckCircle, ArrowRight, Cpu, Lock, Wallet, FileText, Menu, X } from "lucide-react";

const STATS = [
    { label: "Active Talent", value: "12,400+", icon: Users },
    { label: "Supported Currencies", value: "Multiple", icon: Wallet },
    { label: "African Countries", value: "25+", icon: Globe },
    { label: "Cost vs Traditional", value: "−60%", icon: TrendingUp },
];

const HOW_IT_WORKS = [
    { step: "01", title: "Post Your Project", desc: "Define your needs. Our platform helps structure your deliverables and milestones for clarity." },
    { step: "02", title: "Match with Top Talent", desc: "Connect with vetted African professionals based on skill, verified history, and project fit." },
    { step: "03", title: "Fund Securely via Kora", desc: "Deposit funds into a secure virtual account. Funds are locked and visible, building trust before work begins." },
    { step: "04", title: "Verify & Release", desc: "Review submitted work. Once approved, funds are released instantly to the freelancer's local account." },
];

const FEATURES = [
    { icon: Shield, title: "Secure Escrow", desc: "Funds are locked in a Kora-backed virtual account, ensuring freelancers know the money is there, and employers only pay for approved work.", color: "green" },
    { icon: Lock, title: "Milestone Protection", desc: "Work is divided into clear milestones. The next phase only unlocks when the previous payment is confirmed.", color: "green" },
    { icon: Wallet, title: "Local Currency Payouts", desc: "Seamless integration with Kora means freelancers get paid in their local currency without exorbitant FX fees.", color: "green" },
    { icon: FileText, title: "Smart Contracts", desc: "Automated agreements keep everyone on the same page, with clear acceptance criteria built into the platform.", color: "green" },
    { icon: Cpu, title: "AI-Assisted Matching", desc: "Find the exact skill set you need from a continent of emerging talent in seconds.", color: "green" },
    { icon: Star, title: "Verified Reputation", desc: "Trust scores built from actual completed jobs and client ratings, not just a polished profile.", color: "green" },
];

const TESTIMONIALS = [
    { name: "Amara Osei", role: "Full-Stack Engineer · Accra, Ghana", quote: "Afrizend gave me the confidence to take on larger global clients. Knowing the funds are secured in escrow completely eliminates payment anxiety.", avatar: "AO", rating: 5 },
    { name: "Sarah Chen", role: "CTO · FinTech Solutions Ltd", quote: "We hired an incredible team in Lagos. The process was seamless, and the virtual account funding made cross-border payments straightforward.", avatar: "SC", rating: 5 },
    { name: "David Mutua", role: "UI/UX Designer · Nairobi, Kenya", quote: "Getting paid directly to my local bank account without losing a chunk to international transfer fees is a game changer.", avatar: "DM", rating: 5 },
];

function FloatingCard({ children, className = "", delay = 0 }) {
    return (
        <div className={`glass rounded-2xl p-4 animate-float ${className}`} style={{ animationDelay: `${delay}s` }}>
            {children}
        </div>
    );
}

export default function LandingPage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <div style={{ background: "var(--surface)", minHeight: "100vh" }}>
            {/* Nav */}
            <nav style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
                transition: "all 0.3s",
                background: scrolled ? "hsl(var(--surface) / 0.95)" : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled ? "1px solid hsl(var(--border))" : "none",
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                            <Logo scale={0.7} />
                        </Link>
                    </div>

                    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="hidden-mobile">
                        {["How It Works", "Features", "For Talent", "Pricing"].map(item => (
                            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} style={{ color: "hsl(var(--text-2))", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = "hsl(var(--primary))")} onMouseLeave={e => (e.currentTarget.style.color = "hsl(var(--text-2))")}>
                                {item}
                            </a>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <Link to="/auth/login" className="btn btn-ghost btn-sm" style={{ color: "hsl(var(--text-2))" }}>Log in</Link>
                        <Link to="/auth/register" className="btn btn-primary btn-sm">Get Started</Link>
                        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "none", background: "none", border: "none", color: "hsl(var(--text))", cursor: "pointer", padding: 4 }}>
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero-bg" style={{ padding: "160px 1.5rem 100px", position: "relative", overflow: "hidden" }}>
                <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />

                {/* Floating UI cards */}
                <div style={{ position: "absolute", top: 140, right: "8%", opacity: 0.9 }}>
                    <FloatingCard delay={0.4}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div className="status-dot online" />
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "hsl(var(--text-2))", fontWeight: 600 }}>Payment Released</div>
                                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "hsl(var(--text))", fontSize: "1rem" }}>+$1,200.00</div>
                            </div>
                            <CheckCircle size={20} color="hsl(var(--success))" />
                        </div>
                    </FloatingCard>
                </div>

                <div style={{ position: "absolute", bottom: 160, left: "5%", opacity: 0.9 }}>
                    <FloatingCard delay={1.2}>
                        <div style={{ fontSize: "0.72rem", color: "hsl(var(--text-2))", marginBottom: 4, fontWeight: 600 }}>Project Milestone</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Shield size={14} color="hsl(var(--primary))" />
                            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "hsl(var(--text))" }}>Funded & Locked</span>
                        </div>
                    </FloatingCard>
                </div>

                <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
                    <div className="badge badge-green" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
                        <Shield size={10} />
                        Building Trust for Global Work
                    </div>

                    <h1 className="font-heading animate-fade-up" style={{
                        fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 800,
                        lineHeight: 1.1, letterSpacing: "-0.04em", color: "hsl(var(--text))", marginBottom: "1.5rem"
                    }}>
                        Connecting Global Clients with<br />
                        <span className="text-gradient-blue">Exceptional African Talent.</span>
                    </h1>

                    <p className="animate-fade-up" style={{
                        animationDelay: "100ms", fontSize: "1.15rem", color: "hsl(var(--text-2))",
                        maxWidth: 600, margin: "0 auto 2.5rem", lineHeight: 1.7, fontWeight: 500
                    }}>
                        Work with confidence. Our secure virtual account escrow ensures clients get quality deliverables, and talent gets paid reliably in their local currency.
                    </p>

                    <div className="animate-fade-up stagger" style={{ animationDelay: "200ms", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link to="/auth/register?role=employer" className="btn btn-primary btn-lg" style={{ gap: "0.5rem" }}>
                            Hire Global Talent <ArrowRight size={18} />
                        </Link>
                        <Link to="/auth/register?role=freelancer" className="btn btn-ghost btn-lg">
                            Start Earning
                        </Link>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
                        {["Secure Escrow", "Local Currency Payouts", "Vetted Professionals"].map(t => (
                            <span key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "hsl(var(--text-2))", fontSize: "0.85rem", fontWeight: 600 }}>
                                <CheckCircle size={14} color="hsl(var(--success))" /> {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section style={{ padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div className="glass-strong" style={{
                        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1px", background: "hsl(var(--border))", borderRadius: 16, overflow: "hidden"
                    }}>
                        {STATS.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="metric-card" style={{ background: "hsl(var(--surface))", padding: "2rem 1.5rem", textAlign: "center" }}>
                                <Icon size={24} color="hsl(var(--primary))" style={{ margin: "0 auto 0.75rem" }} />
                                <div className="font-heading" style={{ fontSize: "2rem", fontWeight: 800, color: "hsl(var(--text))", letterSpacing: "-0.03em" }}>{value}</div>
                                <div style={{ fontSize: "0.85rem", color: "hsl(var(--text-3))", marginTop: 4, fontWeight: 600 }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" style={{ padding: "100px 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                        <div className="badge badge-green" style={{ marginBottom: "1rem", display: "inline-flex" }}>Workflow</div>
                        <h2 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "hsl(var(--text))", fontWeight: 800, letterSpacing: "-0.03em" }}>
                            Four steps to success.
                        </h2>
                        <p style={{ color: "hsl(var(--text-2))", marginTop: "0.75rem", maxWidth: 500, margin: "0.75rem auto 0", fontWeight: 500 }}>
                            From job posting to final payment — designed for trust and transparency.
                        </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                        {HOW_IT_WORKS.map(({ step, title, desc }) => (
                            <div key={step} className="card card-hover" style={{ position: "relative", overflow: "hidden" }}>
                                <div style={{
                                    position: "absolute", top: -10, right: -10,
                                    fontFamily: "var(--font-heading)", fontSize: "5rem", fontWeight: 900,
                                    color: "hsl(var(--primary) / 0.05)", lineHeight: 1, userSelect: "none"
                                }}>{step}</div>
                                <div className="badge badge-green" style={{ marginBottom: "1rem", display: "inline-flex" }}>{step}</div>
                                <h3 className="font-heading" style={{ fontSize: "1.2rem", fontWeight: 800, color: "hsl(var(--text))", marginBottom: "0.5rem" }}>{title}</h3>
                                <p style={{ fontSize: "0.9rem", color: "hsl(var(--text-2))", lineHeight: 1.65, fontWeight: 500 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" style={{ padding: "0 1.5rem 100px", background: "hsl(var(--surface-4) / 0.5)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: "100px" }}>
                    <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                        <div className="badge badge-green" style={{ marginBottom: "1rem", display: "inline-flex" }}>Features</div>
                        <h2 className="font-heading" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "hsl(var(--text))", fontWeight: 800, letterSpacing: "-0.03em" }}>
                            Built for reliability.<br /><span className="text-gradient-blue">Engineered for growth.</span>
                        </h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="card card-hover" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "hsl(var(--surface))" }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                                    background: "hsl(var(--primary) / 0.1)",
                                    border: `1px solid hsl(var(--primary) / 0.2)`,
                                }}>
                                    <Icon size={24} color="hsl(var(--primary))" />
                                </div>
                                <div>
                                    <h3 className="font-heading" style={{ fontSize: "1.1rem", fontWeight: 800, color: "hsl(var(--text))", marginBottom: "0.4rem" }}>{title}</h3>
                                    <p style={{ fontSize: "0.9rem", color: "hsl(var(--text-2))", lineHeight: 1.65, fontWeight: 500 }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={{ padding: "100px 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 className="font-heading" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "hsl(var(--text))", fontWeight: 800, letterSpacing: "-0.03em" }}>
                            Real people. Real impact.
                        </h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                        {TESTIMONIALS.map(({ name, role, quote, avatar, rating }) => (
                            <div key={name} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div style={{ display: "flex", gap: "0.25rem" }}>
                                    {Array.from({ length: rating }).map((_, i) => <Star key={i} size={16} color="hsl(38 92% 50%)" fill="hsl(38 92% 50%)" />)}
                                </div>
                                <p style={{ fontSize: "0.95rem", color: "hsl(var(--text-2))", lineHeight: 1.7, fontStyle: "italic", fontWeight: 500 }}>&ldquo;{quote}&rdquo;</p>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "auto" }}>
                                    <div className="avatar" style={{ width: 40, height: 40, fontSize: "0.85rem" }}>{avatar}</div>
                                    <div>
                                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "hsl(var(--text))" }}>{name}</div>
                                        <div style={{ fontSize: "0.75rem", color: "hsl(var(--text-3))", fontWeight: 600 }}>{role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: "0 1.5rem 100px" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <div style={{
                        borderRadius: 24, padding: "4rem 2rem", textAlign: "center",
                        background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.05))",
                        border: "1px solid hsl(var(--primary) / 0.2)",
                        boxShadow: "0 0 40px hsl(var(--primary) / 0.05)",
                    }}>
                        <h2 className="font-heading" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "hsl(var(--text))", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem" }}>
                            Ready to transform the way you work?
                        </h2>
                        <p style={{ color: "hsl(var(--text-2))", maxWidth: 460, margin: "0 auto 2rem", lineHeight: 1.7, fontWeight: 500 }}>
                            Join thousands of freelancers and companies building the future of global work on Afrizend.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <Link to="/auth/register?role=freelancer" className="btn btn-primary btn-lg">
                                Start as Freelancer <ChevronRight size={18} />
                            </Link>
                            <Link to="/auth/register?role=employer" className="btn btn-outline btn-lg">
                                Hire Global Talent
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: "1px solid hsl(var(--border))", padding: "3rem 1.5rem", textAlign: "center", background: "hsl(var(--surface-2))" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <Link to="/" style={{ textDecoration: "none" }}>
                      <Logo scale={0.8} />
                    </Link>
                </div>
                <p style={{ color: "hsl(var(--text-3))", fontSize: "0.85rem", fontWeight: 500 }}>
                    © 2026 Afrizend. Building Trust for Global Work.
                </p>
            </footer>

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </div>
    );
}
