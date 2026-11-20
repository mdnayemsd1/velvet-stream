import { describe, expect, it } from "vitest";
import { AD_COUNT, AD_SECONDS, firstAdStep, isValidAdUrl, nextAdStep } from "@/lib/ads";

describe("ads before every video", () => {
  it("shows exactly 2 ads before the video plays", () => {
    let step = firstAdStep();
    const seen: number[] = [];
    while (step.kind === "ad") {
      seen.push(step.index);
      step = nextAdStep(step);
    }
    expect(AD_COUNT).toBe(2);
    expect(seen).toEqual([1, 2]);
    expect(step.kind).toBe("video");
  });

  it("makes each ad wait 15 seconds in a new tab", () => {
    expect(AD_SECONDS).toBe(15);
  });

  it("accepts only http(s) ad links, empty allowed", () => {
    expect(isValidAdUrl("")).toBe(true);
    expect(isValidAdUrl("https://ads.example.com/click?id=1")).toBe(true);
    expect(isValidAdUrl("http://ads.example.com")).toBe(true);
    expect(isValidAdUrl("javascript:alert(1)")).toBe(false);
    expect(isValidAdUrl("<script>alert(1)</script>")).toBe(false);
    expect(isValidAdUrl("not a url")).toBe(false);
  });
});
