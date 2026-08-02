import {
  Boxes,
  Brain,
  MapPin,
  Rocket,
  ScrollText,
  Skull,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { CardType, RevealState } from "@/lib/campaign.server";

export const cardTypeMeta: Record<CardType, { label: string; plural: string; icon: LucideIcon }> = {
  location: { label: "Location", plural: "Locations", icon: MapPin },
  npc: { label: "NPC", plural: "NPCs", icon: Users },
  pc: { label: "Player character", plural: "Player characters", icon: Rocket },
  creature: { label: "Creature", plural: "Creatures", icon: Skull },
  puzzle: { label: "Puzzle", plural: "Puzzles", icon: Brain },
  item: { label: "Item", plural: "Items", icon: Boxes },
  handout: { label: "Handout", plural: "Handouts", icon: ScrollText },
};

export const cardTypeOrder: CardType[] = [
  "location",
  "npc",
  "pc",
  "creature",
  "puzzle",
  "item",
  "handout",
];

export const revealMeta: Record<RevealState, { label: string; short: string; tone: string }> = {
  hidden: { label: "Hidden from players", short: "Hidden", tone: "text-muted-foreground" },
  revealed: { label: "Shared with players", short: "Shared", tone: "text-primary" },
  full: { label: "Shared including secrets", short: "Shared + secrets", tone: "text-accent" },
};
