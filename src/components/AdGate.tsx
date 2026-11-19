import { useEffect, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { AD_COUNT, AD_SECONDS, buildAdDocument } from "@/lib/ads";
import { VideoThumb } from "@/components/VideoThumb";
import { Button } from "@/components/ui/button";

const BN = "০১২৩৪৫৬৭৮৯";
const bnDigits = (n: number) => String(n).replace(/\d/g, (d) => BN.charAt(Number(d)));

export function AdGate({
  index,
  code,
  videoUrl,
  onDone,
}: {
  index: number;
  code: string;
  videoUrl: string;
  onDone: () => void;
}) {
  const [left, setLeft] = useState(AD_SECONDS);

  useEffect(() => {
    setLeft(AD_SECONDS);
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [index]);

  const last = index >= AD_COUNT;
  const hasCode = code.trim().length > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-glow)]">
      <div className="absolute inset-0 opacity-20 blur-2xl">
        <VideoThumb url={videoUrl} />
      </div>
      <div className="relative flex items-center justify-between gap-3 px-4 pt-3 text-xs">
        <span className="rounded-full bg-accent px-2.5 py-1 font-bold text-accent-foreground">
          বিজ্ঞাপন {bnDigits(index)}/{bnDigits(AD_COUNT)}
        </span>
        <span className="text-muted-foreground">ভিডিও দেখতে {bnDigits(AD_COUNT)}টি বিজ্ঞাপন দেখুন</span>
      </div>
      <div className="relative mx-4 mt-3 grid min-h-[250px] place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-background/60 sm:aspect-video sm:min-h-0">
        {hasCode ? (
          <iframe
            key={index}
            title={`বিজ্ঞাপন ${index}`}
            srcDoc={buildAdDocument(code)}
            sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">বিজ্ঞাপনের জায়গা {bnDigits(index)}</p>
            <p className="mt-1">এডমিন পেজ থেকে বিজ্ঞাপনের কোড বসালে এখানে দেখা যাবে।</p>
          </div>
        )}
      </div>
      <div className="relative flex justify-end p-4">
        <Button onClick={onDone} disabled={left > 0} className="min-w-44">
          {left > 0 ? (
            `${bnDigits(left)} সেকেন্ড অপেক্ষা করুন`
          ) : last ? (
            <>
              <Play className="fill-current" /> ভিডিও দেখুন
            </>
          ) : (
            <>
              পরের বিজ্ঞাপন <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
