
-- 1. Create admin user if not exists
DO $$
DECLARE
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = 'taanush029905@gmail.com';
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_uid, 'authenticated', 'authenticated',
      'taanush029905@gmail.com', crypt('123456systemh', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Taanush Admin"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid,
      jsonb_build_object('sub', v_uid::text, 'email', 'taanush029905@gmail.com', 'email_verified', true),
      'email', v_uid::text, now(), now(), now());
  END IF;

  INSERT INTO public.profiles (user_id, display_name, email)
    VALUES (v_uid, 'Taanush Admin', 'taanush029905@gmail.com')
    ON CONFLICT DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (v_uid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
END $$;

-- 2. Approval workflow on papers
ALTER TABLE public.papers
  ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS uploader_id uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid;

-- backfill existing papers as approved so they don't disappear
UPDATE public.papers SET approved = true WHERE approved = false AND created_at < now();

-- Replace permissive policies
DROP POLICY IF EXISTS papers_select_all ON public.papers;
DROP POLICY IF EXISTS papers_insert_all ON public.papers;
DROP POLICY IF EXISTS papers_update_all ON public.papers;
DROP POLICY IF EXISTS papers_delete_all ON public.papers;

CREATE POLICY papers_select_approved_or_owner_or_admin ON public.papers
  FOR SELECT TO public
  USING (
    approved = true
    OR (auth.uid() IS NOT NULL AND auth.uid() = uploader_id)
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY papers_insert_auth ON public.papers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY papers_update_admin ON public.papers
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY papers_delete_admin_or_owner ON public.papers
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = uploader_id);
