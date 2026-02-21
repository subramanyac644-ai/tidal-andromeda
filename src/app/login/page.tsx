"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            redirect: false,
            username,
            password,
        });

        if (res?.error) {
            setError("Invalid username or password");
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 80px)", padding: "40px 24px" }}>
            <motion.div
                className="glass-panel"
                style={{ width: "100%", maxWidth: "440px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ position: "relative", marginBottom: "32px", textAlign: "center" }}>
                    <button
                        onClick={() => router.push("/")}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                        }}
                    >
                        ← Back
                    </button>
                    <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>Welcome Back</h1>
                    <p style={{ color: "var(--text-secondary)" }}>Sign in to continue to NovaPolls</p>
                </div>

                {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--danger)", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", fontSize: "0.9rem" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} autoComplete="off">
                    {/* Hidden dummy fields to absorb aggressive browser autofill */}
                    <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', opacity: 0 }}>
                        <input type="text" name="fakeusernameremembered" tabIndex={-1} aria-hidden="true" autoComplete="username" />
                        <input type="password" name="fakepasswordremembered" tabIndex={-1} aria-hidden="true" autoComplete="current-password" />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="poll_user_identifier">Username</label>
                        <input
                            id="poll_user_identifier"
                            name="poll_user_identifier"
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="poll_secure_key">Password</label>
                        <input
                            id="poll_secure_key"
                            name="poll_secure_key"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                        <button
                            type="button"
                            onClick={() => {
                                setUsername("admin@poll.com");
                                setPassword("admin123");
                            }}
                            className="form-input"
                            style={{
                                background: username === "admin@poll.com" ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                borderColor: username === "admin@poll.com" ? 'var(--accent-primary)' : 'var(--border-color)',
                                color: "#fff",
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            Admin Login
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setUsername("");
                                setPassword("");
                            }}
                            className="form-input"
                            style={{
                                background: username !== "admin@poll.com" ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                borderColor: username !== "admin@poll.com" ? 'var(--accent-primary)' : 'var(--border-color)',
                                color: "#fff",
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        >
                            User Login
                        </button>
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={loading} style={{ justifyContent: "center", padding: "14px" }}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "24px", fontSize: "0.95rem" }}>
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        style={{
                            color: "var(--accent-primary)",
                            fontWeight: 700,
                            textDecoration: "underline",
                            textUnderlineOffset: "4px"
                        }}
                    >
                        Create an account
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
