// Browser-safe ad gate rules: every video plays only after the viewer sees AD_COUNT ads,
// each shown for at least AD_SECONDS seconds.
export const AD_COUNT = 2;
export const AD_SECONDS = 5;
export const AD_CODE_MAX = 20000;

export type AdStep = { kind: "ad"; index: number } | { kind: "video" };

export const firstAdStep = (): AdStep => ({ kind: "ad", index: 1 });

export function nextAdStep(step: AdStep): AdStep {
  if (step.kind === "video") return step;
  return step.index < AD_COUNT ? { kind: "ad", index: step.index + 1 } : { kind: "video" };
}

// Wraps admin-pasted ad code in a full document for a sandboxed iframe.
export function buildAdDocument(code: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><style>html,body{margin:0;height:100%;background:transparent;color:#eee;font-family:sans-serif}body{display:flex;align-items:center;justify-content:center;overflow:hidden}img{max-width:100%;max-height:100%;height:auto}</style></head><body>${code}</body></html>`;
}
