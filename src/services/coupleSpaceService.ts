import { supabase } from '../lib/supabase'

export type CoupleSpace = {
    id: string
    created_by: string
    title: string | null
    status: 'active' | 'paused' | 'closed'
    created_at: string
    updated_at: string
}

export type CoupleMember = {
    couple_id: string
    user_id: string
    role: 'owner' | 'member'
    joined_at: string
    left_at: string | null
}

export type CoupleSpaceWithMembers = CoupleSpace & {
    members: CoupleMember[]
    partner?: {
        id: string
        username: string | null
    }
}

/**
 * Obtiene los espacios de pareja del usuario actual
 */
export async function getUserCoupleSpaces(): Promise<{
    success: boolean
    spaces?: CoupleSpaceWithMembers[]
    error?: string
}> {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'No autenticado' }
        }

        // Use RPC to avoid RLS loop
        const { data: spaces, error } = await supabase
            .rpc('get_user_couple_spaces_secure')

        if (error) {
            console.error('[CoupleSpace] Error fetching spaces via RPC:', error)
            return { success: false, error: error.message }
        }

        // Map RPC result to expected type
        const mappedSpaces: CoupleSpaceWithMembers[] = (spaces as any[] || []).map(s => {
            // In the RPC result, 'members' contains the profiles.
            // We need to map them to the expected structure.
            const members = s.members.map((m: any) => ({
                couple_id: s.id,
                user_id: m.user_id,
                role: m.role,
                joined_at: new Date().toISOString(), // RPC doesn't return this yet, but it's optional for display
                profile: {
                    display_name: m.display_name,
                    avatar_url: m.avatar_url
                }
            }));

            // Partner logic (optional, for frontend convenience)
            const partnerMember = members.find((m: any) => m.user_id !== user.id);
            const partner = partnerMember ? {
                id: partnerMember.user_id,
                username: partnerMember.profile?.display_name // Using display_name as username fallback
            } : undefined;

            return {
                id: s.id,
                created_by: s.created_by,
                title: s.title,
                status: s.status,
                created_at: s.created_at,
                updated_at: s.updated_at,
                members: members,
                partner: partner
            };
        });

        return { success: true, spaces: mappedSpaces }

    } catch (error) {
        console.error('[CoupleSpace] Unexpected error:', error)
        return { success: false, error: 'Error inesperado' }
    }
}

/**
 * Crea un nuevo espacio de pareja
 */
export async function createCoupleSpace(title: string): Promise<{
    success: boolean
    space?: CoupleSpace
    inviteToken?: string
    error?: string
}> {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'No autenticado' }
        }

        // Validar título en el cliente también
        const trimmedTitle = title.trim()
        if (!trimmedTitle) {
            return { success: false, error: 'El título no puede estar vacío' }
        }

        if (trimmedTitle.length < 3) {
            return { success: false, error: 'El título debe tener al menos 3 caracteres' }
        }

        if (trimmedTitle.length > 50) {
            return { success: false, error: 'El título es demasiado largo (máximo 50 caracteres)' }
        }

        // Usar la función RPC que tiene SECURITY DEFINER para bypass RLS
        const { data: result, error: rpcError } = await supabase
            .rpc('create_couple_space', {
                p_title: trimmedTitle
            })

        console.log("[createCoupleSpace] RPC Result:", result)
        console.log("[createCoupleSpace] RPC Error:", rpcError)

        if (rpcError) {
            console.error("[createCoupleSpace] RPC Error Detail:", rpcError)

            if (rpcError.message.includes('Not authenticated')) {
                return { success: false, error: 'No estás autenticado' }
            }

            if (rpcError.message.includes('Title must be')) {
                return { success: false, error: rpcError.message }
            }

            return { success: false, error: 'No se pudo crear el espacio: ' + rpcError.message }
        }

        if (!result) {
            return { success: false, error: 'No se recibió respuesta del servidor' }
        }

        let spaceId = '';
        let inviteToken = '';
        let spaceData: any = null;

        // Verificar el tipo de respuesta
        if (typeof result === 'string') {
            // El RPC devolvió solo el ID
            spaceId = result;

            // Usar RPC para obtener detalles y evitar problemas de RLS (stack depth limit)
            const { data: detailsResult, error: detailsError } = await supabase
                .rpc('get_couple_space_details', {
                    p_space_id: spaceId
                })

            if (detailsError) {
                console.error("[createCoupleSpace] Error getting details after creation:", detailsError)
                return { success: false, error: 'Espacio creado, pero error al obtener detalles: ' + detailsError.message }
            }

            if (detailsResult) {
                spaceData = detailsResult.space;
                inviteToken = detailsResult.inviteToken;
            } else {
                return { success: false, error: 'No se pudieron recuperar los detalles del espacio' }
            }

            // Si por alguna razón no hay token, o el token parece ser un UUID (lo que sería incorrecto), crear uno nuevo
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(inviteToken || '');

            if (!inviteToken || isUUID) {
                console.log("[CoupleSpace] Token inválido o faltante, creando nueva invitación via RPC...")
                const { data: newTokenData, error: newTokenError } = await supabase
                    .rpc('create_pair_invitation', {
                        p_couple_id: spaceId,
                        p_invited_email: null,
                        p_expires_hours: 168
                    })

                if (!newTokenError && newTokenData) {
                    console.log("[CoupleSpace] Invitación creada exitosamente:", newTokenData)
                    inviteToken = newTokenData;
                } else {
                    console.error("[CoupleSpace] Error creando invitación:", newTokenError)
                    return { success: false, error: "No se pudo generar un código de invitación válido." }
                }
            }

        } else if (typeof result === 'object') {
            // El RPC devolvió un objeto completo (como esperábamos originalmente)
            spaceId = result.space_id;
            inviteToken = result.invite_token;
            spaceData = {
                id: result.space_id,
                created_by: user.id,
                title: result.title,
                status: result.status,
                created_at: result.created_at,
                updated_at: result.created_at
            };
        }

        // Construir el objeto space final
        const space: CoupleSpace = {
            id: spaceData.id,
            created_by: spaceData.created_by,
            title: spaceData.title,
            status: spaceData.status,
            created_at: spaceData.created_at,
            updated_at: spaceData.updated_at
        }

        return {
            success: true,
            space,
            inviteToken: inviteToken || space.id
        }
    } catch (error) {
        console.error('[CoupleSpace] Unexpected error:', error)
        return { success: false, error: 'Error inesperado al crear el espacio' }
    }
}

