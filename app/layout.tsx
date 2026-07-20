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
  themeColor: "#0f172a", // Darker theme color
};

export const metadata: Metadata = {
  title: "Adios Metadata - Privacy First",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
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
      <body suppressHydrationWarning className={`antialiased min-h-screen flex flex-col ${avenirNext.variable} font-avenir bg-linear-to-br from-indigo-900 to-purple-900 text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <div className="flex flex-col flex-1 items-center">
              <div className="max-w-(--max-content-width) flex flex-col flex-1 w-full h-full px-(--space-xl)">
                <Navbar />
                <main className="flex-1 glassmorphism-container">{children}</main>
                <Toaster richColors />
              </div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
