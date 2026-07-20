import type { Viewport, Metadata } from "next";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import "./globals.css";

const avenirNext = localFont({
  variable: "--font-avenir",
  display: "swap",
  src: [
    {
      path: "../public/fonts/avenir-next-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/avenir-next-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/avenir-next-demibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafafa",
};

export const metadata: Metadata = {
  title: "Adios Metadata",
  description: "Remove hidden metadata privately from images, videos, audio, PDFs, and documents. Free, offline, no uploads.",
  keywords: [
    "remove metadata",
    "metadata stripper",
    "offline metadata removal",
    "privacy tool",
  ],
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Adios Metadata" />
      </head>
      <body suppressHydrationWarning className={`antialiased min-h-screen flex flex-col ${avenirNext.variable} font-avenir bg-zinc-50 dark:bg-[#0e0e10] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <div className="flex flex-col flex-1 items-center selection:bg-accent/20">
              <div className="max-w-4xl flex flex-col flex-1 w-full h-full px-6 md:px-8">
                <Navbar />
                <main className="flex-1 flex flex-col py-12 md:py-24">{children}</main>
                <Toaster richColors position="top-center" />
              </div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
