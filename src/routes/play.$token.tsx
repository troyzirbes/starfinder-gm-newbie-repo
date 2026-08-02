import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock } from "lucide-react";

import { PlayerBoardView } from "@/components/campaign/PlayerBoardView";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getMemberPlayerViewFn } from "@/lib/account.functions";

export const Route = createFileRoute("/play/$token")({
  head: () => ({
    meta: [
      { title: "Player Board — Starfinder 2e Campaign" },
      {
        name: "description",
        content:
          "Everything your GM has shared: locations, NPCs, handouts, puzzle hints, story milestones, and session recaps.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Player Board — Starfinder 2e Campaign" },
      {
        property: "og:description",
        content: "Live table board with the locations, NPCs, and recaps your GM has shared.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlayerBoard,
});

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-md px-5 py-24 text-center">{children}</div>;
}

function PlayerBoard() {
  const { token } = Route.useParams();
  const { signedIn, loading: authLoading } = useAuth();
  const getView = useServerFn(getMemberPlayerViewFn);

  const { data, isLoading } = useQuery({
    queryKey: ["play", token],
    queryFn: () => getView({ data: { token } }),
    enabled: signedIn,
    refetchInterval: 6000,
    refetchOnWindowFocus: true,
  });

  if (authLoading || (signedIn && isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!signedIn) {
    return (
      <Shell>
        <Lock className="mx-auto size-6 text-primary" />
        <h1 className="mt-3 text-xl font-semibold">Sign in to see this board</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your GM invited you by email. Sign in with that address and the board opens.
        </p>
        <Link to="/auth" search={{ next: `/play/${token}` }}>
          <Button className="mt-5">Sign in</Button>
        </Link>
      </Shell>
    );
  }

  if (!data || data.status === "missing") {
    return (
      <Shell>
        <h1 className="text-xl font-semibold">This board isn't available</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask your GM to re-send the player link.
        </p>
      </Shell>
    );
  }

  if (data.status === "forbidden" || !data.view) {
    return (
      <Shell>
        <Lock className="mx-auto size-6 text-muted-foreground" />
        <h1 className="mt-3 text-xl font-semibold">You're not on this roster</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask your GM to invite the email address you signed in with.
        </p>
        <Link to="/campaigns">
          <Button variant="secondary" className="mt-5">
            My campaigns
          </Button>
        </Link>
      </Shell>
    );
  }

  const view = data.view;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header>
        <span className="label-eyebrow text-accent">
          Player board · {view.campaign.system}
        </span>
        <h1 className="mt-1 text-3xl font-semibold">{view.campaign.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Updates automatically as your GM shares things. Nothing hidden is loaded here.
        </p>
      </header>
      <div className="mt-6">
        <PlayerBoardView data={view} />
      </div>
    </main>
  );
}
