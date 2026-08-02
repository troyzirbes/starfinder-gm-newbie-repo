import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type RevealState = "hidden" | "revealed" | "full";

export type CardType =
  | "location"
  | "npc"
  | "pc"
  | "creature"
  | "puzzle"
  | "item"
  | "handout";

export type CardRow = {
  id: string;
  campaign_id: string;
  type: CardType;
  name: string;
  subtitle: string;
  image_url: string;
  player_text: string;
  gm_secrets: string;
  stat_block: string;
  tags: string[];
  hints: string[];
  solution: string;
  hints_revealed: number;
  reveal_state: RevealState;
  session_number: number | null;
  order_index: number;
};

export type SessionRow = {
  id: string;
  campaign_id: string;
  number: number;
  title: string;
  intro: string;
  intro_published: boolean;
  goals: string;
  scenes: string;
  fallbacks: string;
  gm_notes: string;
  recap: string;
  recap_published: boolean;
  status: string;
};

export type MilestoneRow = {
  id: string;
  campaign_id: string;
  title: string;
  description: string;
  gm_notes: string;
  order_index: number;
  achieved: boolean;
  session_number: number | null;
  visible_to_players: boolean;
};

export type CampaignRow = {
  id: string;
  name: string;
  system: string;
  gm_token: string;
  player_token: string;
};

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

function makeToken(length = 22) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

function tableFor(kind: "session" | "milestone" | "card") {
  return kind === "session" ? "sessions" : kind === "milestone" ? "milestones" : "cards";
}

export async function createCampaign(name: string) {
  const gm_token = makeToken();
  const player_token = makeToken();

  const { data, error } = await supabaseAdmin
    .from("campaigns")
    .insert({ name: name.trim() || "Untitled Operation", gm_token, player_token })
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  const campaign = data as unknown as CampaignRow;

  const sessionSeed = [
    { n: 1, title: "Session 1 — The Hook", goals: "Introduce the crew, the job, and the ticking clock." },
    { n: 2, title: "Session 2 — Complication", goals: "The job goes sideways. Reveal who really benefits." },
    { n: 3, title: "Session 3 — Turn", goals: "A hard choice with no clean answer." },
    { n: 4, title: "Session 4 — Escalation", goals: "The opposition moves first. Raise the stakes." },
    { n: 5, title: "Session 5 — Resolution", goals: "Final confrontation, then an epilogue beat per PC." },
  ];

  await supabaseAdmin.from("sessions").insert(
    sessionSeed.map((s) => ({
      campaign_id: campaign.id,
      number: s.n,
      title: s.title,
      goals: s.goals,
      status: s.n === 1 ? "next" : "planned",
    })),
  );

  return { gmToken: campaign.gm_token, playerToken: campaign.player_token };
}

async function campaignBy(column: "gm_token" | "player_token", token: string) {
  const { data, error } = await supabaseAdmin
    .from("campaigns")
    .select("*")
    .eq(column, token)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as CampaignRow) ?? null;
}

async function loadAll(campaignId: string) {
  const [sessions, milestones, cards] = await Promise.all([
    supabaseAdmin.from("sessions").select("*").eq("campaign_id", campaignId).order("number"),
    supabaseAdmin
      .from("milestones")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("order_index")
      .order("created_at"),
    supabaseAdmin
      .from("cards")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("order_index")
      .order("created_at"),
  ]);
  return {
    sessions: (sessions.data ?? []) as unknown as SessionRow[],
    milestones: (milestones.data ?? []) as unknown as MilestoneRow[],
    cards: (cards.data ?? []) as unknown as CardRow[],
  };
}

export async function getGmView(token: string) {
  const campaign = await campaignBy("gm_token", token);
  if (!campaign) return null;
  const rest = await loadAll(campaign.id);
  return { campaign, ...rest };
}

export type PlayerCard = {
  id: string;
  type: CardType;
  name: string;
  subtitle: string;
  image_url: string;
  player_text: string;
  stat_block: string;
  gm_secrets: string;
  tags: string[];
  hints: string[];
  solution: string;
  order_index: number;
};

