import { parseVideoUrl } from "@/lib/video-utils";

export function VideoPlayer({ url, title, autoPlay = false }: { url: string; title: string; autoPlay?: boolean }) {
  const v = parseVideoUrl(url);
  const frame = "absolute inset-0 size-full";
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-glow)]">
      {v?.kind === "youtube" && (
        <iframe
          className={frame}
          src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0${autoPlay ? "&autoplay=1" : ""}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
      {v?.kind === "vimeo" && (
        <iframe
          className={frame}
          src={`https://player.vimeo.com/video/${v.id}${autoPlay ? "?autoplay=1" : ""}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )}
      {v?.kind === "file" && (
        <video className={frame} src={v.src} controls playsInline autoPlay={autoPlay} preload="metadata" />
      )}
      {!v && (
        <div className="absolute inset-0 grid place-items-center text-muted-foreground">এই ভিডিওটি চালানো যাচ্ছে না।</div>
      )}
    </div>
  );
}
