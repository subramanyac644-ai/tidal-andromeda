"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PollDetails() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const [poll, setPoll] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [voting, setVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [totalVotes, setTotalVotes] = useState(0);

    useEffect(() => {
        fetchPoll();
    }, [params.id, session]);

    const fetchPoll = async () => {
        try {
            const res = await fetch(`/api/polls/${params.id}`);
            if (!res.ok) {
                setError("Poll not found");
                setLoading(false);
                return;
            }
            const data = await res.json();
            setPoll(data);

            const votes = data.options.reduce((acc: number, opt: any) => acc + opt.votes, 0);
            setTotalVotes(votes);

            if (session && data.voters.some((voterId: any) =>
                (voterId._id?.toString() || voterId.toString()) === session.user.id
            )) {
                setHasVoted(true);
            }
        } catch (err) {
            setError("Error loading poll");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        if (!selectedOption) return;
        if (!session) {
            router.push("/login");
            return;
        }

        setVoting(true);
        try {
            const res = await fetch(`/api/polls/${poll._id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ optionId: selectedOption }),
            });

            if (res.ok) {
                setHasVoted(true);
                fetchPoll();
            } else {
                const data = await res.json();
                setError(data.message || "Failed to vote");
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setVoting(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
            <div style={{ width: '40px', height: '40px', margin: '0 auto', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading poll details...</p>
        </div>
    );

    if (error || !poll) return (
        <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", color: "var(--danger)", marginBottom: "16px" }}>{error}</h1>
            <button onClick={() => router.push("/")} className="btn-secondary">Back to Home</button>
        </div>
    );

    const showResults = hasVoted || !poll.active;

    return (
        <div className="container" style={{ maxWidth: "800px", padding: "60px 24px" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: "24px" }}>
                    <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
                        <span>←</span> Back to Explore
                    </Link>
                </div>

                <div style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            {!poll.active && (
                                <span style={{ display: 'inline-block', marginBottom: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600 }}>This poll is closed</span>
                            )}
                            <h1 style={{ fontSize: "2.5rem", marginBottom: "8px", lineHeight: "1.2" }}>{poll.title}</h1>
                            {poll.description && (
                                <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "16px" }}>{poll.description}</p>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                                <span>By <strong style={{ color: "var(--text-primary)" }}>{poll.creator?.username || 'Unknown'}</strong></span>
                                <span>•</span>
                                <span>{new Date(poll.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div style={{ background: "rgba(124, 58, 237, 0.1)", padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(124, 58, 237, 0.2)", textAlign: "center" }}>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent-secondary)" }}>{totalVotes}</div>
                            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)" }}>Votes</div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--danger)", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px" }}>
                        {error}
                    </div>
                )}

                <div className="glass-panel" style={{ padding: "32px" }}>
                    {showResults ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <h3 style={{ fontSize: "1.5rem", marginBottom: "8px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>Results</h3>
                            {poll.options.sort((a: any, b: any) => b.votes - a.votes).map((option: any, index: number) => {
                                const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                                return (
                                    <motion.div
                                        key={option._id}
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "100%", opacity: 1 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        style={{ position: 'relative' }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "1.1rem" }}>
                                            <span>{option.text}</span>
                                            <span style={{ fontWeight: 600 }}>{percentage}% ({option.votes})</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {!hasVoted && poll.active && session?.user.role === 'admin' && (
                                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border-color)", textAlign: "center" }}>
                                    <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>You are viewing results as an admin without voting.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {poll.options.map((option: any) => (
                                <label
                                    key={option._id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                        padding: "20px",
                                        borderRadius: "12px",
                                        border: `2px solid ${selectedOption === option._id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                        background: selectedOption === option._id ? 'rgba(124, 58, 237, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                        cursor: "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedOption !== option._id) e.currentTarget.style.borderColor = "var(--text-secondary)";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedOption !== option._id) e.currentTarget.style.borderColor = "var(--border-color)";
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="poll-option"
                                        value={option._id}
                                        checked={selectedOption === option._id}
                                        onChange={() => setSelectedOption(option._id)}
                                        style={{ width: "20px", height: "20px", accentColor: "var(--accent-primary)" }}
                                    />
                                    <span style={{ fontSize: "1.1rem" }}>{option.text}</span>
                                </label>
                            ))}

                            <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                                <button
                                    onClick={handleVote}
                                    className="btn-primary"
                                    disabled={!selectedOption || voting}
                                    style={{ padding: "14px 40px", fontSize: "1.1rem" }}
                                >
                                    {voting ? "Submitting..." : "Vote"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
