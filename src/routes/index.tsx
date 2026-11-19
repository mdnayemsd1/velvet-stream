import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Play } from "lucide-react";
import { videosQuery } from "@/lib/queries";
import { SiteHeader } from "@/components/SiteHeader";
import { VideoCard, timeAgo } from "@/components/VideoCard";
import { VideoThumb } from "@/components/VideoThumb";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumora — ভিডিও দেখুন" },
      { name: "description", content: "Lumora-তে সব নতুন ভিডিও এক জায়গায় দেখুন।" },
      { property: "og:title", content: "Lumora — ভিডিও দেখুন" },
      { property: "og:description", content: "Lumora-তে সব নতুন ভিডিও এক জায়গায় দেখুন।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(videosQuery()),
  component: Home,
});

function Home() {
  const { data: videos } = useSuspenseQuery(videosQuery());
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? videos.filter((v) => v.title.toLowerCase().includes(s)) : videos;
  }, [q, videos]);
  const featured = !q && videos[0];
  const rest = featured ? filtered.slice(1) : filtered;

  return (
    <>
      <SiteHeader>
        <label className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ভিডিও খুঁজুন…"
            aria-label="ভিডিও খুঁজুন"
            className="h-10 w-full rounded-full border border-input bg-secondary/60 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </label>
      </SiteHeader>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        {featured && (
          <Link
            to="/watch/$id"
            params={{ id: featured.id }}
            className="group relative mb-10 block overflow-hidden rounded-3xl border border-border"
          >
            <div className="relative aspect-[16/9] sm:aspect-[21/9]">
              <VideoThumb url={featured.url} className="transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <span className="text-sm font-bold text-accent">নতুন ভিডিও</span>
                <h1 className="mt-2 line-clamp-2 max-w-2xl font-display text-2xl font-bold leading-tight sm:text-4xl">
                  {featured.title}
                </h1>
                <div className="mt-4 flex items-center gap-3">
                  <span className="bg-brand-gradient inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-primary-foreground">
                    <Play className="size-4 fill-current" /> এখনই দেখুন
                  </span>
                  <span className="text-xs text-muted-foreground">{timeAgo(featured.created_at)}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {videos.length === 0 ? (
          <div className="glass mx-auto mt-16 max-w-md rounded-3xl p-10 text-center">
            <h1 className="font-display text-2xl font-bold">এখনও কোনো ভিডিও নেই</h1>
            <p className="mt-2 text-sm text-muted-foreground">নতুন ভিডিও যোগ হলে এখানে দেখা যাবে।</p>
          </div>
        ) : rest.length === 0 && !q ? null : (
          <>
            <h2 className="mb-4 font-display text-lg font-semibold">{q ? `“${q}” এর ফলাফল` : "সব ভিডিও"}</h2>
            {rest.length === 0 ? (
              <p className="text-sm text-muted-foreground">কোনো ভিডিও পাওয়া যায়নি।</p>
            ) : (
              <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
