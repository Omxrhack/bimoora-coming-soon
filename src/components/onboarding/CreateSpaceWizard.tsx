"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Share2, Copy, Check, Heart, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/CustomToast"
import { createCoupleSpace, getSpaceMembers } from "@/services/coupleSpaceService"

interface CreateSpaceWizardProps {
    onBack: () => void
}

export default function CreateSpaceWizard({ onBack }: CreateSpaceWizardProps) {
    const { showToast } = useToast()

    // Steps: 'details' -> 'invite' -> 'success' | 'join'
    const [step, setStep] = useState<'details' | 'invite' | 'success' | 'join'>('details')

    // Data
    const [title, setTitle] = useState("")
    const [startDate, setStartDate] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [inviteToken, setInviteToken] = useState("")
    const [spaceId, setSpaceId] = useState("")
    const [copied, setCopied] = useState(false)
    const [joinCode, setJoinCode] = useState("")
    const [isJoining, setIsJoining] = useState(false)

    // Polling for invite step
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const joined = params.get('joined')
        const paramSpaceId = params.get('spaceId')
        const paramInviteCode = params.get('inviteCode')

        // Case 1: Already joined (post-redirection)
        if (joined === 'true' && paramSpaceId) {
            setSpaceId(paramSpaceId)
            setStep('success')
            return
        }

        // Case 2: Arrival via Invite Link
        if (paramInviteCode) {
            setJoinCode(paramInviteCode)
            setStep('join')
            return
        }

        // Case 3: Creator logic: polling
        let interval: NodeJS.Timeout

        if (step === 'invite' && spaceId) {
            // Immediate check
            checkMembers()
            interval = setInterval(checkMembers, 3000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [step, spaceId])

    const checkMembers = async () => {
        if (!spaceId) return

        // Using the secure RPC
        console.log("Polling for members...")
        const result = await getSpaceMembers(spaceId)
        console.log("Polling result:", result)

        // If we have 2 or more members, it means partner joined
        if (result.success && result.members && result.members.length >= 2) {
            console.log("Partner joined! Switching to success step.")
            setStep('success')
        }
    }

    const handleCreate = async () => {
        if (!title.trim()) {
            showToast("error", "Error", "Por favor ingresa un nombre para el espacio")
            return
        }

        setIsCreating(true)
        try {
            const response = await createCoupleSpace(title)

            if (response.success && response.space && response.inviteToken) {
                setSpaceId(response.space.id)
                setInviteToken(response.inviteToken)
                setStep('invite')

                // TODO: Save startDate to space metadata or settings if we add that field later
                // For now just creating the space is enough
            } else {
                showToast("error", "Error", response.error || "No se pudo crear el espacio")
            }
        } catch (error) {
            showToast("error", "Error", "Ocurrió un error inesperado")
        } finally {
            setIsCreating(false)
        }
    }

    const handleJoin = async () => {
        if (!joinCode.trim() || joinCode.length < 8) {
            showToast("error", "Error", "Código inválido")
            return
        }

        setIsJoining(true)
        console.log("[Wizard] Attempting to join with code:", joinCode)

        try {
            // Dynamic import to avoid SSR issues if any
            const { joinCoupleSpace } = await import("@/services/coupleSpaceService")
            const response = await joinCoupleSpace(joinCode)
            console.log("[Wizard] Join response:", response)

            if (response.success && response.space) {
                console.log("[Wizard] Join Success!")
                setSpaceId(response.space.id)
                setStep('success')
            } else {
                console.error("[Wizard] Join Failed:", response.error)
                showToast("error", "Error", response.error || "No se pudo unir al espacio")
                setIsJoining(false)
            }
        } catch (err) {
            console.error("🔥 [Wizard] Exception:", err)
            showToast("error", "Error", "Error inesperado al unirse")
            setIsJoining(false)
        }
    }

    const getShareUrl = () => {
        return `${window.location.origin}/onboarding/create-space?inviteCode=${inviteToken}`
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getShareUrl())
            setCopied(true)
            showToast("success", "Enlace Copiado", "Enlace de invitación copiado al portapapeles")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            showToast("error", "Error", "No se pudo copiar")
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Únete a mi espacio en Bimoora',
                    text: `¡Hola! He creado un espacio para nosotros en Bimoora. Únete aquí:`,
                    url: getShareUrl()
                })
            } catch (err) {
                // Ignore abort errors
            }
        } else {
            handleCopy()
        }
    }

    const handleGoToSpace = () => {
        window.location.href = `/espacio/${spaceId}`
    }

    // --- RENDERS ---

    if (step === 'join') {
        return (
            <div className="max-w-md mx-auto px-6 py-12 animate-fade-in-up">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A89CFF] to-[#E8D4F8] flex items-center justify-center mb-6 shadow-lg shadow-[#A89CFF]/20 mx-auto">
                        <Heart className="w-8 h-8 text-white" fill="currentColor" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#1E1B4B] mb-2">Unirse a un Espacio</h1>
                    <p className="text-[#6B7280]">
                        Has recibido una invitación para unirte.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#1E1B4B]">Código de Invitación</label>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 font-mono text-center text-lg tracking-widest text-[#1E1B4B]">
                            {joinCode}
                        </div>
                    </div>

                    <Button
                        onClick={handleJoin}
                        disabled={isJoining}
                        className="w-full h-14 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] hover:opacity-95 text-[#1E1B4B] font-semibold text-lg rounded-xl shadow-lg shadow-[#A89CFF]/20"
                    >
                        {isJoining ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-[#1E1B4B]/30 border-t-[#1E1B4B] rounded-full animate-spin" />
                                Uniendo...
                            </div>
                        ) : (
                            "Unirse Ahora"
                        )}
                    </Button>
                </div>
            </div>
        )
    }

    if (step === 'details') {
        return (
            <div className="max-w-md mx-auto px-6 py-12 animate-fade-in-up">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center text-[#6B7280] hover:text-[#1E1B4B] transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver
                    </button>

                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFC8DD] to-[#FF8FAB] flex items-center justify-center mb-6 shadow-lg shadow-[#FF8FAB]/20">
                        <Heart className="w-8 h-8 text-white" fill="currentColor" />
                    </div>

                    <h1 className="text-3xl font-bold text-[#1E1B4B] mb-3">
                        Crear Espacio
                    </h1>
                    <p className="text-[#6B7280]">
                        Configura tu espacio personal. Una vez creado, podrás invitar a tu pareja.
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#1E1B4B]">Nombre del Espacio</label>
                        <Input
                            placeholder="Ej: Nuestro Nido "
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-white border-[#E8D4F8] focus:border-[#A89CFF] h-12 text-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#1E1B4B]">Fecha de Inicio de Relación</label>
                        <div className="relative">
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-white border-[#E8D4F8] focus:border-[#A89CFF] h-12 pl-10"
                            />
                            <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-[#9CA3AF] pointer-events-none" />
                        </div>
                        <p className="text-xs text-[#9CA3AF]">
                            Usaremos esto para el contador de días juntos.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handleCreate}
                            disabled={isCreating || !title.trim() || !startDate}
                            className="w-full h-14 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] hover:opacity-95 text-[#1E1B4B] font-semibold text-lg rounded-xl shadow-lg shadow-[#A89CFF]/20"
                        >
                            {isCreating ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-[#1E1B4B]/30 border-t-[#1E1B4B] rounded-full animate-spin" />
                                    Creando...
                                </div>
                            ) : (
                                "Continuar"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (step === 'invite') {
        return (
            <div className="max-w-md mx-auto px-6 py-12 animate-fade-in text-center">
                <div className="w-20 h-20 rounded-full bg-[#FDFBFF] border-2 border-[#E8D4F8] flex items-center justify-center mx-auto mb-6 relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A89CFF] to-[#E8D4F8] flex items-center justify-center animate-pulse-slow">
                        <Share2 className="w-8 h-8 text-white" />
                    </div>
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-full border border-[#A89CFF]/30 animate-ping" style={{ animationDuration: '3s' }}></div>
                </div>

                <h2 className="text-2xl font-bold text-[#1E1B4B] mb-2">
                    ¡Espacio Creado!
                </h2>
                <p className="text-[#6B7280] mb-8">
                    Comparte este enlace con tu pareja para que se una. <br />
                    <span className="text-sm text-[#A89CFF] animate-pulse">Esperando a que se una...</span>
                </p>

                {/* Code Display */}
                <div className="bg-white rounded-2xl border-2 border-[#E8D4F8] border-dashed p-6 mb-8 relative group overflow-hidden">
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-2 font-semibold">
                        CÓDIGO DE INVITACIÓN
                    </p>
                    <div className="text-3xl font-mono font-bold text-[#1E1B4B] tracking-widest break-all">
                        {inviteToken}
                    </div>

                    <div className="flex justify-center gap-2 mt-4">
                        <Button
                            onClick={handleCopy}
                            size="sm"
                            className="rounded-full shadow-lg bg-white hover:bg-gray-50 text-[#1E1B4B] border border-gray-100"
                        >
                            {copied ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                            {copied ? "Copiado" : "Copiar Link"}
                        </Button>

                        <Button
                            onClick={handleShare}
                            size="sm"
                            className="rounded-full shadow-lg bg-[#1E1B4B] hover:bg-[#1E1B4B]/90 text-white"
                        >
                            <Share2 className="w-4 h-4 mr-1" />
                            Compartir
                        </Button>
                    </div>
                </div>

                <div className="text-sm text-[#9CA3AF]">
                    No cierres esta ventana hasta que tu pareja se una.
                </div>
            </div>
        )
    }

    if (step === 'success') {
        return (
            <div className="max-w-md mx-auto px-6 py-12 animate-fade-in-up text-center">
                <div className="relative mb-8 mx-auto w-32 h-32">
                    {/* Confetti / Celebration effect css could go here */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF4D6D] to-[#FF1744] flex items-center justify-center animate-bounce">
                            <Heart className="w-12 h-12 text-white fill-current" />
                        </div>
                    </div>

                    {/* Decor */}
                    <div className="absolute top-0 right-0 text-2xl animate-spin" style={{ animationDuration: '3s' }}>✨</div>
                    <div className="absolute bottom-0 left-0 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎉</div>
                </div>

                <h2 className="text-3xl font-bold text-[#1E1B4B] mb-4">
                    ¡Conectados!
                </h2>
                <p className="text-[#6B7280] mb-8 text-lg">
                    Tu pareja se ha unido al espacio correctamente. <br />
                    Ahora pueden compartir momentos juntos.
                </p>

                <Button
                    onClick={handleGoToSpace}
                    className="w-full h-14 bg-gradient-to-r from-[#FF4D6D] to-[#FF1744] hover:opacity-95 text-white font-semibold text-lg rounded-xl shadow-lg shadow-[#FF4D6D]/30"
                >
                    Ir a Nuestro Espacio
                </Button>
            </div>
        )
    }

    return null
}
