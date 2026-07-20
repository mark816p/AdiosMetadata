"use client";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import Typography from "./Typography";
import { ShieldCheck } from "lucide-react";

const Navbar = () => {
  return (
    <header className="relative z-50 pt-8 pb-4">
      <nav className="flex justify-between items-center w-full">
        <Link href="/" prefetch={false} aria-label="Go to Adios Metadata homepage" className="group">
          <span className="flex items-center gap-3">
            <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black p-2 rounded-xl group-hover:scale-105 transition-transform">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            <Typography as="span" variant="h2" className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Adios Metadata
            </Typography>
          </span>
        </Link>
        <div className="flex gap-4">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
