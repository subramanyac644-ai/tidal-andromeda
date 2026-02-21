"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/polls")
      .then((res) => res.json())
      .then((data) => {
        setPolls(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <section className="container" style={{ textAlign: "center", padding: "80px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '16px', fontSize: '0.9rem' }}>
            Elevate Your Polling Experience
          </div>
          <h1 style={{ fontSize: "4rem", lineHeight: "1.1", marginBottom: "24px", maxWidth: "800px", margin: "0 auto", background: "linear-gradient(to right, #ffffff, #a0a0a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            The Web's Most Beautiful Polling Platform
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.25rem", maxWidth: "600px", margin: "24px auto 40px" }}>
            Create stunning, interactive polls in seconds. Gather insights with style and experience unparalleled user engagement.
          </p>
          <div className="flex items-center gap-4" style={{ justifyContent: "center" }}>
            <Link href="/register" className="btn-primary" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
              Get Started Now
            </Link>
            <Link href="/login" className="btn-secondary" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="container" style={{ paddingBottom: "100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Explore Community Polls</h2>
          <Link href="/polls/create" className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>
            + Create New
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center gap-2" style={{ justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: '24px', height: '24px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <span style={{ color: "var(--text-secondary)" }}>Loading polls...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gap: "24px" }}>
            {!Array.isArray(polls) || polls.length === 0 ? (
              <div className="glass-panel text-center w-full" style={{ gridColumn: "1 / -1", padding: "60px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.5 }}>📊</div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>No polls found</h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>Be the first to create an amazing poll.</p>
                <Link href="/polls/create" className="btn-primary">Create Poll</Link>
              </div>
            ) : (
              polls.map((poll: any, index: number) => (
                <motion.div
                  key={poll._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/polls/${poll._id}`}>
                    <div className="poll-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      {!poll.active && (
                        <span style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Closed</span>
                      )}
                      <h3 style={{ fontSize: "1.25rem", marginBottom: "8px", paddingRight: "40px" }}>{poll.title}</h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px", flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {poll.description || "No description provided."}
                      </p>

                      <div className="flex items-center justify-between" style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                        <div className="flex items-center gap-2">
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {poll.creator?.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            {poll.creator?.username || 'Community'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent-secondary)', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600 }}>
                          <span>📊</span>
                          <span>{poll.options.reduce((acc: number, opt: any) => acc + opt.votes, 0)} v</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        )}
      </section>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
