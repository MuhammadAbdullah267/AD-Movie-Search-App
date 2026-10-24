import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Github, Instagram, Mail, Music2, Phone, Youtube, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import logo from "@/assets/ad-tech-logo.jpeg.asset.json";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact AD Tech — AD Movie Search App" },
    { name: "description", content: "Connect with AD Tech by social media, email or phone." },
    { property: "og:title", content: "Contact AD Tech" },
    { property: "og:description", content: "Official contact links for AD Movie Search App and AD Tech." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: ContactPage,
});

const links = [
  { label: "TikTok", value: "@adtech92", href: "https://www.tiktok.com/@adtech92?_r=1&_t=ZS-97JNiO07sjA", icon: Music2 },
  { label: "Instagram", value: "@adtech.92pk", href: "https://www.instagram.com/adtech.92pk?igsh=MTFia2JycW53enhrOA==", icon: Instagram },
  { label: "YouTube", value: "@adtech.92pk", href: "https://www.youtube.com/@adtech.92pk", icon: Youtube },
  { label: "Facebook", value: "AD Tech", href: "https://www.facebook.com/share/1FGpPB1LZR/", icon: Facebook },
  { label: "GitHub", value: "ADTech92", href: "https://github.com/ADTech92", icon: Github },
  { label: "Email", value: "adtech.92pk@gmail.com", href: "mailto:adtech.92pk@gmail.com", icon: Mail },
  { label: "Phone", value: "0326 9669595", href: "tel:+923269669595", icon: Phone },
];

function ContactPage() {
  return <div className="min-h-screen bg-background text-foreground"><SiteHeader/><main className="contact-bg px-5 pb-24 pt-32 lg:px-10 lg:pt-40"><div className="mx-auto max-w-6xl"><div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><section className="animate-rise"><p className="section-kicker">Contact AD Tech</p><h1 className="mt-3 font-display text-5xl font-black leading-none sm:text-7xl">Let’s stay<br/><span className="text-metal">connected.</span></h1><p className="mt-6 max-w-md leading-7 text-muted-foreground">Follow AD Tech for new projects, videos and updates. For collaboration or support, contact us directly.</p><img src={logo.url} alt="AD Tech logo" className="mt-10 w-52 rounded-md border border-border-subtle shadow-poster"/></section><section className="contact-list">{links.map(({ label, value, href, icon: Icon }, index) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="contact-row animate-rise" style={{ animationDelay: `${index * 60}ms` }}><span className="contact-icon"><Icon /></span><span><span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{label}</span><span className="mt-1 block font-display text-base font-bold sm:text-lg">{value}</span></span><ArrowUpRight className="ml-auto size-5 text-muted-foreground transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"/></a>)}</section></div></div></main><SiteFooter/></div>;
}