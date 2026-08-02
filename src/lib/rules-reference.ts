// Static GM quick-reference for Starfinder 2e (shares the Pathfinder 2e remaster
// core chassis). Kept as plain data so it can render on the server with no fetch.

export const degreesOfSuccess = [
  { label: "Critical success", rule: "Beat the DC by 10+, or roll a nat 20 that would already succeed." },
  { label: "Success", rule: "Meet or beat the DC." },
  { label: "Failure", rule: "Below the DC." },
  { label: "Critical failure", rule: "Miss the DC by 10+, or roll a nat 1 that would already fail." },
] as const;

export const natRule =
  "A natural 20 bumps the result one degree better; a natural 1 bumps it one degree worse. Apply it after comparing to the DC.";

export const simpleDCs = [
  { prof: "Untrained", dc: 10 },
  { prof: "Trained", dc: 15 },
  { prof: "Expert", dc: 20 },
  { prof: "Master", dc: 30 },
  { prof: "Legendary", dc: 40 },
] as const;

export const levelDCs = [
  { level: 0, dc: 14 },
  { level: 1, dc: 15 },
  { level: 2, dc: 16 },
  { level: 3, dc: 18 },
  { level: 4, dc: 19 },
  { level: 5, dc: 20 },
  { level: 6, dc: 22 },
  { level: 7, dc: 23 },
  { level: 8, dc: 24 },
  { level: 9, dc: 26 },
  { level: 10, dc: 27 },
  { level: 11, dc: 28 },
  { level: 12, dc: 30 },
  { level: 13, dc: 31 },
  { level: 14, dc: 32 },
  { level: 15, dc: 34 },
  { level: 16, dc: 35 },
  { level: 17, dc: 36 },
  { level: 18, dc: 38 },
  { level: 19, dc: 39 },
  { level: 20, dc: 40 },
] as const;

export const dcAdjustments = [
  { label: "Incredibly easy", mod: "-10" },
  { label: "Very easy", mod: "-5" },
  { label: "Easy", mod: "-2" },
  { label: "Hard", mod: "+2" },
  { label: "Very hard", mod: "+5" },
  { label: "Incredibly hard", mod: "+10" },
] as const;

export const basicActions = [
  { name: "Strike", cost: 1, note: "Attack roll vs AC. Second attack -5, third -10 (agile: -4/-8)." },
  { name: "Stride", cost: 1, note: "Move up to your Speed." },
  { name: "Step", cost: 1, note: "Move 5 ft without triggering reactions." },
  { name: "Take Cover", cost: 1, note: "+2 (or +4 greater) circumstance bonus to AC and Reflex." },
  { name: "Raise a Shield", cost: 1, note: "+2 circumstance AC until your next turn." },
  { name: "Interact", cost: 1, note: "Draw, reload, open, grab — the catch-all manipulate action." },
  { name: "Seek", cost: 1, note: "Perception vs stealth/hidden DC in a 30-ft cone or 15-ft burst." },
  { name: "Point Out", cost: 1, note: "Make an unseen creature merely hidden to your allies." },
  { name: "Aid", cost: "R", note: "Prepare with 1 action, then react: DC 15 check to give an ally a bonus." },
  { name: "Delay", cost: 0, note: "Drop out of initiative and rejoin later in the round." },
  { name: "Ready", cost: 2, note: "Set a trigger for one action or a free action." },
  { name: "Escape", cost: 1, note: "Athletics/Acrobatics/unarmed attack vs the grabber's DC." },
] as const;

