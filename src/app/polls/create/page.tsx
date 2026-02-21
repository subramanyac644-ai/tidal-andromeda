"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function CreatePoll() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length >= 10) return;
        setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const validOptions = options.filter(opt => opt.trim() !== "");
        if (validOptions.length < 2) {
            setError("Please provide at least 2 valid options.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/polls", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, options: validOptions }),
            });

            if (res.ok) {
                const data = await res.json();
                router.push(`/polls/${data.poll._id}`);
            } else {
                const data = await res.json();
                setError(data.message || "Failed to create poll");
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") {
        return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ maxWidth: "800px", padding: "60px 24px" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Create New Poll</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Design your poll and share it with the world.</p>
                </div>

                {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--danger)", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px" }}>
                        {error}
                    </div>
                )}

                <div className="glass-panel">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="title" style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>Poll Question</label>
                            <input
                                id="title"
                                type="text"
                                className="form-input"
                                style={{ fontSize: "1.2rem", padding: "16px" }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., What is your favorite programming language?"
                                required
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="description">Description (Optional)</label>
                            <textarea
                                id="description"
                                className="form-input"
                                style={{ minHeight: "100px", resize: "vertical" }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide more context about your poll..."
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label" style={{ fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "16px" }}>Options</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {options.map((option, index) => (
                                    <motion.div
                                        key={index}
                                        style={{ display: "flex", gap: "12px" }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            required={index < 2}
                                        />
                                        {options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                className="btn-danger"
                                                style={{ padding: "0 16px", flexShrink: 0 }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {options.length < 10 && (
                                <button
                                    type="button"
                                    onClick={addOption}
                                    style={{ marginTop: "16px", background: "transparent", border: "1px dashed var(--border-color)", color: "var(--text-secondary)", width: "100%", padding: "12px", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "var(--accent-primary)";
                                        e.currentTarget.style.color = "var(--accent-primary)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "var(--border-color)";
                                        e.currentTarget.style.color = "var(--text-secondary)";
                                    }}
                                >
                                    + Add another option
                                </button>
                            )}
                        </div>

                        <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                            <button type="button" onClick={() => router.back()} className="btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: "12px 32px" }}>
                                {loading ? "Creating..." : "Publish Poll"}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
