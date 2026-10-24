import { Link } from "@tanstack/react-router";
import { Github, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/ad-tech-logo.jpeg.asset.json";

export function SiteFooter() {
  return <footer className="border-t border-border-subtle bg-footer px-5 py-10 lg:px-10"><div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-6 sm:flex-row"><Link to="/" className="flex items-center gap-3"><img src={logo.url} alt="AD Tech" className="size-10 rounded-md object-cover" /><span className="font-display text-sm font-extrabold uppercase">AD Movie Search App</span></Link><p className="text-xs text-muted-foreground">© 2026 AD Tech. Demo entertainment experience.</p><div className="flex gap-2"><a className="social-icon" aria-label="Instagram" href="https://www.instagram.com/adtech.92pk" target="_blank" rel="noreferrer"><Instagram /></a><a className="social-icon" aria-label="YouTube" href="https://www.youtube.com/@adtech.92pk" target="_blank" rel="noreferrer"><Youtube /></a><a className="social-icon" aria-label="GitHub" href="https://github.com/ADTech92" target="_blank" rel="noreferrer"><Github /></a></div></div></footer>;
}