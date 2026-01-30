"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Heart } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ToastProvider, useToast } from "@/components/ui/CustomToast"

function AccederFormContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { login, loginWithOAuth, isSubmitting } = useAuth()
  const { showToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const response = await login({
      email: formData.email,
      password: formData.password
    })

    if (response.success) {
      showToast('success', '¡Bienvenido!', response.message)
      // Redirigir al perfil
      setTimeout(() => {
        window.location.href = '/perfil'
      }, 1500)
    } else {
      showToast('error', 'Error al acceder', response.error || response.message)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    const response = await loginWithOAuth(provider)
    if (!response.success) {
      showToast('error', `Error con ${provider}`, response.error || response.message)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background gradient orbs - same as index */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }} />
      
      {/* Decorative particles */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-[#A89CFF]/40 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
      <div className="absolute top-40 left-20 w-1.5 h-1.5 bg-[#FF8FAB]/40 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 right-32 w-2 h-2 bg-[#E8D4F8]/50 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-32 w-1.5 h-1.5 bg-[#8EC5FC]/40 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '1.5s' }} />

      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-[#FDFBFF]/80 backdrop-blur-sm relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Back link */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </a>

          {/* Logo */}
         

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1E1B4B] mb-2">
              Bienvenido de nuevo
            </h1>
            <p className="text-[#6B7280]">
              Ingresa tus credenciales para acceder a tu espacio.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1E1B4B]">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A89CFF]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-white border-[#E8D4F8] focus:border-[#A89CFF] focus:ring-[#A89CFF]/20 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#1E1B4B]">
                  Contraseña
                </Label>
                <a
                  href="/auth/recuperar"
                  className="text-sm text-[#A89CFF] hover:text-[#A89CFF]/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A89CFF]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 h-12 bg-white border-[#E8D4F8] focus:border-[#A89CFF] focus:ring-[#A89CFF]/20 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#A89CFF] transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox 
                id="remember" 
                className="border-[#E8D4F8] data-[state=checked]:bg-[#A89CFF] data-[state=checked]:border-[#A89CFF]"
              />
              <Label htmlFor="remember" className="text-sm text-[#6B7280] cursor-pointer font-normal">
                Mantener sesión iniciada
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] hover:opacity-90 text-white font-medium rounded-xl shadow-lg shadow-[#A89CFF]/25 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Accediendo...
                </span>
              ) : (
                "Acceder"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E8D4F8]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FDFBFF] px-3 text-[#6B7280]">
                o continúa con
              </span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={isSubmitting}
              className="h-12 flex items-center justify-center gap-2 rounded-xl border border-[#E8D4F8] bg-white hover:bg-[#E8D4F8]/10 hover:border-[#A89CFF]/50 transition-all text-[#1E1B4B] font-medium disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('apple')}
              disabled={isSubmitting}
              className="h-12 flex items-center justify-center gap-2 rounded-xl border border-[#E8D4F8] bg-white hover:bg-[#E8D4F8]/10 hover:border-[#A89CFF]/50 transition-all text-[#1E1B4B] font-medium disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Apple
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-[#6B7280]">
            ¿No tienes una cuenta?{" "}
            <a href="/auth/crear-cuenta" className="text-[#A89CFF] hover:text-[#A89CFF]/80 font-medium transition-colors">
              Crear cuenta
            </a>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8D4F8] via-[#A89CFF]/5 to-[#FDFBFF]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#A89CFF]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#FFC8DD]/20 rounded-full blur-3xl" />
        
        <div className="relative flex items-center justify-center w-full p-12">
          <div className="text-center max-w-md">
            {/* Decorative mockup */}
            <div className="relative w-64 h-[420px] mx-auto mb-8">
              <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl border border-[#E8D4F8] overflow-hidden">
                <div className="absolute inset-2 bg-gradient-to-b from-[#E8D4F8]/30 to-[#FDFBFF] rounded-[2rem] overflow-hidden">
                  <div className="p-5 pt-10">
                    <div className="w-10 h-10 rounded-xl bg-[#A89CFF]/20 mb-3 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-[#A89CFF]" />
                    </div>
                    <div className="h-3 w-24 bg-[#A89CFF]/20 rounded-full mb-2" />
                    <div className="h-2 w-20 bg-[#E8D4F8] rounded-full mb-6" />
                    
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-3 border border-[#E8D4F8]/50">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A89CFF]/20 to-[#E8D4F8]/30" />
                            <div className="flex-1">
                              <div className="h-2 w-16 bg-[#E8D4F8] rounded-full mb-1" />
                              <div className="h-1.5 w-24 bg-[#E8D4F8]/50 rounded-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">
              Tu espacio te espera
            </h2>
            <p className="text-[#6B7280]">
              Accede para continuar construyendo recuerdos juntos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente exportado con ToastProvider
export default function AccederForm() {
  return (
    <ToastProvider>
      <AccederFormContent />
    </ToastProvider>
  )
}
