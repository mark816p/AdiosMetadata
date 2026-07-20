"use client";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import Typography from "./Typography";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <header className="relative z-50">
      <nav className="h-40 flex flex-col sm:flex-row gap-(--space-lg) justify-center sm:justify-between items-start sm:items-center">
        <div className="flex justify-between items-center w-full">
          <Link href="/" prefetch={false} aria-label="Go to Adios Metadata homepage">
            <span className="flex items-center gap-(--fluid-sm-lg) type-fluid type-h1 group">
              <Sparkles className="size-10 text-pink-400 group-hover:text-purple-400 transition-colors" />
              <Typography as="span" variant="h1" className="leading-none text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-400 font-extrabold tracking-tight">
                Adios Metadata
              </Typography>
            </span>
          </Link>
          <div className="flex gap-(--space-md) sm:hidden">
            <ThemeToggle />
          </div>
        </div>

        <div className="relative">
          <div className="absolute gap-(--space-md) top-full mt-(--space-lg) right-0 hidden sm:flex">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
