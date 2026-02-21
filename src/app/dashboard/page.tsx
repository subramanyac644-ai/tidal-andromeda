"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchPolls();
        }
    }, [status, router]);

    const fetchPolls = async () => {
        try {
            const res = await fetch("/api/polls");
            const data = await res.json();
            setPolls(data);
        } catch (err) {
            console.error("Failed to load polls", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (id: string) => {
        try {
            const res = await fetch(`/api/polls/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "toggleActive" }),
            });
            if (res.ok) {
                fetchPolls();
            }
        } catch (err) {
            console.error("Failed to toggle poll status", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this poll? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/polls/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchPolls();
            }
        } catch (err) {
            console.error("Failed to delete poll", err);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
                <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading dashboard...</p>
            </div>
        );
    }

    const isAdmin = session?.user?.role === "admin";

    // Admins see all polls to manage them, Users see only their own
    const displayedPolls = isAdmin
        ? polls
        : polls.filter((poll: any) => poll.creator._id === session?.user.id || poll.creator === session?.user.id || poll.creator.username === session?.user.name);

    return (
        <div className="container" style={{ padding: "60px 24px" }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div style={{ marginBottom: "24px" }}>
                    <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
                        <span>←</span> Back to Home
                    </Link>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Dashboard</h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                            {isAdmin ? "Admin tools: Manage all platform polls" : "Manage your created polls"}
                        </p>
                    </div>
                    <Link href="/polls/create" className="btn-primary" style={{ padding: "12px 24px" }}>
                        + Create New
                    </Link>
                </div>

                {!Array.isArray(displayedPolls) || displayedPolls.length === 0 ? (
                    <div className="glass-panel text-center" style={{ padding: "60px 0" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.5 }}>📝</div>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{isAdmin ? "No polls on the platform yet" : "You haven't created any polls yet"}</h3>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                            {isAdmin ? "Users haven't created any content yet." : "Start by creating your very first poll to gather opinions."}
                        </p>
                        {!isAdmin && (
                            <Link href="/polls/create" className="btn-primary">Create Your First Poll</Link>
                        )}
                    </div>
                ) : (
                    <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid var(--border-color)" }}>
                                    <th style={{ padding: "16px 24px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Poll Name</th>
                                    {isAdmin && (
                                        <th style={{ padding: "16px 24px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Creator</th>
                                    )}
                                    <th style={{ padding: "16px 24px", textAlign: "center", color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Status</th>
                                    <th style={{ padding: "16px 24px", textAlign: "center", color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Votes</th>
                                    <th style={{ padding: "16px 24px", textAlign: "right", color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedPolls.map((poll: any) => (
                                    <tr key={poll._id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: "20px 24px" }}>
                                            <Link href={`/polls/${poll._id}`} style={{ fontWeight: 600, display: "block", marginBottom: "4px" }}>
                                                {poll.title}
                                            </Link>
                                            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{new Date(poll.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        {isAdmin && (
                                            <td style={{ padding: "20px 24px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                                                {poll.creator.username}
                                            </td>
                                        )}
                                        <td style={{ padding: "20px 24px", textAlign: "center" }}>
                                            <span style={{
                                                display: "inline-block",
                                                padding: "4px 12px",
                                                borderRadius: "12px",
                                                fontSize: "0.8rem",
                                                fontWeight: 600,
                                                background: poll.active ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                                color: poll.active ? "var(--success)" : "var(--danger)"
                                            }}>
                                                {poll.active ? "Active" : "Closed"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "20px 24px", textAlign: "center", fontWeight: 600 }}>
                                            {poll.options.reduce((acc: number, opt: any) => acc + opt.votes, 0)}
                                        </td>
                                        <td style={{ padding: "20px 24px", textAlign: "right" }}>
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                                                {isAdmin && (
                                                    <>
                                                        <button onClick={() => handleToggleActive(poll._id)} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                                                            {poll.active ? "Close" : "Open"}
                                                        </button>
                                                        <button onClick={() => handleDelete(poll._id)} className="btn-danger" style={{ padding: "6px 12px", fontSize: "0.85rem", background: "rgba(239, 68, 68, 0.1)" }}>
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                                {!isAdmin && (
                                                    <Link href={`/polls/${poll._id}`} className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                                                        View Results
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
