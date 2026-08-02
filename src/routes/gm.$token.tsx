import { useCallback, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Check,
  Copy,
  ExternalLink,
  Flag,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import { AutoField } from "@/components/campaign/AutoField";
import { CardEditor } from "@/components/campaign/CardEditor";
import { CheatSheet } from "@/components/campaign/CheatSheet";
import { InitiativeTracker } from "@/components/campaign/InitiativeTracker";
import { RevealToggle } from "@/components/campaign/RevealToggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteRowFn,
  getGmViewFn,
  insertRowFn,
  renameCampaignFn,
  updateRowFn,
} from "@/lib/campaign.functions";
import type { CardRow, CardType, MilestoneRow, SessionRow } from "@/lib/campaign.server";
import { cardTypeMeta, cardTypeOrder, revealMeta } from "@/lib/card-meta";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gm/$token")({
  head: () => ({
    meta: [
      { title: "GM Desk — Starfinder 2e Campaign Hub" },
      {
        name: "description",
        content:
          "Private game master workspace: session prep, milestones, content cards, reveal control, and a Starfinder 2e rules cheat sheet.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "GM Desk — Starfinder 2e Campaign Hub" },
      { property: "og:description", content: "Private game master workspace for your campaign." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GmDesk,
});

function CopyLink({ label, path }: { label: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === "undefined" ? path : window.location.origin + path;
  return (
    <div className="flex items-center gap-1.5">
      <span className="label-eyebrow">{label}</span>
      <Button
        size="sm"
        variant="secondary"
        className="h-7 gap-1.5 text-xs"
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </Button>
      <a href={path} target="_blank" rel="noreferrer">
        <Button size="icon" variant="ghost" className="size-7">
          <ExternalLink className="size-3.5" />
        </Button>
      </a>
    </div>
  );
}

function GmDesk() {
  const { token } = Route.useParams();
  const qc = useQueryClient();
  const getView = useServerFn(getGmViewFn);
  const update = useServerFn(updateRowFn);
  const insert = useServerFn(insertRowFn);
  const remove = useServerFn(deleteRowFn);
  const rename = useServerFn(renameCampaignFn);

  const key = ["gm", token];
  const { data, isLoading } = useQuery({
    queryKey: key,
    queryFn: () => getView({ data: { token } }),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: key });

  const patchMut = useMutation({
    mutationFn: (v: {
      kind: "session" | "milestone" | "card";
      id: string;
      patch: Record<string, unknown>;
    }) => update({ data: { token, ...v } }),
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData(key);
      qc.setQueryData(key, (old: typeof data) => {
        if (!old) return old;
        const bucket =
          v.kind === "session" ? "sessions" : v.kind === "milestone" ? "milestones" : "cards";
        return {
          ...old,
          [bucket]: (old[bucket] as { id: string }[]).map((r) =>
            r.id === v.id ? { ...r, ...v.patch } : r,
          ),
        };
      });
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx && qc.setQueryData(key, ctx.prev),
    onSettled: invalidate,
  });

  const patch = useCallback(
    (kind: "session" | "milestone" | "card", id: string, p: Record<string, unknown>) =>
      patchMut.mutate({ kind, id, patch: p }),
    [patchMut],
  );

  const insertMut = useMutation({
    mutationFn: (v: { kind: "milestone" | "card"; patch: Record<string, unknown> }) =>
      insert({ data: { token, ...v } }),
    onSuccess: invalidate,
  });
  const deleteMut = useMutation({
    mutationFn: (v: { kind: "milestone" | "card"; id: string }) =>
      remove({ data: { token, ...v } }),
    onSuccess: invalidate,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<CardType | "all">("all");

  const cards = data?.cards ?? [];
  const editing = cards.find((c) => c.id === editingId) ?? null;
  const pcNames = useMemo(
    () => cards.filter((c) => c.type === "pc" || c.type === "creature").map((c) => c.name),
    [cards],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-xl font-semibold">This GM link doesn't exist</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Double-check the URL, or create a new campaign from the home page.
        </p>
      </div>
    );
  }

  const { campaign, sessions, milestones } = data;
  const shown = filter === "all" ? cards : cards.filter((c) => c.type === filter);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-64 flex-1">
          <span className="label-eyebrow text-primary">Game Master desk · Starfinder 2e</span>
          <AutoField
            className="mt-1"
            value={campaign.name}
            onCommit={(v) => rename({ data: { token, name: v } }).then(invalidate)}
          />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <CopyLink label="Player board" path={`/play/${campaign.player_token}`} />
          <CopyLink label="This GM desk" path={`/gm/${campaign.gm_token}`} />
        </div>
      </header>

      <Tabs defaultValue="sessions" className="mt-7">
        <TabsList className="flex-wrap">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="cards">Cards ({cards.length})</TabsTrigger>
          <TabsTrigger value="table">At the table</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-5 space-y-4">
          {sessions.map((s: SessionRow) => (
            <section key={s.id} className="panel p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 font-mono text-sm text-primary">
                    {s.number}
                  </span>
                  <div className="min-w-56 flex-1">
                    <AutoField value={s.title} onCommit={(v) => patch("session", s.id, { title: v })} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {(["planned", "next", "played"] as const).map((st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant="ghost"
                      onClick={() => patch("session", s.id, { status: st })}
                      className={cn(
                        "h-7 px-2 text-xs capitalize",
                        s.status === st ? "bg-primary/20 text-primary" : "text-muted-foreground",
                      )}
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
                <AutoField
                  label="Read-aloud intro"
                  value={s.intro}
                  multiline
                  rows={4}
                  hint="The opening everyone hears — read it out at the top of the session"
                  placeholder={'"Security Team 4, please wake up…"'}
                  onCommit={(v) => patch("session", s.id, { intro: v })}
                />
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={s.intro_published}
                    onCheckedChange={(c) => patch("session", s.id, { intro_published: c === true })}
                  />
                  <span className="text-muted-foreground">
                    Show this intro on the player board
                  </span>
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">

                <AutoField
                  label="Goals for this session"
                  value={s.goals}
                  multiline
                  rows={3}
                  onCommit={(v) => patch("session", s.id, { goals: v })}
                />
                <AutoField
                  label="Scene beats"
                  value={s.scenes}
                  multiline
                  rows={3}
                  placeholder={"1. Cold open…\n2. Investigation…\n3. Confrontation…"}
                  onCommit={(v) => patch("session", s.id, { scenes: v })}
                />
                <AutoField
                  label="If they go off-script"
                  value={s.fallbacks}
                  multiline
                  rows={3}
                  hint="Two fallbacks are enough"
                  onCommit={(v) => patch("session", s.id, { fallbacks: v })}
                />
                <AutoField
                  label="GM notes"
                  value={s.gm_notes}
                  multiline
                  rows={3}
                  onCommit={(v) => patch("session", s.id, { gm_notes: v })}
                />
              </div>

              <div className="mt-4 rounded-lg border border-accent/30 bg-accent/5 p-3">
                <AutoField
                  label="Session recap"
                  value={s.recap}
                  multiline
                  rows={4}
                  placeholder="What the crew did, what changed, what's chasing them now."
                  onCommit={(v) => patch("session", s.id, { recap: v })}
                />
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={s.recap_published}
                    onCheckedChange={(c) =>
                      patch("session", s.id, { recap_published: c === true })
                    }
                  />
                  <span className="text-muted-foreground">Publish this recap to the player board</span>
                </label>
              </div>
            </section>
          ))}
        </TabsContent>

        <TabsContent value="milestones" className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              The beats the story has to hit. Tick them off as they land.
            </p>
            <Button
              size="sm"
              onClick={() =>
                insertMut.mutate({
                  kind: "milestone",
                  patch: { title: "New milestone", order_index: milestones.length },
                })
              }
            >
              <Plus className="size-4" /> Milestone
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {milestones.map((m: MilestoneRow) => (
              <section key={m.id} className="panel p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    className="mt-1"
                    checked={m.achieved}
                    onCheckedChange={(c) => patch("milestone", m.id, { achieved: c === true })}
                  />
                  <div className="flex-1 space-y-3">
                    <AutoField value={m.title} onCommit={(v) => patch("milestone", m.id, { title: v })} />
                    <AutoField
                      label="What the players know"
                      value={m.description}
                      multiline
                      rows={2}
                      onCommit={(v) => patch("milestone", m.id, { description: v })}
                    />
                    <AutoField
                      label="GM only"
                      value={m.gm_notes}
                      multiline
                      rows={2}
                      onCommit={(v) => patch("milestone", m.id, { gm_notes: v })}
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={m.visible_to_players}
                        onCheckedChange={(c) =>
                          patch("milestone", m.id, { visible_to_players: c === true })
                        }
                      />
                      <span className="text-muted-foreground">Show on the player board</span>
                    </label>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteMut.mutate({ kind: "milestone", id: m.id })}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </section>
            ))}
            {milestones.length === 0 ? (
              <div className="panel flex flex-col items-center gap-2 p-10 text-center">
                <Flag className="size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No milestones yet. Five to eight is plenty for a five-session arc.
                </p>
              </div>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="cards" className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFilter("all")}
                className={cn("h-7 px-2 text-xs", filter === "all" && "bg-secondary")}
              >
                All
              </Button>
              {cardTypeOrder.map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant="ghost"
                  onClick={() => setFilter(t)}
                  className={cn("h-7 px-2 text-xs", filter === t && "bg-secondary")}
                >
                  {cardTypeMeta[t].plural}
                </Button>
              ))}
            </div>
            <Button
              size="sm"
              onClick={() =>
                insertMut.mutate(
                  {
                    kind: "card",
                    patch: {
                      type: filter === "all" ? "npc" : filter,
                      name: "New card",
                      order_index: cards.length,
                    },
                  },
                  { onSuccess: (r) => setEditingId((r as { id: string }).id) },
                )
              }
            >
              <Plus className="size-4" /> New card
            </Button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((c: CardRow) => {
              const Icon = cardTypeMeta[c.type].icon;
              return (
                <article key={c.id} className="panel flex flex-col p-4">
                  <button className="text-left" onClick={() => setEditingId(c.id)}>
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-accent" />
                      <span className="label-eyebrow">{cardTypeMeta[c.type].label}</span>
                    </div>
                    <h3 className="mt-2 font-semibold">{c.name}</h3>
                    {c.subtitle ? (
                      <p className="text-xs text-muted-foreground">{c.subtitle}</p>
                    ) : null}
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {c.player_text || c.gm_secrets || "No text yet."}
                    </p>
                  </button>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                    <RevealToggle
                      size="sm"
                      value={c.reveal_state}
                      onChange={(v) => patch("card", c.id, { reveal_state: v })}
                    />
                    <span className={cn("text-[11px]", revealMeta[c.reveal_state].tone)}>
                      {revealMeta[c.reveal_state].short}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
          {shown.length === 0 ? (
            <p className="panel mt-4 p-10 text-center text-sm text-muted-foreground">
              Nothing here yet. Cards start hidden — reveal them when the table earns it.
            </p>
          ) : null}
        </TabsContent>

        <TabsContent value="table" className="mt-5 space-y-4">
          <InitiativeTracker suggestions={pcNames} />
          <section className="panel p-4">
            <h3 className="text-sm font-semibold">Live reveal board</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Flip anything here without leaving the tab. The player board follows within seconds.
            </p>
            <ul className="mt-3 divide-y divide-border/60">
              {cards.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="truncate text-sm">
                    <span className="text-muted-foreground">{cardTypeMeta[c.type].label} · </span>
                    {c.name}
                  </span>
                  <RevealToggle
                    size="sm"
                    value={c.reveal_state}
                    onChange={(v) => patch("card", c.id, { reveal_state: v })}
                  />
                </li>
              ))}
            </ul>
          </section>
        </TabsContent>

        <TabsContent value="rules" className="mt-5">
          <CheatSheet />
        </TabsContent>
      </Tabs>

      <CardEditor
        card={editing}
        onClose={() => setEditingId(null)}
        onPatch={(id, p) => patch("card", id, p)}
        onDelete={(id) => deleteMut.mutate({ kind: "card", id })}
      />
    </main>
  );
}
