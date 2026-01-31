-- Función para obtener los espacios del usuario (SECURTY DEFINER para evitar RLS loops)
CREATE OR REPLACE FUNCTION public.get_user_couple_spaces_secure()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_spaces JSON;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  -- Seleccionamos los espacios donde el usuario es miembro
  SELECT json_agg(
    json_build_object(
      'id', s.id,
      'title', s.title,
      'status', s.status,
      'created_at', s.created_at,
      'updated_at', s.updated_at,
      'created_by', s.created_by,
      'my_role', m.role,
      'members', (
        SELECT json_agg(
          json_build_object(
            'user_id', mem.user_id,
            'role', mem.role,
            'display_name', p.display_name,
            'avatar_url', p.avatar_url
          )
        )
        FROM public.couple_members mem
        LEFT JOIN public.profiles p ON p.id = mem.user_id
        WHERE mem.couple_id = s.id AND mem.left_at IS NULL
      )
    )
  ) INTO v_spaces
  FROM public.couple_members m
  JOIN public.couple_spaces s ON s.id = m.couple_id
  WHERE m.user_id = v_user_id AND m.left_at IS NULL;

  RETURN v_spaces;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_couple_spaces_secure() TO authenticated;