export const conditions = [
  { name: "Blinded", effect: "Can't see. All terrain is difficult. Everything is undetected to you." },
  { name: "Clumsy N", effect: "-N to Dex-based checks and DCs, including AC and Reflex." },
  { name: "Confused", effect: "Off-guard, attacks random targets, can't act voluntarily." },
  { name: "Dazzled", effect: "All creatures are concealed to you (DC 5 flat check)." },
  { name: "Drained N", effect: "-N to Con checks and Fortitude; lose N x level HP from max." },
  { name: "Dying N", effect: "Unconscious at 0 HP. Recovery check each turn. Dying 4 = dead." },
  { name: "Enfeebled N", effect: "-N to Strength-based rolls and DCs." },
  { name: "Fascinated", effect: "-2 to Perception and skill checks; can't use hostile actions." },
  { name: "Fatigued", effect: "-1 to AC and saves. Can't use exploration activities while travelling." },
  { name: "Frightened N", effect: "-N to all checks and DCs. Decreases by 1 at end of each turn." },
  { name: "Grabbed", effect: "Immobilized and off-guard. Manipulate actions need a DC 5 flat check." },
  { name: "Immobilized", effect: "Can't take actions with the move trait." },
  { name: "Off-guard", effect: "-2 circumstance penalty to AC. (This is 2e's 'flat-footed'.)" },
  { name: "Persistent damage", effect: "Take damage at end of turn, then DC 15 flat check to end." },
  { name: "Prone", effect: "Off-guard, -2 to attacks. Stand costs 1 action." },
  { name: "Quickened", effect: "One extra action each turn, usable only as specified." },
  { name: "Sickened N", effect: "-N to all checks and DCs. Can't willingly ingest anything." },
  { name: "Slowed N", effect: "Lose N actions at the start of your turn." },
  { name: "Stunned N", effect: "Lose N actions total, then the condition ends." },
  { name: "Stupefied N", effect: "-N to Int/Wis/Cha rolls and DCs. Spellcasting needs a DC 5+N flat check." },
  { name: "Unconscious", effect: "Blinded, off-guard, prone; AC takes -4. Can't act." },
  { name: "Wounded N", effect: "Going down again starts you at Dying N+1." },
] as const;

export const encounterBudget = [
  { threat: "Trivial", xp: 40, note: "Barely a speed bump. Good for pacing filler." },
  { threat: "Low", xp: 60, note: "Costs a few resources." },
  { threat: "Moderate", xp: 80, note: "The default. A real fight, rarely lethal." },
  { threat: "Severe", xp: 120, note: "Climactic. Someone may go down." },
  { threat: "Extreme", xp: 160, note: "Genuinely lethal. Use sparingly — maybe once in five sessions." },
] as const;

export const creatureXP = [
  { rel: "Party level -4", xp: 10 },
  { rel: "Party level -3", xp: 15 },
  { rel: "Party level -2", xp: 20 },
  { rel: "Party level -1", xp: 30 },
  { rel: "Party level", xp: 40 },
  { rel: "Party level +1", xp: 60 },
  { rel: "Party level +2", xp: 80 },
  { rel: "Party level +3", xp: 120 },
  { rel: "Party level +4", xp: 160 },
] as const;

export const starfinderSpecifics = [
  {
    name: "Stamina, Hit Points, Resolve",
    note: "Damage hits Stamina Points first, then Hit Points. Spending 1 Resolve Point on a 10-minute breather refills Stamina — this is why SF2e parties can push through more encounters per day than a Pathfinder party. Budget encounters accordingly.",
  },
  {
    name: "Grenades",
    note: "No attack roll. Creatures in the burst attempt a Reflex save against your class DC. Splash damage still applies on a success.",
  },
  {
    name: "Computers & Piloting",
    note: "Two skills a sci-fi table leans on constantly. Pre-set DCs for hacking a door, spoofing a manifest, and a chase check before the session so you're not inventing them live.",
  },
  {
    name: "Areas & Range",
    note: "Ranged weapons have a range increment; each increment past the first is a -2 penalty, to a max of six increments.",
  },
] as const;

export const gmMoves = [
  "When you don't know a rule: pick a DC from the level table, roll it, and move on. Look it up after the session.",
  "When players stall: have something arrive — a patrol, a comms ping, a countdown ticking one step closer.",
  "When a plan is clever but not covered: say yes, then ask for one skill check at a hard DC.",
  "When a fight is dragging: start narrating monsters as bloodied and let them flee or surrender.",
  "When you need an NPC name fast: keep three spares written down before the session.",
  "End every scene by asking a player what their character does next — it hands you the following beat.",
] as const;
