"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div style={{ width: '40px', height: '40px' }}></div>;

    return (
        <motion.button
            onClick={toggleTheme}
            className="theme-toggle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-primary)",
                fontSize: "1.2rem",
                cursor: "pointer",
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === "light" ? <FiMoon /> : <FiSun />}
        </motion.button>
    );
}
