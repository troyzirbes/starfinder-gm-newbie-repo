import { supabaseAdmin } from "@/integrations/supabase/client.server";

import { buildPlayerView, campaignBy, type CampaignRow } from "./campaign.server";

export type MemberEntry = {
  kind: "member" | "invite";
  id: string;
  email: string;
  displayName: string;
  role: string;
  since: string;
};

export type CampaignSummary = {
  id: string;
  name: string;
  system: string;
  gmToken: string | null;
  playerToken: string;
  playerCount: number;
  updatedAt: string;
};

function normEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function syncAccount(userId: string, email: string) {
  const clean = normEmail(email);
  await supabaseAdmin
    .from("profiles")
    .upsert({ id: userId, email: clean }, { onConflict: "id" });

  // Turn any pending invites for this address into real memberships.
  const { data: invites } = await supabaseAdmin
    .from("campaign_invites")
    .select("id, campaign_id")
    .eq("email", clean)
    .is("accepted_at", null);

  for (const inv of invites ?? []) {
    await supabaseAdmin
      .from("campaign_members")
      .upsert(
        { campaign_id: inv.campaign_id, user_id: userId, role: "player" },
        { onConflict: "campaign_id,user_id" },
      );
    await supabaseAdmin
      .from("campaign_invites")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", inv.id);
  }
}

async function countPlayers(campaignIds: string[]) {
  const counts = new Map<string, number>();
  if (campaignIds.length === 0) return counts;
  const { data } = await supabaseAdmin
    .from("campaign_members")
    .select("campaign_id")
    .in("campaign_id", campaignIds);
  for (const row of (data ?? []) as { campaign_id: string }[]) {
    counts.set(row.campaign_id, (counts.get(row.campaign_id) ?? 0) + 1);
  }
  return counts;
}

export async function listMyCampaigns(userId: string, email: string) {
  await syncAccount(userId, email);

  const { data: owned } = await supabaseAdmin
    .from("campaigns")
    .select("*")
    .eq("owner_id", userId)
    .order("updated_at", { ascending: false });

  const { data: memberships } = await supabaseAdmin
    .from("campaign_members")
    .select("campaign_id")
    .eq("user_id", userId);

  const memberIds = (memberships ?? []).map((m) => (m as { campaign_id: string }).campaign_id);
  const ownedRows = (owned ?? []) as unknown as (CampaignRow & { updated_at: string })[];
  const ownedIds = new Set(ownedRows.map((c) => c.id));
  const playingIds = memberIds.filter((id) => !ownedIds.has(id));

  const { data: playingRaw } = playingIds.length
    ? await supabaseAdmin.from("campaigns").select("*").in("id", playingIds)
    : { data: [] };
  const playingRows = (playingRaw ?? []) as unknown as (CampaignRow & { updated_at: string })[];

  const counts = await countPlayers(ownedRows.map((c) => c.id));

  const toSummary = (c: CampaignRow & { updated_at: string }, isOwner: boolean): CampaignSummary => ({
    id: c.id,
    name: c.name,
    system: c.system,
    gmToken: isOwner ? c.gm_token : null,
    playerToken: c.player_token,
    playerCount: counts.get(c.id) ?? 0,
    updatedAt: c.updated_at,
  });

  return {
    owned: ownedRows.map((c) => toSummary(c, true)),
    playing: playingRows.map((c) => toSummary(c, false)),
  };
}

/** GM links predate accounts: the first signed-in GM to open one claims it. */
export async function claimCampaign(userId: string, gmToken: string) {
  const campaign = await campaignBy("gm_token", gmToken);
  if (!campaign) return { ok: false, owned: false };
  if (!campaign.owner_id) {
    await supabaseAdmin.from("campaigns").update({ owner_id: userId }).eq("id", campaign.id);
    return { ok: true, owned: true };
  }
  return { ok: true, owned: campaign.owner_id === userId };
}

async function requireOwned(userId: string, gmToken: string) {
  const campaign = await campaignBy("gm_token", gmToken);
  if (!campaign) throw new Error("Campaign not found");
  if (campaign.owner_id && campaign.owner_id !== userId) {
    throw new Error("You don't run this campaign");
  }
  if (!campaign.owner_id) {
    await supabaseAdmin.from("campaigns").update({ owner_id: userId }).eq("id", campaign.id);
  }
  return campaign;
}

