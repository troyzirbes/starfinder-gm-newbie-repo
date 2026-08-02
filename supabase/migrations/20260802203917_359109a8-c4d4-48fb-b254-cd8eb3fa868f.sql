CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  system text NOT NULL DEFAULT 'Starfinder 2e',
  gm_token text NOT NULL UNIQUE,
  player_token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  number int NOT NULL,
  title text NOT NULL DEFAULT '',
  goals text NOT NULL DEFAULT '',
  scenes text NOT NULL DEFAULT '',
  fallbacks text NOT NULL DEFAULT '',
  gm_notes text NOT NULL DEFAULT '',
  recap text NOT NULL DEFAULT '',
  recap_published boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'planned',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, number)
);

CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  gm_notes text NOT NULL DEFAULT '',
  order_index int NOT NULL DEFAULT 0,
  achieved boolean NOT NULL DEFAULT false,
  session_number int,
  visible_to_players boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'npc',
  name text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  player_text text NOT NULL DEFAULT '',
  gm_secrets text NOT NULL DEFAULT '',
  stat_block text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  hints text[] NOT NULL DEFAULT '{}',
  solution text NOT NULL DEFAULT '',
  hints_revealed int NOT NULL DEFAULT 0,
  reveal_state text NOT NULL DEFAULT 'hidden',
  session_number int,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_campaign ON public.sessions(campaign_id);
CREATE INDEX idx_milestones_campaign ON public.milestones(campaign_id);
CREATE INDEX idx_cards_campaign ON public.cards(campaign_id);

GRANT ALL ON public.campaigns TO service_role;
GRANT ALL ON public.sessions TO service_role;
GRANT ALL ON public.milestones TO service_role;
GRANT ALL ON public.cards TO service_role;

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_campaigns_touch BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_sessions_touch BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_milestones_touch BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_cards_touch BEFORE UPDATE ON public.cards FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();