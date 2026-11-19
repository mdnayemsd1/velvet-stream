import { describe, expect, it } from "vitest";
import { AD_COUNT, AD_SECONDS, firstAdStep, nextAdStep } from "@/lib/ads";

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

  it("makes each ad wait 5 seconds", () => {
    expect(AD_SECONDS).toBe(5);
  });
});