export async function listRoster(userId: string, gmToken: string): Promise<MemberEntry[]> {
  const campaign = await requireOwned(userId, gmToken);

  const { data: members } = await supabaseAdmin
    .from("campaign_members")
    .select("id, user_id, role, created_at")
    .eq("campaign_id", campaign.id);

  const memberRows = (members ?? []) as {
    id: string;
    user_id: string;
    role: string;
    created_at: string;
  }[];

  const { data: profiles } = memberRows.length
    ? await supabaseAdmin
        .from("profiles")
        .select("id, email, display_name")
        .in("id", memberRows.map((m) => m.user_id))
    : { data: [] };
  const byId = new Map(
    ((profiles ?? []) as { id: string; email: string; display_name: string }[]).map((p) => [
      p.id,
      p,
    ]),
  );

  const { data: invites } = await supabaseAdmin
    .from("campaign_invites")
    .select("id, email, created_at")
    .eq("campaign_id", campaign.id)
    .is("accepted_at", null);

  return [
    ...memberRows.map((m) => ({
      kind: "member" as const,
      id: m.user_id,
      email: byId.get(m.user_id)?.email ?? "",
      displayName: byId.get(m.user_id)?.display_name ?? "",
      role: m.role,
      since: m.created_at,
    })),
    ...((invites ?? []) as { id: string; email: string; created_at: string }[]).map((i) => ({
      kind: "invite" as const,
      id: i.id,
      email: i.email,
      displayName: "",
      role: "player",
      since: i.created_at,
    })),
  ];
}

export async function invitePlayer(userId: string, gmToken: string, email: string) {
  const campaign = await requireOwned(userId, gmToken);
  const clean = normEmail(email);

  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", clean)
    .maybeSingle();

  if (existing) {
    const uid = (existing as { id: string }).id;
    await supabaseAdmin
      .from("campaign_members")
      .upsert(
        { campaign_id: campaign.id, user_id: uid, role: "player" },
        { onConflict: "campaign_id,user_id" },
      );
    return { added: true };
  }

  await supabaseAdmin
    .from("campaign_invites")
    .upsert(
      { campaign_id: campaign.id, email: clean, invited_by: userId, accepted_at: null },
      { onConflict: "campaign_id,email" },
    );
  return { added: false };
}

export async function removeFromRoster(
  userId: string,
  gmToken: string,
  kind: "member" | "invite",
  id: string,
) {
  const campaign = await requireOwned(userId, gmToken);
  if (kind === "member") {
    await supabaseAdmin
      .from("campaign_members")
      .delete()
      .eq("campaign_id", campaign.id)
      .eq("user_id", id);
    // Drop any stale invite so they can't silently rejoin.
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", id)
      .maybeSingle();
    const email = (profile as { email: string } | null)?.email;
    if (email) {
      await supabaseAdmin
        .from("campaign_invites")
        .delete()
        .eq("campaign_id", campaign.id)
        .eq("email", email);
    }
  } else {
    await supabaseAdmin
      .from("campaign_invites")
      .delete()
      .eq("campaign_id", campaign.id)
      .eq("id", id);
  }
  return { ok: true };
}

/** Player board, gated on membership instead of just the link. */
export async function getMemberPlayerView(userId: string, email: string, playerToken: string) {
  await syncAccount(userId, email);
  const campaign = await campaignBy("player_token", playerToken);
  if (!campaign) return { status: "missing" as const, view: null };

  if (campaign.owner_id === userId) {
    return { status: "ok" as const, view: await buildPlayerView(campaign) };
  }

  const { data: member } = await supabaseAdmin
    .from("campaign_members")
    .select("id")
    .eq("campaign_id", campaign.id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!member) return { status: "forbidden" as const, view: null, name: campaign.name };
  return { status: "ok" as const, view: await buildPlayerView(campaign) };
}

/** Simulator: exactly what a player sees, fetched with the GM's own token. */
export async function getPlayerSimulation(userId: string, gmToken: string) {
  const campaign = await requireOwned(userId, gmToken);
  return buildPlayerView(campaign);
}
