"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link href="/" className="brand">
                    <motion.div
                        initial={{ rotate: -10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        ✧
                    </motion.div>
                    Nova<span>Polls</span>
                </Link>

                <div className="nav-links">
                    {session ? (
                        <>
                            <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>
                                Dashboard
                            </Link>
                            <Link href="/polls/create" className={`nav-link ${pathname === '/polls/create' ? 'active' : ''}`}>
                                Create Poll
                            </Link>
                            <div className="flex items-center gap-4 ml-4">
                                <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                                    {session.user?.name}
                                    {session.user?.role === "admin" && (
                                        <span style={{ marginLeft: '4px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>(Admin)</span>
                                    )}
                                </span>
                                <button onClick={() => signOut()} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="nav-link">Login</Link>
                            <Link href="/register" className="btn-primary" style={{ padding: "8px 20px" }}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
