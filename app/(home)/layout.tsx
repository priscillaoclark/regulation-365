import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "@/app/globals.css";
import AppLogo from "@/components/logo";
import Footer from "@/components/footer";
import Header from "@/components/header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Regulation 365",
  description: "Navigate Financial Regulations with Confidence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasFullWidth = React.Children.toArray(children).some(
    (child: any) => child.props?.className === "full-width-section"
  );

  return (
    <div className="bg-background dark:bg-neutral-950 text-foreground">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main className="min-h-screen flex flex-col items-center">
          <Header />
          <div
            className={`flex-1 w-full flex flex-col gap-20 ${hasFullWidth ? "" : ""} items-center pt-16`}
          >
            <div className="flex flex-col gap-20 w-full">
              {children}
              <SpeedInsights />
              <Analytics />
            </div>
            <Footer />
          </div>
        </main>
      </ThemeProvider>
    </div>
  );
}
