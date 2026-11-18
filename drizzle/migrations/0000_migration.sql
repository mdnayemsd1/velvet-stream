CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  url text NOT NULL CHECK (char_length(url) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.videos TO anon, authenticated;
GRANT ALL ON public.videos TO service_role;

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos"
  ON public.videos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX videos_created_at_idx ON public.videos (created_at DESC);

-- Failed admin login attempts, used for lockout (server-only)
CREATE TABLE public.admin_login_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_login_attempts TO service_role;

ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

CREATE INDEX admin_login_attempts_ip_idx ON public.admin_login_attempts (ip, created_at DESC);