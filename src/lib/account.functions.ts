import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import {
  claimCampaign,
  getMemberPlayerView,
  getPlayerSimulation,
  invitePlayer,
  listMyCampaigns,
  listRoster,
  removeFromRoster,
} from "./account.server";

const tokenSchema = z.string().min(6).max(64);

function emailOf(claims: Record<string, unknown>) {
  return typeof claims["email"] === "string" ? (claims["email"] as string) : "";
}

export const listMyCampaignsFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => listMyCampaigns(context.userId, emailOf(context.claims)));

export const claimCampaignFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ token: tokenSchema }).parse(d))
  .handler(async ({ data, context }) => claimCampaign(context.userId, data.token));

export const listRosterFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ token: tokenSchema }).parse(d))
  .handler(async ({ data, context }) => listRoster(context.userId, data.token));

export const invitePlayerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({ token: tokenSchema, email: z.string().trim().email().max(255) })
      .parse(d),
  )
  .handler(async ({ data, context }) => invitePlayer(context.userId, data.token, data.email));

export const removeFromRosterFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        token: tokenSchema,
        kind: z.enum(["member", "invite"]),
        id: z.string().uuid(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) =>
    removeFromRoster(context.userId, data.token, data.kind, data.id),
  );

export const getMemberPlayerViewFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ token: tokenSchema }).parse(d))
  .handler(async ({ data, context }) =>
    getMemberPlayerView(context.userId, emailOf(context.claims), data.token),
  );

export const getPlayerSimulationFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ token: tokenSchema }).parse(d))
  .handler(async ({ data, context }) => getPlayerSimulation(context.userId, data.token));
