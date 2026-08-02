import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Compass, Eye, Loader2, Rocket, ScrollText, SplitSquareHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { createCampaignFn } from "@/lib/campaign.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Starfinder 2e Campaign Hub — GM Prep & Player Board" },
      {
        name: "description",
        content:
          "Plan a five-session Starfinder 2e campaign: milestones, content cards for NPCs and locations, session recaps, and a live player board you control.",
      },
      { property: "og:title", content: "Starfinder 2e Campaign Hub" },
      {
        property: "og:description",
        content:
          "GM prep and a reveal-controlled player board for a five-session Starfinder 2e campaign.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: Compass,
    title: "Five-session spine",
    body: "Every session gets goals, scene beats, off-script fallbacks, and a recap you can read aloud next time.",
  },
  {
    icon: ScrollText,
    title: "Content cards",
    body: "Locations, NPCs, player characters, creatures, items, handouts — plus puzzles with a hint ladder so you never improvise a nudge.",
  },
  {
    icon: SplitSquareHorizontal,
    title: "Two views, one link each",
    body: "Your GM link shows everything. The player link shows only what you've shared, and updates within seconds.",
  },
  {
    icon: Eye,
    title: "Reveal control",
    body: "Every card is hidden, shared, or shared with secrets. Flip it mid-scene and the table screen follows.",
  },
];

function Index() {
  const navigate = useNavigate();
  const create = useServerFn(createCampaignFn);
  const { signedIn, loading } = useAuth();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Google OAuth returns to the origin; finish the hop the user started.
  useEffect(() => {
    if (!signedIn) return;
    const next = sessionStorage.getItem("post_auth_next");
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      sessionStorage.removeItem("post_auth_next");
      navigate({ to: next, replace: true });
    }
  }, [signedIn, navigate]);

  async function start() {
    if (!signedIn) {
      sessionStorage.setItem("post_auth_next", "/campaigns");
      navigate({ to: "/auth", search: { next: "/campaigns" } });
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await create({ data: { name } });
      navigate({ to: "/gm/$token", params: { token: res.gmToken } });
    } catch {
      setError("Couldn't create the campaign. Try again in a moment.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-primary">
          <Rocket className="size-5" />
          <span className="label-eyebrow text-primary">Starfinder 2e · Game Master Hub</span>
        </div>
        {loading ? null : signedIn ? (
          <Link to="/campaigns">
            <Button size="sm" variant="secondary">
              My campaigns
            </Button>
          </Link>
        ) : (
          <Link to="/auth" search={{ next: "/campaigns" }}>
            <Button size="sm" variant="secondary">
              Sign in
            </Button>
          </Link>
        )}
      </div>


      <h1 className="mt-5 max-w-3xl text-4xl leading-tight font-semibold sm:text-5xl">
        Run your first five sessions without holding it all in your head.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        A prep desk for new GMs: story milestones, content cards, a rules cheat sheet, and a
        second-screen player board where you decide exactly what the table sees and when.
      </p>

      <div className="panel mt-8 max-w-xl p-5">
        <label htmlFor="campaign-name" className="label-eyebrow">
          Name your campaign
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input
            id="campaign-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !busy && start()}
            placeholder="The Drift Wreck of Absalom Station"
            className="bg-background/60"
          />
          <Button onClick={start} disabled={busy} className="shrink-0">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
            Create campaign
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          No sign-up. You get one private GM link and one shareable player link — bookmark the GM
          link, it's the only way back in.
        </p>
        {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <section key={f.title} className="panel p-5">
            <f.icon className="size-5 text-accent" />
            <h2 className="mt-3 text-base font-semibold">{f.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
