// Browser-safe helpers shared by the player, cards and server validation.

export type ParsedVideo =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "file"; src: string };

const FILE_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v)$/i;

export function parseVideoUrl(raw: string): ParsedVideo | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return isYouTubeId(id) ? { kind: "youtube", id } : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "music.youtube.com") {
    const v = url.searchParams.get("v");
    if (v && isYouTubeId(v)) return { kind: "youtube", id: v };
    const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
    const pathId = m?.[1];
    if (isYouTubeId(pathId)) return { kind: "youtube", id: pathId };
    return null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const m = url.pathname.match(/(\d{6,})/);
    return m?.[1] ? { kind: "vimeo", id: m[1] } : null;
  }
  if (FILE_EXT.test(url.pathname)) return { kind: "file", src: url.toString() };
  return null;
}

function isYouTubeId(id: string | undefined): id is string {
  return !!id && /^[A-Za-z0-9_-]{11}$/.test(id);
}

export function thumbnailFor(raw: string): string | null {
  const v = parseVideoUrl(raw);
  if (v?.kind === "youtube") return `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
  if (v?.kind === "vimeo") return `https://vumbnail.com/${v.id}.jpg`;
  return null;
}

// Hidden admin access: 7 taps, each within TAP_WINDOW_MS of the previous one.
export const ADMIN_TAPS = 7;
export const TAP_WINDOW_MS = 1500;

export function registerTap(prev: { count: number; last: number }, now: number) {
  const count = now - prev.last <= TAP_WINDOW_MS ? prev.count + 1 : 1;
  return { count, last: now, unlocked: count >= ADMIN_TAPS };
}
