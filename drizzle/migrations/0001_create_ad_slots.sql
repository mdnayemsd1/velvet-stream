CREATE TABLE public.ad_slots (
  slot smallint PRIMARY KEY CHECK (slot IN (1, 2)),
  code text NOT NULL DEFAULT '' CHECK (char_length(code) <= 20000),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ad_slots TO anon, authenticated;
GRANT ALL ON public.ad_slots TO service_role;
ALTER TABLE public.ad_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ad slots" ON public.ad_slots FOR SELECT TO anon, authenticated USING (true);