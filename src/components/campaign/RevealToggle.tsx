import { Eye, EyeOff, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { revealMeta } from "@/lib/card-meta";
import type { RevealState } from "@/lib/campaign.server";
import { cn } from "@/lib/utils";

const options: { value: RevealState; icon: typeof Eye }[] = [
  { value: "hidden", icon: EyeOff },
  { value: "revealed", icon: Eye },
  { value: "full", icon: Sparkles },
];

export function RevealToggle({
  value,
  onChange,
  size = "default",
}: {
  value: RevealState;
  onChange: (v: RevealState) => void;
  size?: "default" | "sm";
}) {
  return (
    <div className="inline-flex rounded-md border border-border bg-background/60 p-0.5">
      {options.map((o) => {
        const Icon = o.icon;
        const active = value === o.value;
        return (
          <Button
            key={o.value}
            type="button"
            variant="ghost"
            size="sm"
            title={revealMeta[o.value].label}
            aria-label={revealMeta[o.value].label}
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-7 gap-1.5 px-2 text-xs",
              active
                ? o.value === "hidden"
                  ? "bg-secondary text-foreground"
                  : o.value === "revealed"
                    ? "bg-primary/20 text-primary"
                    : "bg-accent/20 text-accent"
                : "text-muted-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {size === "default" ? revealMeta[o.value].short : null}
          </Button>
        );
      })}
    </div>
  );
}
