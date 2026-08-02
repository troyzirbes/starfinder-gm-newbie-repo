import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mail, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  invitePlayerFn,
  listRosterFn,
  removeFromRosterFn,
} from "@/lib/account.functions";

export function RosterPanel({ token }: { token: string }) {
  const qc = useQueryClient();
  const listRoster = useServerFn(listRosterFn);
  const invite = useServerFn(invitePlayerFn);
  const remove = useServerFn(removeFromRosterFn);

  const key = ["roster", token];
  const { data, isLoading, error } = useQuery({
    queryKey: key,
    queryFn: () => listRoster({ data: { token } }),
  });

  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  const inviteMut = useMutation({
    mutationFn: (value: string) => invite({ data: { token, email: value } }),
    onSuccess: (res) => {
      setEmail("");
      setNotice(
        res.added
          ? "Added — they already have an account and the board is live for them."
          : "Invited. The board unlocks as soon as they sign up with that email.",
      );
      qc.invalidateQueries({ queryKey: key });
    },
    onError: () => setNotice("Couldn't send that invite. Check the address and try again."),
  });

  const removeMut = useMutation({
    mutationFn: (v: { kind: "member" | "invite"; id: string }) =>
      remove({ data: { token, ...v } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  if (error) {
    return (
      <p className="panel p-8 text-center text-sm text-muted-foreground">
        Only the GM who owns this campaign can manage the roster.
      </p>
    );
  }

  const roster = data ?? [];

  return (
    <div className="space-y-4">
      <section className="panel p-4">
        <h3 className="text-sm font-semibold">Invite a player</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          They sign in with this email address and the player board opens for them. Nobody else
          can see it, even with the link.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            type="email"
            value={email}
            placeholder="player@email.com"
            maxLength={255}
            className="min-w-56 flex-1"
            onChange={(e) => {
              setEmail(e.target.value);
              setNotice("");
            }}
            onKeyDown={(e) => e.key === "Enter" && email.trim() && inviteMut.mutate(email)}
          />
          <Button
            className="gap-1.5"
            disabled={!email.trim() || inviteMut.isPending}
            onClick={() => inviteMut.mutate(email)}
          >
            {inviteMut.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            Invite
          </Button>
        </div>
        {notice ? <p className="mt-2 text-xs text-accent">{notice}</p> : null}
      </section>

      <section className="panel p-4">
        <h3 className="text-sm font-semibold">Roster ({roster.length})</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        ) : (
          <ul className="mt-2 divide-y divide-border/60">
            {roster.map((r) => (
              <li key={`${r.kind}-${r.id}`} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    {r.displayName || r.email || "Player"}
                    {r.kind === "invite" ? (
                      <span className="ml-2 rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        invite pending
                      </span>
                    ) : null}
                  </p>
                  {r.displayName && r.email ? (
                    <p className="truncate text-xs text-muted-foreground">{r.email}</p>
                  ) : null}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  title={r.kind === "invite" ? "Cancel invite" : "Remove from campaign"}
                  onClick={() => removeMut.mutate({ kind: r.kind, id: r.id })}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
            {roster.length === 0 ? (
              <li className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                <Mail className="size-4" /> Nobody invited yet.
              </li>
            ) : null}
          </ul>
        )}
      </section>
    </div>
  );
}
