-- Run once in Supabase SQL Editor after setup-all.sql
-- Admin login: taanush029905@gmail.com / 123456systemh

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_uid uuid;
  v_encrypted text := crypt('123456systemh', gen_salt('bf'));
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
      'taanush029905@gmail.com', v_encrypted,
      now(), '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Taanush Admin"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (
      gen_random_uuid(), v_uid,
      jsonb_build_object('sub', v_uid::text, 'email', 'taanush029905@gmail.com', 'email_verified', true),
      'email', v_uid::text, now(), now(), now()
    );
  ELSE
    UPDATE auth.users
    SET
      encrypted_password = v_encrypted,
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now()
    WHERE id = v_uid;
  END IF;

  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (v_uid, 'Taanush Admin', 'taanush029905@gmail.com')
  ON CONFLICT (user_id) DO UPDATE
    SET display_name = EXCLUDED.display_name, email = EXCLUDED.email;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
