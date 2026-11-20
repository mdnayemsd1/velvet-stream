// Browser-safe ad gate rules: every video plays only after the viewer opens AD_COUNT ads,
// each in a new browser tab, waiting at least AD_SECONDS seconds per ad.
export const AD_COUNT = 2;
export const AD_SECONDS = 15;
export const AD_URL_MAX = 2000;

export type AdStep = { kind: "ad"; index: number } | { kind: "video" };

export const firstAdStep = (): AdStep => ({ kind: "ad", index: 1 });

export function nextAdStep(step: AdStep): AdStep {
  if (step.kind === "video") return step;
  return step.index < AD_COUNT ? { kind: "ad", index: step.index + 1 } : { kind: "video" };
}

// Ad slots store a direct link (e.g. from an ad network) that opens in a new tab.
// Empty string is allowed: the viewer still waits, but no tab opens.
export function isValidAdUrl(value: string) {
  if (!value) return true;
  if (value.length > AD_URL_MAX) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
