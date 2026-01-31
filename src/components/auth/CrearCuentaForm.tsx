"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Heart } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ToastProvider, useToast } from "@/components/ui/CustomToast"

function CrearCuentaFormContent() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const { register, loginWithOAuth, isSubmitting } = useAuth()
  const { showToast } = useToast()

  // Guard para evitar doble submit (StrictMode, doble click)
  const isSubmittingRef = useRef(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Guard: evitar doble submit
    if (isSubmittingRef.current || isSubmitting) return

    if (!acceptTerms) {
      showToast('warning', 'Términos requeridos', 'Debes aceptar los términos y condiciones')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('error', 'Las contraseñas no coinciden', 'Por favor, verifica que ambas contraseñas sean iguales')
      return
    }

    if (formData.password.length < 8) {
      showToast('error', 'Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres')
      return
    }

    // Activar guard
    isSubmittingRef.current = true
    const normalizedEmail = formData.email.trim().toLowerCase()

    console.log('[CrearCuenta] Registering user:', normalizedEmail)

    const response = await register({
      email: normalizedEmail,
      password: formData.password,
      full_name: formData.name || undefined
    })

    // Liberar guard
    isSubmittingRef.current = false

    if (response.success) {
      // ====================================================================
      // IMPORTANTE: NO llamamos a signInWithOtp aquí.
      // 
      // Supabase signUp ya envía automáticamente un email de confirmación
      // cuando "Confirm email" está habilitado en el dashboard.
      // Ese email contiene el token de tipo 'signup'.
      //
      // Si llamamos a signInWithOtp después, causamos:
      // 1. Un segundo email (confuso para el usuario)
      // 2. Rate limit (429) si se hacen muy seguido
      // 3. El segundo token invalida el primero
      //
      // Solución: Solo redirigir a la página de verificación.
      // El usuario usará el código del email de signUp.
      // ====================================================================

      console.log('[CrearCuenta] Registration successful, redirecting to verify')
      // No mostrar toast, el estado isSubmitting ya muestra el loading
      // Redirigir directamente
      // type=signup porque el email viene del flujo de signUp
      window.location.href = `/auth/verificar-codigo?email=${encodeURIComponent(normalizedEmail)}&type=signup`
    } else {
      showToast('error', 'Error al registrar', response.error || response.message)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    const response = await loginWithOAuth(provider)
    if (!response.success) {
      showToast('error', `Error con ${provider}`, response.error || response.message)
    }
  }

  // Mostrar pantalla de carga completa cuando está enviando
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBFF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#1E1B4B] font-semibold text-lg">Creando tu cuenta...</p>
          <p className="text-[#6B7280] text-sm">Un momento por favor</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden transition-colors duration-300">
      {/* Background gradient orbs - same as index */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '2s' }} />

      {/* Decorative particles */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-[#A89CFF]/40 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
      <div className="absolute top-40 left-20 w-1.5 h-1.5 bg-[#FF8FAB]/40 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
      <div className="absolute bottom-40 right-32 w-2 h-2 bg-[#E8D4F8]/50 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-32 w-1.5 h-1.5 bg-[#8EC5FC]/40 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '1.5s' }} />

      {/* Left Panel - Visual */}


      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-[#FDFBFF] transition-colors duration-300">
        <div className="w-full max-w-md mx-auto">
          {/* Back link */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1E1B4B] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </a>



          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1E1B4B] mb-2">
              Crea tu cuenta
            </h1>
            <p className="text-[#6B7280]">
              Un espacio íntimo para guardar lo que importa.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#1E1B4B]">
                Nombre <span className="text-[#6B7280] text-sm">(opcional)</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-white border-[#E8D4F8] text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:border-[#A89CFF] focus:ring-[#A89CFF]/20 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1E1B4B]">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-white border-[#E8D4F8] text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:border-[#A89CFF] focus:ring-[#A89CFF]/20 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1E1B4B]">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 h-12 bg-white border-[#E8D4F8] text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:border-[#A89CFF] focus:ring-[#A89CFF]/20 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1E1B4B] transition-colors"
                  aria-label={showPassword ? "Mostrar contraseña" : "Ocultar contraseña"}
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (

                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#1E1B4B]">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  required
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10 h-12 bg-white border-[#E8D4F8] text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:border-[#A89CFF] focus:ring-[#A89CFF]/20 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1E1B4B] transition-colors"
                  aria-label={showConfirmPassword ? "Mostrar contraseña" : "Ocultar contraseña"}
                >
                  {showConfirmPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />

                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-0.5 border-[#E8D4F8] data-[state=checked]:bg-[#A89CFF] data-[state=checked]:border-[#A89CFF]"
              />
              <Label htmlFor="terms" className="text-sm text-[#6B7280] cursor-pointer leading-relaxed font-normal">
                Acepto los{" "}
                <a href="/terms" className="text-[#A89CFF] hover:text-[#A89CFF]/80 underline underline-offset-2">
                  Términos y condiciones
                </a>{" "}
                y la{" "}
                <a href="/privacy" className="text-[#A89CFF] hover:text-[#A89CFF]/80 underline underline-offset-2">
                  Política de privacidad
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !acceptTerms}
              className="w-full h-12 mt-2 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] hover:opacity-90 text-white font-medium rounded-xl shadow-lg shadow-[#A89CFF]/25 transition-all duration-300 disabled:opacity-50"
              size="lg"
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E8D4F8]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FDFBFF] px-3 text-[#6B7280]">
                o regístrate con
              </span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 border-[#E8D4F8] bg-white hover:bg-[#E8D4F8]/10 text-[#1E1B4B]"
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="h-12 border-[#E8D4F8] bg-white hover:bg-[#E8D4F8]/10 text-[#1E1B4B]"
              type="button"
              onClick={() => handleOAuthLogin('apple')}
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Apple
            </Button>
          </div>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-[#6B7280]">
            ¿Ya tienes una cuenta?{" "}
            <a href="/auth/acceder" className="text-[#A89CFF] hover:text-[#A89CFF]/80 font-medium">
              Acceder
            </a>
          </p>
        </div>
      </div>



      <div className="hidden lg:flex flex-1 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8D4F8] via-[#A89CFF]/5 to-[#FDFBFF]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#A89CFF]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#FFC8DD]/20 rounded-full blur-3xl" />

        <div className="relative flex items-center justify-center w-full p-12">
          <div className="text-center max-w-md">
            {/* Decorative illustration */}
            <div className="relative w-72 h-[440px] mx-auto mb-8">
              {/* Phone mockup */}
              <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl shadow-[#A89CFF]/20 border border-[#E8D4F8] overflow-hidden transition-colors">
                <div className="absolute inset-2 bg-gradient-to-b from-[#E8D4F8]/30 to-[#FDFBFF] rounded-[2rem] overflow-hidden">
                  <div className="p-5 pt-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#A89CFF]/20 mx-auto mb-4 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-[#A89CFF]" />
                    </div>
                    <div className="h-4 w-32 bg-[#A89CFF]/20 rounded-full mx-auto mb-2" />
                    <div className="h-2 w-24 bg-[#E8D4F8] rounded-full mx-auto mb-8" />

                    {/* Invite code mockup */}
                    <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-[#E8D4F8]/50 mb-4">
                      <div className="text-xs text-[#6B7280] mb-2">Código de invitación</div>
                      <div className="flex gap-2 justify-center">
                        {['B', 'I', 'M', 'O'].map((letter, i) => (
                          <div key={i} className="w-10 h-10 rounded-lg bg-[#E8D4F8]/50 flex items-center justify-center text-[#1E1B4B] font-semibold">
                            {letter}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Connection visual */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <div className="w-12 h-12 rounded-full bg-[#A89CFF]/20" />
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-[#A89CFF]/20 via-[#A89CFF] to-[#A89CFF]/20 rounded-full" />
                      <div className="w-12 h-12 rounded-full bg-[#FFC8DD]/30" />
                    </div>
                    <div className="text-xs text-[#6B7280] mt-3">Conecta con tu pareja</div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">
              Comienza su historia
            </h2>
            <p className="text-[#6B7280]">
              Crea tu cuenta y después invita a tu pareja para comenzar a guardar recuerdos juntos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente exportado con ToastProvider
export default function CrearCuentaForm() {
  return (
    <ToastProvider>
      <CrearCuentaFormContent />
    </ToastProvider>
  )
}
