import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/hooks/useWallet";
import { ToastProvider } from "@/components/Toast";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "EvoArena — AI-Powered Adaptive Liquidity",
  description:
    "AI-driven AMM parameter control on BNB Chain. Dynamic fees, slippage optimization, and real-time agent intelligence.",
  keywords: ["DeFi", "AMM", "BNB Chain", "AI", "Liquidity", "EvoArena"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased pt-16">
        <WalletProvider>
          <ToastProvider>
            <Navbar />
            <main className="px-4 sm:px-6">{children}</main>
          </ToastProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