/**
 * Unirse a un espacio de pareja mediante token de invitación
 */
export async function joinCoupleSpace(inviteToken: string): Promise<{
    success: boolean
    space?: CoupleSpace
    error?: string
}> {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'No autenticado' }
        }

        // Usar la función de la BD para aceptar la invitación
        const { data: coupleId, error: acceptError } = await supabase
            .rpc('accept_invitation', {
                p_token: inviteToken
            })

        if (acceptError) {
            console.error('[CoupleSpace] Error accepting invitation:', acceptError)

            // Mensajes de error más amigables
            if (acceptError.message.includes('Invalid token')) {
                return { success: false, error: 'Código de invitación inválido' }
            }
            if (acceptError.message.includes('already used')) {
                return { success: false, error: 'Este código ya fue utilizado' }
            }
            if (acceptError.message.includes('expired')) {
                return { success: false, error: 'Este código ha expirado' }
            }
            if (acceptError.message.includes('full')) {
                return { success: false, error: 'Este espacio ya está completo' }
            }

            return { success: false, error: acceptError.message }
        }

        // Obtener el espacio usando RPC seguro para evitar RLS stack depth error
        const { data: detailsResult, error: detailsError } = await supabase
            .rpc('get_couple_space_details', {
                p_space_id: coupleId
            })

        if (detailsError) {
            console.error('[CoupleSpace] Error fetching space via RPC:', detailsError)
            // Fallback a select directo (puede fallar con stack depth error si RLS está mal)
            const { data: space, error: spaceError } = await supabase
                .from('couple_spaces')
                .select('*')
                .eq('id', coupleId)
                .single()

            if (spaceError) {
                return { success: false, error: spaceError.message }
            }
            return { success: true, space }
        }

        return { success: true, space: detailsResult?.space }
    } catch (error) {
        console.error('[CoupleSpace] Unexpected error:', error)
        return { success: false, error: 'Error inesperado' }
    }
}

/**
 * Abandonar un espacio de pareja
 */
export async function leaveCoupleSpace(spaceId: string): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'No autenticado' }
        }

        // Marcar como que el usuario dejó el espacio
        const { error } = await supabase
            .from('couple_members')
            .update({ left_at: new Date().toISOString() })
            .eq('couple_id', spaceId)
            .eq('user_id', user.id)
            .is('left_at', null)

        if (error) {
            console.error('[CoupleSpace] Error leaving space:', error)
            return { success: false, error: error.message }
        }

        // Actualizar el estado del espacio a 'closed'
        await supabase
            .from('couple_spaces')
            .update({ status: 'closed' })
            .eq('id', spaceId)

        return { success: true }
    } catch (error) {
        console.error('[CoupleSpace] Unexpected error:', error)
        return { success: false, error: 'Error inesperado' }
    }
}

/**
 * Checks the members of a specific couple space (used for polling during onboarding)
 */
export async function getSpaceMembers(spaceId: string): Promise<{
    success: boolean
    members?: CoupleMember[]
    error?: string
}> {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'No autenticado' }
        }

        // Use RPC to avoid RLS stack depth limit exceeded
        const { data: members, error: membersError } = await supabase
            .rpc('get_couple_members_secure', {
                p_couple_id: spaceId
            })

        if (membersError) {
            console.error('[CoupleSpace] Error fetching members via RPC:', membersError)
            // Fallback to direct select if RPC fails or doesn't exist (though it might trigger RLS error)
            if (membersError.message.includes('function') && membersError.message.includes('not found')) {
                const { data: directMembers, error: directError } = await supabase
                    .from('couple_members')
                    .select('*')
                    .eq('couple_id', spaceId)
                    .is('left_at', null)

                if (directError) return { success: false, error: directError.message }
                return { success: true, members: directMembers || [] }
            }
            return { success: false, error: membersError.message }
        }

        return { success: true, members: members || [] }
    } catch (error) {
        console.error('[CoupleSpace] Unexpected error:', error)
    }
}
