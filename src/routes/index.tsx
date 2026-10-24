import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, Check, ChevronLeft, ChevronRight, CircleAlert, Clapperboard, Clock3, Info, Maximize2, Minimize2, Expand, Play, RotateCcw, Search, Sparkles, Star, TrendingUp, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import hero from "@/assets/hero-eclipse.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { allMovies, indianMovies, movieGenres, movies, pakistaniMovies, type Movie } from "@/lib/movies";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "AD Movie Search App — 260 Free Full Movies" },
    { name: "description", content: "Stream 260 real full-length classic Hollywood, Bollywood and Lahore movies for free on AD Movie Search App." },
    { property: "og:title", content: "AD Movie Search App — 260 Free Full Movies" },
    { property: "og:description", content: "A premium cinematic movie discovery and viewing experience by AD Tech." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

type MovieCardProps = { movie: Movie; saved: boolean; onDetails: () => void; onPlay: () => void; onSave: () => void; rank?: number | undefined; compact?: boolean };

function MovieCard({ movie, saved, onDetails, onPlay, onSave, rank, compact }: MovieCardProps) {
  return <article className={`movie-card group ${compact ? "w-[168px] shrink-0 sm:w-[205px]" : ""}`}>
    {rank && <span className="rank-number" aria-label={`Number ${rank}`}>{rank}</span>}
    <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-card shadow-poster">
      <button className="block size-full text-left" onClick={onDetails} aria-label={`View details for ${movie.title}`}>
        <img src={movie.poster} alt="" onError={(e) => { const img = e.currentTarget; if (img.dataset["tries"] === "2") { img.style.opacity = "0"; return; } img.dataset["tries"] = img.dataset["tries"] ? "2" : "1"; window.setTimeout(() => { img.src = img.dataset["tries"] === "1" ? `${movie.poster}${movie.poster.includes("?") ? "&" : "?"}r=1` : movie.still; }, 600 + Math.random() * 1400); }} loading="lazy" decoding="async" width={600} height={900} className={`poster-img size-full object-cover transition duration-700 group-hover:scale-110 ${movie.official ? "" : "poster-graded"}`}/>
        <span className={movie.official ? "poster-title poster-title-fallback" : "poster-title"}><span className="poster-year">{movie.year} · {movie.region}</span>{movie.title}</span>
        <div className="card-shade absolute inset-0 opacity-50 transition duration-300 group-hover:opacity-100"/>
        <span className="absolute left-3 top-3 rounded-sm bg-badge px-2 py-1 text-[10px] font-black uppercase text-primary-foreground">{movie.quality}</span>
        <span className="absolute bottom-3 left-3 flex size-10 translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-action transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><Play className="size-4 fill-current" /></span>
      </button>
      <Button variant="icon" size="icon" onClick={onSave} className="absolute right-3 top-3 size-9 opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label={saved ? `Remove ${movie.title} from list` : `Add ${movie.title} to list`}>{saved ? <Check className="size-4"/> : <Bookmark className="size-4"/>}</Button>
    </div>
    <button className="mt-3 block w-full text-left" onClick={onPlay} aria-label={`Play ${movie.title}`}><h3 className="truncate font-display text-sm font-bold sm:text-base">{movie.title}</h3><div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground"><span className="text-match">{movie.match}% Match</span><span>{movie.year} · {movie.maturity}</span><span className="flex items-center gap-1 text-rating"><Star className="size-3 fill-current" />{movie.rating}</span></div></button>
  </article>;
}

function MovieRail({ id, kicker, title, icon: Icon, items, saved, onDetails, onPlay, onSave, ranked = false }: { id?: string; kicker: string; title: string; icon: typeof Star; items: Movie[]; saved: number[]; onDetails: (movie: Movie) => void; onPlay: (movie: Movie) => void; onSave: (id: number) => void; ranked?: boolean }) {
  const rail = useRef<HTMLDivElement>(null);
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * Math.min(900, window.innerWidth * 0.75), behavior: "smooth" });
  return <section id={id} className="content-section">
    <div className="section-heading"><div><p className="section-kicker flex items-center gap-2"><Icon className="size-3.5" />{kicker}</p><h2 className="section-title">{title}</h2></div><div className="hidden gap-2 sm:flex"><Button variant="icon" size="icon" onClick={() => move(-1)} aria-label={`Scroll ${title} left`}><ChevronLeft/></Button><Button variant="icon" size="icon" onClick={() => move(1)} aria-label={`Scroll ${title} right`}><ChevronRight/></Button></div></div>
    <div ref={rail} className={`movie-rail scrollbar-none ${ranked ? "ranked-rail" : ""}`}>{items.map((movie, index) => <MovieCard key={movie.id} movie={movie} rank={ranked ? index + 1 : undefined} compact saved={saved.includes(movie.id)} onDetails={() => onDetails(movie)} onPlay={() => onPlay(movie)} onSave={() => onSave(movie.id)}/>)}</div>
  </section>;
}

