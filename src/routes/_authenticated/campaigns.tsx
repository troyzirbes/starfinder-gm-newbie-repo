import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, LogOut, Plus, Rocket, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { claimCampaignFn, listMyCampaignsFn } from "@/lib/account.functions";
import { createCampaignFn } from "@/lib/campaign.functions";

export const Route = createFileRoute("/_authenticated/campaigns")({
  head: () => ({
    meta: [
      { title: "My Campaigns — Starfinder 2e Campaign Hub" },
      {
        name: "description",
        content:
          "Every Starfinder 2e campaign you run or play in, with GM desks, player boards, and rosters in one place.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "My Campaigns — Starfinder 2e Campaign Hub" },
      {
        property: "og:description",
        content: "Your GM desks and the player boards you've been invited to.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Campaigns,
});

function Campaigns() {
  const navigate = useNavigate();
  const list = useServerFn(listMyCampaignsFn);
  const create = useServerFn(createCampaignFn);
  const claim = useServerFn(claimCampaignFn);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [claimLink, setClaimLink] = useState("");
  const [claimNote, setClaimNote] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-campaigns"],
    queryFn: () => list(),
  });

  async function newCampaign() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await create({ data: { name } });
      navigate({ to: "/gm/$token", params: { token: res.gmToken } });
    } finally {
      setBusy(false);
      refetch();
    }
  }

  async function claimByLink() {
    const token = claimLink.trim().split("/").pop() ?? "";
    if (token.length < 6) {
      setClaimNote("That doesn't look like a GM link.");
      return;
    }
    setClaimNote("");
    try {
      const res = await claim({ data: { token } });
      if (res.ok && res.owned) {
        setClaimLink("");
        setClaimNote("Added to your list.");
        refetch();
      } else {
        setClaimNote("That campaign already belongs to another account.");
      }
    } catch {
      setClaimNote("Couldn't find a campaign for that link.");
    }
  }


  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: {}, replace: true });
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="size-4" />
            <span className="label-eyebrow text-primary">Starfinder 2e · Campaign Hub</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold">My campaigns</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5">
          <LogOut className="size-4" /> Sign out
        </Button>
      </header>

      <section className="panel mt-6 flex flex-wrap items-end gap-2 p-4">
        <div className="min-w-56 flex-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New campaign name"
            maxLength={120}
            onKeyDown={(e) => e.key === "Enter" && newCampaign()}
          />
        </div>
        <Button onClick={newCampaign} disabled={busy} className="gap-1.5">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Create campaign
        </Button>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <h2 className="mt-8 text-sm font-semibold tracking-wide">Campaigns you run</h2>
          <div className="mt-3 space-y-2">
            {(data?.owned ?? []).map((c) => (
              <div key={c.id} className="panel flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-40 flex-1">
                  <h3 className="font-medium">{c.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3.5" />
                    {c.playerCount} {c.playerCount === 1 ? "player" : "players"} · {c.system}
                  </p>
                </div>
                {c.gmToken ? (
                  <Link to="/gm/$token" params={{ token: c.gmToken }}>
                    <Button size="sm">Open GM desk</Button>
                  </Link>
                ) : null}
              </div>
            ))}
            {(data?.owned ?? []).length === 0 ? (
              <p className="panel p-8 text-center text-sm text-muted-foreground">
                No campaigns yet. Name one above to start.
              </p>
            ) : null}
          </div>

          {(data?.playing ?? []).length > 0 ? (
            <>
              <h2 className="mt-8 text-sm font-semibold tracking-wide">Campaigns you play in</h2>
              <div className="mt-3 space-y-2">
                {(data?.playing ?? []).map((c) => (
                  <div key={c.id} className="panel flex flex-wrap items-center gap-3 p-4">
                    <div className="min-w-40 flex-1">
                      <h3 className="font-medium">{c.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.system}</p>
                    </div>
                    <Link to="/play/$token" params={{ token: c.playerToken }}>
                      <Button size="sm" variant="secondary">
                        Open player board
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </>
      )}
    </main>
  );
}
