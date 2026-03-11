"use client";

import { motion } from "framer-motion";
import { Sparkles, Github } from "lucide-react";
import FileUpload from "@/components/FileUpload";

export default function HomePage() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* ── Ambient Orbs ── */}
            <div className="orb h-[500px] w-[500px] bg-brand-600 top-[-100px] left-[-200px]" />
            <div className="orb h-[400px] w-[400px] bg-purple-600 bottom-[-50px] right-[-150px]" />
            <div className="orb h-[300px] w-[300px] bg-indigo-500 top-[40%] left-[60%]" />

            {/* ── Dot Pattern Overlay ── */}
            <div className="absolute inset-0 dot-pattern opacity-30" />

            {/* ── Content Container ── */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
                {/* ── Badge ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6"
                >
                    <span
                        className="inline-flex items-center gap-2 rounded-full border border-brand-500/20
                       bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-300
                       backdrop-blur-sm"
                    >
                        <Sparkles className="h-3 w-3" />
                        Powered by Llama 3 &amp; Groq
                    </span>
                </motion.div>

                {/* ── Title ── */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-4 text-center text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
                >
                    <span className="block text-white">Sales Insight</span>
                    <span
                        className="block bg-gradient-to-r from-brand-400 via-purple-400 to-brand-300
                       bg-clip-text text-transparent"
                    >
                        Automator
                    </span>
                </motion.h1>

                {/* ── Subtitle ── */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mb-12 max-w-lg text-center text-base text-slate-400 leading-relaxed"
                >
                    Upload your sales dataset, let{" "}
                    <span className="text-brand-400 font-medium">AI analyze</span> it, and
                    receive a polished executive summary straight to your inbox.
                </motion.p>

                {/* ── File Upload Widget ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="w-full max-w-2xl"
                >
                    <FileUpload />
                </motion.div>

                {/* ── Footer ── */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="mt-16 flex items-center gap-4 text-xs text-slate-600"
                >
                    <span>© {new Date().getFullYear()} Sales Insight Automator</span>
                    <span className="text-slate-700">•</span>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-slate-500 hover:text-brand-400 transition-colors"
                    >
                        <Github className="h-3.5 w-3.5" />
                        GitHub
                    </a>
                </motion.footer>
            </div>
        </main>
    );
}
