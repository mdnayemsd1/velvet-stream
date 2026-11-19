import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { adsQuery, videoQuery, videosQuery } from "@/lib/queries";
import { firstAdStep, nextAdStep, type AdStep } from "@/lib/ads";
import { AdGate } from "@/components/AdGate";
import { SiteHeader } from "@/components/SiteHeader";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoCard, timeAgo } from "@/components/VideoCard";

export const Route = createFileRoute("/watch/$id")({
  loader: async ({ context, params }) => {
    const [video] = await Promise.all([
      context.queryClient.ensureQueryData(videoQuery(params.id)),
      context.queryClient.ensureQueryData(videosQuery()),
      context.queryClient.ensureQueryData(adsQuery()),
    ]);
    if (!video) throw notFound();
    return { title: video.title };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — Lumora` : "ভিডিও পাওয়া যায়নি — Lumora";
    const description = loaderData ? `Lumora-তে দেখুন: ${loaderData.title}` : "এই ভিডিওটি আর নেই।";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "video.other" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: () => (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">ভিডিওটি পাওয়া যায়নি</h1>
        <p className="mt-2 text-sm text-muted-foreground">হয়তো এটি মুছে ফেলা হয়েছে।</p>
        <Link to="/" className="mt-6 inline-block text-primary hover:underline">সব ভিডিও দেখুন</Link>
      </main>
    </>
  ),
  component: Watch,
});

function Watch() {
  const { id } = Route.useParams();
  const { data: video } = useSuspenseQuery(videoQuery(id));
  const { data: all } = useSuspenseQuery(videosQuery());
  const { data: ads } = useSuspenseQuery(adsQuery());
  const [step, setStep] = useState<AdStep>(firstAdStep);
  const [shownFor, setShownFor] = useState(id);
  if (shownFor !== id) {
    setShownFor(id);
    setStep(firstAdStep());
  }
  if (!video) return null;
  const more = all.filter((v) => v.id !== id).slice(0, 12);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 pt-6 lg:grid-cols-[1fr_320px]">
        <section>
          <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> সব ভিডিও
          </Link>
          {step.kind === "ad" ? (
            <AdGate
              index={step.index}
              code={ads[step.index] ?? ""}
              videoUrl={video.url}
              onDone={() => setStep(nextAdStep(step))}
            />
          ) : (
            <VideoPlayer key={video.id} url={video.url} title={video.title} autoPlay />
          )}
          <h1 className="mt-5 font-display text-2xl font-bold leading-tight sm:text-3xl">{video.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{timeAgo(video.created_at)}</p>
        </section>
        {more.length > 0 && (
          <aside>
            <h2 className="mb-4 font-display text-lg font-semibold">আরও ভিডিও</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {more.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </aside>
        )}
      </main>
    </>
  );
}
