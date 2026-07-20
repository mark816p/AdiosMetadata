"use client";
import Typography from "./Typography";
import { useEffect, useState } from "react";

const Hero = () => {
  const [locationText, setLocationText] = useState("directly in your browser");

  useEffect(() => {
    // Check if running inside Electron
    if (typeof window !== "undefined" && navigator.userAgent.toLowerCase().includes("electron")) {
      setLocationText("directly on your computer");
    }
  }, []);

  return (
    <section className="text-center max-w-2xl mx-auto mb-12">
      <Typography variant="hero" as={"h1"} className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 pb-4">
        Clean your files.
      </Typography>
      <Typography variant="body" className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
        Adios Metadata securely strips hidden data from your photos, videos, and documents {locationText}. Complete privacy, zero uploads.
      </Typography>
    </section>
  );
};

export default Hero;
