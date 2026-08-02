ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS intro text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS intro_published boolean NOT NULL DEFAULT false;