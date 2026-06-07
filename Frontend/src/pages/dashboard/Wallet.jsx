"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Wallet, ArrowUpRight, ArrowDownRight, Zap, Globe, RefreshCw, ExternalLink, CreditCard, ShieldCheck } from "lucide-react";

export default function WalletPage() {
    const user = useAuthStore((s) => s.user);
    const fundWallet = useAuthStore((s) => s.fundWallet);
    const withdrawWallet = useAuthStore((s) => s.withdrawWallet);
    const fetchKoraBalance = useAuthStore((s) => s.fetchKoraBalance);
    const generateVirtualWallet = useAuthStore((s) => s.generateVirtualWallet);

    const [koraData, setKoraData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [amount, setAmount] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [pin, setPin] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const isFreelancer = user?.role === "freelancer";
    const currency = user?.currency || (isFreelancer ? "NGN" : "USD");

    const loadData = async () => {
        setRefreshing(true);
        try {
            const data = await fetchKoraBalance();
            setKoraData(data);
        } catch (e) {}
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => { loadData(); }, []);

    const handleGenerateVBA = async () => {
        setActionLoading(true);
        setMsg(null);
        try {
            await generateVirtualWallet();
            await loadData();
            setMsg({ ok: true, text: "Virtual account generated successfully." });
        } catch (err) {
            setMsg({ ok: false, text: err.message });
        }
        setActionLoading(false);
    };

    const handleAction = async (type) => {
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) return;
        
        if (type === "fund" && (!cardNumber || !expiry || !cvv || !pin)) {
            setMsg({ ok: false, text: "Please provide complete card details (Number, Expiry, CVV, PIN) for funding." });
            return;
        }

        setActionLoading(true);
        setMsg(null);
        
        try {
            let res;
            if (type === "fund") {
                res = await fundWallet(amt, { cardNumber, expiry, cvv, pin });
            } else {
                res = await withdrawWallet(amt);
            }

            setMsg({ ok: true, text: `${formatCurrency(amt, currency)} ${type === "fund" ? 'added to' : 'withdrawn from'} your wallet` });
            setAmount("");
            if (type === "fund") {
                setCardNumber("");
                setExpiry("");
                setCvv("");
                setPin("");
            }
            await loadData();
        } catch (err) {
            setMsg({ ok: false, text: err.message });
        }
        setActionLoading(false);
    };

    const balance = user?.balance || 0;
    const transactions = koraData?.transactions || [];
    const virtualAccount = koraData?.virtualAccount || user?.virtual_account_number || null;

    return (
        <div style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div>
                    <h1 className="font-heading" style={{ fontSize: "1.5rem", fontWeight: 800, color: "hsl(var(--text))" }}>Kora Wallet</h1>
                    <p style={{ color: "hsl(var(--text-2))", fontSize: "0.875rem", marginTop: 4, fontWeight: 500 }}>
                        Powered by Kora · Sandbox Environment
                    </p>
                </div>
                <button onClick={loadData} className="btn btn-ghost btn-sm" style={{ gap: "0.4rem" }} disabled={refreshing}>
                    <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }}/> Refresh
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    {/* Balance Card */}
                    <div className="card" style={{
                        background: "hsl(var(--surface))",
                        boxShadow: "var(--shadow)",
                        border: "1px solid hsl(var(--border))",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <Wallet size={16} color="hsl(var(--primary))"/>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "hsl(var(--text-2))" }}>Available Balance</span>
                                    <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.12)", border: "1px solid hsl(var(--primary) / 0.25)", padding: "0.1rem 0.35rem", borderRadius: 4, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }}/>
                                        Kora Sandbox
                                    </span>
                                </div>
                                <div className="font-heading" style={{ fontSize: "3rem", fontWeight: 800, color: "hsl(var(--text))", letterSpacing: "-0.04em", lineHeight: 1 }}>
                                    {formatCurrency(balance, currency)}
                                </div>
                                {virtualAccount ? (
                                    <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", background: "hsl(var(--surface-4))", padding: "0.3rem 0.75rem", borderRadius: 99, width: "fit-content" }}>
                                        <ShieldCheck size={12} color="hsl(var(--primary))"/>
                                        <span style={{ fontSize: "0.72rem", color: "hsl(var(--text-2))", fontFamily: "monospace", fontWeight: 600 }}>
                                            VBA: {virtualAccount}
                                        </span>
                                    </div>
                                ) : (
                                    <button onClick={handleGenerateVBA} disabled={actionLoading} className="btn btn-sm btn-outline" style={{ marginTop: "0.75rem", fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}>
                                        Generate Virtual Account
                                    </button>
                                )}
                            </div>

                            {/* Manual Funding Controls with Card Input */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 240, background: "hsl(var(--surface-3))", padding: "1rem", borderRadius: 12, border: "1px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
                                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "hsl(var(--text))", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                    <CreditCard size={14} color="hsl(var(--primary))"/> Add Funds (Card)
                                </div>
                                <input 
                                    type="number" 
                                    placeholder={`Amount (${currency})`} 
                                    value={amount} 
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="input input-sm"
                                    style={{ width: "100%", marginBottom: 4 }}
                                />
                                <div style={{ display: "flex", gap: "0.5rem", marginBottom: 4 }}>
                                    <input 
                                        type="text" 
                                        placeholder="Card Number" 
                                        value={cardNumber} 
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="input input-sm"
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <input 
                                        type="text" 
                                        placeholder="MM/YY" 
                                        value={expiry} 
                                        onChange={(e) => setExpiry(e.target.value)}
                                        className="input input-sm"
                                        style={{ flex: 1 }}
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="CVV" 
                                        value={cvv} 
                                        onChange={(e) => setCvv(e.target.value)}
                                        className="input input-sm"
                                        style={{ flex: 1 }}
                                        maxLength={4}
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="PIN" 
                                        value={pin} 
                                        onChange={(e) => setPin(e.target.value)}
                                        className="input input-sm"
                                        style={{ flex: 1 }}
                                        maxLength={4}
                                    />
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                                    <button 
                                        onClick={() => handleAction("fund")}
                                        disabled={actionLoading || !amount || !cardNumber || !expiry || !cvv || !pin}
                                        className="btn btn-primary btn-sm"
                                        style={{ flex: 1 }}
                                    >
                                        {actionLoading ? "..." : "Charge Card"}
                                    </button>
                                    <button 
                                        onClick={() => handleAction("withdraw")}
                                        disabled={actionLoading || !amount || balance < parseFloat(amount)}
                                        className="btn btn-outline btn-sm"
                                        style={{ flex: 1 }}
                                    >
                                        Withdraw
                                    </button>
                                </div>
                                {msg && (
                                    <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: msg.ok ? "hsl(145 65% 50%)" : "hsl(0 84% 60%)" }}>
                                        {msg.text}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transactions */}
                    <div className="card" style={{ background: "hsl(var(--surface))", boxShadow: "var(--shadow-sm)" }}>
                        <h2 className="font-heading" style={{ fontSize: "1.1rem", fontWeight: 800, color: "hsl(var(--text))", marginBottom: "1.25rem" }}>
                            Transaction History
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {loading && <p style={{ color: "hsl(var(--text-3))", fontSize: "0.85rem", textAlign: "center", padding: "2rem 0", fontWeight: 500 }}>Loading…</p>}
                            {!loading && transactions.length === 0 && (
                                <p style={{ color: "hsl(var(--text-3))", fontSize: "0.85rem", textAlign: "center", padding: "2rem 0", fontWeight: 500 }}>
                                    No transactions yet. Fund your wallet or complete a milestone to see activity here.
                                </p>
                            )}
                            {transactions.map((tx, i) => {
                                const isIncoming = tx.to_user_id === user?.id;
                                return (
                                    <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 0", borderBottom: i < transactions.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: isIncoming ? "hsl(var(--success) / 0.15)" : "hsl(var(--surface-4))" }}>
                                            {isIncoming ? <ArrowDownRight size={17} color="hsl(var(--success))"/> : <ArrowUpRight size={17} color="hsl(var(--text-2))"/>}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "hsl(var(--text))", marginBottom: 2 }}>
                                                {tx.description || (tx.type || '').replace(/_/g, " ")}
                                            </div>
                                            <div style={{ fontSize: "0.73rem", color: "hsl(var(--text-3))", fontWeight: 500 }}>
                                                {isIncoming ? `Deposit` : `Withdrawal`} · {formatDate(tx.created_at)}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div className="font-heading" style={{ fontSize: "0.95rem", fontWeight: 800, color: isIncoming ? "hsl(var(--success))" : "hsl(var(--text))" }}>
                                                {isIncoming ? "+" : "-"}{formatCurrency(tx.amount, currency)}
                                            </div>
                                            <div style={{ fontSize: "0.65rem", color: "hsl(var(--primary))", fontFamily: "monospace", fontWeight: 600 }}>
                                                {(tx.id || '').slice(0, 12)}…
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                    {/* Kora Wallet Info */}
                    <div className="card" style={{ background: "hsl(var(--surface))", boxShadow: "var(--shadow-sm)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                            <Globe size={15} color="hsl(var(--primary))"/>
                            <h3 className="font-heading" style={{ fontSize: "0.95rem", color: "hsl(var(--text))", fontWeight: 800 }}>Kora Architecture</h3>
                        </div>
                        {[
                            { label: "Network", value: "Kora Sandbox" },
                            { label: "Asset", value: currency },
                            { label: "Status", value: "Connected" },
                            { label: "Mode", value: "Virtual Accounts" },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.45rem 0", borderTop: "1px solid hsl(var(--border))" }}>
                                <span style={{ fontSize: "0.75rem", color: "hsl(var(--text-3))", fontWeight: 500 }}>{label}</span>
                                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "hsl(var(--primary))" }}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
