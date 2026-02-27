"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toastVariants } from "@/lib/motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

/* ── Types ───────────────────────────────────────────────── */
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

/* ── Context ─────────────────────────────────────────────── */
const ToastContext = createContext<ToastContextType>({
    toasts: [],
    addToast: () => { },
    removeToast: () => { },
});

export function useToast() {
    return useContext(ToastContext);
}

/* ── Icons ───────────────────────────────────────────────── */
const toastIcons: Record<ToastType, ReactNode> = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <XCircle size={18} className="text-red-400" />,
    warning: <AlertTriangle size={18} className="text-yellow-400" />,
    info: <Info size={18} className="text-neon-blue" />,
};

const toastBorders: Record<ToastType, string> = {
    success: "rgba(34, 197, 94, 0.2)",
    error: "rgba(239, 68, 68, 0.2)",
    warning: "rgba(240, 185, 11, 0.2)",
    info: "rgba(0, 212, 255, 0.2)",
};

/* ── Provider ────────────────────────────────────────────── */
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(
        (toast: Omit<Toast, "id">) => {
            const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            const newToast: Toast = { ...toast, id };
            setToasts((prev) => [...prev.slice(-4), newToast]); // Max 5 toasts

            // Auto-dismiss
            const dismissTime = toast.duration ?? 4000;
            setTimeout(() => removeToast(id), dismissTime);
        },
        [removeToast]
    );

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            {/* Toast Container — bottom right */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            layout
                            variants={toastVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="pointer-events-auto min-w-[300px] max-w-[380px] rounded-xl p-4 flex items-start gap-3"
                            style={{
                                background: "rgba(20, 20, 30, 0.9)",
                                backdropFilter: "blur(16px)",
                                border: `1px solid ${toastBorders[toast.type]}`,
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            <div className="shrink-0 mt-0.5">{toastIcons[toast.type]}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white">
                                    {toast.title}
                                </p>
                                {toast.description && (
                                    <p className="text-xs text-[#8888a0] mt-0.5 leading-relaxed">
                                        {toast.description}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 text-[#6b6b80] hover:text-white transition p-0.5"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
