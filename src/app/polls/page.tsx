"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ExplorePolls() {
    const { status } = useSession();
    const router = useRouter();

    const [polls, setPolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchActivePolls();
        }
    }, [status, router]);

    const fetchActivePolls = async () => {
        try {
            // Fetch all polls, we will filter for active ones visually
            const res = await fetch("/api/polls");
            const data = await res.json();
            // Only show active polls to general users exploring
            setPolls(data.filter((p: any) => p.active));
        } catch (err) {
            console.error("Failed to load polls", err);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
                <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading polls...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: "60px 24px", maxWidth: "1200px" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div style={{ marginBottom: "24px" }}>
                    <Link href="/dashboard" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
                        <span>←</span> Back to Dashboard
                    </Link>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Explore Polls</h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
                            Discover and vote on active community polls
                        </p>
                    </div>
                </div>

                {polls.length === 0 ? (
                    <div className="glass-panel text-center" style={{ padding: "60px 0" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.5 }}>🔍</div>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>No active polls found</h3>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                            There are currently no active polls to vote on. Check back later or create one!
                        </p>
                        <Link href="/polls/create" className="btn-primary">Create a Poll</Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
                        {polls.map((poll: any) => (
                            <Link href={`/polls/${poll._id}`} key={poll._id} style={{ display: "block", textDecoration: "none" }}>
                                <motion.div
                                    className="glass-panel"
                                    style={{ padding: "24px", height: "100%", display: "flex", flexDirection: "column" }}
                                    whileHover={{ y: -4, borderColor: "var(--accent-primary)", boxShadow: "0 10px 30px -10px rgba(124, 58, 237, 0.2)" }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h3 style={{ fontSize: "1.25rem", marginBottom: "8px", color: "#fff" }}>{poll.title}</h3>

                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                            By {poll.creator?.username || 'Unknown'}
                                        </span>
                                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--border-color)" }}></span>
                                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                            {new Date(poll.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {poll.description && (
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "24px", flexGrow: 1, WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", display: "-webkit-box" }}>
                                            {poll.description}
                                        </p>
                                    )}

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                                        <span style={{ fontSize: "0.9rem", color: "var(--accent-primary)", fontWeight: 500 }}>
                                            {poll.options.reduce((acc: number, opt: any) => acc + opt.votes, 0)} Votes
                                        </span>
                                        <span className="btn-primary" style={{ padding: "6px 16px", fontSize: "0.85rem" }}>
                                            Vote Now
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
