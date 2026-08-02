import { Check, Lightbulb } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cardTypeMeta, cardTypeOrder } from "@/lib/card-meta";
import type { PlayerCard } from "@/lib/campaign.server";
import { cn } from "@/lib/utils";

export type PlayerBoardData = {
  campaign: { name: string; system: string };
  cards: PlayerCard[];
  milestones: { id: string; title: string; description: string; achieved: boolean }[];
  intros: { id: string; number: number; title: string; intro: string }[];
  recaps: { id: string; number: number; title: string; recap: string }[];
};

export function PlayerBoardView({ data }: { data: PlayerBoardData }) {
  const { cards, milestones, recaps, intros } = data;
  const grouped = cardTypeOrder
    .map((t) => ({ type: t, items: cards.filter((c) => c.type === t) }))
    .filter((g) => g.items.length > 0);

  return (
    <Tabs defaultValue="board">
      <TabsList>
        <TabsTrigger value="board">Board</TabsTrigger>
        <TabsTrigger value="story">Story ({milestones.length})</TabsTrigger>
        <TabsTrigger value="recaps">Recaps ({recaps.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="board" className="mt-5 space-y-8">
        {intros.map((s) => (
          <article key={s.id} className="panel border-primary/40 bg-primary/5 p-4">
            <span className="label-eyebrow text-primary">Session {s.number} · Briefing</span>
            <h2 className="mt-1 font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{s.intro}</p>
          </article>
        ))}

        {grouped.map((g) => {
          const Icon = cardTypeMeta[g.type].icon;
          return (
            <section key={g.type}>
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-accent" />
                <h2 className="text-sm font-semibold tracking-wide">
                  {cardTypeMeta[g.type].plural}
                </h2>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {g.items.map((c) => (
                  <article key={c.id} className="panel overflow-hidden">
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt={c.name}
                        loading="lazy"
                        className="h-40 w-full object-cover"
                      />
                    ) : null}
                    <div className="p-4">
                      <h3 className="font-semibold">{c.name}</h3>
                      {c.subtitle ? (
                        <p className="text-xs text-muted-foreground">{c.subtitle}</p>
                      ) : null}
                      {c.player_text ? (
                        <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                          {c.player_text}
                        </p>
                      ) : null}
                      {c.hints.length > 0 ? (
                        <ul className="mt-3 space-y-1.5 rounded-md border border-accent/30 bg-accent/5 p-2.5">
                          {c.hints.map((h, i) => (
                            <li key={i} className="flex gap-2 text-sm">
                              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-accent" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {c.stat_block ? (
                        <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-background/60 p-2.5 font-mono text-xs whitespace-pre-wrap text-muted-foreground">
                          {c.stat_block}
                        </pre>
                      ) : null}
                      {c.solution ? <p className="mt-3 text-sm text-accent">{c.solution}</p> : null}
                      {c.gm_secrets ? (
                        <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground">
                          {c.gm_secrets}
                        </p>
                      ) : null}
                      {c.tags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {c.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded border border-border bg-background/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
        {grouped.length === 0 ? (
          <p className="panel p-12 text-center text-sm text-muted-foreground">
            Nothing has been shared yet. This page fills in during play.
          </p>
        ) : null}
      </TabsContent>

      <TabsContent value="story" className="mt-5 space-y-2">
        {milestones.map((m) => (
          <div key={m.id} className="panel flex items-start gap-3 p-4">
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                m.achieved
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-border text-transparent",
              )}
            >
              <Check className="size-3" />
            </span>
            <div>
              <h3 className={cn("font-medium", !m.achieved && "text-muted-foreground")}>
                {m.title}
              </h3>
              {m.description ? (
                <p className="mt-0.5 text-sm text-muted-foreground">{m.description}</p>
              ) : null}
            </div>
          </div>
        ))}
        {milestones.length === 0 ? (
          <p className="panel p-12 text-center text-sm text-muted-foreground">
            No story beats revealed yet.
          </p>
        ) : null}
      </TabsContent>

      <TabsContent value="recaps" className="mt-5 space-y-3">
        {recaps.map((r) => (
          <article key={r.id} className="panel p-4">
            <span className="label-eyebrow text-primary">Session {r.number}</span>
            <h3 className="mt-1 font-semibold">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {r.recap}
            </p>
          </article>
        ))}
        {recaps.length === 0 ? (
          <p className="panel p-12 text-center text-sm text-muted-foreground">
            Recaps show up here after each session.
          </p>
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
