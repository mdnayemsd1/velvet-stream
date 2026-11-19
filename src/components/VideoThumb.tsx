import { useState } from "react";
import { Film } from "lucide-react";
import { parseVideoUrl, thumbnailFor } from "@/lib/video-utils";
import { cn } from "@/lib/utils";

// Automatic thumbnail: platform image for YouTube/Vimeo, a frame from the file itself for MP4/WebM.
export function VideoThumb({ url, className }: { url: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const img = thumbnailFor(url);
  const parsed = parseVideoUrl(url);
  const base = cn("size-full object-cover", className);

  if (img && !failed) {
    return <img src={img} alt="" loading="lazy" className={base} onError={() => setFailed(true)} />;
  }
  if (parsed?.kind === "file" && !failed) {
    const src = `${parsed.src.split("#")[0]}#t=1`;
    return (
      <video
        src={src}
        className={cn(base, "pointer-events-none")}
        preload="metadata"
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className={cn("bg-brand-gradient grid size-full place-items-center opacity-60", className)}>
      <Film className="size-8 text-primary-foreground" />
    </div>
  );
}
