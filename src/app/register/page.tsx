"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, role }),
            });

            if (res.ok) {
                router.push("/login");
            } else {
                const data = await res.json();
                setError(data.message || "Something went wrong");
                setLoading(false);
            }
        } catch (error) {
            setError("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 80px)", padding: "40px 24px" }}>
            <motion.div
                className="glass-panel"
                style={{ width: "100%", maxWidth: "440px", margin: "0 auto" }}
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
                    <h1 style={{ fontSize: "2rem", marginBottom: "8px" }}>Join NovaPolls</h1>
                    <p style={{ color: "var(--text-secondary)" }}>Create your account to start polling</p>
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
                        <input type="password" name="fakepasswordremembered" tabIndex={-1} aria-hidden="true" autoComplete="new-password" />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="poll_reg_user_identifier">Username</label>
                        <input
                            id="poll_reg_user_identifier"
                            name="poll_reg_user_identifier"
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="poll_reg_secure_key">Password</label>
                        <input
                            id="poll_reg_secure_key"
                            name="poll_reg_secure_key"
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Role selection removed - standard users only */}


                    <button type="submit" className="btn-primary w-full" disabled={loading} style={{ justifyContent: "center", padding: "14px" }}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p style={{ textAlign: "center", color: "var(--text-secondary)", marginTop: "24px", fontSize: "0.9rem" }}>
                    Already have an account? <Link href="/login" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Sign in</Link>
                </p>
            </motion.div>
        </div >
    );
}
