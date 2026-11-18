import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { registerTap } from "@/lib/video-utils";

// Invisible bottom-right corner: 7 quick taps open the admin page.
export function SecretTapZone() {
  const navigate = useNavigate();
  const state = useRef({ count: 0, last: 0 });
  return (
    <div
      aria-hidden="true"
      data-testid="secret-tap-zone"
      className="fixed bottom-0 right-0 z-50 size-14 select-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
      onClick={() => {
        const next = registerTap(state.current, Date.now());
        state.current = { count: next.unlocked ? 0 : next.count, last: next.last };
        if (next.unlocked) navigate({ to: "/admin" });
      }}
    />
  );
}
