import films from "./films.json";

export type Movie = {
  id: number;
  title: string;
  year: number;
  rating: number;
  runtime: string;
  genre: string;
  maturity: string;
  description: string;
  cast: string;
  poster: string;
  still: string;
  official: boolean;
  quality: "4K" | "HD";
  match: number;
  region: "Hollywood" | "Pakistani" | "Indian";
  video: string;
  hdVideo: string;
  fallbackVideo: string;
  source: string;
};

type Film = { wposter?: string; title: string; year: number; mins: number; genre: string; region: Movie["region"]; poster: string; video: string; original: string; source: string };

const stories: Record<string, string> = {
  Drama: "A timeless drama of ambition, family and sacrifice, restored from the archives as a free full-length classic.",
  Romance: "A sweeping love story where hearts collide with fate, family and society — a celebrated classic of its era.",
  Comedy: "Non-stop laughs, daring stunts and unforgettable gags from the golden age of cinema.",
  Western: "Dust, horses and frontier justice — a classic Western adventure across the open plains.",
  Horror: "A chilling tale of shadows and terror that helped define the horror genre.",
  "Sci-Fi": "A visionary journey to other worlds that imagined the future long before modern special effects.",
  War: "An epic portrait of courage and loss on the battlefield, told on a grand scale.",
  Adventure: "Heroes, legends and daring quests in a spectacular full-length adventure.",
  Crime: "Gangsters, detectives and dangerous secrets in a gripping tale of crime and suspense.",
};

const cleanCast = (source: string) => {
  const parts = source.replace(/\.(webm|ogv|ogg)$/i, "").split(/ - |, /).slice(1).filter((p) => !/\d{4}|full|movie|hd|drama|black|blockbuster|production|eye|ob \d/i.test(p));
  return parts.slice(0, 3).join(", ") || "Archive classic cast";
};

export const allMovies: Movie[] = (films as Film[]).map((film, index) => ({
  id: index + 1,
  title: film.title,
  year: film.year,
  rating: Number((6.8 + ((index * 17) % 28) / 10).toFixed(1)),
  runtime: `${Math.floor(film.mins / 60)}h ${film.mins % 60}m`,
  genre: film.genre,
  maturity: film.genre === "Horror" || film.genre === "Crime" ? "16+" : "PG",
  description: stories[film.genre] ?? stories["Drama"] ?? "",
  cast: cleanCast(film.source),
  poster: film.wposter ?? film.poster.replace("500px--", "960px--"),
  still: film.poster.replace("500px--", "1280px--"),
  official: Boolean(film.wposter),
  quality: index % 3 === 0 ? "4K" : "HD",
  match: 82 + ((index * 7) % 18),
  region: film.region,
  video: film.video.replace(".480p.vp9.webm", ".360p.vp9.webm"),
  hdVideo: film.video,
  fallbackVideo: film.original,
  source: film.source,
}));

export const movies = allMovies.filter((movie) => movie.region === "Hollywood");
export const pakistaniMovies = allMovies.filter((movie) => movie.region === "Pakistani");
export const indianMovies = allMovies.filter((movie) => movie.region === "Indian");
export const movieGenres = ["All", ...Array.from(new Set(allMovies.map((movie) => movie.genre))).sort()];
