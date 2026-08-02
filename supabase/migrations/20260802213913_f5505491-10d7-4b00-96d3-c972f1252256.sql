DO $mig$
DECLARE cid uuid;
BEGIN
  SELECT id INTO cid FROM public.campaigns WHERE gm_token = 'nsuk5z5pdzs7r85pzvxhf9';
  IF cid IS NULL THEN RAISE EXCEPTION 'campaign not found'; END IF;

  UPDATE public.campaigns SET name = 'Echoes of the Celestial Core' WHERE id = cid;

  UPDATE public.sessions SET
    title = $t$Session 1 — The Bubble Hub$t$,
    intro = $t$"Security Team 4, please wake up. There has been a... 'discrepancy' in the logic center."

The automated voice of the station AI, AURA, sounds strangely drowsy. As your stasis pods hiss open, you don't find a boarding party of lethal pirates. Instead, the floor of the Security Hub is covered in three inches of shimmering, pink iridescent bubbles.

Your weapon lockers have been forced open. Where your rifles and tactical gear should be, there are neatly folded "apology notes" written in glowing crayon. From the ventilation shafts above, you hear a chorus of high-pitched, chaotic giggling.

"They took the shiny circles," AURA sighs. "And they turned off the gravity in the mess hall. It's very... floaty. Please fix this."

You look down at your belts. Your gear is gone, but you see a trail of glowing, neon-orange handprints leading toward the Engineering Sector. The hunt is on.$t$,
    goals = $t$Wake the crew, establish the tone (pranks, not war), recover the Singularity Lens from the Atmospheric Regulator. Party ends the session with Vector Dash + Wall-Walking.$t$,
    scenes = $t$1. Stasis wake-up — read the intro, let each PC describe their one hidden stasis item.
2. Bubble-Flooded Corridor (DC 18 Acrobatics/Athletics or fall Prone) — comedy, not damage.
3. First Glimmer-Gremlin ambush — run the Giggle Check (Perception vs Stealth) so nobody is Off-Guard.
4. The Bubble Hub — gravity is off in the mess hall; floating combat with 3 Gremlins.
5. Claim the Singularity Lens. Vector Dash unlocks; use it to cross the Bottomless Maintenance Pit on the way out.$t$,
    fallbacks = $t$• If they stall: AURA pipes in with a "helpful" (slightly wrong) hint over the intercom.
• If a fight is going badly: the Gremlins get bored, throw a smoke of bubbles, and flee with something shiny.$t$,
    gm_notes = $t$Level 3 party, 4 PCs. Keep encounters Low-to-Moderate this session (2-3 Creature 1 Gremlins). Non-lethal or social resolutions earn Apology Loot (Healing Serums, batteries). Introduce Vector Dash mechanically before you gate anything behind it.$t$,
    status = 'next'
  WHERE campaign_id = cid AND number = 1;

  UPDATE public.sessions SET
    title = $t$Session 2 — Clockwork Nebula$t$,
    intro = $t$The Engineering Chronos-Lab does not tick. It stutters.

Brass turbines the size of shuttlecraft turn in the vault above you, each blade throwing a bar of amber light across the mahogany decking. Crystalline pipes overhead carry raw Aether, and where the Chrono-Shifter should sit there is only an empty brass cradle — and a crayon drawing of a very smug imp holding a clock.

Somewhere in the machinery, a Glimmer-Imp has learned that if you spin the big wheel backwards, the same second happens twice. It has been doing this for approximately nine hours.$t$,
    goals = $t$Recover the Chrono-Shifter. Party ends the session with Stasis Field, which freezes the giant turbines so they can cross the fan blades.$t$,
    scenes = $t$1. Time-stutter cold open — the same 6 seconds replay; players narrate the deja vu.
2. Brass Watcher Enforcer patrol (Creature 3) — it wants to "nap" the intruders, not kill them.
3. Turbine hall traversal puzzle — impassable until Stasis Field.
4. Chrono-Lab prank vault: Data-Mimics disguised as terminals steal a feat/skill for 1d4 rounds.
5. Claim the Chrono-Shifter; the station clock lurches forward and AURA gets very apologetic.$t$,
    fallbacks = $t$• If they solve the turbines early: the Watcher reactivates and shoves someone toward the blades.
