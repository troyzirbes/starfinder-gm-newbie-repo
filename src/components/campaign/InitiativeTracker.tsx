import { useState } from "react";
import { ChevronsUpDown, Plus, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Combatant = {
  id: string;
  name: string;
  initiative: number;
  hp: string;
  notes: string;
  isPC: boolean;
};

const uid = () => Math.random().toString(36).slice(2, 10);

export function InitiativeTracker({ suggestions }: { suggestions: string[] }) {
  const [list, setList] = useState<Combatant[]>([]);
  const [name, setName] = useState("");
  const [init, setInit] = useState("");
  const [turn, setTurn] = useState(0);
  const [round, setRound] = useState(1);

  const sorted = [...list].sort((a, b) => b.initiative - a.initiative);

  function add(isPC = false) {
    if (!name.trim()) return;
    setList((l) => [
      ...l,
      { id: uid(), name: name.trim(), initiative: Number(init) || 0, hp: "", notes: "", isPC },
    ]);
    setName("");
    setInit("");
  }

  function patch(id: string, p: Partial<Combatant>) {
    setList((l) => l.map((c) => (c.id === id ? { ...c, ...p } : c)));
  }

  function next() {
    if (sorted.length === 0) return;
    const n = turn + 1;
    if (n >= sorted.length) {
      setTurn(0);
      setRound((r) => r + 1);
    } else {
      setTurn(n);
    }
  }

  return (
    <div className="panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Initiative</h3>
          <p className="text-xs text-muted-foreground">
            Round {round}
            {sorted.length > 0 ? ` · ${sorted[turn]?.name ?? ""} is up` : " · nobody rolled yet"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={next} disabled={sorted.length === 0}>
            <ChevronsUpDown className="size-4" /> Next turn
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setList([]);
              setRound(1);
              setTurn(0);
            }}
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Combatant"
          className="w-44 bg-background/60"
        />
        <Input
          value={init}
          onChange={(e) => setInit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Init"
          inputMode="numeric"
          className="w-20 bg-background/60"
        />
        <Button size="sm" onClick={() => add()}>
          <Plus className="size-4" /> Add
        </Button>
      </div>

      {suggestions.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              onClick={() => setName(s)}
              className="rounded border border-border bg-background/50 px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="mt-3 space-y-1.5">
        {sorted.map((c, i) => (
          <li
            key={c.id}
            className={cn(
              "flex flex-wrap items-center gap-2 rounded border px-2 py-1.5",
              i === turn
                ? "border-primary/60 bg-primary/10"
                : "border-border/60 bg-background/40",
            )}
          >
            <span className="w-8 shrink-0 text-center font-mono text-sm text-accent">
              {c.initiative}
            </span>
            <span className="min-w-24 flex-1 truncate text-sm">{c.name}</span>
            <Input
              value={c.hp}
              onChange={(e) => patch(c.id, { hp: e.target.value })}
              placeholder="HP/SP"
              className="h-7 w-24 bg-background/60 text-xs"
            />
            <Input
              value={c.notes}
              onChange={(e) => patch(c.id, { notes: e.target.value })}
              placeholder="conditions"
              className="h-7 w-36 bg-background/60 text-xs"
            />
            <Button
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={() => setList((l) => l.filter((x) => x.id !== c.id))}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </li>
        ))}
        {sorted.length === 0 ? (
          <li className="py-3 text-center text-xs text-muted-foreground">
            Add the party and tonight's opposition to start tracking turns.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
