"use client";
import { Suspense, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Zap, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import Logo from "@/components/Logo";

function LoginForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const login = useAuthStore((s) => s.login);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [role, setRole] = useState("freelancer");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const user = await login(email, password);
            navigate(user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/employer");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (<>
      {/* Role selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["freelancer", "employer"].map((r) => (<button key={r} id={`role-${r}`} onClick={() => setRole(r)} type="button" style={{
                padding: "0.625rem", borderRadius: 8, cursor: "pointer", transition: "all 0.2s", fontWeight: 600, fontSize: "0.8rem", textTransform: "capitalize",
                background: role === r ? "hsl(var(--primary) / 0.1)" : "hsl(var(--surface-3))",
                border: role === r ? "1px solid hsl(var(--primary) / 0.3)" : "1px solid hsl(var(--border))",
                color: role === r ? "hsl(var(--primary-dark))" : "hsl(var(--text-2))",
            }}>{r}</button>))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>Email</label>
          <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required/>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(var(--text-2))", marginBottom: "0.4rem" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input className="input" type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: "2.5rem" }}/>
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "hsl(var(--text-3))" }}>
              {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
        </div>
        {error && <p style={{ color: "hsl(var(--error))", fontSize: "0.8rem", fontWeight: 600 }}>{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "0.5rem", width: "100%", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Signing in…" : <><span>Sign In</span><ArrowRight size={16}/></>}
        </button>
      </form>
    </>);
}

export default function LoginPage() {
    return (<div style={{ minHeight: "100vh", background: "hsl(var(--surface-2))", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ position: "absolute", inset: 0 }} className="hero-bg"/>
      <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", textDecoration: "none" }}>
          <Logo scale={0.9} />
        </Link>

        <div className="card" style={{ padding: "2rem", background: "hsl(var(--surface))", boxShadow: "var(--shadow-lg)" }}>
          <h1 className="font-heading" style={{ fontSize: "1.5rem", fontWeight: 800, color: "hsl(var(--text))", marginBottom: "0.25rem" }}>Welcome back</h1>
          <p style={{ color: "hsl(var(--text-2))", fontSize: "0.875rem", marginBottom: "1.5rem", fontWeight: 500 }}>Sign in to your Afrizend account</p>

          <Suspense fallback={<div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>}>
            <LoginForm />
          </Suspense>

          <div className="divider" style={{ margin: "1.25rem 0" }}/>
          <div style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.2)", borderRadius: 8, padding: "0.75rem", fontSize: "0.78rem", color: "hsl(var(--primary-dark))", fontWeight: 500 }}>
            <CheckCircle size={12} style={{ display: "inline", marginRight: 6 }}/>
            <strong>Demo mode:</strong> Enter any email & password to explore
          </div>
          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.8rem", color: "hsl(var(--text-2))", fontWeight: 500 }}>
            No account?{" "}
            <Link to="/auth/register" style={{ color: "hsl(var(--primary))", fontWeight: 700, textDecoration: "none" }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>);
}
