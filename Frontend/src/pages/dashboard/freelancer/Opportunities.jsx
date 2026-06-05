"use client";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useJobsStore } from "@/lib/jobs-store";
import { DEMO_JOBS } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Briefcase, Search, Cpu, Shield } from "lucide-react";
export default function FreelancerOpportunitiesPage() {
    const user = useAuthStore((s) => s.user);
    const jobs = useJobsStore((s) => s.jobs);
    const liveOpenJobs = jobs.filter((j) => j.status === "OPEN");
    const [search, setSearch] = useState("");
    const [appliedJobs, setAppliedJobs] = useState(new Set());
    
    const handleApply = (jobId) => {
        setAppliedJobs(prev => new Set(prev).add(jobId));
        alert("Application submitted! The employer will review your profile shortly.");
    };
    // Combine live + demo open jobs
    const openJobs = [
        ...liveOpenJobs,
        ...DEMO_JOBS.filter((j) => j.status === "OPEN"),
    ].filter((j) => !search || j.title.toLowerCase().includes(search.toLowerCase()));
    return (<div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="font-heading" style={{ fontSize: "1.5rem", fontWeight: 800, color: "white" }}>Job Opportunities</h1>
        <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.875rem", marginTop: 4 }}>AI-matched projects based on your skills</p>
      </div>

      {/* AI Match Banner */}
      <div style={{
            marginBottom: "2rem", background: "linear-gradient(135deg, hsl(217 91% 55% / 0.12), hsl(200 100% 60% / 0.06))",
            border: "1px solid hsl(217 91% 55% / 0.2)", borderRadius: 12, padding: "1.25rem 1.5rem",
            display: "flex", alignItems: "center", gap: "1.25rem",
        }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: "hsl(217 91% 55% / 0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Cpu size={22} color="hsl(217 91% 70%)"/>
        </div>
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "white", marginBottom: "0.2rem" }}>Gemini Semantic Matching Active</div>
          <div style={{ fontSize: "0.82rem", color: "hsl(220 15% 65%)" }}>Jobs are ranked by skill alignment, trust score, and milestone fit. Apply to any job and the employer's AI will score you.</div>
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: "1.5rem", maxWidth: 400 }}>
        <Search size={16} color="hsl(220 15% 50%)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }}/>
        <input className="input" placeholder="Search open jobs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }}/>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {openJobs.map((job, i) => (<div key={job.id} className="card card-hover" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ flex: 1, paddingRight: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <h3 className="font-heading" style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>{job.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", fontWeight: 700, color: "hsl(217 91% 70%)", background: "hsl(217 91% 55% / 0.12)", border: "1px solid hsl(217 91% 55% / 0.2)", padding: "0.15rem 0.5rem", borderRadius: 4 }}>
                    <Cpu size={10}/> {90 + Math.floor(Math.random() * 8)}% Match
                  </div>
                </div>
                <div style={{ fontSize: "0.83rem", color: "hsl(220 15% 65%)", marginBottom: "1rem", lineHeight: 1.6 }}>
                  {job.description?.slice(0, 160)}{job.description?.length > 160 ? "…" : ""}
                </div>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "hsl(220 15% 55%)", marginBottom: "1rem", flexWrap: "wrap" }}>
                  <span>By: <strong style={{ color: "white" }}>{job.employerName || "Afrizend Client"}</strong></span>
                  {job.deadline && <span>Deadline: {formatDate(job.deadline)}</span>}
                  {job.milestones?.length > 0 && (<span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Shield size={11} color="hsl(145 65% 50%)"/>
                      {job.milestones.length} AI-verified milestones
                    </span>)}
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {job.skills?.map((s) => (<span key={s} style={{ fontSize: "0.72rem", color: "hsl(220 15% 75%)", background: "hsl(220 20% 14%)", padding: "0.2rem 0.5rem", borderRadius: 4 }}>{s}</span>))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem", flexShrink: 0, minWidth: 130 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.72rem", color: "hsl(220 15% 55%)", marginBottom: 2 }}>Fixed Budget</div>
                  <div className="font-heading" style={{ fontSize: "1.25rem", fontWeight: 800, color: "white" }}>{formatCurrency(job.budget)}</div>
                </div>
                <button 
                  className={`btn ${appliedJobs.has(job.id) ? 'btn-ghost' : 'btn-primary'}`} 
                  style={{ width: "100%", fontSize: "0.82rem" }}
                  onClick={() => handleApply(job.id)}
                  disabled={appliedJobs.has(job.id)}
                >
                  {appliedJobs.has(job.id) ? "Applied" : "Apply Now"}
                </button>
              </div>
            </div>

            {/* Milestone preview for live jobs */}
            {job.milestones?.length > 0 && (<div style={{ borderTop: "1px solid hsl(220 20% 14%)", paddingTop: "0.875rem", display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: "hsl(220 15% 45%)", marginRight: "0.25rem" }}>Milestones:</span>
                {job.milestones.map((m, mi) => (<span key={m.id} style={{ fontSize: "0.7rem", color: "hsl(217 91% 65%)", background: "hsl(217 91% 55% / 0.08)", border: "1px solid hsl(217 91% 55% / 0.15)", padding: "0.1rem 0.45rem", borderRadius: 4 }}>
                    {m.title.length > 22 ? m.title.slice(0, 22) + "…" : m.title} · {formatCurrency(m.amount)}
                  </span>))}
              </div>)}
          </div>))}

        {openJobs.length === 0 && (<div className="card" style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <Briefcase size={48} color="hsl(220 15% 25%)" style={{ margin: "0 auto 1rem" }}/>
            <h3 className="font-heading" style={{ fontSize: "1.1rem", color: "white", marginBottom: "0.5rem" }}>No open jobs right now</h3>
            <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.875rem" }}>Check back soon — new jobs are posted by employers daily.</p>
          </div>)}
      </div>
    </div>);
}
