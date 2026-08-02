import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import {
  createCampaign,
  deleteRow,
  getGmView,
  insertRow,
  renameCampaign,
  updateRow,
} from "./campaign.server";

export const createCampaignFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ name: z.string().max(120) }).parse(d))
  .handler(async ({ data, context }) => createCampaign(data.name, context.userId));

export const getGmViewFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ token: z.string().min(6).max(64) }).parse(d))
  .handler(async ({ data }) => getGmView(data.token));


export const updateRowFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token: z.string().min(6).max(64),
        kind: z.enum(["session", "milestone", "card"]),
        id: z.string().uuid(),
        patch: z.record(z.any()),
      })
      .parse(d),
  )
  .handler(async ({ data }) => updateRow(data.token, data.kind, data.id, data.patch));

export const insertRowFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token: z.string().min(6).max(64),
        kind: z.enum(["milestone", "card"]),
        patch: z.record(z.any()),
      })
      .parse(d),
  )
  .handler(async ({ data }) => insertRow(data.token, data.kind, data.patch));

export const deleteRowFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        token: z.string().min(6).max(64),
        kind: z.enum(["milestone", "card"]),
        id: z.string().uuid(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => deleteRow(data.token, data.kind, data.id));

export const renameCampaignFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ token: z.string().min(6).max(64), name: z.string().max(120) }).parse(d),
  )
  .handler(async ({ data }) => renameCampaign(data.token, data.name));
