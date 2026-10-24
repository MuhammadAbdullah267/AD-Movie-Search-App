import { Link } from "@tanstack/react-router";
import { Bookmark, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/ad-tech-logo.jpeg.asset.json";
import { Button } from "@/components/ui/button";

type HeaderProps = { search?: string; onSearch?: (value: string) => void; savedCount?: number };

export function SiteHeader({ search = "", onSearch, savedCount = 0 }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border-subtle bg-nav/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center gap-6 px-5 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="AD Movie Search App home">
          <img src={logo.url} alt="AD Tech" className="size-11 rounded-md object-cover" />
          <div className="hidden sm:block"><p className="font-display text-sm font-extrabold uppercase text-foreground">AD Movie</p><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Search App</p></div>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          <a href="#home" className="nav-link nav-link-active">Home</a>
          <a href="#trending" className="nav-link">Trending</a>
          <a href="#movies" className="nav-link">Movies</a>
          <a href="#genres" className="nav-link">Genres</a>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {onSearch && <label className="relative hidden w-64 md:block"><span className="sr-only">Search movies</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search 260 movies..." className="h-10 w-full rounded-md border border-border-bright bg-surface-glass pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary" /></label>}
          <a href="#my-list" className="relative hidden size-10 items-center justify-center rounded-md border border-border-bright bg-surface-glass text-foreground transition hover:bg-surface-hover sm:flex" aria-label={`My list, ${savedCount} movies`}><Bookmark className="size-4"/>{savedCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{savedCount}</span>}</a>
          <Button variant="icon" aria-label={open ? "Close menu" : "Open menu"} className="lg:hidden" onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && <nav className="animate-menu border-t border-border-subtle bg-nav px-5 py-5 lg:hidden"><div className="flex flex-col gap-1"><a href="#home" onClick={close} className="mobile-nav">Home</a><a href="#trending" onClick={close} className="mobile-nav">Trending</a><a href="#movies" onClick={close} className="mobile-nav">All Movies</a><a href="#genres" onClick={close} className="mobile-nav">Genres</a><a href="#my-list" onClick={close} className="mobile-nav">My List ({savedCount})</a><Link to="/contact" className="mobile-nav">Contact</Link></div></nav>}
    </header>
  );
}