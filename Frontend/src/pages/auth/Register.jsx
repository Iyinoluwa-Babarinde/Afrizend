"use client";
import { Suspense, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Zap, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import Logo from "@/components/Logo";

const STEPS = ["Account", "Profile", "Wallet"];
const SKILLS_LIST = ["React", "Node.js", "TypeScript", "Python", "Figma", "UI/UX", "Solidity", "AWS", "PostgreSQL", "GraphQL", "Next.js", "Rust", "Go", "Vue", "Data Science", "Mobile (React Native)", "DevOps", "Blockchain", "AI/ML", "Compliance"];

function RegisterForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const register = useAuthStore((s) => s.register);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(searchParams.get("role") || "freelancer");
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", skills: [], walletAddress: "", bio: "", hourlyRate: "", currency: searchParams.get("role") === "employer" ? "USD" : "NGN" });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSkill = (s) => update("skills", form.skills.includes(s) ? form.skills.filter(x => x !== s) : [...form.skills, s]);

  async function handleFinish() {
    setLoading(true);
    try {
      await register({
        ...form,
        role
      });
      navigate(role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/employer");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (<>
    {/* Step indicators */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
      {STEPS.map((s, i) => (<div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.75rem", fontWeight: 700, transition: "all 0.3s",
          background: i < step ? "hsl(var(--success))" : i === step ? "hsl(var(--primary))" : "hsl(var(--surface-3))",
          color: i <= step ? "white" : "hsl(var(--text-3))",
          border: i === step ? "none" : "1px solid hsl(var(--border-light))",
        }}>
          {i < step ? <CheckCircle size={14} /> : i + 1}
        </div>
        <span style={{ fontSize: "0.75rem", color: i === step ? "hsl(var(--primary-dark))" : "hsl(var(--text-3))", fontWeight: i === step ? 700 : 600 }}>{s}</span>
        {i < STEPS.length - 1 && <div style={{ width: 24, height: 2, background: i < step ? "hsl(var(--primary))" : "hsl(var(--border))" }} />}
      </div>))}
    </div>

    <div className="card" style={{ padding: "2rem", background: "hsl(var(--surface))", boxShadow: "var(--shadow-lg)" }}>
      {step === 0 && (<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: "1.4rem", fontWeight: 800, color: "hsl(var(--text))" }}>Create your account</h1>
          <p style={{ color: "hsl(var(--text-2))", fontSize: "0.85rem", marginTop: 4, fontWeight: 500 }}>Join the global talent network</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {["freelancer", "employer"].map(r => (<button key={r} onClick={() => { setRole(r); update("currency", r === "employer" ? "USD" : "NGN"); }} style={{
            padding: "0.75rem", borderRadius: 8, cursor: "pointer", textTransform: "capitalize", fontWeight: 600, fontSize: "0.85rem",
            background: role === r ? "hsl(var(--primary) / 0.1)" : "hsl(var(--surface-3))",
            border: role === r ? "1px solid hsl(var(--primary) / 0.3)" : "1px solid hsl(var(--border))",
            color: role === r ? "hsl(var(--primary-dark))" : "hsl(var(--text-2))",
            transition: "all 0.2s",
          }}>{r === "employer" ? "🏢 Employer" : "💼 Freelancer"}</button>))}
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>Full Name</label>
          <input className="input" placeholder="Your full name" value={form.name} onChange={e => update("name", e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>Email</label>
          <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => update("email", e.target.value)} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>Password</label>
          <input className="input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => update("password", e.target.value)} />
        </div>
        {role === "employer" && (<div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>Company Name</label>
          <input className="input" placeholder="Your company" value={form.company} onChange={e => update("company", e.target.value)} />
        </div>)}
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>Preferred Currency</label>
          <select className="input" value={form.currency} onChange={e => update("currency", e.target.value)} style={{ padding: "0.625rem 0.875rem" }}>
            {role === "employer" ? (
               <>
                 <option value="USD">USD - US Dollar</option>
                 <option value="GBP">GBP - British Pound</option>
               </>
            ) : (
               <>
                 <option value="NGN">NGN - Nigerian Naira</option>
                 <option value="KES">KES - Kenyan Shilling</option>
                 <option value="GHS">GHS - Ghanaian Cedi</option>
               </>
            )}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setStep(1)} disabled={!form.name || !form.email} style={{ width: "100%", marginTop: "0.5rem" }}>
          Continue <ArrowRight size={16} />
        </button>
      </div>)}

      {step === 1 && (<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <h2 className="font-heading" style={{ fontSize: "1.3rem", fontWeight: 800, color: "hsl(var(--text))" }}>
            {role === "freelancer" ? "Your Skills" : "Company Profile"}
          </h2>
          <p style={{ color: "hsl(var(--text-2))", fontSize: "0.85rem", marginTop: 4, fontWeight: 500 }}>This helps our AI match you with the right {role === "freelancer" ? "jobs" : "talent"}</p>
        </div>
        {role === "freelancer" ? (<>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.75rem" }}>Select your skills</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {SKILLS_LIST.map(skill => (<button key={skill} onClick={() => toggleSkill(skill)} style={{
                padding: "0.3rem 0.7rem", borderRadius: 99, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                background: form.skills.includes(skill) ? "hsl(var(--primary) / 0.15)" : "hsl(var(--surface-3))",
                border: form.skills.includes(skill) ? "1px solid hsl(var(--primary) / 0.4)" : "1px solid hsl(var(--border))",
                color: form.skills.includes(skill) ? "hsl(var(--primary-dark))" : "hsl(var(--text-2))",
              }}>{skill}</button>))}
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>Hourly Rate (USD)</label>
            <input className="input" type="number" placeholder="e.g. 45" value={form.hourlyRate} onChange={e => update("hourlyRate", e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>Bio</label>
            <textarea className="input" rows={3} placeholder="Tell clients about your experience…" value={form.bio} onChange={e => update("bio", e.target.value)} style={{ resize: "none" }} />
          </div>
        </>) : (<div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>What types of talent do you hire?</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {SKILLS_LIST.map(skill => (<button key={skill} onClick={() => toggleSkill(skill)} style={{
              padding: "0.3rem 0.7rem", borderRadius: 99, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              background: form.skills.includes(skill) ? "hsl(var(--primary) / 0.15)" : "hsl(var(--surface-3))",
              border: form.skills.includes(skill) ? "1px solid hsl(var(--primary) / 0.4)" : "1px solid hsl(var(--border))",
              color: form.skills.includes(skill) ? "hsl(var(--primary-dark))" : "hsl(var(--text-2))",
            }}>{skill}</button>))}
          </div>
        </div>)}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn btn-ghost" onClick={() => setStep(0)}><ArrowLeft size={16} /></button>
          <button className="btn btn-primary" onClick={() => setStep(2)} style={{ flex: 1 }}>Continue <ArrowRight size={16} /></button>
        </div>
      </div>)}

      {step === 2 && (<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <h2 className="font-heading" style={{ fontSize: "1.3rem", fontWeight: 800, color: "hsl(var(--text))" }}>Kora Virtual Account</h2>
          <p style={{ color: "hsl(var(--text-2))", fontSize: "0.85rem", marginTop: 4, fontWeight: 500 }}>Your dedicated virtual account for global payments</p>
        </div>
        <div style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.2)", borderRadius: 8, padding: "0.875rem", fontSize: "0.8rem", color: "hsl(var(--primary-dark))", fontWeight: 500 }}>
          <strong>Global Payments:</strong> We auto-generate a secure Kora virtual account for you to receive funds in your preferred local currency with minimal FX fees.
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>Virtual Account Reference (Optional)</label>
          <input className="input" placeholder="Leave blank to auto-generate" value={form.walletAddress} onChange={e => update("walletAddress", e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
          <button className="btn btn-ghost" onClick={() => setStep(1)}><ArrowLeft size={16} /></button>
          <button className="btn btn-primary" onClick={handleFinish} disabled={loading} style={{ flex: 1, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Setting up account…" : <><CheckCircle size={16} /> Launch Afrizend</>}
          </button>
        </div>
      </div>)}
    </div>
  </>);
}

export default function RegisterPage() {
  return (<div style={{ minHeight: "100vh", background: "hsl(var(--surface-2))", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
    <div style={{ position: "absolute", inset: 0 }} className="hero-bg" />
    <div style={{ position: "relative", width: "100%", maxWidth: 460 }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem", textDecoration: "none" }}>
        <Logo scale={0.9} />
      </Link>

      <Suspense fallback={<div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>}>
        <RegisterForm />
      </Suspense>

      <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.8rem", color: "hsl(var(--text-3))", fontWeight: 500 }}>
        Already have an account?{" "}
        <Link to="/auth/login" style={{ color: "hsl(var(--primary))", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
      </p>
    </div>
  </div>);
}
