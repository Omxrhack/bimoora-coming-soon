-- Función para obtener detalles del espacio y token de invitación (SECURITY DEFINER para evitar problemas de recursión RLS)
CREATE OR REPLACE FUNCTION public.get_couple_space_details(
  p_space_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_space RECORD;
  v_token TEXT;
  v_result JSON;
BEGIN
  -- Obtener el usuario autenticado
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Obtener datos del espacio
  SELECT * INTO v_space
  FROM public.couple_spaces
  WHERE id = p_space_id;

  IF v_space IS NULL THEN
    RAISE EXCEPTION 'Space not found';
  END IF;

  -- Verificar que el usuario sea miembro de este espacio (seguridad básica)
  IF NOT EXISTS (
    SELECT 1 FROM public.couple_members 
    WHERE couple_id = p_space_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Not a member of this space';
  END IF;

  -- Obtener token de invitación activo si existe
  SELECT token INTO v_token
  FROM public.pair_invitations
  WHERE couple_id = p_space_id
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;

  -- Construir resultado
  SELECT json_build_object(
    'space', v_space,
    'inviteToken', v_token
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_couple_space_details(UUID) TO authenticated;
