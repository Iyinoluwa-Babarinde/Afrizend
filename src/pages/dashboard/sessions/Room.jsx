"use client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/lib/store";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { Video, Mic, VideoOff, PhoneOff, Users, MessageSquare, Zap } from "lucide-react";
// For demo purposes only
export default function SessionRoom() {
    const params = useParams();
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const [timer, setTimer] = useState(null);
    const [inCall, setInCall] = useState(false);
    const [duration, setDuration] = useState(0); // in seconds
    const ratePerMinute = 1.20; // Hardcoded demo rate
    const amountEarned = (duration / 60) * ratePerMinute;
    useEffect(() => {
        let interval;
        if (inCall) {
            interval = setInterval(() => {
                setDuration((d) => d + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [inCall]);
    const toggleCall = () => {
        if (inCall) {
            // End call
            setInCall(false);
            alert(`Session ended. Total streamed: ${formatCurrency(amountEarned)}`);
            navigate(-1);
        }
        else {
            setInCall(true);
        }
    };
    return (<div style={{ height: "calc(100vh - 56px)", display: "flex", flexDirection: "column", background: "black" }}>
      {/* Room Header */}
      <div style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "hsl(220 14% 6%)", borderBottom: "1px solid hsl(220 20% 12%)" }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: "1.1rem", fontWeight: 700, color: "white" }}>Advisory Session</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "hsl(220 15% 55%)", marginTop: 4 }}>
            <span className="badge badge-blue" style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>{user?.role}</span>
            <span>Room ID: {params.id}</span>
          </div>
        </div>

        {/* Live Meter (Visible when in call) */}
        {inCall && (<div style={{ display: "flex", alignItems: "center", gap: "1.5rem", background: "hsl(220 20% 10%)", padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid hsl(200 100% 60% / 0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div className="status-dot online animate-blink"/>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "white", fontFamily: "monospace" }}>{formatDuration(duration)}</span>
            </div>
            <div style={{ width: 1, height: 20, background: "hsl(220 20% 16%)" }}/>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Zap size={14} color="hsl(200 100% 65%)" className="pulse-blue" style={{ borderRadius: "50%" }}/>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.65rem", color: "hsl(220 15% 55%)", lineHeight: 1 }}>Streaming via Kora</span>
                <span className="font-heading" style={{ fontSize: "1rem", fontWeight: 800, color: "hsl(200 100% 65%)", lineHeight: 1 }}>
                  {formatCurrency(amountEarned)}
                </span>
              </div>
            </div>
          </div>)}
      </div>

      {/* Video Area (Placeholder) */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", position: "relative" }}>
        
        {!inCall ? (<div className="card" style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
            <Video size={48} color="hsl(217 91% 55%)" style={{ margin: "0 auto 1rem" }}/>
            <h2 className="font-heading" style={{ fontSize: "1.2rem", color: "white", marginBottom: "0.5rem" }}>Ready to join?</h2>
            <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.85rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              {user?.role === "employer"
                ? `You will pre-authorize a budget. Payment streams at ${formatCurrency(ratePerMinute)}/min while connected.`
                : `Payment will stream directly to your Kora wallet at ${formatCurrency(ratePerMinute)}/min.`}
            </p>
            <button className="btn btn-primary" onClick={toggleCall} style={{ width: "100%" }}>
              Join & Start Streaming Payment
            </button>
          </div>) : (<div style={{ width: "100%", height: "100%", maxWidth: 1000, background: "hsl(220 14% 10%)", borderRadius: 16, border: "1px solid hsl(220 20% 16%)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div className="avatar" style={{ width: 80, height: 80, fontSize: "2rem", margin: "0 auto 1rem", borderRadius: 24 }}>{user?.role === "employer" ? "NA" : "FS"}</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "white" }}>{user?.role === "employer" ? "Dr. Ngozi Adeyemi" : "FinTech Solutions"}</div>
              <div style={{ fontSize: "0.85rem", color: "hsl(220 15% 55%)", marginTop: 4 }}>Connecting video...</div>
            </div>

            {/* Self view pip */}
            <div style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", width: 240, height: 160, background: "hsl(220 20% 14%)", borderRadius: 12, border: "1px solid hsl(220 20% 20%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="avatar" style={{ width: 48, height: 48, fontSize: "1.2rem", borderRadius: 12 }}>{user?.avatar}</div>
            </div>
          </div>)}

      </div>

      {/* Controls */}
      <div style={{ padding: "1rem", background: "hsl(220 14% 6%)", borderTop: "1px solid hsl(220 20% 12%)", display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button className="btn btn-ghost" style={{ width: 48, height: 48, borderRadius: "50%", padding: 0 }} disabled={!inCall}><Mic size={20}/></button>
        <button className="btn btn-ghost" style={{ width: 48, height: 48, borderRadius: "50%", padding: 0 }} disabled={!inCall}><VideoOff size={20}/></button>
        <button className="btn btn-ghost" style={{ width: 48, height: 48, borderRadius: "50%", padding: 0 }} disabled={!inCall}><Users size={20}/></button>
        <button className="btn btn-ghost" style={{ width: 48, height: 48, borderRadius: "50%", padding: 0 }} disabled={!inCall}><MessageSquare size={20}/></button>
        <div style={{ width: 1, height: 48, background: "hsl(220 20% 16%)", margin: "0 0.5rem" }}/>
        <button onClick={toggleCall} style={{
            width: 48, height: 48, borderRadius: "50%", padding: 0, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
            background: inCall ? "hsl(0 84% 50%)" : "hsl(220 20% 16%)",
            color: inCall ? "white" : "hsl(220 15% 45%)",
            opacity: inCall ? 1 : 0.5, pointerEvents: inCall ? "auto" : "none"
        }}>
          <PhoneOff size={20}/>
        </button>
      </div>

    </div>);
}
