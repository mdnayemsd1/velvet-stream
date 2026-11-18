import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import { thumbnailFor } from "@/lib/video-utils";
import type { Video } from "@/lib/videos.functions";

export function timeAgo(iso: string) {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: bn });
}

export function VideoCard({ video }: { video: Video }) {
  const thumb = thumbnailFor(video.url);
  return (
    <Link to="/watch/$id" params={{ id: video.id }} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-secondary">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="bg-brand-gradient size-full opacity-60" />
        )}
        <div className="absolute inset-0 grid place-items-center bg-background/0 transition-colors group-hover:bg-background/30">
          <span className="grid size-12 scale-90 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
            <Play className="size-5 fill-current" />
          </span>
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 font-semibold leading-snug group-hover:text-primary">{video.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{timeAgo(video.created_at)}</p>
    </Link>
  );
}
