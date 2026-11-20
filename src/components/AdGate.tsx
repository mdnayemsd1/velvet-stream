import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Play } from "lucide-react";
import { AD_COUNT, AD_SECONDS } from "@/lib/ads";
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
  const [opened, setOpened] = useState(false);
  const [left, setLeft] = useState(AD_SECONDS);

  useEffect(() => {
    setOpened(false);
    setLeft(AD_SECONDS);
  }, [index]);

  useEffect(() => {
    if (!opened) return;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [index, opened]);

  const last = index >= AD_COUNT;
  const hasAd = code.trim().length > 0;
  const waiting = opened && left > 0;
  const progress = opened ? ((AD_SECONDS - left) / AD_SECONDS) * 100 : 0;

  const openAd = () => {
    if (hasAd) window.open(code, "_blank", "noopener,noreferrer");
    setOpened(true);
  };

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
        <div className="p-6 text-center">
          {!opened ? (
            <>
              <p className="text-sm font-semibold text-foreground">বিজ্ঞাপন {bnDigits(index)} নতুন ট্যাবে খুলবে</p>
              <p className="mt-1 text-xs text-muted-foreground">
                নিচের বাটনে চাপ দিলে বিজ্ঞাপনটি অন্য ট্যাবে ওপেন হবে।
              </p>
            </>
          ) : waiting ? (
            <>
              <p className="font-display text-4xl font-bold text-accent">{bnDigits(left)}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">সেকেন্ড অপেক্ষা করুন</p>
              <p className="mt-1 text-xs text-muted-foreground">বিজ্ঞাপনটি অন্য ট্যাবে খুলেছে।</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground">বিজ্ঞাপন {bnDigits(index)} দেখা শেষ!</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {last ? "এবার ভিডিওটি দেখুন।" : "এবার পরের বিজ্ঞাপনে যান।"}
              </p>
            </>
          )}
        </div>
        {opened && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-muted">
            <div className="h-full bg-accent transition-[width] duration-1000 ease-linear" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      <div className="relative flex justify-end p-4">
        {!opened ? (
          <Button onClick={openAd} className="min-w-44">
            <ExternalLink /> বিজ্ঞাপন {bnDigits(index)} খুলুন
          </Button>
        ) : (
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
        )}
      </div>
    </div>
  );
}
