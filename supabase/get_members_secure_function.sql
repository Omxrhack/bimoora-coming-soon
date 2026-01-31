-- Función para obtener miembros de un espacio (SECURITY DEFINER para evitar problemas de recursión RLS)
CREATE OR REPLACE FUNCTION public.get_couple_members_secure(
  p_couple_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_members JSON;
BEGIN
  -- Obtener el usuario autenticado
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verificar que el usuario sea miembro de este espacio (seguridad básica)
  -- Nota: Hacemos select directo sin RLS gracias a SECURITY DEFINER
  IF NOT EXISTS (
    SELECT 1 FROM public.couple_members 
    WHERE couple_id = p_couple_id AND user_id = v_user_id AND left_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Not a member of this space';
  END IF;

  -- Obtener miembros
  SELECT json_agg(
    json_build_object(
      'couple_id', m.couple_id,
      'user_id', m.user_id,
      'role', m.role,
      'joined_at', m.joined_at,
      'username', p.username,
      'display_name', p.display_name,
      'avatar_url', p.avatar_url
    )
  ) INTO v_members
  FROM public.couple_members m
  LEFT JOIN public.profiles p ON p.id = m.user_id
  WHERE m.couple_id = p_couple_id 
    AND m.left_at IS NULL;

  RETURN v_members;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_couple_members_secure(UUID) TO authenticated;