• If they go full stealth: let it work — reward it with the Apology Loot table.$t$,
    gm_notes = $t$Brass Watcher: Physical resistance 3 (not Adamantine/Electricity) — signal this so the party swaps damage type. Mandatory Nap Protocol is DC 20 Fort; Unconscious 1 round on crit fail is scary at level 3, so use it once for drama.$t$,
    status = 'planned'
  WHERE campaign_id = cid AND number = 2;

  UPDATE public.sessions SET
    title = $t$Session 3 — Aether Suite$t$,
    intro = $t$The Star-Gazer Observatory is a cathedral of glass and brass, and every pane of it is looking at something that is not there.

Red security lasers grid the floor in a lattice you could not walk through on your best day. Beyond them, the Phase-Tuner hums in its cradle, and the stars outside the dome swim like fish in a bowl. Something with too many joints moves along the ceiling corners — there, then not there, then behind you.

"Ah," says AURA. "Yes. Something came in with the imps. I would call that a problem."$t$,
    goals = $t$Recover the Phase-Tuner from the Observatory. Party ends the session with Aetheric Shift, letting them ghost-step through laser grids and locked security bars.$t$,
    scenes = $t$1. Observatory approach — Void-Puffers create 15-ft Zones of Silence; no verbal spells, no Envoy orders.
2. Laser grid puzzle — solvable the hard way (Thievery/Acrobatics) or later trivially with Aetheric Shift.
3. Phase-Stalker hunt (Creature 4) — the tentpole fight; it corner-jumps and swaps PC positions.
4. Claim the Phase-Tuner. The trail of neon handprints now leads down, to the Mainframe.
5. Foreshadow: AURA reveals the imps have plugged something into the logic core.$t$,
    fallbacks = $t$• If the Stalker is too much: it is a hunter, not a martyr — it flees at half HP and returns in Session 4.
• If they are locked out of the Observatory: a Glimmer-Gremlin trades entry for the shiniest thing they own.$t$,
    gm_notes = $t$Creature 4 vs a level 3 party is a Severe-leaning solo — use terrain (corners, silence zones) rather than more HP. Position Swap (DC 21 Will) is the fun part; use it to yank the squishiest PC into melee once per round at most.$t$,
    status = 'planned'
  WHERE campaign_id = cid AND number = 3;

  UPDATE public.sessions SET
    title = $t$Session 4 — Mainframe Core$t$,
    intro = $t$Down at the base of the Spire, the Mainframe Core beats like a heart made of brass and starlight — and it is wearing a crown.

King Glimmer-Gully sits atop the logic array on a throne of stolen components, scepter crackling, court of gremlins giggling around him. The four cradles behind him are empty. Your gear — every last confiscated piece of it — is stacked beside the throne in a very neat, very insulting pile.

"You brought them all back!" he beams. "Oh, that's the best part of the game."$t$,
    goals = $t$Defeat King Glimmer-Gully, assemble the Unity Engine, survive the 10-round self-destruct escape, plug the Engine in and save the Spire.$t$,
    scenes = $t$1. Throne room parley — he will absolutely monologue; social skills can strip him of allies.
2. Boss fight: King Glimmer-Gully (Creature 5 elite) + 2-4 Gremlin minions.
3. SELF-DESTRUCT: "CRITICAL ALERT: LOGIC CENTER UNSTABLE. INITIATING STATION SANITIZATION PROTOCOL. TIME TO PURGE: 10 ROUNDS." Put a d10 on the table and tick it down out loud.
4. Escape run — one obstacle per 2 rounds, each solved by one unlocked power (Vector Dash, Stasis Field, Aetheric Shift, Omni-Dash).
5. Plug in the Unity Engine. Epilogue beat for each PC.$t$,
    fallbacks = $t$• If the boss drops fast: he escapes via "Not the Face!", steals the Unity Engine, and the escape run becomes a chase.
