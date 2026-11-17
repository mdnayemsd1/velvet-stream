import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/lumora-logo.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumora — Premium streaming site for Cloudflare Pages" },
      {
        name: "description",
        content:
          "Download Lumora: a premium video streaming website with a hidden admin studio, built for Cloudflare Pages, Functions and D1.",
      },
      { property: "og:title", content: "Lumora — Premium streaming site for Cloudflare Pages" },
      {
        property: "og:description",
        content: "A premium video streaming website with a hidden admin studio, ready for Cloudflare Pages and D1.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  { title: "Push to GitHub", text: "Unzip the package and push it to a new repository." },
  { title: "Create the D1 database", text: "Create “lumora-db”, run schema.sql, and paste its ID into wrangler.toml." },
  { title: "Connect Cloudflare Pages", text: "Choose the repo, set the output folder to “public” and leave the build command empty." },
  { title: "Add two secrets", text: "Add ADMIN_PASSWORD and SESSION_SECRET in Settings → Variables and Secrets, then redeploy." },
];

function Index() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-5 py-16">
      <header className="flex items-center gap-3">
        <img src={logo} alt="" width={44} height={44} className="drop-shadow-[var(--shadow-glow)]" />
        <span className="font-display text-2xl font-bold tracking-tight">Lumora</span>
      </header>

      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Cloudflare Pages · Functions · D1</p>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          Your premium streaming site is{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">ready to deploy</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          The full source code is in your Files as <strong className="text-foreground">lumora-stream.zip</strong>,
          including the hidden 7-tap admin studio, the database setup and the README.
        </p>
      </section>

      <ol className="grid gap-3 sm:grid-cols-2">
        {steps.map((step, i) => (
          <li key={step.title} className="glass rounded-2xl p-5">
            <span className="bg-brand-gradient inline-grid size-8 place-items-center rounded-full text-sm font-bold text-primary-foreground">
              {i + 1}
            </span>
            <h2 className="mt-3 font-display text-lg font-semibold">{step.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
