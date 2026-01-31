-- Función para crear un espacio de pareja (bypass RLS con SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.create_couple_space_with_member(
  p_title TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_space_id UUID;
  v_token TEXT;
  v_result JSON;
BEGIN
  -- Obtener el usuario autenticado
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validar título
  IF p_title IS NULL OR LENGTH(TRIM(p_title)) < 3 THEN
    RAISE EXCEPTION 'Title must be at least 3 characters';
  END IF;

  IF LENGTH(p_title) > 50 THEN
    RAISE EXCEPTION 'Title must be at most 50 characters';
  END IF;

  -- Crear el espacio
  INSERT INTO public.couple_spaces (created_by, title, status)
  VALUES (v_user_id, TRIM(p_title), 'active')
  RETURNING id INTO v_space_id;

  -- Agregar al usuario como owner
  INSERT INTO public.couple_members (couple_id, user_id, role)
  VALUES (v_space_id, v_user_id, 'owner');

  -- Inicializar streak
  INSERT INTO public.streaks (couple_id, current_streak)
  VALUES (v_space_id, 0)
  ON CONFLICT (couple_id) DO NOTHING;

  -- Crear invitación
  v_token := encode(gen_random_bytes(24), 'hex');
  
  INSERT INTO public.pair_invitations (
    couple_id, 
    inviter_user_id, 
    token, 
    expires_at
  )
  VALUES (
    v_space_id,
    v_user_id,
    v_token,
    NOW() + INTERVAL '7 days'
  );

  -- Retornar resultado
  SELECT json_build_object(
    'space_id', v_space_id,
    'invite_token', v_token,
    'title', p_title,
    'status', 'active',
    'created_at', NOW()
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Dar permisos a usuarios autenticados
GRANT EXECUTE ON FUNCTION public.create_couple_space_with_member(TEXT) TO authenticated;
