"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    FileSpreadsheet,
    Mail,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    ArrowRight,
    BarChart3,
    Send,
    Brain,
} from "lucide-react";

/* ─── Types ─── */
type UIState =
    | "idle"
    | "uploading"
    | "analyzing"
    | "sending"
    | "success"
    | "error";

interface AnalysisResult {
    status: string;
    summary: string;
}

/* ─── Constants ─── */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [email, setEmail] = useState("");
    const [state, setState] = useState<UIState>("idle");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    /* ── file helpers ── */
    const validateFile = useCallback((f: File): string | null => {
        if (!f.name.match(/\.(csv|xlsx)$/i))
            return "Only .csv and .xlsx files are accepted.";
        if (f.size > MAX_FILE_SIZE) return "File exceeds 5 MB limit.";
        if (f.size === 0) return "File is empty.";
        return null;
    }, []);

    const handleFile = useCallback(
        (f: File) => {
            const err = validateFile(f);
            if (err) {
                setError(err);
                setState("error");
                return;
            }
            setFile(f);
            setError("");
            setState("idle");
        },
        [validateFile]
    );

    /* ── drag & drop ── */
    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);
    const onDragLeave = useCallback(() => setDragOver(false), []);
    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
        },
        [handleFile]
    );

    /* ── submit ── */
    const handleSubmit = async () => {
        if (!file || !email) return;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            setState("error");
            return;
        }

        try {
            setState("uploading");
            const formData = new FormData();
            formData.append("file", file);
            formData.append("email", email);

            // Simulate a brief pause so users see upload state
            await new Promise((r) => setTimeout(r, 600));
            setState("analyzing");

            const res = await fetch(`${API_URL}/analyze`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({ detail: "Unknown error" }));
                throw new Error(body.detail || `Server error ${res.status}`);
            }

            setState("sending");
            await new Promise((r) => setTimeout(r, 500));

            const data: AnalysisResult = await res.json();
            setResult(data);
            setState("success");
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            setState("error");
        }
    };

    /* ── reset ── */
    const reset = () => {
        setFile(null);
        setEmail("");
        setState("idle");
        setResult(null);
        setError("");
    };

    /* ── file size display ── */
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    /* ── step indicator ── */
    const steps = [
        { key: "uploading", label: "Uploading", icon: Upload },
        { key: "analyzing", label: "AI Analysis", icon: Brain },
        { key: "sending", label: "Emailing", icon: Send },
        { key: "success", label: "Complete", icon: CheckCircle2 },
    ];

    const activeIndex = steps.findIndex((s) => s.key === state);

    /* ━━━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━━━ */
    return (
        <div className="relative z-10 w-full max-w-2xl mx-auto">
            {/* ── PROGRESS STEPS ── */}
            <AnimatePresence>
                {["uploading", "analyzing", "sending", "success"].includes(state) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between">
                            {steps.map((step, i) => {
                                const Icon = step.icon;
                                const isActive = i === activeIndex;
                                const isDone = i < activeIndex;
                                return (
                                    <React.Fragment key={step.key}>
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${isActive
                                                        ? "border-brand-400 bg-brand-500/20 text-brand-400 scale-110"
                                                        : isDone
                                                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                                                            : "border-slate-700 bg-slate-800/50 text-slate-500"
                                                    }`}
                                            >
                                                {isDone ? (
                                                    <CheckCircle2 className="h-5 w-5" />
                                                ) : isActive ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <Icon className="h-5 w-5" />
                                                )}
                                            </div>
                                            <span
                                                className={`text-[11px] font-medium transition-colors ${isActive
                                                        ? "text-brand-400"
                                                        : isDone
                                                            ? "text-emerald-400"
                                                            : "text-slate-600"
                                                    }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className="flex-1 mx-2 mb-6">
                                                <div className="h-[2px] rounded-full bg-slate-800 overflow-hidden">
                                                    <motion.div
                                                        className={`h-full rounded-full ${isDone ? "bg-emerald-500" : isActive ? "bg-brand-400" : ""
                                                            }`}
                                                        initial={{ width: "0%" }}
                                                        animate={{
                                                            width: isDone ? "100%" : isActive ? "50%" : "0%",
                                                        }}
                                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── MAIN CARD ── */}
            <motion.div
                layout
                className="glass rounded-3xl p-8 glow-indigo"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <AnimatePresence mode="wait">
                    {/* ═════════ SUCCESS STATE ═════════ */}
                    {state === "success" && result ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* header */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Analysis Complete
                                    </h2>
                                    <p className="text-sm text-slate-400">
                                        Summary sent to{" "}
                                        <span className="text-brand-400">{email}</span>
                                    </p>
                                </div>
                            </div>

                            {/* summary */}
                            <div className="glass-card rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="h-4 w-4 text-brand-400" />
                                    <h3 className="text-sm font-semibold text-brand-300 uppercase tracking-widest">
                                        Executive Summary
                                    </h3>
                                </div>
                                <div className="summary-content whitespace-pre-wrap">
                                    {result.summary}
                                </div>
                            </div>

                            {/* reset */}
                            <button
                                onClick={reset}
                                className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80
                           py-3 text-sm font-medium text-slate-300
                           hover:bg-slate-700/80 hover:text-white
                           transition-all duration-300"
                            >
                                Analyze Another Dataset
                            </button>
                        </motion.div>
                    ) : (
                        /* ═════════ FORM / PROCESSING STATE ═════════ */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* ── FILE DROP ZONE ── */}
                            <div
                                className={`drop-zone cursor-pointer p-8 text-center ${dragOver ? "drag-over border-brand-400/60" : ""
                                    } ${file ? "border-brand-500/30 bg-brand-500/5" : "bg-slate-900/30"}`}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                onClick={() => inputRef.current?.click()}
                            >
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept=".csv,.xlsx"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleFile(f);
                                    }}
                                />

                                {file ? (
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20">
                                            <FileSpreadsheet className="h-6 w-6 text-brand-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-white truncate max-w-[280px]">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {formatSize(file.size)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="ml-auto flex h-8 w-8 items-center justify-center
                                 rounded-lg bg-slate-800 text-slate-400
                                 hover:bg-red-500/20 hover:text-red-400
                                 transition-all"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <motion.div
                                            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20"
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <Upload className="h-7 w-7 text-brand-400" />
                                        </motion.div>
                                        <p className="text-sm font-medium text-slate-300">
                                            Drop your sales dataset here or{" "}
                                            <span className="text-brand-400 underline decoration-brand-400/30 underline-offset-2">
                                                browse files
                                            </span>
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Supports CSV and XLSX • Max 5 MB
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* ── EMAIL INPUT ── */}
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="recipient@company.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (state === "error") {
                                            setError("");
                                            setState("idle");
                                        }
                                    }}
                                    disabled={
                                        state !== "idle" && state !== "error"
                                    }
                                    className="w-full rounded-xl border border-slate-700/60 bg-slate-900/50
                             py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500
                             focus:border-brand-500/60 focus:outline-none focus:ring-2
                             focus:ring-brand-500/20 transition-all duration-300
                             disabled:opacity-50"
                                />
                            </div>

                            {/* ── ERROR ── */}
                            <AnimatePresence>
                                {state === "error" && error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-start gap-3 rounded-xl border border-red-500/20
                               bg-red-500/5 p-4"
                                    >
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                                        <p className="text-sm text-red-300">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── SUBMIT BUTTON ── */}
                            <button
                                onClick={handleSubmit}
                                disabled={
                                    !file ||
                                    !email ||
                                    !["idle", "error"].includes(state)
                                }
                                className="group relative w-full overflow-hidden rounded-xl py-4 text-sm
                           font-semibold text-white transition-all duration-300
                           disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {/* gradient background */}
                                <div
                                    className="absolute inset-0 btn-gradient opacity-100
                             group-hover:opacity-90 transition-opacity"
                                />
                                {/* shine sweep */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent
                             via-white/10 to-transparent -translate-x-full
                             group-hover:translate-x-full transition-transform
                             duration-700"
                                />
                                <span className="relative flex items-center justify-center gap-2">
                                    {state === "uploading" ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Uploading Dataset…
                                        </>
                                    ) : state === "analyzing" ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            AI is Analyzing…
                                        </>
                                    ) : state === "sending" ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Sending Email…
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4" />
                                            Generate AI Sales Summary
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── BOTTOM FEATURES ── */}
            <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                    {
                        icon: BarChart3,
                        title: "Smart Parsing",
                        desc: "CSV & XLSX support",
                    },
                    {
                        icon: Brain,
                        title: "Llama 3 AI",
                        desc: "Powered by Groq",
                    },
                    {
                        icon: Mail,
                        title: "Email Delivery",
                        desc: "Instant via Resend",
                    },
                ].map((feat) => (
                    <motion.div
                        key={feat.title}
                        whileHover={{ y: -2, scale: 1.02 }}
                        className="glass-card rounded-xl p-4 text-center cursor-default"
                    >
                        <feat.icon className="mx-auto mb-2 h-5 w-5 text-brand-400" />
                        <p className="text-xs font-semibold text-white">{feat.title}</p>
                        <p className="text-[10px] text-slate-500">{feat.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