• If the party is battered before the countdown: AURA reroutes power for one free Healing Serum each — she feels responsible.$t$,
    gm_notes = $t$Cosmic Tantrum (DC 22 Reflex, up to 6d6 force) can drop a level 3 PC — telegraph the wind-up a round early. Countdown: one physical d10, ticked every round, no exceptions; Omni-Dash grants one reaction-based auto-success per round to keep pace. He is a prankster, not a murderer — defeat can be humiliation rather than death.$t$,
    status = 'planned'
  WHERE campaign_id = cid AND number = 4;

  UPDATE public.sessions SET
    title = $t$Session 5 — Buffer / Epilogue (optional)$t$,
    intro = $t$$t$,
    goals = $t$Spare slot. Use it if Sessions 1-4 run long, or run the aftermath: salvage rights, what the imps left behind, and who at Spire Command wants the cores now that they are proven.$t$,
    scenes = $t$1. Repairs and rewards aboard the restored Ouroboros Spire.
2. One personal beat per PC — the stasis item they hid, and why.
3. Hook for the next arc: the Unity Engine remembers being switched on.$t$,
    fallbacks = $t$Cut entirely if the campaign lands cleanly at the end of Session 4.$t$,
    gm_notes = $t$Your guide is a 4-session arc; this slot exists so you never have to rush the finale.$t$,
    status = 'planned'
  WHERE campaign_id = cid AND number = 5;

  INSERT INTO public.milestones (campaign_id, title, description, gm_notes, order_index, session_number, visible_to_players) VALUES
    (cid, 'Wake up and take the job', 'Security Team 4 comes out of stasis to find the Spire overrun with bubbles, giggling, and apology notes.', 'Session 1 opener. Players should end this beat clear on the tone: pranks, not pirates.', 0, 1, true),
    (cid, 'Recover the Singularity Lens', 'The gravity core, stolen from the Atmospheric Regulator. Unlocks Vector Dash and wall-walking.', 'Gate the Bottomless Maintenance Pit behind this.', 1, 1, false),
    (cid, 'Recover the Chrono-Shifter', 'The time core, hidden in the Engineering Chronos-Lab. Unlocks the Stasis Field.', 'Gate the turbine hall behind this.', 2, 2, false),
    (cid, 'Recover the Phase-Tuner', 'The aether core, taken to the Star-Gazer Observatory. Unlocks Aetheric Shift.', 'Gate laser grids and security bars behind this.', 3, 3, false),
    (cid, 'Dethrone King Glimmer-Gully', 'The imp king holds court on the Mainframe Core, wearing a crown of stolen components.', 'Defeat can be social humiliation instead of death — it fits the tone better.', 4, 4, false),
    (cid, 'Assemble the Unity Engine and save the Spire', 'Ten rounds to the purge. Plug it in or lose the station.', 'Physical d10 on the table. Omni-Dash keeps the pace honest.', 5, 4, false);

  INSERT INTO public.cards (campaign_id, type, name, subtitle, player_text, gm_secrets, stat_block, tags, hints, solution, order_index) VALUES
    (cid, 'location', 'The Ouroboros Spire', 'Home station — polished mahogany, brass filigree, crystalline Aether pipes', 'A high-fantasy spelljammer station wound in a great ring: warm wood decking, glowing brass inlay, and crystal pipes that carry raw Aether like veins of light. Your posting. Currently, your problem.', 'Hub of the metroidvania map. Every sector interconnects — as the party unlocks powers, old corridors open into new routes. Keep a rough map so backtracking feels like progress, not repetition.', '', ARRAY['hub','station'], ARRAY[]::text[], '', 0),
    (cid, 'location', 'Atmospheric Regulator — The Bubble Hub', 'Session 1 · Singularity Lens', 'Three inches of shimmering pink bubbles across every deck, and the mess hall gravity has been switched off. Everything in it is very, very floaty.', 'Holds the Singularity Lens. Encounters: Bubble-Flooded Corridor hazard, 2-3 Glimmer-Gremlin Saboteurs. Exit route crosses the Bottomless Maintenance Pit — needs Vector Dash.', '', ARRAY['session 1','gravity'], ARRAY[]::text[], '', 1),
    (cid, 'location', 'Engineering Chronos-Lab', 'Session 2 · Chrono-Shifter', 'A clockwork nebula of brass turbines the size of shuttles, amber light strobing between blades. Time here does not tick — it stutters.', 'Holds the Chrono-Shifter. Encounters: Brass Watcher Enforcer patrol, Data-Mimic terminals. Turbine hall is impassable until Stasis Field.', '', ARRAY['session 2','time'], ARRAY[]::text[], '', 2),
    (cid, 'location', 'Star-Gazer Observatory', 'Session 3 · Phase-Tuner', 'A cathedral of glass and brass under a swimming field of stars, floored wall to wall in red security lasers.', 'Holds the Phase-Tuner. Encounters: Void-Puffers (15-ft Zone of Silence), Phase-Stalker (Creature 4, tentpole fight). Laser grid trivialised by Aetheric Shift.', '', ARRAY['session 3','aether'], ARRAY[]::text[], '', 3),
    (cid, 'location', 'Mainframe Core', 'Session 4 · Unity Engine, boss, and escape', 'The base of the Spire, where the logic array beats like a heart of brass and starlight.', 'Throne room of King Glimmer-Gully. On his defeat: 10-round self-destruct. Escape route uses every unlocked traversal power in sequence.', '', ARRAY['session 4','boss','finale'], ARRAY[]::text[], '', 4),
    (cid, 'npc', 'AURA', 'Station AI — drowsy, apologetic, unreliable', 'The voice of the Ouroboros Spire. Polite to a fault, currently running at about sixty percent of her usual composure. "They took the shiny circles. Please fix this."', 'Your hint-delivery valve. When the table stalls, AURA offers help that is 80% correct. She feels genuinely guilty about the breach and will spend power on the party (free Healing Serums) at the low point in Session 4.', '', ARRAY['ally','hint system'], ARRAY[]::text[], '', 5),
    (cid, 'npc', 'King Glimmer-Gully', 'Imp king · Creature 5 elite boss', 'A crowned Glimmer-Imp on a throne of stolen components, scepter crackling, court giggling around him. He is delighted you came.', 'He is not evil — he is playing. He has kept the party gear stacked neatly beside the throne. Social play can peel his minions away before initiative. Reaction "Not the Face!" swaps him with an adjacent gremlin when targeted.', 'King Glimmer-Gully — Creature 5 (Elite Boss)
Perception +14; Low-Light Vision. Languages Common, Aklo
Skills Deception +14, Diplomacy +12, Stealth +14, Thievery +16
Str +0, Dex +5, Con +3, Int +2, Wis +2, Cha +5
AC 23; Fort +10, Ref +15, Will +13; HP 75
Speed 30 ft., Fly 15 ft.
Reaction "Not the Face!" — swaps places with an adjacent Glimmer-Gremlin within 10 ft. when targeted by an attack.
[1] Scepter of Static +14 (agile, finesse), 1d8+5 electricity
[3] Cosmic Tantrum — 15-ft burst, DC 22 Reflex. Success: none. Failure: 4d6 force, pushed 10 ft. Crit failure: 6d6 force, pushed 20 ft., Prone.
[2] King''s Command — target PC DC 22 Will or drops held item; King teleports it 20 ft. away.', ARRAY['boss','session 4'], ARRAY[]::text[], '', 6),
    (cid, 'creature', 'Glimmer-Gremlin Saboteur', 'Creature 1 · CN Tiny Fey (Aether)', 'A tiny giggling thing made of static and mischief, armed with a wrench nearly its own size.', 'Standard mook. Use 2-4 at a time. They flee rather than die. Non-lethal resolution earns Apology Loot.', 'Glimmer-Gremlin Saboteur — Creature 1
CN Tiny Fey Aether
Perception +7; Low-Light Vision. Languages Common, Aklo (giggling dialect)
Skills Acrobatics +8, Stealth +8, Thievery +9
Str -2, Dex +4, Con +1, Int +0, Wis +1, Cha +2
AC 17; Fort +4, Ref +9, Will +7; HP 20; Speed 25 ft.
[1] Tiny Wrench +8 (agile, finesse), 1d4+2 bludgeoning plus Mischief Spark
[1] Shiny Rock +8 (thrown 20 ft.), 1d4+2 bludgeoning
Mischief Spark — on a hit, DC 17 Reflex. Failure: primary weapon or tech slot glitches; one Interact action to fix.
[2] Invisibility Prank (illusion) — invisible 1 round or until it attacks.', ARRAY['mook'], ARRAY[]::text[], '', 7),
    (cid, 'creature', 'Brass Watcher Enforcer', 'Creature 3 · N Medium Construct (mindless)', 'A slab of walking brass with a single patient lens, here to escort you politely to bed.', 'Physical resistance 3 except adamantine or electricity — telegraph this. Its goal is sedation, not killing, which keeps the tone right.', 'Brass Watcher Enforcer — Creature 3
N Medium Construct Mindless
Perception +7; Darkvision. Skills Athletics +11
Str +4, Dex +0, Con +3, Int -5, Wis +0, Cha -5
AC 20; Fort +11, Ref +7, Will +7; HP 45
Resistances physical 3 (except adamantine or electricity)
Immunities bleed, death effects, disease, paralyzed, poison, sleep, mental
Speed 20 ft.
[1] Fist +11, 1d8+5 bludgeoning
[2] Mandatory Nap Protocol — Grapple (+11 Athletics). On success, sedation gas: DC 20 Fortitude. Failure: Stunned 1. Crit failure: Unconscious 1 round.', ARRAY['session 2','construct'], ARRAY[]::text[], '', 8),
    (cid, 'creature', 'Phase-Stalker', 'Creature 4 · CN Medium Beast (Aether)', 'Something with too many joints, walking the corners of the room — there, then not there, then behind you.', 'Session 3 tentpole. Solo above party level: lean on terrain and corner-jumping, not extra HP. Flees at half HP if the fight is one-sided; bring it back in Session 4.', 'Phase-Stalker — Creature 4
CN Medium Beast Aether
Perception +11; Darkvision, Scent (imprecise) 30 ft.
Skills Acrobatics +11, Stealth +11
Str +2, Dex +4, Con +2, Int -2, Wis +2, Cha +0
AC 21; Fort +9, Ref +13, Will +11; HP 60; Speed 35 ft.
[1] Phase-Bite +14 (finesse), 2d8+4 piercing plus Position Swap
Position Swap — targets up to 2 PCs, DC 21 Will. Failure: teleports and swaps their locations within 15 ft.
[1] Corner-Jump (teleportation) — teleports between visible wall corners within 30 ft.', ARRAY['session 3','solo'], ARRAY[]::text[], '', 9),
    (cid, 'creature', 'Data-Mimic', 'Level 3 · reskinned mimic', 'A chest, a terminal, a security camera — right up until it is teeth.', 'On a hit, the target forgets one feat or skill for 1d4 rounds. Great for the Chronos-Lab vault. Play the memory loss for comedy.', 'Data-Mimic — Level 3 (reskin of Mimic)
Disguised as station objects: chests, terminals, cameras.
On hit: target forgets 1 feat or skill for 1d4 rounds.', ARRAY['trap','session 2'], ARRAY[]::text[], '', 10),
    (cid, 'creature', 'Void-Puffer', 'Level 2 · reskinned akata', 'A translucent jellyfish drifting through vacuum-cold air, and everywhere it goes the sound goes with it.', 'Creates a 15-ft Zone of Silence: no verbal spells, no Envoy orders. Use to pressure casters in the Observatory approach.', 'Void-Puffer — Level 2 (reskin of Akata)
Aura: 15-ft Zone of Silence — absorbs sound, muting verbal spells and Envoy orders.', ARRAY['session 3','silence'], ARRAY[]::text[], '', 11),
    (cid, 'item', 'Singularity Lens', 'Gravity core · unlocks Vector Dash + Wall-Walking', 'A lens of compressed dark, heavy in a way that has nothing to do with weight.', 'Session 1 reward. Vector Dash crosses the Bottomless Maintenance Pit and opens two shortcut routes back through the Regulator.', '', ARRAY['core','traversal'], ARRAY[]::text[], '', 12),
    (cid, 'item', 'Chrono-Shifter', 'Time core · unlocks Stasis Field', 'A brass movement that keeps a time no clock agrees with.', 'Session 2 reward. Stasis Field freezes the giant turbines so the party can cross the fan blades — and can pause one hazard per scene elsewhere.', '', ARRAY['core','traversal'], ARRAY[]::text[], '', 13),
    (cid, 'item', 'Phase-Tuner', 'Aether core · unlocks Aetheric Shift', 'A tuning fork of pale crystal that rings in a room where sound has been eaten.', 'Session 3 reward. Aetheric Shift ghost-steps through laser grids and locked security bars — retroactively opens two earlier sectors.', '', ARRAY['core','traversal'], ARRAY[]::text[], '', 14),
    (cid, 'item', 'Unity Engine', 'Omni-Sync core · unlocks Omni-Dash', 'All four echoes singing the same note.', 'Session 4. Assembled from the other three plus the crown component. Omni-Dash: one reaction-based skill auto-success per round during the 10-round escape.', '', ARRAY['core','finale'], ARRAY[]::text[], '', 15),
    (cid, 'puzzle', 'Bubble-Flooded Corridor', 'Level 2 hazard · Session 1', 'The corridor is knee-deep in pink soap. It smells like candy. It is trying to kill your dignity.', 'DC 18 Acrobatics or Athletics to cross without falling Prone. Comedy hazard — no damage, just embarrassment and lost actions.', '', ARRAY['hazard','session 1'], ARRAY['The bubbles are shallowest along the wall seams.','Something under the foam is spraying more of it — find the valve.','Wall-Walking, once you have it, skips this entirely.'], 'Shut the foam valve (DC 18 Thievery/Crafting) or cross the wall seams one at a time.', 16),
    (cid, 'puzzle', 'Gravity-Flipped Shaft', 'Level 3 hazard · Session 1-2', 'The shaft ahead has decided that down is a matter of opinion.', 'DC 20 Athletics to climb, or cross cleanly with Vector Dash. Good gate to teach the traversal loop.', '', ARRAY['hazard','traversal'], ARRAY['The inversion has an edge — watch where the dust falls.','Anything you throw into it tells you which way it will pull you.','Vector Dash carries you straight through the flip.'], 'Vector Dash across, or DC 20 Athletics climb with a fixed line.', 17),
    (cid, 'puzzle', 'Turbine Hall', 'Traversal gate · Session 2', 'Blades the size of shuttlecraft, turning fast enough to make the air hum.', 'Impassable until Stasis Field. If the party tries anyway, one failed DC 22 Reflex costs serious HP — let them see that before they commit.', '', ARRAY['gate','session 2'], ARRAY['Watch the rhythm — the blades slow for a half-second every rotation.','The control gallery above has a manual brake, seized shut (DC 22 Athletics).','The Chrono-Shifter can stop them outright.'], 'Freeze the turbines with the Stasis Field and walk across the blades.', 18),
    (cid, 'puzzle', 'Laser Grid — Observatory Floor', 'Traversal gate · Session 3', 'A lattice of red light from wall to wall, with the Phase-Tuner glowing on the far side.', 'Solvable the hard way (Thievery to reroute, Acrobatics to thread) or trivially with Aetheric Shift. Void-Puffers silence the room while they work.', '', ARRAY['gate','session 3'], ARRAY['The grid pulses — count the gap between sweeps.','A junction box on the near pillar controls one quadrant (DC 20 Thievery).','Aetheric Shift walks straight through the beams.'], 'Ghost-step through with Aetheric Shift, or kill one quadrant at the junction and thread the rest (DC 20 Acrobatics).', 19);
END
$mig$;