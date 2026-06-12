"use client";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, Briefcase, FileText, Wallet, Calendar, Users, Bell, Settings, LogOut, ChevronRight, Menu, TrendingUp, Star, MessageSquare } from "lucide-react";
import { useAuthStore, useUIStore } from "@/lib/store";
import { formatCurrency, getInitials } from "@/lib/utils";
import Logo from "@/components/Logo";
import { io } from "socket.io-client";

const EMPLOYER_NAV = [
    { href: "/dashboard/employer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/employer/jobs", label: "Jobs", icon: Briefcase },
    { href: "/dashboard/employer/contracts", label: "Contracts", icon: FileText },
    { href: "/dashboard/employer/sessions", label: "Book a Session", icon: Calendar },
    { href: "/dashboard/chat", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
];

const FREELANCER_NAV = [
    { href: "/dashboard/freelancer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/freelancer/opportunities", label: "Opportunities", icon: TrendingUp },
    { href: "/dashboard/freelancer/contracts", label: "My Contracts", icon: FileText },
    { href: "/dashboard/freelancer/sessions", label: "My Sessions", icon: Calendar },
    { href: "/dashboard/chat", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
];

export default function DashboardLayout() {
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const notifications = useUIStore((s) => s.notifications);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null); 
    const socketRef = useRef(null);
    const nav = user?.role === "employer" ? EMPLOYER_NAV : FREELANCER_NAV;

    useEffect(() => {
        if (!user) return;
        socketRef.current = io((import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"));
        socketRef.current.emit("join_user_room", user.id);

        socketRef.current.on("notification", (data) => {
            setToast(data);
            setTimeout(() => setToast(null), 8000);
            useUIStore.setState({ notifications: useUIStore.getState().notifications + 1 });
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [user]);

    function handleLogout() {
        logout();
        navigate("/");
    }

    if (!user) {
        if (typeof window !== "undefined")
            navigate("/auth/login");
        return null;
    }

    const Sidebar = () => (
        <aside style={{
            width: 260, background: "hsl(var(--surface-2))", borderRight: "1px solid hsl(var(--border))",
            display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0,
            overflowY: "auto",
        }}>
            {/* Logo */}
            <div style={{ padding: "1.25rem 1.25rem 1rem", borderBottom: "1px solid hsl(var(--border))" }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                    <Logo scale={0.7} />
                </Link>
            </div>

            {/* User card */}
            <div style={{ padding: "1rem 1rem 0.75rem", borderBottom: "1px solid hsl(var(--border))" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className="avatar" style={{ width: 38, height: 38, fontSize: "0.8rem" }}>{getInitials(user.name)}</div>
                    <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "hsl(var(--text))", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <span className="badge badge-green" style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>{user.role}</span>
                            {user.trustScore && <span style={{ fontSize: "0.72rem", color: "hsl(var(--warning))", fontWeight: 700 }}>★ {user.trustScore}</span>}
                        </div>
                    </div>
                </div>
                {/* Balance */}
                <div style={{ marginTop: "0.75rem", background: "hsl(var(--surface))", borderRadius: 8, padding: "0.6rem 0.75rem", border: "1px solid hsl(var(--border-light))", boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ fontSize: "0.7rem", color: "hsl(var(--text-3))", marginBottom: 2, fontWeight: 600 }}>Wallet Balance</div>
                    <div className="font-heading" style={{ fontSize: "1.1rem", fontWeight: 800, color: "hsl(var(--text))" }}>{formatCurrency(user.balance || 0, user.currency || (user.role === "employer" ? "USD" : "NGN"))}</div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ padding: "0.75rem 0.75rem", flex: 1 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "hsl(var(--text-3))", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 0.5rem", marginBottom: "0.35rem" }}>
                    {user.role === "employer" ? "Employer" : "Freelancer"}
                </div>
                {nav.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || (href !== `/dashboard/${user.role}` && pathname.startsWith(href));
                    return (
                        <Link key={href} to={href} style={{
                            display: "flex", alignItems: "center", gap: "0.625rem",
                            padding: "0.65rem 0.75rem", borderRadius: 8, textDecoration: "none",
                            marginBottom: "0.35rem", transition: "all 0.2s",
                            background: active ? "hsl(var(--primary) / 0.1)" : "hsl(var(--surface))",
                            color: active ? "hsl(var(--primary-dark))" : "hsl(var(--text-2))",
                            fontWeight: active ? 600 : 500, fontSize: "0.875rem",
                            border: active ? "1px solid hsl(var(--primary) / 0.3)" : "1px solid hsl(var(--border-light))",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                        }} onMouseEnter={e => {
                            if (!active) {
                                e.currentTarget.style.background = "hsl(var(--surface-3))";
                                e.currentTarget.style.color = "hsl(var(--text))";
                            }
                        }} onMouseLeave={e => {
                            if (!active) {
                                e.currentTarget.style.background = "hsl(var(--surface))";
                                e.currentTarget.style.color = "hsl(var(--text-2))";
                            }
                        }}>
                            <Icon size={16} />
                            {label}
                            {active && <ChevronRight size={13} style={{ marginLeft: "auto" }} />}
                        </Link>
                    );
                })}

                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "hsl(var(--text-3))", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.75rem 0.5rem 0.35rem" }}>General</div>
                <Link to="/dashboard/employer/sessions" style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.65rem 0.75rem", borderRadius: 8, textDecoration: "none", color: "hsl(var(--text-2))", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.35rem", border: "1px solid hsl(var(--border-light))", background: "hsl(var(--surface))", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }} onMouseEnter={e => { e.currentTarget.style.background = "hsl(var(--surface-3))"; e.currentTarget.style.color = "hsl(var(--text))"; }} onMouseLeave={e => { e.currentTarget.style.background = "hsl(var(--surface))"; e.currentTarget.style.color = "hsl(var(--text-2))"; }}>
                    <Star size={16} /> Find Consultants
                </Link>
                <Link to="/dashboard/employer/settings" style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.65rem 0.75rem", borderRadius: 8, textDecoration: "none", color: "hsl(var(--text-2))", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.35rem", border: "1px solid hsl(var(--border-light))", background: "hsl(var(--surface))", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }} onMouseEnter={e => { e.currentTarget.style.background = "hsl(var(--surface-3))"; e.currentTarget.style.color = "hsl(var(--text))"; }} onMouseLeave={e => { e.currentTarget.style.background = "hsl(var(--surface))"; e.currentTarget.style.color = "hsl(var(--text-2))"; }}>
                    <Settings size={16} /> Settings
                </Link>
                <Link to="/dashboard/employer/network" style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.65rem 0.75rem", borderRadius: 8, textDecoration: "none", color: "hsl(var(--text-2))", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.35rem", border: "1px solid hsl(var(--border-light))", background: "hsl(var(--surface))", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }} onMouseEnter={e => { e.currentTarget.style.background = "hsl(var(--surface-3))"; e.currentTarget.style.color = "hsl(var(--text))"; }} onMouseLeave={e => { e.currentTarget.style.background = "hsl(var(--surface))"; e.currentTarget.style.color = "hsl(var(--text-2))"; }}>
                    <Users size={16} /> Talent Network
                </Link>
            </nav>

            {/* Logout */}
            <div style={{ borderTop: "1px solid hsl(var(--border))", padding: "0.75rem" }}>
                <button onClick={handleLogout} style={{
                    display: "flex", alignItems: "center", gap: "0.625rem", width: "100%",
                    padding: "0.55rem 0.625rem", borderRadius: 8, background: "none", border: "none",
                    cursor: "pointer", color: "hsl(var(--error))", fontSize: "0.875rem", fontWeight: 600, transition: "all 0.2s",
                }} onMouseEnter={e => { e.currentTarget.style.background = "hsl(var(--error) / 0.1)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
        </aside>
    );

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "hsl(var(--surface-4))" }}>
            {/* Desktop sidebar */}
            <div style={{ display: "none" }} className="desktop-sidebar">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (<div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }} onClick={() => setSidebarOpen(false)} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <Sidebar />
                </div>
            </div>)}

            {/* Main content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* Top bar */}
                <header style={{
                    height: 56, borderBottom: "1px solid hsl(var(--border))",
                    display: "flex", alignItems: "center", padding: "0 1.25rem", gap: "1rem",
                    background: "hsl(var(--surface))", position: "sticky", top: 0, zIndex: 40,
                    boxShadow: "var(--shadow-sm)"
                }}>
                    <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "hsl(var(--text-2))", display: "flex" }}>
                        <Menu size={20} />
                    </button>
                    <div style={{ flex: 1 }} />
                    {/* Notifications */}
                    <button style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "hsl(var(--text-2))", padding: 4 }}>
                        <Bell size={18} />
                        {notifications > 0 && <span className="notif-dot" />}
                    </button>
                    <div className="avatar" style={{ width: 30, height: 30, fontSize: "0.7rem", cursor: "pointer" }}>{getInitials(user.name)}</div>
                </header>

                <main style={{ flex: 1, overflowY: "auto", position: "relative", padding: "1.5rem" }}>
                    <Outlet />

                    {/* Toast Notification */}
                    {toast && (
                        <div style={{
                            position: "absolute", bottom: "2rem", right: "2rem", zIndex: 1000,
                            background: "hsl(var(--surface))",
                            border: `1px solid ${toast.type === "success" ? "hsl(var(--success))" : "hsl(var(--error))"}`,
                            padding: "1rem", borderRadius: "8px", color: "hsl(var(--text))", minWidth: "300px",
                            boxShadow: "var(--shadow-lg)",
                            animation: "slideIn 0.3s ease-out forwards",
                            borderLeft: `4px solid ${toast.type === "success" ? "hsl(var(--success))" : "hsl(var(--error))"}`
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <Bell size={16} color={toast.type === "success" ? "hsl(var(--success))" : "hsl(var(--error))"} />
                                <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700 }}>{toast.title}</h4>
                            </div>
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "hsl(var(--text-2))", lineHeight: 1.4, fontWeight: 500 }}>{toast.message}</p>
                        </div>
                    )}
                </main>
            </div>

            <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (min-width: 1024px) {
          .desktop-sidebar { display: block !important; }
          header button:first-child { display: none !important; }
        }
      `}</style>
        </div>
    );
}
