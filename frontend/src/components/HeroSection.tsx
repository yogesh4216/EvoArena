"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    Zap,
    Bot,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import {
    staggerContainer,
    depthItem,
    valueResolve,
    springs,
    TIMING,
    DELAYS,
} from "@/lib/motion";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { SkeletonCard } from "@/components/SkeletonLoader";

const ArenaScene = dynamic(() => import("./ArenaScene"), { ssr: false });

/* ── Stat card data ──────────────────────────────────────── */
const statConfigs = [
    {
        label: "TOTAL VALUE LOCKED",
        value: 2.47,
        decimals: 2,
        prefix: "$",
        suffix: "M",
        change: 12.4,
        icon: TrendingUp,
    },
    {
        label: "CURRENT POOL APY",
        value: 18.6,
        decimals: 1,
        prefix: "",
        suffix: "%",
        change: 3.2,
        icon: Zap,
    },
    {
        label: "ACTIVE AI AGENTS",
        value: 3,
        decimals: 0,
        prefix: "",
        suffix: "",
        change: 0,
        changeText: "Online",
        icon: Bot,
    },
];

/* ── Animated Stat Card ──────────────────────────────────── */
function StatCard({
    label,
    value,
    decimals,
    prefix,
    suffix,
    change,
    changeText,
    icon: Icon,
}: (typeof statConfigs)[0] & { changeText?: string }) {
    const { formatted, direction, resolved, flashKey } = useAnimatedNumber(
        value,
        { duration: 800, decimals, prefix, suffix }
    );

    return (
        <motion.div
            variants={depthItem}
            whileHover={{
                y: -3,
                scale: 1.01,
                boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
            }}
            transition={springs.snappy}
            className="group relative rounded-2xl p-5 cursor-default"
            style={{
                background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                    "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
        >
            <div className="flex items-center justify-between">
                {/* Left: Data */}
                <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-[#6b6b80] uppercase">
                        {label}
                    </span>
                    <div className="flex items-baseline gap-2.5">
                        {/* Value resolves from blur */}
                        <motion.span
                            key={flashKey}
                            variants={valueResolve}
                            initial="hidden"
                            animate="visible"
                            className="text-2xl sm:text-3xl font-bold inline-block transition-colors duration-500"
                            style={{
                                color: resolved ? "#ffffff" : "rgba(255,255,255,0.7)",
                            }}
                        >
                            {formatted}
                        </motion.span>

                        {/* Direction arrow with micro-motion */}
                        {changeText ? (
                            <span className="text-xs font-semibold text-green-400">
                                {changeText}
                            </span>
                        ) : change !== 0 ? (
                            <motion.span
                                key={`dir-${flashKey}`}
                                initial={{ opacity: 0, y: direction === "up" ? 4 : -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={springs.snappy}
                                className={`text-xs font-semibold flex items-center gap-0.5 ${change > 0 ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                {change > 0 ? (
                                    <ArrowUp size={10} />
                                ) : (
                                    <ArrowDown size={10} />
                                )}
                                {change > 0 ? "+" : ""}
                                {change}%
                            </motion.span>
                        ) : null}
                    </div>
                </div>

                {/* Right: Icon */}
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(240,185,11,0.12) 0%, rgba(240,185,11,0.04) 100%)",
                        border: "1px solid rgba(240,185,11,0.12)",
                    }}
                >
                    <Icon size={20} className="text-bnb-gold" />
                </div>
            </div>
        </motion.div>
    );
}

/* ── Hero Section ────────────────────────────────────────── */
export default function HeroSection() {
    const [booted, setBooted] = useState(false);

    // Simulates data loading / system boot
    useEffect(() => {
        const timer = setTimeout(() => setBooted(true), 700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative min-h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
            {/* Starfield Background */}
            <div className="absolute inset-x-0 top-16 bottom-0 z-0">
                <div
                    className="absolute inset-x-0 top-16 bottom-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 60% at 70% 30%, rgba(30, 25, 50, 0.9) 0%, rgba(3, 3, 5, 1) 70%)",
                    }}
                />
                <div
                    className="absolute top-[5%] right-[5%] w-[55%] h-[80%]"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(240,185,11,0.06) 0%, rgba(240,185,11,0.02) 40%, transparent 70%)",
                    }}
                />
                <div
                    className="absolute top-[20%] right-[15%] w-[40%] h-[50%]"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(0,140,255,0.04) 0%, transparent 60%)",
                    }}
                />
                <div className="stars-layer absolute inset-x-0 top-16 bottom-0" />
            </div>

            {/* Main Content */}
            <div className="relative z-[2] flex-1 flex items-center max-w-7xl mx-auto w-full px-6 sm:px-8 pt-24 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-center">
                    {/* Left Column — Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -16, filter: "blur(4px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{
                            ...springs.gentle,
                            opacity: { duration: TIMING.normal },
                            filter: { duration: TIMING.slow },
                        }}
                        className="space-y-5"
                    >
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
                            <span className="text-white">The Arena</span>
                        </h1>
                        <p className="text-base sm:text-lg text-[#7a7a92] max-w-md leading-relaxed">
                            AI-driven adaptive liquidity protocol on BNB Chain
                        </p>
                    </motion.div>

                    {/* Right Column — 3D Orb */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.88, filter: "blur(6px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{
                            ...springs.settle,
                            opacity: { duration: TIMING.slow, delay: 0.1 },
                            filter: { duration: TIMING.slow, delay: 0.15 },
                        }}
                        className="relative h-[360px] sm:h-[420px] lg:h-[480px]"
                    >
                        <Suspense
                            fallback={
                                <div className="w-full h-full flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-14 h-14 rounded-full border-2 border-bnb-gold/40 border-t-transparent"
                                    />
                                </div>
                            }
                        >
                            <ArenaScene />
                        </Suspense>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Stat Cards — Z-depth assembly */}
            <div className="relative z-[2] max-w-7xl mx-auto w-full px-6 sm:px-8 pb-10">
                <AnimatePresence mode="wait">
                    {!booted ? (
                        <motion.div
                            key="skeleton"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, filter: "blur(3px)" }}
                            transition={{ duration: TIMING.fast }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                        >
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            variants={staggerContainer(DELAYS.stagger, 0)}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                        >
                            {statConfigs.map((stat) => (
                                <StatCard key={stat.label} {...stat} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
