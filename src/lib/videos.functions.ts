import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { parseVideoUrl } from "./video-utils";
import { AD_COUNT, isValidAdUrl } from "./ads";
import {
  LOCKOUT_MINUTES,
  MAX_FAILED_LOGINS,
  clientIp,
  getAdminSession,
  isAdmin,
  passwordMatches,
  requireAdmin,
} from "./admin.server";

export type Video = { id: string; title: string; url: string; created_at: string };

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listVideos = createServerFn({ method: "GET" }).handler(async (): Promise<Video[]> => {
  const { data, error } = await publicClient()
    .from("videos")
    .select("id, title, url, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getVideo = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => {
    if (!/^[0-9a-f-]{36}$/i.test(input.id)) throw new Error("Invalid id");
    return input;
  })
  .handler(async ({ data }): Promise<Video | null> => {
    const { data: row, error } = await publicClient()
      .from("videos")
      .select("id, title, url, created_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => ({
  loggedIn: await isAdmin(),
}));

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: { password: string }) => ({ password: String(input.password ?? "").slice(0, 500) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ip = clientIp();
    const since = new Date(Date.now() - LOCKOUT_MINUTES * 60_000).toISOString();
    const { count } = await supabaseAdmin
      .from("admin_login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since);
    if ((count ?? 0) >= MAX_FAILED_LOGINS) {
      return { ok: false as const, error: `অনেকবার ভুল পাসওয়ার্ড। ${LOCKOUT_MINUTES} মিনিট পরে আবার চেষ্টা করুন।` };
    }
    if (!(await passwordMatches(data.password))) {
      await supabaseAdmin.from("admin_login_attempts").insert({ ip });
      return { ok: false as const, error: "পাসওয়ার্ড ভুল হয়েছে।" };
    }
    await supabaseAdmin.from("admin_login_attempts").delete().eq("ip", ip);
    const session = await getAdminSession();
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  await session.clear();
  return { ok: true };
});

export const addVideo = createServerFn({ method: "POST" })
  .inputValidator((input: { title: string; url: string }) => {
    const title = String(input.title ?? "").trim();
    const url = String(input.url ?? "").trim();
    if (!title) throw new Error("ভিডিওর নাম লিখুন।");
    if (title.length > 200) throw new Error("নাম ২০০ অক্ষরের বেশি হতে পারবে না।");
    if (!parseVideoUrl(url)) throw new Error("সঠিক YouTube, Vimeo বা MP4/WebM লিংক দিন।");
    return { title, url };
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("videos").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteVideo = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => {
    if (!/^[0-9a-f-]{36}$/i.test(input.id)) throw new Error("Invalid id");
    return input;
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("videos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type AdCodes = Record<number, string>;

export const getAds = createServerFn({ method: "GET" }).handler(async (): Promise<AdCodes> => {
  const { data, error } = await publicClient().from("ad_slots").select("slot, code");
  if (error) throw new Error(error.message);
  const out: AdCodes = {};
  for (let i = 1; i <= AD_COUNT; i++) out[i] = data?.find((r) => r.slot === i)?.code ?? "";
  return out;
});

export const saveAds = createServerFn({ method: "POST" })
  .inputValidator((input: { codes: string[] }) => {
    const codes = Array.from({ length: AD_COUNT }, (_, i) => String(input.codes?.[i] ?? "").trim());
    if (codes.some((c) => !isValidAdUrl(c))) throw new Error("বিজ্ঞাপনের লিংক ঠিক নেই। http:// বা https:// দিয়ে শুরু হওয়া লিংক দিন।");
    return { codes };
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = data.codes.map((code, i) => ({ slot: i + 1, code, updated_at: new Date().toISOString() }));
    const { error } = await supabaseAdmin.from("ad_slots").upsert(rows, { onConflict: "slot" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
