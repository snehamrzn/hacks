"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

const links = [
  { label: "The reframe", href: "#reframe" },
  { label: "How it works", href: "#how" },
  { label: "Method & data", href: "#method" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-standard",
        scrolled
          ? "border-b border-border bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          ◆ ARCLIGHT
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative text-sm text-muted transition-colors hover:text-fg"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-fg transition-all duration-250 ease-standard group-hover:w-full" />
            </a>
          ))}
        </nav>
        <Link
          href="/studio"
          className="inline-flex h-9 items-center justify-center rounded bg-fg px-4 text-sm font-medium text-bg outline-none transition-colors duration-200 ease-standard hover:bg-muted focus-visible:shadow-focus-ring"
        >
          Launch the map
        </Link>
      </Container>
    </header>
  );
}
