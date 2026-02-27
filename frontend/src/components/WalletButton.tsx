"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Wallet, Check, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/components/Toast";
import { shake, springs, TIMING } from "@/lib/motion";

export function WalletButton() {
  const { address, connected, connecting, connect, disconnect } = useWallet();
  const { addToast } = useToast();
  const [showCheck, setShowCheck] = useState(false);
  const [shakeState, setShakeState] = useState<"idle" | "shake">("idle");
  const [wasConnected, setWasConnected] = useState(false);
  const [ripple, setRipple] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Magnetic hover —  spring-based cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * 0.12;
    const dy = (e.clientY - centerY) * 0.12;
    mouseX.set(dx);
    mouseY.set(dy);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Success animation
  useEffect(() => {
    if (connected && !wasConnected) {
      setShowCheck(true);
      setRipple(true);
      addToast({
        type: "success",
        title: "Wallet Connected",
        description: address
          ? `${address.slice(0, 6)}…${address.slice(-4)}`
          : undefined,
      });
      setTimeout(() => setShowCheck(false), 1800);
      setTimeout(() => setRipple(false), 600);
    }
    setWasConnected(connected);
  }, [connected]);

  const handleConnect = async () => {
    try {
      setRipple(true);
      setTimeout(() => setRipple(false), 400);
      await connect();
    } catch {
      setShakeState("shake");
      addToast({
        type: "error",
        title: "Connection Failed",
        description: "Please check your wallet and try again",
      });
      setTimeout(() => setShakeState("idle"), 500);
    }
  };

  /* ── Connecting: pulsing spinner ─────────────────────────── */
  if (connecting) {
    return (
      <motion.button
        disabled
        animate={{ opacity: [1, 0.6, 1], scale: [1, 0.99, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center gap-2 px-4 h-[34px] rounded-full text-[13px] cursor-not-allowed min-w-[140px] whitespace-nowrap"
        style={{
          background: "rgba(240, 185, 11, 0.06)",
          border: "1px solid rgba(240, 185, 11, 0.15)",
          color: "#f0b90b",
        }}
      >
        <Loader2 size={14} className="animate-spin" />
        Connecting…
      </motion.button>
    );
  }

  /* ── Connected: morphed state ────────────────────────────── */
  if (connected && address) {
    return (
      <motion.div
        layout={false}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springs.smooth}
        className="flex items-center gap-2 h-[34px]"
      >
        <AnimatePresence mode="wait">
          {showCheck ? (
            <motion.div
              layout={false}
              key="check"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springs.snappy}
              className="flex items-center justify-center gap-2 px-4 h-full rounded-full min-w-[130px] whitespace-nowrap"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
                boxShadow: "0 0 16px rgba(34,197,94,0.1)",
              }}
            >
              <Check size={14} className="text-green-400" />
              <span className="text-[13px] font-medium text-green-400">
                Connected
              </span>
            </motion.div>
          ) : (
            <motion.div
              layout={false}
              key="address"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={springs.smooth}
              className="flex items-center justify-center gap-2 px-4 h-full rounded-full min-w-[130px] whitespace-nowrap"
              style={{
                background: "rgba(34, 197, 94, 0.06)",
                border: "1px solid rgba(34, 197, 94, 0.15)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-[13px] font-mono text-green-400 font-medium tracking-tight">
                {address.slice(0, 6)}…{address.slice(-4)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          layout={false}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={springs.snappy}
          onClick={() => {
            disconnect();
            addToast({ type: "info", title: "Wallet Disconnected" });
          }}
          className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
          style={{ border: "1px solid rgba(239, 68, 68, 0.12)" }}
        >
          ✕
        </motion.button>
      </motion.div>
    );
  }

  /* ── Default: Connect button (physical object) ───────────── */
  return (
    <motion.button
      layout={false}
      ref={buttonRef}
      variants={shake}
      animate={shakeState}
      initial={false}
      style={{
        background: shakeState === "shake" ? "rgba(239, 68, 68, 0.1)" : "rgba(240, 185, 11, 0.08)",
        border: shakeState === "shake" ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(240, 185, 11, 0.3)",
        color: shakeState === "shake" ? "#ef4444" : "#F0B90B",
        willChange: "transform",
      }}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(240,185,11,0.15)" }}
      whileTap={{ scale: 0.96 }}
      transition={springs.snappy}
      onClick={handleConnect}
      className="relative flex items-center justify-center gap-2 px-4 h-[34px] rounded-full text-[13px] font-semibold cursor-pointer overflow-hidden origin-right shrink-0 min-w-[140px] whitespace-nowrap"
    >
      {/* Energy ripple */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            layout={false}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-[#f0b90b]/20 pointer-events-none"
          />
        )}
      </AnimatePresence>
      <Wallet size={14} className="shrink-0" />
      <span>Connect Wallet</span>
    </motion.button>
  );
}
