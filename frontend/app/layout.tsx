import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Sales Insight Automator | AI-Powered Sales Analysis",
    description:
        "Upload your sales data and receive an AI-generated executive summary delivered straight to your inbox. Powered by Llama 3.",
    keywords: [
        "sales analysis",
        "AI",
        "executive summary",
        "data analytics",
        "Llama 3",
    ],
    authors: [{ name: "Sales Insight Automator" }],
    openGraph: {
        title: "Sales Insight Automator",
        description: "AI-Powered Sales Data Analysis & Executive Summaries",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="gradient-bg noise min-h-screen">{children}</body>
        </html>
    );
}