export async function getPlayerView(token: string) {
  const campaign = await campaignBy("player_token", token);
  if (!campaign) return null;
  const { sessions, milestones, cards } = await loadAll(campaign.id);

  const visibleCards: PlayerCard[] = cards
    .filter((c) => c.reveal_state !== "hidden")
    .map((c) => ({
      id: c.id,
      type: c.type,
      name: c.name,
      subtitle: c.subtitle,
      image_url: c.image_url,
      player_text: c.player_text,
      tags: c.tags,
      order_index: c.order_index,
      hints: (c.hints ?? []).slice(0, Math.max(0, c.hints_revealed ?? 0)),
      // Secrets, stat blocks and solutions only leave the server on "full".
      stat_block: c.reveal_state === "full" ? c.stat_block : "",
      gm_secrets: c.reveal_state === "full" ? c.gm_secrets : "",
      solution: c.reveal_state === "full" ? c.solution : "",
    }));

  return {
    campaign: { name: campaign.name, system: campaign.system },
    cards: visibleCards,
    milestones: milestones
      .filter((m) => m.visible_to_players)
      .map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        achieved: m.achieved,
        order_index: m.order_index,
      })),
    intros: sessions
      .filter((s) => s.intro_published && (s.intro ?? "").trim())
      .map((s) => ({ id: s.id, number: s.number, title: s.title, intro: s.intro })),
    recaps: sessions
      .filter((s) => s.recap_published && s.recap.trim())
      .map((s) => ({ id: s.id, number: s.number, title: s.title, recap: s.recap })),
  };
}

export async function requireCampaign(gmToken: string) {
  const campaign = await campaignBy("gm_token", gmToken);
  if (!campaign) throw new Error("Campaign not found");
  return campaign;
}

const ALLOWED: Record<string, string[]> = {
  sessions: [
    "title",
    "intro",
    "intro_published",
    "goals",
    "scenes",
    "fallbacks",
    "gm_notes",
    "recap",
    "recap_published",
    "status",
  ],
  milestones: ["title", "description", "gm_notes", "order_index", "achieved", "session_number", "visible_to_players"],
  cards: [
    "type",
    "name",
    "subtitle",
    "image_url",
    "player_text",
    "gm_secrets",
    "stat_block",
    "tags",
    "hints",
    "solution",
    "hints_revealed",
    "reveal_state",
    "session_number",
    "order_index",
  ],
};

function sanitize(table: string, patch: Record<string, unknown>) {
  const allowed = ALLOWED[table] ?? [];
  const out: Record<string, unknown> = {};
  for (const key of allowed) if (key in patch) out[key] = patch[key];
  return out;
}

export async function updateRow(
  gmToken: string,
  kind: "session" | "milestone" | "card",
  id: string,
  patch: Record<string, unknown>,
) {
  const campaign = await requireCampaign(gmToken);
  const table = tableFor(kind);
  const { error } = await supabaseAdmin
    .from(table)
    .update(sanitize(table, patch) as never)
    .eq("id", id)
    .eq("campaign_id", campaign.id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function insertRow(
  gmToken: string,
  kind: "milestone" | "card",
  patch: Record<string, unknown>,
) {
  const campaign = await requireCampaign(gmToken);
  const table = tableFor(kind);
  const { data, error } = await supabaseAdmin
    .from(table)
    .insert({ ...sanitize(table, patch), campaign_id: campaign.id } as never)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: (data as { id: string }).id };
}

export async function deleteRow(
  gmToken: string,
  kind: "milestone" | "card",
  id: string,
) {
  const campaign = await requireCampaign(gmToken);
  const { error } = await supabaseAdmin
    .from(tableFor(kind))
    .delete()
    .eq("id", id)
    .eq("campaign_id", campaign.id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function renameCampaign(gmToken: string, name: string) {
  const campaign = await requireCampaign(gmToken);
  const { error } = await supabaseAdmin
    .from("campaigns")
    .update({ name: name.trim() || "Untitled Operation" })
    .eq("id", campaign.id);
  if (error) throw new Error(error.message);
  return { ok: true };
}
