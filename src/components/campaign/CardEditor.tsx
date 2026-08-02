import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { AutoField } from "@/components/campaign/AutoField";
import { RevealToggle } from "@/components/campaign/RevealToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cardTypeMeta, cardTypeOrder } from "@/lib/card-meta";
import type { CardRow, CardType, RevealState } from "@/lib/campaign.server";

type Props = {
  card: CardRow | null;
  onClose: () => void;
  onPatch: (id: string, patch: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
};

export function CardEditor({ card, onClose, onPatch, onDelete }: Props) {
  const [tagDraft, setTagDraft] = useState("");
  const [hintDraft, setHintDraft] = useState("");

  if (!card) return null;
  const patch = (p: Record<string, unknown>) => onPatch(card.id, p);
  const isPuzzle = card.type === "puzzle";

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="px-5">
          <SheetTitle className="text-base">Edit card</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 px-5 pb-10">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={card.type} onValueChange={(v) => patch({ type: v as CardType })}>
              <SelectTrigger className="w-44 bg-background/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cardTypeOrder.map((t) => (
                  <SelectItem key={t} value={t}>
                    {cardTypeMeta[t].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <RevealToggle
              value={card.reveal_state}
              onChange={(v) => patch({ reveal_state: v as RevealState })}
            />
          </div>

          <AutoField label="Name" value={card.name} onCommit={(v) => patch({ name: v })} />
          <AutoField
            label="Subtitle"
            value={card.subtitle}
            onCommit={(v) => patch({ subtitle: v })}
            placeholder="Wayfinder mechanic · owes the crew a favour"
          />
          <AutoField
            label="Image URL"
            value={card.image_url}
            onCommit={(v) => patch({ image_url: v })}
            placeholder="https://…"
            hint="optional"
          />

          <AutoField
            label="Read-aloud / player text"
            value={card.player_text}
            onCommit={(v) => patch({ player_text: v })}
            multiline
            rows={5}
            hint="Players see this when shared"
          />

          <AutoField
            label="GM secrets"
            value={card.gm_secrets}
            onCommit={(v) => patch({ gm_secrets: v })}
            multiline
            rows={4}
            hint="Only shown on 'Shared + secrets'"
          />

          <AutoField
            label="Stat block / mechanics"
            value={card.stat_block}
            onCommit={(v) => patch({ stat_block: v })}
            multiline
            rows={4}
            placeholder="Level 2 · AC 18 · HP 30 · Fort +9 Ref +7 Will +5 …"
          />

          {isPuzzle ? (
            <div className="space-y-3 rounded-lg border border-accent/30 bg-accent/5 p-3">
              <div className="label-eyebrow">Hint ladder</div>
              <p className="text-xs text-muted-foreground">
                Reveal one rung at a time when the table stalls. Players only see revealed hints.
              </p>
              <ul className="space-y-1.5">
                {card.hints.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 font-mono text-xs text-accent">{i + 1}</span>
                    <span className="flex-1 text-sm">{h}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-6"
                      onClick={() =>
                        patch({
                          hints: card.hints.filter((_, x) => x !== i),
                          hints_revealed: Math.min(card.hints_revealed, card.hints.length - 1),
                        })
                      }
                    >
                      <X className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  value={hintDraft}
                  onChange={(e) => setHintDraft(e.target.value)}
                  placeholder="Add a hint…"
                  className="bg-background/60"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && hintDraft.trim()) {
                      patch({ hints: [...card.hints, hintDraft.trim()] });
                      setHintDraft("");
                    }
                  }}
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!hintDraft.trim()) return;
                    patch({ hints: [...card.hints, hintDraft.trim()] });
                    setHintDraft("");
                  }}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {card.hints_revealed} of {card.hints.length} revealed
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={card.hints_revealed >= card.hints.length}
                  onClick={() => patch({ hints_revealed: card.hints_revealed + 1 })}
                >
                  Reveal next hint
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={card.hints_revealed === 0}
                  onClick={() => patch({ hints_revealed: 0 })}
                >
                  Reset
                </Button>
              </div>
              <AutoField
                label="Solution"
                value={card.solution}
                onCommit={(v) => patch({ solution: v })}
                multiline
                rows={3}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <span className="label-eyebrow">Tags</span>
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map((t) => (
                <button
                  key={t}
                  onClick={() => patch({ tags: card.tags.filter((x) => x !== t) })}
                  className="group flex items-center gap-1 rounded border border-border bg-background/50 px-2 py-0.5 text-xs"
                >
                  {t}
                  <X className="size-3 text-muted-foreground group-hover:text-destructive" />
                </button>
              ))}
            </div>
            <Input
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              placeholder="Add tag, press Enter"
              className="bg-background/60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagDraft.trim()) {
                  patch({ tags: [...new Set([...card.tags, tagDraft.trim()])] });
                  setTagDraft("");
                }
              }}
            />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">Changes save automatically.</span>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                onDelete(card.id);
                onClose();
              }}
            >
              <Trash2 className="size-4" /> Delete card
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
