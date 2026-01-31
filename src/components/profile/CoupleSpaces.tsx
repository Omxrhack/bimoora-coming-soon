"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Plus, Copy, Check, Users, UserPlus, LogOut as LeaveIcon } from "lucide-react"
import { useToast } from "@/components/ui/CustomToast"
import type { CoupleSpaceWithMembers } from "@/services/coupleSpaceService"

export default function CoupleSpaces() {
    const { showToast } = useToast()
    const [spaces, setSpaces] = useState<CoupleSpaceWithMembers[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isJoining, setIsJoining] = useState(false)
    const [joinCode, setJoinCode] = useState("")
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    useEffect(() => {
        loadSpaces()
    }, [])

    const loadSpaces = async () => {
        setIsLoading(true)
        try {
            const { getUserCoupleSpaces } = await import("@/services/coupleSpaceService")
            const response = await getUserCoupleSpaces()

            if (response.success && response.spaces) {
                setSpaces(response.spaces)
            } else {
                showToast("error", "Error", response.error || "No se pudieron cargar los espacios")
            }
        } catch (error) {
            showToast("error", "Error", "Ocurrió un error inesperado")
        } finally {
            setIsLoading(false)
        }
    }



    const handleJoinSpace = async () => {
        const trimmedCode = joinCode.trim()
        if (!trimmedCode) {
            showToast("error", "Error", "Ingresa un código de invitación")
            return
        }
        if (trimmedCode.length < 8) return

        setIsJoining(true)
        console.log(" [CoupleSpaces] Attempting to join with code:", trimmedCode)

        try {
            const { joinCoupleSpace } = await import("@/services/coupleSpaceService")
            const response = await joinCoupleSpace(trimmedCode)
            console.log("[CoupleSpaces] Join response:", response)

            if (response.success && response.space) {
                console.log("[CoupleSpaces] Join Success! Space:", response.space)
                showToast("success", "¡Unido!", "Te has unido al espacio. Redirigiendo...")
                // Redirect to onboarding success screen
                window.location.href = `/onboarding/create-space?spaceId=${response.space.id}&joined=true`
            } else {
                console.error("[CoupleSpaces] Join Failed:", response.error)
                showToast("error", "Error", response.error || "No se pudo unir al espacio")
                setIsJoining(false)
            }
        } catch (error) {
            console.error("[CoupleSpaces] Exception:", error)
            showToast("error", "Error", "Ocurrió un error inesperado")
            setIsJoining(false)
        }
    }

    const handleCopyInviteCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code)
            setCopiedCode(code)
            showToast("success", "Copiado", "Código copiado al portapapeles")
            setTimeout(() => setCopiedCode(null), 2000)
        } catch (error) {
            showToast("error", "Error", "No se pudo copiar el código")
        }
    }

    const handleLeaveSpace = async (spaceId: string) => {
        if (!confirm("¿Estás seguro de que quieres abandonar este espacio?")) {
            return
        }

        try {
            const { leaveCoupleSpace } = await import("@/services/coupleSpaceService")
            const response = await leaveCoupleSpace(spaceId)

            if (response.success) {
                showToast("success", "Espacio abandonado", "Has salido del espacio")
                await loadSpaces()
            } else {
                showToast("error", "Error", response.error || "No se pudo abandonar el espacio")
            }
        } catch (error) {
            showToast("error", "Error", "Ocurrió un error inesperado")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFC8DD] to-[#FF8FAB] flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">Espacios de Pareja</h2>
                    <p className="text-sm text-[#6B7280]">Crea o únete a un espacio compartido</p>
                </div>
            </div>

            {/* Create Space */}
            <div className="bg-white rounded-2xl border border-[#E8D4F8]/50 p-6 space-y-4">
                <h3 className="font-semibold text-[#1E1B4B] flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#A89CFF]" />
                    Crear Nuevo Espacio
                </h3>
                <p className="text-sm text-[#6B7280]">
                    Inicia un espacio compartido, invita a tu pareja y comiencen a guardar recuerdos.
                </p>
                <Button
                    onClick={() => window.location.href = '/onboarding/create-space'}
                    className="w-full bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] hover:opacity-90 text-[#1E1B4B]"
                >
                    Comenzar Creación
                </Button>
            </div>

            {/* Join Space */}
            <div className="bg-white rounded-2xl border border-[#E8D4F8]/50 p-6 space-y-4">
                <h3 className="font-semibold text-[#1E1B4B] flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#A89CFF]" />
                    Unirse a un Espacio
                </h3>
                <div className="flex gap-3">
                    <Input
                        type="text"
                        placeholder="Código de invitación"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleJoinSpace()}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleJoinSpace}
                        disabled={isJoining || !joinCode.trim()}
                        className="bg-gradient-to-r from-[#FF8FAB] to-[#FFC8DD] hover:opacity-90"
                    >
                        {isJoining ? "Uniéndose..." : "Unirse"}
                    </Button>
                </div>
            </div>

            {/* Spaces List */}
            <div className="space-y-4">
                <h3 className="font-semibold text-[#1E1B4B] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#A89CFF]" />
                    Mis Espacios ({spaces.length})
                </h3>

                {spaces.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#E8D4F8]/50 p-12 text-center">
                        <Heart className="w-16 h-16 text-[#E8D4F8] mx-auto mb-4" />
                        <p className="text-[#6B7280] mb-2">Aún no tienes espacios</p>
                        <p className="text-sm text-[#9CA3AF]">Crea uno nuevo o únete con un código</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {spaces.map((space) => (
                            <div
                                key={space.id}
                                className="bg-white rounded-2xl border border-[#E8D4F8]/50 p-6 hover:border-[#A89CFF]/30 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-[#1E1B4B] text-lg mb-1">{space.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${space.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : space.status === "paused"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {space.status === "active" ? "Activo" : space.status === "paused" ? "Pausado" : "Cerrado"}
                                            </span>
                                            <span className="text-xs text-[#9CA3AF]">
                                                {space.members.length} de 2 miembros
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {space.status === "active" && space.members.length === 2 && (
                                            <a
                                                href={`/espacio/${space.id}`}
                                                className="px-4 py-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF1744] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                Entrar
                                            </a>
                                        )}
                                        <Button
                                            onClick={() => handleLeaveSpace(space.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <LeaveIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {space.partner ? (
                                    <div className="flex items-center gap-3 p-3 bg-[#FDFBFF] rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A89CFF] to-[#E8D4F8] flex items-center justify-center text-white font-semibold">
                                            {space.partner.username?.[0]?.toUpperCase() || "U"}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-[#1E1B4B] text-sm">
                                                {space.partner.username || "Usuario"}
                                            </p>
                                            <p className="text-xs text-[#6B7280]">ID: {space.partner.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-[#6B7280]">
                                            Esperando a tu pareja. Comparte este código:
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 px-4 py-2 bg-[#FDFBFF] border border-[#E8D4F8]/50 rounded-lg text-sm font-mono text-[#A89CFF]">
                                                {space.id}
                                            </code>
                                            <Button
                                                onClick={() => handleCopyInviteCode(space.id)}
                                                variant="outline"
                                                size="sm"
                                                className="border-[#E8D4F8]/50"
                                            >
                                                {copiedCode === space.id ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
