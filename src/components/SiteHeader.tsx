import { Link } from "@tanstack/react-router";
import logo from "@/assets/lumora-logo.svg";

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="" width={32} height={32} />
          <span className="font-display text-xl font-bold tracking-tight">Lumora</span>
        </Link>
        <div className="ml-auto flex min-w-0 flex-1 justify-end">{children}</div>
      </div>
    </header>
  );
}
