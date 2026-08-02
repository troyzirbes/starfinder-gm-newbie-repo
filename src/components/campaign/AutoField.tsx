import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  value: string;
  onCommit: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  hint?: string;
};

/** Text field that debounces edits and pushes them up after 600ms of quiet. */
export function AutoField({
  label,
  value,
  onCommit,
  placeholder,
  multiline,
  rows = 4,
  className,
  hint,
}: Props) {
  const [local, setLocal] = useState(value);
  const committed = useRef(value);

  useEffect(() => {
    if (value !== committed.current) {
      committed.current = value;
      setLocal(value);
    }
  }, [value]);

  useEffect(() => {
    if (local === committed.current) return;
    const t = setTimeout(() => {
      committed.current = local;
      onCommit(local);
    }, 600);
    return () => clearTimeout(t);
  }, [local, onCommit]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <div className="flex items-baseline justify-between gap-3">
          <span className="label-eyebrow">{label}</span>
          {hint ? <span className="text-[11px] text-muted-foreground/70">{hint}</span> : null}
        </div>
      ) : null}
      {multiline ? (
        <Textarea
          value={local}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => setLocal(e.target.value)}
          className="resize-y bg-background/60 text-sm leading-relaxed"
        />
      ) : (
        <Input
          value={local}
          placeholder={placeholder}
          onChange={(e) => setLocal(e.target.value)}
          className="bg-background/60"
        />
      )}
    </div>
  );
}
