import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Lock, LogOut, Trash2 } from "lucide-react";
import { adminStatusQuery, videosQuery } from "@/lib/queries";
import { addVideo, adminLogin, adminLogout, deleteVideo } from "@/lib/videos.functions";
import { parseVideoUrl, thumbnailFor } from "@/lib/video-utils";
import { SiteHeader } from "@/components/SiteHeader";
import { timeAgo } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "এডমিন — Lumora" },
      { name: "description", content: "Lumora এডমিন প্যানেল।" },
      { property: "og:title", content: "এডমিন — Lumora" },
      { property: "og:description", content: "Lumora এডমিন প্যানেল।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminStatusQuery()),
  component: AdminPage,
});

function AdminPage() {
  const { data } = useSuspenseQuery(adminStatusQuery());
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-8">{data.loggedIn ? <Dashboard /> : <LoginForm />}</main>
    </>
  );
}

function LoginForm() {
  const qc = useQueryClient();
  const login = useServerFn(adminLogin);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const m = useMutation({
    mutationFn: () => login({ data: { password } }),
    onSuccess: (res) => {
      if (!res.ok) return setError(res.error);
      setPassword("");
      qc.invalidateQueries({ queryKey: ["admin-status"] });
    },
    onError: () => setError("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।"),
  });

  return (
    <form
      className="glass mx-auto mt-10 max-w-sm space-y-5 rounded-3xl p-7"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        if (!password) return setError("পাসওয়ার্ড লিখুন।");
        m.mutate();
      }}
    >
      <div className="bg-brand-gradient mx-auto grid size-12 place-items-center rounded-full text-primary-foreground">
        <Lock className="size-5" />
      </div>
      <h1 className="text-center font-display text-2xl font-bold">এডমিন লগইন</h1>
      <div className="space-y-2">
        <Label htmlFor="password">পাসওয়ার্ড</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={m.isPending}>
        {m.isPending ? "যাচাই হচ্ছে…" : "লগইন"}
      </Button>
      <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">
        হোমপেজে ফিরে যান
      </Link>
    </form>
  );
}

function Dashboard() {
  const qc = useQueryClient();
  const { data: videos } = useSuspenseQuery(videosQuery());
  const add = useServerFn(addVideo);
  const remove = useServerFn(deleteVideo);
  const logout = useServerFn(adminLogout);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addM = useMutation({
    mutationFn: () => add({ data: { title, url } }),
    onSuccess: () => {
      setTitle("");
      setUrl("");
      toast.success("ভিডিও যোগ হয়েছে!");
      qc.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (e) => handleAuthError(e, setError, qc),
  });
  const delM = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("ভিডিও মুছে ফেলা হয়েছে।");
      qc.invalidateQueries({ queryKey: ["videos"] });
    },
    onError: (e) => handleAuthError(e, (msg) => msg && toast.error(msg), qc),
  });
  const outM = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-status"] }),
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">ভিডিও যোগ করুন</h1>
        <Button variant="ghost" size="sm" onClick={() => outM.mutate()} disabled={outM.isPending}>
          <LogOut /> লগআউট
        </Button>
      </div>

      <form
        className="glass space-y-4 rounded-3xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          if (!title.trim()) return setError("ভিডিওর নাম লিখুন।");
          if (!parseVideoUrl(url)) return setError("সঠিক YouTube, Vimeo বা MP4/WebM লিংক দিন।");
          addM.mutate();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="title">ভিডিওর নাম</Label>
          <Input id="title" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} placeholder="যেমন: আমার প্রথম ভিডিও" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">ভিডিও লিংক</Label>
          <Input id="url" type="url" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…" />
          <p className="text-xs text-muted-foreground">YouTube, Vimeo অথবা সরাসরি MP4/WebM লিংক।</p>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full sm:w-auto" disabled={addM.isPending}>
          {addM.isPending ? "যোগ হচ্ছে…" : "সাবমিট"}
        </Button>
      </form>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold">সব ভিডিও ({videos.length})</h2>
        {videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">এখনও কোনো ভিডিও যোগ করা হয়নি।</p>
        ) : (
          <ul className="space-y-3">
            {videos.map((v) => {
              const thumb = thumbnailFor(v.url);
              return (
                <li key={v.id} className="glass flex items-center gap-3 rounded-2xl p-3">
                  <div className="aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    {thumb ? <img src={thumb} alt="" className="size-full object-cover" /> : <div className="bg-brand-gradient size-full opacity-50" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(v.created_at)}</p>
                  </div>
                  <Button asChild variant="ghost" size="icon" aria-label="ভিডিও দেখুন">
                    <Link to="/watch/$id" params={{ id: v.id }}>
                      <ExternalLink />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`মুছুন: ${v.title}`}
                    className="text-destructive hover:text-destructive"
                    disabled={delM.isPending}
                    onClick={() => {
                      if (window.confirm(`"${v.title}" মুছে ফেলবেন?`)) delM.mutate(v.id);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function handleAuthError(
  e: unknown,
  show: (msg: string | null) => void,
  qc: ReturnType<typeof useQueryClient>,
) {
  const msg = e instanceof Error ? e.message : "কিছু একটা সমস্যা হয়েছে।";
  show(msg);
  if (msg.includes("লগইন")) qc.invalidateQueries({ queryKey: ["admin-status"] });
}
