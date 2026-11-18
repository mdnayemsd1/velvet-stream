import { describe, expect, it } from "vitest";
import { ADMIN_TAPS, TAP_WINDOW_MS, parseVideoUrl, registerTap } from "@/lib/video-utils";

describe("hidden admin taps", () => {
  it("opens the admin page on the 7th quick tap", () => {
    let s = { count: 0, last: 0 };
    let unlocked = false;
    for (let i = 0; i < 7; i++) {
      const r = registerTap(s, 10_000 + i * 300);
      s = r;
      unlocked = r.unlocked;
      if (i < 6) expect(r.unlocked).toBe(false);
    }
    expect(ADMIN_TAPS).toBe(7);
    expect(unlocked).toBe(true);
  });

  it("starts the count over after a pause", () => {
    let s = { count: 0, last: 0 };
    for (let i = 0; i < 6; i++) s = registerTap(s, 10_000 + i * 300);
    const r = registerTap(s, s.last + TAP_WINDOW_MS + 1);
    expect(r.count).toBe(1);
    expect(r.unlocked).toBe(false);
  });
});

describe("video links", () => {
  it("accepts YouTube links in common forms", () => {
    for (const u of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtu.be/dQw4w9WgXcQ",
      "https://youtube.com/shorts/dQw4w9WgXcQ",
    ]) {
      expect(parseVideoUrl(u)).toEqual({ kind: "youtube", id: "dQw4w9WgXcQ" });
    }
  });

  it("accepts Vimeo and direct MP4 links", () => {
    expect(parseVideoUrl("https://vimeo.com/76979871")).toEqual({ kind: "vimeo", id: "76979871" });
    expect(parseVideoUrl("https://example.com/a/clip.mp4")?.kind).toBe("file");
  });

  it("rejects links that are not videos", () => {
    expect(parseVideoUrl("https://example.com/page")).toBeNull();
    expect(parseVideoUrl("javascript:alert(1)")).toBeNull();
    expect(parseVideoUrl("not a url")).toBeNull();
  });
});
