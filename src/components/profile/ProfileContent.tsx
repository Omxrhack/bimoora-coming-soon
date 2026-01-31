"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Mail, Calendar, LogOut, Heart, Settings, Edit2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ToastProvider, useToast } from "@/components/ui/CustomToast"
import CoupleSpaces from "@/components/profile/CoupleSpaces"

function ProfileContentInner() {
  const { user, isLoading, logout } = useAuth()
  const { showToast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)

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
      // No mostrar toast, el estado isLoggingOut ya muestra el loading
      // Redirigir directamente
      window.location.href = '/'
    } else {
      showToast('error', 'Error', response.error || 'No se pudo cerrar sesión')
      setIsLoggingOut(false)
    }
  }

  const handleEditName = () => {
    setEditedName(user?.full_name || '')
    setIsEditingName(true)
  }

  const handleCancelEdit = () => {
    setIsEditingName(false)
    setEditedName('')
  }

  const handleSaveName = async () => {
    const trimmedName = editedName.trim()

    if (!trimmedName) {
      showToast('error', 'Error', 'El nombre no puede estar vacío')
      return
    }

    if (trimmedName.length < 2) {
      showToast('error', 'Error', 'El nombre debe tener al menos 2 caracteres')
      return
    }

    if (trimmedName.length > 100) {
      showToast('error', 'Error', 'El nombre es demasiado largo')
      return
    }

    setIsSavingName(true)

    try {
      const { updateUserProfile } = await import('@/services/authService')
      const response = await updateUserProfile({ full_name: trimmedName })

      if (response.success) {
        // Mantener el loading activo y recargar directamente
        // No quitamos setIsSavingName(false) para que siga mostrando el loading
        await new Promise(resolve => setTimeout(resolve, 500))
        window.location.reload()
      } else {
        showToast('error', 'Error', response.error || 'No se pudo actualizar el nombre')
        setIsSavingName(false)
      }
    } catch (error) {
      showToast('error', 'Error', 'Ocurrió un error inesperado')
      setIsSavingName(false)
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

  // Mostrar loading mientras se guarda el perfil
  if (isSavingName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBFF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#1E1B4B] font-semibold text-lg">Actualizando perfil...</p>
          <p className="text-[#6B7280] text-sm">Un momento por favor</p>
        </div>
      </div>
    )
  }

  // Mostrar loading mientras se cierra sesión
  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBFF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#1E1B4B] font-semibold text-lg">Cerrando sesión...</p>
          <p className="text-[#6B7280] text-sm">Hasta pronto</p>
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
      <div className="flex-1 flex flex-col px-6 py-8 lg:px-8 bg-[#FDFBFF]/80 backdrop-blur-sm relative z-10 transition-colors duration-300">
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
          <div className="bg-white rounded-3xl shadow-xl shadow-[#A89CFF]/10 border border-[#E8D4F8]/30 overflow-hidden transition-colors duration-300">
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
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center transition-colors">
                    <User className="w-10 h-10 text-[#A89CFF]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 pb-8 px-8">
              {/* Name and Edit */}
              <div className="mb-6">
                {!isEditingName ? (
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-[#1E1B4B] mb-1 transition-colors">
                        {user.full_name || 'Usuario de Bimoora'}
                      </h1>
                      <p className="text-[#6B7280] text-sm transition-colors">
                        Miembro de Bimoora
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditName}
                      className="border-[#E8D4F8] text-[#A89CFF] hover:bg-[#E8D4F8]/20"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Tu nombre completo"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#E8D4F8] bg-white text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveName}
                        disabled={isSavingName}
                        className="flex-1 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white hover:opacity-90"
                      >
                        {isSavingName ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isSavingName}
                        className="flex-1 border-[#E8D4F8] text-[#6B7280] hover:bg-[#E8D4F8]/20"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-[#FDFBFF] rounded-2xl border border-[#E8D4F8]/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#A89CFF]/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#A89CFF]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-0.5">Correo electrónico</p>
                    <p className="text-[#1E1B4B] font-medium break-all">{user.email}</p>
                  </div>
                </div>

                {/* Member since */}
                <div className="flex items-center gap-4 p-4 bg-[#FDFBFF] rounded-2xl border border-[#E8D4F8]/30 transition-colors">
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

          {/* Couple Spaces */}
          <div className="mt-8">
            <CoupleSpaces />
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