function Index() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [selected, setSelected] = useState<Movie | null>(null);
  const [playing, setPlaying] = useState<Movie | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const [minimized, setMinimized] = useState(false);
  const filtered = useMemo(() => allMovies.filter((movie) => (genre === "All" || movie.genre === genre) && `${movie.title} ${movie.cast} ${movie.genre} ${movie.region} ${movie.year}`.toLowerCase().includes(search.toLowerCase())), [genre, search]);
  const toggleSave = (id: number) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const startMovie = (movie: Movie) => { setPlaying(movie); setMinimized(false); };
  const featured = allMovies.find((m) => m.title.startsWith("Awaara")) ?? allMovies[0];
  const spot = movies.find((m) => m.title.startsWith("Nosferatu")) ?? movies[0];
  const savedMovies = allMovies.filter((movie) => saved.includes(movie.id));

  return <div className="min-h-screen overflow-hidden bg-background text-foreground">
    <SiteHeader search={search} onSearch={setSearch} savedCount={saved.length}/>
    <main>
      <section id="home" className="hero relative flex min-h-[92svh] items-end overflow-hidden px-5 pb-20 pt-28 lg:min-h-[94svh] lg:items-center lg:px-10 lg:pb-0">
        <img src={featured?.still ?? hero} alt={`${featured?.title} still`} width={1280} height={720} className="absolute inset-0 size-full object-cover object-[68%_center]" />
        <div className="hero-shade absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1600px]"><div className="max-w-2xl animate-rise">
          <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-primary-bright"><span className="h-px w-8 bg-primary" />Free full movie · #1 Today</div>
          <h1 className="font-display text-5xl font-black uppercase leading-[0.9] sm:text-7xl lg:text-8xl">{featured?.title}<br/><span className="text-metal">{featured?.year}</span></h1>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold"><span className="text-match">{featured?.match}% Match</span><span className="flex items-center gap-1 text-rating"><Star className="size-4 fill-current"/>{featured?.rating}</span><span>{featured?.region}</span><span>{featured?.runtime}</span><span>{featured?.genre}</span></div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-hero-copy sm:text-base">{allMovies.length} real full-length classic movies — Hollywood, Bollywood and Lahore legends — free to stream, each with its own film and picture.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Button size="lg" onClick={() => featured && startMovie(featured)}><Play className="size-4 fill-current"/>Watch now</Button><Button size="lg" variant="glass" onClick={() => featured && setSelected(featured)}><Info className="size-4"/>More info</Button></div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-border-subtle pt-5"><div><strong className="font-display text-xl">{allMovies.length}</strong><span className="block text-xs text-muted-foreground">Movies</span></div><div><strong className="font-display text-xl">{movieGenres.length - 1}</strong><span className="block text-xs text-muted-foreground">Genres</span></div><div><strong className="font-display text-xl">100%</strong><span className="block text-xs text-muted-foreground">Free to watch</span></div></div>
        </div></div>
        <a href="#trending" className="absolute bottom-7 right-8 hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground lg:flex">Explore collection <ChevronRight className="size-4 animate-nudge" /></a>
      </section>

      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        <MovieRail id="trending" kicker="Most watched now" title="Trending this week" icon={TrendingUp} items={allMovies.filter((_, i) => i % 9 === 0).slice(0, 16)} saved={saved} onDetails={setSelected} onPlay={startMovie} onSave={toggleSave}/>
        <MovieRail kicker="The charts" title="Top 10 in Pakistan" icon={Star} items={[...indianMovies.slice(0,5), ...movies.slice(14, 19)]} saved={saved} onDetails={setSelected} onPlay={startMovie} onSave={toggleSave} ranked/>

        <section className="spotlight"><img src={spot?.still} alt={`${spot?.title} still`} loading="lazy"/><div className="spotlight-shade"/><div className="relative max-w-2xl"><p className="section-kicker">AD Spotlight · {spot?.year}</p><h2 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">{spot?.title}</h2><p className="mt-4 max-w-xl leading-7 text-hero-copy">{spot?.description}</p><div className="mt-6 flex gap-3"><Button onClick={() => spot && startMovie(spot)}><Play className="fill-current"/>Play</Button><Button variant="glass" onClick={() => spot && setSelected(spot)}><Info/>Details</Button></div></div></section>

        <MovieRail id="pakistani" kicker="Noor Jehan & Lahore studios" title="Pakistani classics" icon={Sparkles} items={[...pakistaniMovies, ...indianMovies.filter((m) => /urdu|mirza|ghalib|anarkali|dastan|lahore/i.test(m.source))]} saved={saved} onDetails={setSelected} onPlay={startMovie} onSave={toggleSave}/>
        <MovieRail id="indian" kicker="Bollywood golden era" title="Indian movies" icon={Sparkles} items={indianMovies} saved={saved} onDetails={setSelected} onPlay={startMovie} onSave={toggleSave}/>
        <MovieRail kicker="Laugh out loud" title="Comedy classics" icon={Sparkles} items={allMovies.filter((m) => m.genre === "Comedy").slice(0, 20)} saved={saved} onDetails={setSelected} onPlay={startMovie} onSave={toggleSave}/>
        <MovieRail kicker="Critics’ favorites" title="Highly rated" icon={Star} items={[...allMovies].sort((a, b) => b.rating - a.rating).slice(0, 16)} saved={saved} onDetails={setSelected} onPlay={startMovie} onSave={toggleSave}/>

        <MovieRail kicker="Dare to watch" title="Horror & mystery" icon={Sparkles} items={allMovies.filter((m) => m.genre === "Horror").slice(0, 20)} saved={saved} onDetails={setSelected} onPlay={startMovie} onSave={toggleSave}/>
        <MovieRail kicker="Frontier legends" title="Westerns & adventure" icon={Sparkles} items={allMovies.filter((m) => m.genre === "Western" || m.genre === "Adventure").slice(0, 20)} saved={saved} onDetails={setSelected} onPlay={startMovie} onSave={toggleSave}/>
        {savedMovies.length > 0 && <MovieRail id="my-list" kicker="Saved for later" title={`My list · ${savedMovies.length}`} icon={Bookmark} items={savedMovies} saved={saved} onDetails={setSelected} onPlay={startMovie} onSave={toggleSave}/>} 

        <section id="movies" className="content-section pb-24">
          <div className="section-heading"><div><p className="section-kicker flex items-center gap-2"><Clapperboard className="size-3.5"/>Complete catalogue</p><h2 className="section-title">Browse all {allMovies.length} movies</h2><p className="mt-3 text-sm text-muted-foreground">Showing {filtered.length} titles</p></div><label className="relative w-full sm:w-80"><span className="sr-only">Search movies</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Title, cast or genre..." className="h-11 w-full rounded-md border border-border-bright bg-card pl-10 pr-3 text-sm outline-none transition focus:border-primary"/></label></div>
          <div id="genres" className="scrollbar-none mb-9 flex gap-2 overflow-x-auto pb-2">{movieGenres.map((item) => <Button key={item} variant={genre === item ? "primary" : "outline"} size="sm" onClick={() => setGenre(item)} className="shrink-0 rounded-full">{item}</Button>)}</div>
          {filtered.length ? <div className="movie-grid">{filtered.map((movie) => <MovieCard key={movie.id} movie={movie} saved={saved.includes(movie.id)} onDetails={() => setSelected(movie)} onPlay={() => startMovie(movie)} onSave={() => toggleSave(movie.id)}/>)}</div> : <div className="empty-state"><Search className="mb-4 size-8 text-primary"/><h3 className="font-display text-xl font-bold">No movies found</h3><p className="mt-2 text-sm text-muted-foreground">Try another title, cast member or genre.</p><Button className="mt-5" variant="outline" onClick={() => { setSearch(""); setGenre("All"); }}>Clear filters</Button></div>}
        </section>
      </div>
    </main>
    <SiteFooter/>

    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><div role="dialog" aria-modal="true" aria-label={`${selected.title} details`} onMouseDown={(event) => event.stopPropagation()} className="detail-modal animate-scale-in"><img src={selected.poster} alt="" width={768} height={1152} className="h-80 w-full object-cover"/><div className="detail-shade absolute inset-x-0 top-0 h-80"/><Button variant="icon" className="absolute right-4 top-4" onClick={() => setSelected(null)} aria-label="Close details"><X/></Button><div className="relative -mt-24 p-6 sm:p-9"><p className="section-kicker">{selected.genre} · {selected.region} · Full movie</p><h2 className="mt-2 font-display text-3xl font-black sm:text-5xl">{selected.title}</h2><div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="text-match">{selected.match}% Match</span><span className="text-rating">★ {selected.rating}</span><span>{selected.year}</span><span>{selected.runtime}</span><span>{selected.maturity}</span><span>{selected.quality}</span></div><p className="mt-6 leading-7 text-hero-copy">{selected.description}</p><p className="mt-4 text-sm text-muted-foreground"><span className="text-foreground">Cast:</span> {selected.cast}</p><div className="mt-7 flex flex-wrap gap-3"><Button onClick={() => { startMovie(selected); setSelected(null); }}><Play className="size-4 fill-current"/>Play movie</Button><Button variant="glass" onClick={() => toggleSave(selected.id)}>{saved.includes(selected.id) ? <Check/> : <Bookmark/>}{saved.includes(selected.id) ? "Saved" : "My list"}</Button></div></div></div></div>}

    {playing && <Player movie={playing} minimized={minimized} onMinimize={setMinimized} onClose={() => setPlaying(null)}/>}
  </div>;
}
function Player({ movie, minimized, onMinimize, onClose }: { movie: Movie; minimized: boolean; onMinimize: (v: boolean) => void; onClose: () => void }) {
  const sources = [movie.video, movie.hdVideo, movie.fallbackVideo];
  const [src, setSrc] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  useEffect(() => { setSrc(0); setFailed(false); setReady(false); }, [movie.id]);
  const next = () => { setReady(false); if (src < sources.length - 1) setSrc(src + 1); else setFailed(true); };
  useEffect(() => { if (ready || failed) return; const t = window.setTimeout(next, 12000); return () => window.clearTimeout(t); });
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const full = () => { const el = shell.current; if (!el) return; if (document.fullscreenElement) void document.exitFullscreen(); else void el.requestFullscreen?.(); };
  return <div className={minimized ? "mini-player animate-scale-in" : "modal-backdrop p-3"} role="presentation" onMouseDown={(e) => { if (!minimized && e.target === e.currentTarget) onClose(); }}>
    <div ref={shell} className={minimized ? "player-shell w-full" : "player-shell animate-scale-in"} role="dialog" aria-modal={!minimized} aria-label={`Playing ${movie.title}`}>
      <div className="player-bar">
        <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Now playing · {movie.year} · {movie.runtime}</p><h2 className="truncate font-display font-bold">{movie.title}</h2></div>
        <div className="flex shrink-0 gap-2">
          <button className="player-btn" onClick={() => onMinimize(!minimized)} aria-label={minimized ? "Expand player" : "Minimize player"} title={minimized ? "Expand" : "Minimize"}>{minimized ? <Maximize2/> : <Minimize2/>}<span className="hidden sm:inline">{minimized ? "Expand" : "Minimize"}</span></button>
          {!minimized && <button className="player-btn" onClick={full} aria-label="Full screen" title="Full screen"><Expand/><span className="hidden sm:inline">Full screen</span></button>}
          <button className="player-btn player-close" onClick={onClose} aria-label="Close video" title="Close"><X/><span className="hidden sm:inline">Close</span></button>
        </div>
      </div>
      {failed ? <div className="flex aspect-video flex-col items-center justify-center bg-nav p-8 text-center"><CircleAlert className="mb-4 size-10 text-primary"/><h3 className="font-display text-xl font-bold">Video could not load</h3><p className="mt-2 max-w-md text-sm text-muted-foreground">Your connection is slow or blocked this film. Try again.</p><Button className="mt-5" onClick={() => { setSrc(0); setFailed(false); }}><RotateCcw/>Try again</Button></div>
      : <div className="relative"><video key={`${movie.id}-${src}`} src={sources[src]} poster={movie.still} controls autoPlay playsInline preload="auto" onError={next} onCanPlay={() => setReady(true)} className="aspect-video w-full bg-nav">Your browser does not support video playback.</video>{!ready && <div className="pointer-events-none absolute inset-0 flex items-center justify-center"><span className="player-spinner"/></div>}</div>}
      {!minimized && <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground"><Clock3 className="size-3.5"/><span>Free public-domain film from Wikimedia Commons · Press Esc to close</span></div>}
    </div>
  </div>;
}
