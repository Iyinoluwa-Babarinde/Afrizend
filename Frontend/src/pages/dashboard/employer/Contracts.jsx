"use client";
import { useAuthStore } from "@/lib/store";
import { useJobsStore } from "@/lib/jobs-store";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Lock, CheckCircle, Clock, Zap, FileText, ArrowRight } from "lucide-react";
export default function EmployerContractsPage() {
    const user = useAuthStore((s) => s.user);
    const jobs = useJobsStore((s) => s.jobs);
    const activeJobs = jobs.filter((j) => j.employerId === (user?.id || "") && (j.status === "IN_PROGRESS" || j.status === "COMPLETED"));
    return (<div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="font-heading" style={{ fontSize: "1.5rem", fontWeight: 800, color: "white" }}>Active Contracts</h1>
        <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.875rem", marginTop: 4 }}>
          Review milestone submissions, release payments, and manage deliveries
        </p>
      </div>

      {activeJobs.length === 0 ? (<div className="card" style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <FileText size={48} color="hsl(220 15% 25%)" style={{ margin: "0 auto 1rem" }}/>
          <h3 className="font-heading" style={{ fontSize: "1.1rem", color: "white", marginBottom: "0.5rem" }}>No active contracts</h3>
          <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Post a job, hire a freelancer, and fund escrow to start a contract.
          </p>
          <Link to="/dashboard/employer/jobs/new" className="btn btn-primary">Post a Job</Link>
        </div>) : (<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {activeJobs.map((job) => {
                const pct = Math.round((job.escrow.released / job.escrow.total) * 100);
                const pendingMilestones = job.milestones.filter((m) => m.status === "UNDER_REVIEW" || m.status === "APPROVED" && !m.paidAt);
                const awaitingRelease = job.milestones.filter((m) => m.status === "APPROVED" && !m.paidAt);
                return (<div key={job.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <h3 className="font-heading" style={{ fontSize: "1.1rem", fontWeight: 700, color: "white", marginBottom: "0.25rem" }}>{job.title}</h3>
                    <div style={{ fontSize: "0.82rem", color: "hsl(220 15% 55%)" }}>
                      Freelancer: <strong style={{ color: "white" }}>{job.freelancerName}</strong> · Budget: <strong style={{ color: "white" }}>{formatCurrency(job.budget)}</strong>
                    </div>
                  </div>
                  <Link to={`/dashboard/employer/jobs/${job.id}/contract`} className="btn btn-outline btn-sm review-submission-btn" style={{ gap: "0.4rem" }}>
                    Manage <ArrowRight size={14}/>
                  </Link>
                </div>

                {/* Escrow bar */}
                <div style={{ background: "hsl(220 20% 10%)", border: "1px solid hsl(145 65% 42% / 0.2)", borderRadius: 8, padding: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Lock size={13} color="hsl(145 65% 50%)"/>
                      <span style={{ fontSize: "0.8rem", color: "white", fontWeight: 600 }}>Kora Escrow</span>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "hsl(145 65% 55%)", fontWeight: 600 }}>{pct}% released</span>
                  </div>
                  <div style={{ height: 6, background: "hsl(220 20% 16%)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, hsl(145 65% 42%), hsl(145 65% 55%))", borderRadius: 99 }}/>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.73rem", color: "hsl(220 15% 50%)" }}>
                    <span>{formatCurrency(job.escrow.released)} paid</span>
                    <span>{formatCurrency(job.escrow.total - job.escrow.released)} locked</span>
                  </div>
                </div>

                {/* Alerts */}
                {awaitingRelease.length > 0 && (<div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "hsl(145 65% 42% / 0.06)", border: "1px solid hsl(145 65% 42% / 0.2)", borderRadius: 8, padding: "0.75rem 1rem" }}>
                    <Zap size={16} color="hsl(145 65% 55%)"/>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "0.85rem", color: "white", fontWeight: 600 }}>
                        {awaitingRelease.length} milestone{awaitingRelease.length > 1 ? "s" : ""} approved — payment pending release
                      </span>
                    </div>
                    <Link to={`/dashboard/employer/jobs/${job.id}/contract`} className="btn btn-primary btn-sm">
                      Release Now
                    </Link>
                  </div>)}

                {pendingMilestones.filter(m => m.status === "UNDER_REVIEW").length > 0 && awaitingRelease.length === 0 && (<div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "hsl(38 92% 50% / 0.06)", border: "1px solid hsl(38 92% 50% / 0.2)", borderRadius: 8, padding: "0.75rem 1rem" }}>
                    <Clock size={16} color="hsl(38 92% 60%)"/>
                    <span style={{ fontSize: "0.85rem", color: "hsl(38 92% 65%)", fontWeight: 500 }}>
                      Gemini AI is reviewing a milestone submission…
                    </span>
                  </div>)}

                {/* Milestone summary */}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {job.milestones.map((m, i) => (<div key={m.id} style={{
                            display: "flex", alignItems: "center", gap: "0.35rem",
                            padding: "0.3rem 0.65rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 600,
                            background: m.status === "APPROVED" ? "hsl(145 65% 42% / 0.12)" : m.status === "UNDER_REVIEW" ? "hsl(38 92% 50% / 0.1)" : m.status === "IN_PROGRESS" ? "hsl(217 91% 55% / 0.1)" : "hsl(220 20% 13%)",
                            color: m.status === "APPROVED" ? "hsl(145 65% 55%)" : m.status === "UNDER_REVIEW" ? "hsl(38 92% 60%)" : m.status === "IN_PROGRESS" ? "hsl(217 91% 65%)" : "hsl(220 15% 40%)",
                            border: "1px solid transparent",
                        }}>
                      {m.status === "APPROVED" && <CheckCircle size={11}/>}
                      {m.status === "UNDER_REVIEW" && <Clock size={11}/>}
                      {m.status === "IN_PROGRESS" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(217 91% 65%)" }}/>}
                      {m.status === "LOCKED" && <Lock size={10}/>}
                      M{i + 1}
                    </div>))}
                </div>
              </div>);
            })}
        </div>)}
    </div>);
}
