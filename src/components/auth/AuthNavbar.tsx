"use client"

import React, { useEffect, useState } from "react"
import { User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User as UserType } from "@/models/types/user"

interface AuthNavbarProps {
  className?: string
}

export default function AuthNavbar({ className = "" }: AuthNavbarProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay sesión activa
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at
          })
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
        <div className="w-20 h-9 bg-[#E8D4F8]/30 dark:bg-[#A89CFF]/15 rounded-lg animate-pulse" />
        <div className="w-24 h-10 bg-[#E8D4F8]/30 dark:bg-[#A89CFF]/15 rounded-xl animate-pulse" />
      </div>
    )
  }

  // Si el usuario está autenticado, mostrar icono de perfil
  if (user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <a
          href="/perfil"
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base font-medium text-white bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-105 transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:inline">
            {user.full_name?.split(' ')[0] || 'Mi Perfil'}
          </span>
          <span className="sm:hidden">Perfil</span>
        </a>
      </div>
    )
  }

  // Si no está autenticado, mostrar botones de login/registro
  return (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      <a 
        href="/auth/acceder" 
        className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base font-medium text-[#1E1B4B] dark:text-white hover:text-[#A89CFF] transition-colors"
      >
        Iniciar sesión
      </a>
      <a 
        href="/auth/crear-cuenta" 
        className="px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium text-white bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-105 transition-all"
      >
        Registrarse
      </a>
    </div>
  )
}
