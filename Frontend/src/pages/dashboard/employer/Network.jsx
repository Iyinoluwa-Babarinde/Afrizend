"use client";
import { useState } from "react";
import { DEMO_FREELANCERS } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Search, Star, MessageSquare, Calendar, X, Check, Send } from "lucide-react";
export default function EmployerNetwork() {
    const [search, setSearch] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("ALL");
    const [bookingConsultant, setBookingConsultant] = useState(null);
    const [chatConsultant, setChatConsultant] = useState(null);
    const [chatMessage, setChatMessage] = useState("");
    const [chatHistory, setChatHistory] = useState({});
    const [bookingDate, setBookingDate] = useState("");
    const [bookingDuration, setBookingDuration] = useState("30");
    const [bookingSuccess, setBookingSuccess] = useState(false);
    // All unique skills from demo data
    const allSkills = ["ALL", ...Array.from(new Set(DEMO_FREELANCERS.flatMap(f => f.skills)))];
    const filteredFreelancers = DEMO_FREELANCERS.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.title.toLowerCase().includes(search.toLowerCase());
        const matchesSkill = selectedSkill === "ALL" || f.skills.includes(selectedSkill);
        return matchesSearch && matchesSkill;
    });
    const handleSendMessage = () => {
        if (!chatMessage.trim() || !chatConsultant)
            return;
        const cid = chatConsultant.id;
        const currentChat = chatHistory[cid] || [];
        // User message
        const updatedChat = [...currentChat, { sender: "You", text: chatMessage }];
        setChatHistory({ ...chatHistory, [cid]: updatedChat });
        setChatMessage("");
        // Simulate AI response
        setTimeout(() => {
            setChatHistory(prev => ({
                ...prev,
                [cid]: [...(prev[cid] || []), { sender: chatConsultant.name, text: "Hey! Thanks for reaching out. I'd love to help with your project. Should we book a quick 15-min call to align?" }]
            }));
        }, 1500);
    };
    const handleConfirmBooking = () => {
        if (!bookingDate)
            return;
        setBookingSuccess(true);
        setTimeout(() => {
            setBookingSuccess(false);
            setBookingConsultant(null);
            setBookingDate("");
        }, 2000);
    };
    return (<div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="font-heading" style={{ fontSize: "1.5rem", fontWeight: 800, color: "white" }}>Talent Network</h1>
        <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.875rem", marginTop: 4 }}>
          Browse, chat with, and book vetted global consultants instantly over Kora
        </p>
      </div>

      {/* Filters bar */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
          <Search size={16} color="hsl(220 15% 50%)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }}/>
          <input className="input" placeholder="Search freelancers by name or role..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }}/>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
          {allSkills.slice(0, 7).map(skill => (<button key={skill} onClick={() => setSelectedSkill(skill)} style={{
                padding: "0.5rem 1rem", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
                fontWeight: 600, fontSize: "0.8rem", whiteSpace: "nowrap",
                background: selectedSkill === skill ? "hsl(217 91% 55% / 0.15)" : "hsl(220 14% 10%)",
                border: selectedSkill === skill ? "1px solid hsl(217 91% 55% / 0.5)" : "1px solid hsl(220 20% 16%)",
                color: selectedSkill === skill ? "hsl(217 91% 70%)" : "hsl(220 15% 55%)",
            }}>
              {skill}
            </button>))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {filteredFreelancers.map((f) => (<div key={f.id} className="card card-hover" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {/* Header info */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: "1.1rem", borderRadius: 10 }}>
                {f.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="font-heading" style={{ fontSize: "1rem", fontWeight: 700, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</h3>
                <p style={{ fontSize: "0.78rem", color: "hsl(220 15% 65%)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.title}</p>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "0.75rem", borderRadius: 8, background: "hsl(220 20% 10%)", border: "1px solid hsl(220 20% 16%)" }}>
              <div>
                <span style={{ fontSize: "0.68rem", color: "hsl(220 15% 50%)", textTransform: "uppercase" }}>Trust Score</span>
                <div style={{ fontSize: "0.85rem", color: "white", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem", marginTop: 2 }}>
                  <Star size={13} fill="hsl(38 92% 50%)" color="hsl(38 92% 50%)"/> {f.trustScore} / 100
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.68rem", color: "hsl(220 15% 50%)", textTransform: "uppercase" }}>Hourly Rate</span>
                <div style={{ fontSize: "0.85rem", color: "white", fontWeight: 700, marginTop: 2 }}>
                  {formatCurrency(f.hourlyRate)} / hr
                </div>
              </div>
            </div>

            {/* Skills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {f.skills.map(s => (<span key={s} style={{ fontSize: "0.7rem", color: "hsl(220 15% 55%)", background: "hsl(220 20% 12%)", padding: "0.15rem 0.45rem", borderRadius: 4 }}>
                  {s}
                </span>))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid hsl(220 20% 16%)", paddingTop: "0.875rem", marginTop: "auto" }}>
              <button onClick={() => setChatConsultant(f)} className="btn btn-ghost btn-sm" style={{ flex: 1, gap: "0.35rem" }}>
                <MessageSquare size={13}/> Chat
              </button>
              <button onClick={() => setBookingConsultant(f)} className="btn btn-primary btn-sm" style={{ flex: 1, gap: "0.35rem" }}>
                <Calendar size={13}/> Book Call
              </button>
            </div>

          </div>))}
      </div>

      {filteredFreelancers.length === 0 && (<div className="card text-center" style={{ padding: "4rem 2rem" }}>
          <Search size={48} color="hsl(220 15% 25%)" style={{ margin: "0 auto 1rem" }}/>
          <h3 className="font-heading" style={{ fontSize: "1.1rem", color: "white", marginBottom: "0.5rem" }}>No matches found</h3>
          <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.875rem" }}>Try adjusting your search criteria or filter selections.</p>
        </div>)}

      {/* Consultation Booking Modal */}
      {bookingConsultant && (<div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} className="animate-fade-in">
          <div className="card glass-strong" style={{ width: "100%", maxWidth: 450, padding: "2rem", position: "relative" }}>
            <button onClick={() => setBookingConsultant(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "hsl(220 15% 55%)" }}>
              <X size={20}/>
            </button>

            {bookingSuccess ? (<div style={{ textAlign: "center", padding: "1rem 0" }} className="animate-fade-in">
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "hsl(145 65% 42% / 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <Check size={24} color="hsl(145 65% 55%)"/>
                </div>
                <h3 className="font-heading" style={{ fontSize: "1.2rem", color: "white", marginBottom: "0.5rem" }}>Session Booked!</h3>
                <p style={{ color: "hsl(220 15% 55%)", fontSize: "0.85rem" }}>Consultation scheduled and synced to your dashboard sessions.</p>
              </div>) : (<>
                <h3 className="font-heading" style={{ fontSize: "1.25rem", color: "white", marginBottom: "1rem" }}>Schedule Consultation</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", padding: "0.75rem", borderRadius: 8, background: "hsl(220 20% 10%)" }}>
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: "0.7rem", borderRadius: 8 }}>
                    {bookingConsultant.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "white", fontSize: "0.9rem" }}>{bookingConsultant.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "hsl(220 15% 55%)" }}>{bookingConsultant.title}</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(220 15% 65%)", marginBottom: "0.4rem" }}>Date & Time</label>
                    <input className="input" type="datetime-local" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required/>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "hsl(220 15% 65%)", marginBottom: "0.4rem" }}>Duration</label>
                    <select className="input" value={bookingDuration} onChange={e => setBookingDuration(e.target.value)} style={{ background: "hsl(220 16% 12%)" }}>
                      <option value="15">15 Minutes ({formatCurrency(bookingConsultant.hourlyRate / 4)})</option>
                      <option value="30">30 Minutes ({formatCurrency(bookingConsultant.hourlyRate / 2)})</option>
                      <option value="60">60 Minutes ({formatCurrency(bookingConsultant.hourlyRate)})</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="btn btn-ghost" onClick={() => setBookingConsultant(null)} style={{ flex: 1 }}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleConfirmBooking} disabled={!bookingDate} style={{ flex: 1 }}>Book Session</button>
                </div>
              </>)}
          </div>
        </div>)}

      {/* Chat Messages Drawer */}
      {chatConsultant && (<div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "100%", maxWidth: 380, zIndex: 999, background: "hsl(220 14% 8%)", borderLeft: "1px solid hsl(220 20% 16%)", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column" }} className="animate-fade-in">
          
          {/* Header */}
          <div style={{ padding: "1.25rem", borderBottom: "1px solid hsl(220 20% 16%)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div className="avatar" style={{ width: 36, height: 36, fontSize: "0.7rem", borderRadius: 8 }}>
                {chatConsultant.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "white", fontSize: "0.9rem" }}>{chatConsultant.name}</div>
                <div style={{ fontSize: "0.72rem", color: "hsl(145 65% 50%)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(145 65% 50%)" }}/> Active Now
                </div>
              </div>
            </div>
            <button onClick={() => setChatConsultant(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "hsl(220 15% 55%)" }}>
              <X size={20}/>
            </button>
          </div>

          {/* Messages content */}
          <div style={{ flex: 1, padding: "1.25rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ alignSelf: "center", textAlign: "center", fontSize: "0.72rem", color: "hsl(220 15% 45%)", background: "hsl(220 20% 12%)", padding: "0.3rem 0.6rem", borderRadius: 4, margin: "0 auto" }}>
              Secure Chat monetized via Kora Protocol (Kora)
            </div>

            {(chatHistory[chatConsultant.id] || [
                { sender: chatConsultant.name, text: `Hello! I see you are looking for consultants in ${chatConsultant.skills.slice(0, 2).join(" & ")}. I have verified deliveries and a TrustScore of ${chatConsultant.trustScore}. How can I assist you today?` }
            ]).map((msg, i) => {
                const isMe = msg.sender === "You";
                return (<div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                  <div style={{
                        padding: "0.75rem 1rem", borderRadius: 12, fontSize: "0.85rem", maxWidth: "80%", lineHeight: 1.4,
                        background: isMe ? "hsl(217 91% 55%)" : "hsl(220 16% 12%)",
                        color: isMe ? "white" : "hsl(220 15% 85%)",
                        border: isMe ? "none" : "1px solid hsl(220 20% 16%)",
                        borderBottomRightRadius: isMe ? 2 : 12,
                        borderBottomLeftRadius: isMe ? 12 : 2,
                    }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: "0.68rem", color: "hsl(220 15% 45%)", marginTop: 4 }}>{msg.sender}</span>
                </div>);
            })}
          </div>

          {/* Footer input */}
          <div style={{ padding: "1.25rem", borderTop: "1px solid hsl(220 20% 16%)", background: "hsl(220 14% 6%)" }}>
            <div style={{ position: "relative" }}>
              <input className="input" placeholder="Type a message..." value={chatMessage} onChange={e => setChatMessage(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendMessage()} style={{ paddingRight: "3rem" }}/>
              <button onClick={handleSendMessage} style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "hsl(217 91% 60%)" }}>
                <Send size={18}/>
              </button>
            </div>
          </div>

        </div>)}

    </div>);
}
