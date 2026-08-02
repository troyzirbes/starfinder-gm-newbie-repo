import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  basicActions,
  conditions,
  creatureXP,
  dcAdjustments,
  degreesOfSuccess,
  encounterBudget,
  gmMoves,
  levelDCs,
  natRule,
  simpleDCs,
  starfinderSpecifics,
} from "@/lib/rules-reference";

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel p-4">
      <h3 className="text-sm font-semibold tracking-wide text-foreground">{title}</h3>
      {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function CheatSheet() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filteredConditions = useMemo(
    () =>
      conditions.filter(
        (c) => !q || c.name.toLowerCase().includes(q) || c.effect.toLowerCase().includes(q),
      ),
    [q],
  );
  const filteredActions = useMemo(
    () =>
      basicActions.filter(
        (a) => !q || a.name.toLowerCase().includes(q) || a.note.toLowerCase().includes(q),
      ),
    [q],
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter conditions and actions…"
          className="bg-background/60 pl-9"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Degrees of success" subtitle={natRule}>
          <ul className="space-y-2 text-sm">
            {degreesOfSuccess.map((d) => (
              <li key={d.label} className="flex gap-3">
                <span className="w-32 shrink-0 font-medium text-primary">{d.label}</span>
                <span className="text-muted-foreground">{d.rule}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Simple DCs" subtitle="Use when difficulty depends on training, not on level.">
          <div className="flex flex-wrap gap-2">
            {simpleDCs.map((s) => (
              <div key={s.prof} className="rounded-md border border-border bg-background/50 px-3 py-2">
                <div className="label-eyebrow">{s.prof}</div>
                <div className="font-mono text-lg text-accent">{s.dc}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="label-eyebrow mb-2">Adjustments</div>
            <div className="flex flex-wrap gap-1.5">
              {dcAdjustments.map((a) => (
                <span
                  key={a.label}
                  className="rounded border border-border bg-background/50 px-2 py-1 text-xs text-muted-foreground"
                >
                  {a.label} <span className="font-mono text-foreground">{a.mod}</span>
                </span>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Level-based DCs" subtitle="The one table to grab when you need a number right now.">
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7 md:grid-cols-11">
          {levelDCs.map((l) => (
            <div
              key={l.level}
              className="rounded border border-border bg-background/50 px-2 py-1.5 text-center"
            >
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Lvl {l.level}
              </div>
              <div className="font-mono text-base text-accent">{l.dc}</div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Conditions" subtitle={`${filteredConditions.length} shown`}>
          <ul className="space-y-1.5 text-sm">
            {filteredConditions.map((c) => (
              <li key={c.name} className="rounded border border-border/60 bg-background/40 px-3 py-2">
                <span className="font-medium text-foreground">{c.name}</span>
                <span className="ml-2 text-muted-foreground">{c.effect}</span>
              </li>
            ))}
            {filteredConditions.length === 0 ? (
              <li className="text-sm text-muted-foreground">No conditions match that filter.</li>
            ) : null}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel title="Basic actions" subtitle="Three actions per turn, plus one reaction.">
            <ul className="space-y-1.5 text-sm">
              {filteredActions.map((a) => (
                <li key={a.name} className="flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-primary/40 font-mono text-[11px] text-primary">
                    {a.cost}
                  </span>
                  <span>
                    <span className="font-medium text-foreground">{a.name}</span>{" "}
                    <span className="text-muted-foreground">{a.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Encounter budget" subtitle="Per-party XP budget, then spend it on creatures.">
            <div className="grid gap-3 sm:grid-cols-2">
              <ul className="space-y-1 text-sm">
                {encounterBudget.map((e) => (
                  <li key={e.threat} className="flex items-baseline gap-2">
                    <span className="font-mono text-accent">{e.xp}</span>
                    <span className="font-medium text-foreground">{e.threat}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 text-sm">
                {creatureXP.map((c) => (
                  <li key={c.rel} className="flex items-baseline gap-2">
                    <span className="w-8 font-mono text-primary">{c.xp}</span>
                    <span className="text-muted-foreground">{c.rel}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Add 20/30/40 XP to the budget per extra player beyond four (low/moderate/severe).
            </p>
          </Panel>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Starfinder-specific" subtitle="Where SF2e diverges from a fantasy 2e table.">
          <ul className="space-y-2.5 text-sm">
            {starfinderSpecifics.map((s) => (
              <li key={s.name}>
                <div className="font-medium text-foreground">{s.name}</div>
                <div className="text-muted-foreground">{s.note}</div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="When you freeze up" subtitle="Read this before session one.">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {gmMoves.map((m) => (
              <li key={m} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
