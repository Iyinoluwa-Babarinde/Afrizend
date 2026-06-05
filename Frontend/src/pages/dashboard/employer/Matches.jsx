"use client";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobsStore } from "@/lib/jobs-store";
import { DEMO_FREELANCERS } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowLeft, Cpu, Star, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
export default function JobMatchesPage() {
    const params = useParams();
    const navigate = useNavigate();
    const jobs = useJobsStore((s) => s.jobs);
    const job = jobs.find((j) => j.id === params.id);
    const hireFreelancer = useJobsStore((s) => s.hireFreelancer);
    const [hiringId, setHiringId] = useState(null);
    const [hiredFreelancer, setHiredFreelancer] = useState(null);
    if (!job) {
        return (<div style={{ padding: "3rem", textAlign: "center" }}>
        <AlertCircle size={48} color="hsl(0 84% 60%)" style={{ margin: "0 auto 1rem" }}/>
        <p style={{ color: "hsl(220 15% 55%)" }}>Job not found.</p>
        <Link to="/dashboard/employer/jobs" className="btn btn-primary" style={{ marginTop: "1rem" }}>Back to Jobs</Link>
      </div>);
    }
    // Pre-calculate matches for this job based on skills
    const matches = DEMO_FREELANCERS.map((f, idx) => {
        const matchingSkills = f.skills.filter(s => job.skills.includes(s));
        const pct = Math.round(75 + (matchingSkills.length / Math.max(1, job.skills.length)) * 20 - idx * 5);
        return {
            ...f,
            matchPct: Math.min(99, Math.max(65, pct)),
            matchReason: matchingSkills.length > 0
                ? `Top match for ${matchingSkills.slice(0, 2).join(" & ")}. Delivered ${f.reviews} similar projects.`
                : `Strong profile with high TrustScore and experience in related domains.`
        };
    }).sort((a, b) => b.matchPct - a.matchPct);
    const handleHire = async (freelancer) => {
        setHiringId(freelancer.id);
        // Simulate smart contract generation & Kora network connection
        await new Promise(r => setTimeout(r, 2500));
        hireFreelancer(job.id, freelancer.id, freelancer.name);
        setHiredFreelancer(freelancer);
        // Brief delay to show success state before redirecting
        await new Promise(r => setTimeout(r, 1500));
        navigate(`/dashboard/employer/jobs/${job.id}/contract`);
    };
    return (<div style={{ padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      <Link to="/dashboard/employer/jobs" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "hsl(220 15% 55%)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
        <ArrowLeft size={16}/> Back to Jobs
      </Link>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, hsl(217 91% 55% / 0.2), hsl(200 100% 60% / 0.1))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Cpu size={18} color="hsl(217 91% 70%)"/>
          </div>
          <h1 className="font-heading" style={{ fontSize: "1.5rem", fontWeight: 800, color: "white" }}>AI Candidate Matchmaker</h1>
        </div>
        <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.9rem" }}>
          Gemini has analyzed your job post <strong>&ldquo;{job.title}&rdquo;</strong> and matched these vetted global candidates based on skill similarity, previous smart contract feedback, and TrustScores.
        </p>
      </div>

      {hiredFreelancer ? (<div className="card text-center animate-fade-in" style={{ background: "hsl(145 65% 42% / 0.08)", borderColor: "hsl(145 65% 42% / 0.3)", padding: "3rem 2rem", borderRadius: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "hsl(145 65% 42% / 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <CheckCircle size={32} color="hsl(145 65% 55%)"/>
          </div>
          <h2 className="font-heading" style={{ fontSize: "1.5rem", color: "white", marginBottom: "0.5rem" }}>Hired Successfully!</h2>
          <p style={{ color: "hsl(220 15% 65%)", fontSize: "0.95rem", maxWidth: 500, margin: "0 auto 1.5rem" }}>
            You have hired <strong>{hiredFreelancer.name}</strong>. The Kora smart contract is active and the first milestone has been structured. Redirecting you to manage the contract escrow...
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "hsl(217 91% 75%)", fontSize: "0.85rem" }}>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }}/> Creating secure payment escrow...
          </div>
        </div>) : (<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {matches.map((freelancer) => {
                const isHiring = hiringId === freelancer.id;
                const matchScoreColor = freelancer.matchPct >= 90 ? "hsl(145 65% 50%)" : freelancer.matchPct >= 80 ? "hsl(217 91% 65%)" : "hsl(38 92% 60%)";
                return (<div key={freelancer.id} className="card card-hover ai-match-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative" }}>
                
                {/* Top Row: Name, Match score, Trust score */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="avatar" style={{ width: 48, height: 48, fontSize: "1.2rem", borderRadius: 12 }}>
                      {freelancer.name?.split(" ").map((n) => n[0]).join("") || "F"}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <h3 className="font-heading" style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>{freelancer.name}</h3>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: matchScoreColor, background: `${matchScoreColor}1a`, border: `1px solid ${matchScoreColor}33`, padding: "0.15rem 0.4rem", borderRadius: 4 }}>
                          {freelancer.matchPct}% Match
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "hsl(220 15% 65%)", marginTop: 2 }}>{freelancer.title}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1.5rem", textAlign: "right" }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "hsl(220 15% 50%)" }}>TRUST SCORE</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "hsl(200 100% 65%)", display: "flex", alignItems: "center", gap: "0.25rem", justifyContent: "flex-end" }}>
                        <Star size={13} fill="currentColor"/> {freelancer.trustScore} / 100
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "hsl(220 15% 50%)" }}>HOURLY RATE</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "white" }}>
                        {formatCurrency(freelancer.hourlyRate)}/hr
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match rationale */}
                <div style={{ background: "hsl(220 20% 10%)", border: "1px solid hsl(220 20% 16%)", borderRadius: 8, padding: "0.875rem 1rem", fontSize: "0.85rem", color: "hsl(220 15% 75%)", display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                  <Shield size={16} color="hsl(217 91% 65%)" style={{ marginTop: 2, flexShrink: 0 }}/>
                  <div>
                    <strong>AI Recommendation:</strong> {freelancer.matchReason}
                  </div>
                </div>

                {/* Skills match check list */}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {freelancer.skills.map((skill) => {
                        const isMatched = job.skills.includes(skill);
                        return (<span key={skill} style={{
                                fontSize: "0.72rem", padding: "0.2rem 0.5rem", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: "0.25rem",
                                background: isMatched ? "hsl(145 65% 42% / 0.12)" : "hsl(220 20% 14%)",
                                border: isMatched ? "1px solid hsl(145 65% 42% / 0.25)" : "1px solid hsl(220 20% 16%)",
                                color: isMatched ? "hsl(145 65% 60%)" : "hsl(220 15% 50%)",
                            }}>
                        {isMatched && <CheckCircle size={10}/>}
                        {skill}
                      </span>);
                    })}
                </div>

                {/* Hire actions */}
                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid hsl(220 20% 16%)", paddingTop: "1rem" }}>
                  <button onClick={() => handleHire(freelancer)} disabled={hiringId !== null} className="btn btn-primary btn-sm hire-btn" style={{ minWidth: 140, fontWeight: 700, gap: "0.5rem" }}>
                    {isHiring ? (<>
                        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }}/>
                        Deploying Kora Contract...
                      </>) : (<>
                        Hiring Offer
                      </>)}
                  </button>
                </div>

              </div>);
            })}
        </div>)}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>);
}
