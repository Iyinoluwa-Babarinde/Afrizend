"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useJobsStore } from "@/lib/jobs-store";
import { DEMO_JOBS } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Plus, Search, Briefcase, Cpu, Lock } from "lucide-react";
export default function EmployerJobsPage() {
    const user = useAuthStore((s) => s.user);
    const jobs = useJobsStore((s) => s.jobs);
    const liveJobs = jobs.filter((j) => j.employerId === (user?.id || ""));
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    // Show live store jobs first, then demo jobs as fallback
    const allJobs = liveJobs.length > 0 ? liveJobs : DEMO_JOBS;
    const filteredJobs = allJobs.filter((j) => {
        if (filter !== "ALL" && j.status !== filter)
            return false;
        if (search && !j.title.toLowerCase().includes(search.toLowerCase()))
            return false;
        return true;
    });
    return (<div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: "1.5rem", fontWeight: 800, color: "white" }}>Jobs & Contracts</h1>
          <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.875rem", marginTop: 4 }}>Manage your active projects and AI matches</p>
        </div>
        <Link to="/dashboard/employer/jobs/new" className="btn btn-primary">
          <Plus size={16}/> Post New Job
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search size={16} color="hsl(220 15% 50%)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }}/>
          <input className="input" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }}/>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
          {["ALL", "OPEN", "IN_PROGRESS", "COMPLETED"].map((f) => (<button key={f} onClick={() => setFilter(f)} style={{
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

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredJobs.map((job) => {
            const isLive = liveJobs.some((j) => j.id === job.id);
            const pct = job.escrow ? Math.round((job.escrow.released / job.escrow.total) * 100) : 0;
            return (<div key={job.id} className="card card-hover" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1, paddingRight: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <h3 className="font-heading" style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>{job.title}</h3>
                    {isLive && (<span style={{ fontSize: "0.65rem", fontWeight: 700, color: "hsl(145 65% 55%)", background: "hsl(145 65% 42% / 0.12)", border: "1px solid hsl(145 65% 42% / 0.25)", padding: "0.1rem 0.4rem", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Live
                      </span>)}
                  </div>
                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "hsl(220 15% 55%)", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                    {job.createdAt && <span>Posted: {formatDate(job.createdAt)}</span>}
                    {job.deadline && <span>Deadline: {formatDate(job.deadline)}</span>}
                    <span>Budget: <strong style={{ color: "white" }}>{formatCurrency(job.budget)}</strong></span>
                    {job.freelancerName && <span>Freelancer: <strong style={{ color: "white" }}>{job.freelancerName}</strong></span>}
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {job.skills?.map((s) => (<span key={s} style={{ fontSize: "0.7rem", color: "hsl(220 15% 65%)", background: "hsl(220 20% 14%)", padding: "0.2rem 0.5rem", borderRadius: 4 }}>{s}</span>))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem", flexShrink: 0 }}>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 6,
                    textTransform: "uppercase", letterSpacing: "0.04em",
                    background: job.status === "OPEN" ? "hsl(200 100% 60% / 0.12)" : job.status === "COMPLETED" ? "hsl(145 65% 42% / 0.12)" : "hsl(217 91% 55% / 0.12)",
                    color: job.status === "OPEN" ? "hsl(200 100% 70%)" : job.status === "COMPLETED" ? "hsl(145 65% 55%)" : "hsl(217 91% 70%)",
                }}>
                    {job.status.replace("_", " ")}
                  </span>

                  {job.status === "OPEN" && isLive && (<Link to={`/dashboard/employer/jobs/${job.id}/matches`} className="btn btn-primary btn-sm">
                      <Cpu size={14}/> AI Matches
                    </Link>)}
                  {(job.status === "IN_PROGRESS" || job.status === "COMPLETED") && isLive && (<Link to={`/dashboard/employer/jobs/${job.id}/contract`} className="btn btn-outline btn-sm">
                      <Lock size={14}/> Manage Contract
                    </Link>)}
                  {!isLive && job.status === "OPEN" && (<button className="btn btn-primary btn-sm">
                      <Cpu size={14}/> Review Matches
                    </button>)}
                </div>
              </div>

              {/* Escrow / Milestone progress bar */}
              {job.status !== "OPEN" && job.escrow && (<div style={{ borderTop: "1px solid hsl(220 20% 16%)", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Lock size={12} color="hsl(145 65% 50%)"/>
                      <span style={{ fontSize: "0.75rem", color: "hsl(220 15% 55%)" }}>Escrow Progress</span>
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "hsl(145 65% 50%)" }}>
                      {formatCurrency(job.escrow.released)} released of {formatCurrency(job.escrow.total)}
                    </span>
                  </div>
                  <div style={{ height: 8, background: "hsl(220 20% 14%)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, hsl(145 65% 42%), hsl(145 65% 55%))", borderRadius: 99, transition: "width 0.8s ease" }}/>
                  </div>
                  {/* Milestone pills */}
                  {isLive && job.milestones && (<div style={{ display: "flex", gap: "0.35rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                      {job.milestones.map((m) => (<span key={m.id} style={{
                                fontSize: "0.68rem", fontWeight: 600, padding: "0.1rem 0.45rem", borderRadius: 4,
                                background: m.status === "APPROVED" ? "hsl(145 65% 42% / 0.15)" : m.status === "UNDER_REVIEW" ? "hsl(38 92% 50% / 0.12)" : m.status === "IN_PROGRESS" ? "hsl(217 91% 55% / 0.12)" : "hsl(220 20% 14%)",
                                color: m.status === "APPROVED" ? "hsl(145 65% 55%)" : m.status === "UNDER_REVIEW" ? "hsl(38 92% 60%)" : m.status === "IN_PROGRESS" ? "hsl(217 91% 65%)" : "hsl(220 15% 40%)",
                            }}>
                          {m.title.length > 20 ? m.title.slice(0, 20) + "…" : m.title}
                        </span>))}
                    </div>)}
                </div>)}
            </div>);
        })}

        {filteredJobs.length === 0 && (<div className="card" style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <Briefcase size={48} color="hsl(220 15% 25%)" style={{ margin: "0 auto 1rem" }}/>
            <h3 className="font-heading" style={{ fontSize: "1.1rem", color: "white", marginBottom: "0.5rem" }}>No jobs yet</h3>
            <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Post your first job and let Gemini AI structure it into verified milestones.</p>
            <Link to="/dashboard/employer/jobs/new" className="btn btn-primary">
              <Plus size={16}/> Post First Job
            </Link>
          </div>)}
      </div>
    </div>);
}
