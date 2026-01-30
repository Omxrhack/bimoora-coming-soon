"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Mail, Calendar, LogOut, Heart, Settings, Edit2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ToastProvider, useToast } from "@/components/ui/CustomToast"

function ProfileContentInner() {
  const { user, isLoading, logout } = useAuth()
  const { showToast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/auth/acceder'
    }
  }, [isLoading, user])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const response = await logout()
    if (response.success) {
      showToast('success', '¡Hasta pronto!', 'Has cerrado sesión correctamente')
      setTimeout(() => {
        window.location.href = '/'
      }, 1500)
    } else {
      showToast('error', 'Error', response.error || 'No se pudo cerrar sesión')
      setIsLoggingOut(false)
    }
  }

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBFF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#6B7280]">Cargando...</p>
        </div>
      </div>
    )
  }

  // No mostrar nada si no hay usuario (se está redirigiendo)
  if (!user) {
    return null
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No disponible'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }} />
      
      {/* Decorative particles */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-[#A89CFF]/40 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
      <div className="absolute top-40 left-20 w-1.5 h-1.5 bg-[#FF8FAB]/40 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 right-32 w-2 h-2 bg-[#E8D4F8]/50 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-32 w-1.5 h-1.5 bg-[#8EC5FC]/40 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '1.5s' }} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 py-8 lg:px-8 bg-[#FDFBFF]/80 backdrop-blur-sm relative z-10">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header with back link */}
          <div className="flex items-center justify-between mb-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </a>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-[#A89CFF]/10 border border-[#E8D4F8]/30 overflow-hidden">
            {/* Header Banner */}
            <div className="h-32 bg-gradient-to-r from-[#A89CFF] via-[#E8D4F8] to-[#FFC8DD] relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              {/* Decorative hearts */}
              <Heart className="absolute top-4 right-4 w-6 h-6 text-white/40" />
              <Heart className="absolute bottom-4 left-8 w-4 h-4 text-white/30" />
            </div>

            {/* Avatar */}
            <div className="relative px-8">
              <div className="absolute -top-12 left-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#A89CFF] to-[#E8D4F8] p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <User className="w-10 h-10 text-[#A89CFF]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 pb-8 px-8">
              {/* Name and Edit */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#1E1B4B] mb-1">
                    {user.full_name || 'Usuario de Bimoora'}
                  </h1>
                  <p className="text-[#6B7280] text-sm">
                    Miembro de Bimoora
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#E8D4F8] text-[#A89CFF] hover:bg-[#E8D4F8]/20"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-[#FDFBFF] rounded-2xl border border-[#E8D4F8]/30">
                  <div className="w-10 h-10 rounded-xl bg-[#A89CFF]/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#A89CFF]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-0.5">Correo electrónico</p>
                    <p className="text-[#1E1B4B] font-medium">{user.email}</p>
                  </div>
                </div>

                {/* Member since */}
                <div className="flex items-center gap-4 p-4 bg-[#FDFBFF] rounded-2xl border border-[#E8D4F8]/30">
                  <div className="w-10 h-10 rounded-xl bg-[#FFC8DD]/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#FF8FAB]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-0.5">Miembro desde</p>
                    <p className="text-[#1E1B4B] font-medium">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-8 border-t border-[#E8D4F8]/30" />

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#E8D4F8] text-[#6B7280] hover:bg-[#E8D4F8]/20 hover:text-[#1E1B4B]"
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Configuración de la cuenta
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full justify-start border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                </Button>
              </div>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div className="mt-8 p-6 bg-white/50 rounded-2xl border border-[#E8D4F8]/30 text-center">
            <Heart className="w-8 h-8 text-[#A89CFF] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#1E1B4B] mb-2">
              ¡Próximamente más funciones!
            </h3>
            <p className="text-[#6B7280] text-sm">
              Estamos trabajando en nuevas características para tu perfil. 
              Pronto podrás conectar con tu pareja y más.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfileContent() {
  return (
    <ToastProvider>
      <ProfileContentInner />
    </ToastProvider>
  )
}
