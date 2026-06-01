"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useJobsStore } from "@/lib/jobs-store";
import { DEMO_JOBS } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Search, Upload, CheckCircle, FileText, Lock, Play, Clock, AlertTriangle, Zap, RotateCcw, Shield } from "lucide-react";
function MilestoneStatusIcon({ status }) {
    if (status === "APPROVED")
        return <CheckCircle size={16} color="hsl(145 65% 50%)"/>;
    if (status === "IN_PROGRESS")
        return <Play size={14} color="hsl(217 91% 65%)"/>;
    if (status === "UNDER_REVIEW")
        return <Clock size={14} color="hsl(38 92% 60%)"/>;
    if (status === "NEEDS_REVISION")
        return <RotateCcw size={14} color="hsl(0 84% 60%)"/>;
    if (status === "ESCALATED")
        return <AlertTriangle size={14} color="hsl(38 92% 60%)"/>;
    return <Lock size={14} color="hsl(220 15% 40%)"/>;
}
function MilestoneStatusLabel({ status }) {
    const map = {
        LOCKED: { label: "Locked", color: "hsl(220 15% 40%)" },
        IN_PROGRESS: { label: "In Progress", color: "hsl(217 91% 65%)" },
        UNDER_REVIEW: { label: "Under Review", color: "hsl(38 92% 60%)" },
        APPROVED: { label: "Verified & Paid", color: "hsl(145 65% 50%)" },
        NEEDS_REVISION: { label: "Needs Revision", color: "hsl(0 84% 65%)" },
        ESCALATED: { label: "Escalated", color: "hsl(38 92% 60%)" },
    };
    const { label, color } = map[status] || map.LOCKED;
    return <span style={{ fontSize: "0.75rem", color }}>{label}</span>;
}
export default function FreelancerContractsPage() {
    const user = useAuthStore((s) => s.user);
    const jobs = useJobsStore((s) => s.jobs);
    const liveContracts = jobs.filter((j) => j.freelancerId === (user?.id || ""));
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    // Prefer live contracts, fall back to demo jobs for this user
    const allContracts = liveContracts.length > 0
        ? liveContracts
        : DEMO_JOBS.filter((j) => j.status !== "OPEN" && j.freelancer?.id === user?.id);
    const contracts = allContracts.filter((j) => (filter === "ALL" || j.status === filter) &&
        (!search || j.title.toLowerCase().includes(search.toLowerCase())));
    const isLive = (id) => liveContracts.some((j) => j.id === id);
    return (<div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="font-heading" style={{ fontSize: "1.5rem", fontWeight: 800, color: "white" }}>My Contracts</h1>
        <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.875rem", marginTop: 4 }}>Manage active projects and submit deliverables for AI verification</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search size={16} color="hsl(220 15% 50%)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }}/>
          <input className="input" placeholder="Search contracts..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }}/>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["ALL", "IN_PROGRESS", "COMPLETED"].map((f) => (<button key={f} onClick={() => setFilter(f)} style={{
                padding: "0.5rem 1rem", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                fontWeight: 600, fontSize: "0.8rem", whiteSpace: "nowrap",
                background: filter === f ? "hsl(217 91% 55% / 0.15)" : "hsl(220 14% 10%)",
                border: filter === f ? "1px solid hsl(217 91% 55% / 0.5)" : "1px solid hsl(220 20% 16%)",
                color: filter === f ? "hsl(217 91% 70%)" : "hsl(220 15% 55%)",
            }}>
              {f.replace("_", " ")}
            </button>))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {contracts.map((job) => {
            const live = isLive(job.id);
            const pct = job.escrow ? Math.round((job.escrow.released / job.escrow.total) * 100) : 0;
            return (<div key={job.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1, paddingRight: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <h3 className="font-heading" style={{ fontSize: "1.2rem", fontWeight: 700, color: "white" }}>{job.title}</h3>
                    {live && (<span style={{ fontSize: "0.65rem", fontWeight: 700, color: "hsl(145 65% 55%)", background: "hsl(145 65% 42% / 0.12)", border: "1px solid hsl(145 65% 42% / 0.25)", padding: "0.1rem 0.4rem", borderRadius: 4, textTransform: "uppercase" }}>
                        Live
                      </span>)}
                  </div>
                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "hsl(220 15% 55%)", flexWrap: "wrap" }}>
                    <span>Employer: <strong style={{ color: "white" }}>{job.employerName || "Afrizend Client"}</strong></span>
                    {job.deadline && <span>Deadline: {formatDate(job.deadline)}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 6,
                    textTransform: "uppercase",
                    background: job.status === "COMPLETED" ? "hsl(145 65% 42% / 0.12)" : "hsl(217 91% 55% / 0.12)",
                    color: job.status === "COMPLETED" ? "hsl(145 65% 55%)" : "hsl(217 91% 70%)",
                }}>
                    {job.status.replace("_", " ")}
                  </span>
                  <div className="font-heading" style={{ fontSize: "1.25rem", fontWeight: 800, color: "white" }}>
                    {formatCurrency(job.budget)}
                  </div>
                </div>
              </div>

              {/* Escrow bar */}
              {job.escrow && (<div style={{ background: "hsl(220 20% 10%)", border: "1px solid hsl(220 20% 16%)", borderRadius: 8, padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Lock size={14} color="hsl(145 65% 50%)"/>
                      <span style={{ fontSize: "0.8rem", color: "white", fontWeight: 600 }}>Kora Escrow</span>
                      {job.escrow.koraTxId && (<span style={{ fontSize: "0.68rem", color: "hsl(220 15% 45%)", fontFamily: "monospace" }}>
                          {job.escrow.koraTxId.slice(0, 20)}…
                        </span>)}
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "hsl(145 65% 50%)" }}>
                      {formatCurrency(job.escrow.funded || job.escrow.total)} Secured
                    </span>
                  </div>
                  <div style={{ height: 6, background: "hsl(220 20% 16%)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, hsl(145 65% 42%), hsl(145 65% 55%))", borderRadius: 99, transition: "width 0.8s ease" }}/>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.75rem", color: "hsl(220 15% 55%)" }}>
                    <span>{formatCurrency(job.escrow.released)} Paid to you</span>
                    <span>{formatCurrency(job.escrow.total - job.escrow.released)} Pending</span>
                  </div>
                </div>)}

              {/* Milestones */}
              <div>
                <h4 className="font-heading" style={{ fontSize: "1rem", color: "white", marginBottom: "1rem" }}>Milestones & Deliverables</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {job.milestones?.map((m, i) => (<div key={m.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap",
                        padding: "1rem", borderRadius: 8,
                        background: m.status === "IN_PROGRESS" ? "hsl(217 91% 55% / 0.05)" : m.status === "NEEDS_REVISION" ? "hsl(0 84% 60% / 0.05)" : "hsl(220 14% 10%)",
                        border: m.status === "IN_PROGRESS" ? "1px solid hsl(217 91% 55% / 0.2)" : m.status === "NEEDS_REVISION" ? "1px solid hsl(0 84% 60% / 0.2)" : "1px solid hsl(220 20% 16%)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 200 }}>
                        <div style={{
                        width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        background: m.status === "APPROVED" ? "hsl(145 65% 42% / 0.15)" : m.status === "IN_PROGRESS" ? "hsl(217 91% 55% / 0.15)" : m.status === "NEEDS_REVISION" ? "hsl(0 84% 60% / 0.15)" : "hsl(220 20% 16%)",
                    }}>
                          <MilestoneStatusIcon status={m.status}/>
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "white", marginBottom: 2 }}>{m.title}</div>
                          <MilestoneStatusLabel status={m.status}/>
                          {m.status === "UNDER_REVIEW" && m.submittedAt && (<div style={{ fontSize: "0.7rem", color: "hsl(220 15% 45%)", marginTop: 2 }}>
                              Submitted · Gemini reviewing…
                            </div>)}
                          {m.verificationResult && (m.status === "NEEDS_REVISION" || m.status === "ESCALATED") && (<div style={{ fontSize: "0.75rem", color: "hsl(0 84% 65%)", marginTop: "0.3rem", maxWidth: 360 }}>
                              {m.verificationResult.summary?.slice(0, 100)}…
                            </div>)}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "white" }}>{formatCurrency(m.amount)}</div>
                          {m.paidAt && <div style={{ fontSize: "0.7rem", color: "hsl(145 65% 50%)" }}>Paid ✓</div>}
                        </div>

                        {live && (m.status === "IN_PROGRESS" || m.status === "NEEDS_REVISION") && (<Link to={`/dashboard/freelancer/contracts/${job.id}/submit/${m.id}`} className="btn btn-primary btn-sm submit-milestone-btn">
                            <Upload size={14}/>
                            {m.status === "NEEDS_REVISION" ? "Resubmit" : "Submit Work"}
                          </Link>)}
                        {m.status === "UNDER_REVIEW" && (<div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "hsl(38 92% 60%)" }}>
                            <Shield size={13}/> AI Reviewing…
                          </div>)}
                        {m.status === "APPROVED" && (<div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "hsl(145 65% 50%)" }}>
                            <Zap size={13}/> Paid
                          </div>)}
                        {!live && m.status === "IN_PROGRESS" && (<button className="btn btn-primary btn-sm">
                            <Upload size={14}/> Submit Work
                          </button>)}
                      </div>
                    </div>))}
                </div>
              </div>
            </div>);
        })}

        {contracts.length === 0 && (<div className="card" style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <FileText size={48} color="hsl(220 15% 25%)" style={{ margin: "0 auto 1rem" }}/>
            <h3 className="font-heading" style={{ fontSize: "1.1rem", color: "white", marginBottom: "0.5rem" }}>No contracts yet</h3>
            <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.875rem" }}>
              Contracts will appear here once an employer hires you through AI matching.
            </p>
          </div>)}
      </div>
    </div>);
}
