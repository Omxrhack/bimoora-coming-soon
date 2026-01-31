"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, Clock, Calendar as CalendarIcon, Camera } from "lucide-react"
import FlameCounter from "./FlameCounter"
import EventsHeader from "./EventsHeader"
import BottomNav from "./BottomNav"
import SpaceLayout from "./SpaceLayout"
import SpaceHero from "./SpaceHero"
import { GlassCard } from "@/components/ui/GlassCard"
import { useToast, ToastProvider } from "@/components/ui/CustomToast"

function SpaceContentInner() {
    const { showToast } = useToast()
    const [activeTab, setActiveTab] = useState("memories")
    const [spaceData, setSpaceData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Mock data - replace with actual API call
    const mockEvents = [
        {
            id: "1",
            title: "Primer encuentro",
            date: "2018-03-12",
            icon: "heart",
            partner: "Invitado"
        },
        // ... (can expand mock data if needed)
    ]

    useEffect(() => {
        // TODO: Load space data from API
        // For now, using mock data and extracting ID from URL if possible
        const pathParts = window.location.pathname.split('/')
        const urlId = pathParts[pathParts.length - 1]

        setTimeout(() => {
            setSpaceData({
                id: urlId || "demo",
                title: "Nuestro Espacio",
                startDate: "2023-01-01", // Default date for demo
                events: mockEvents
            })
            setIsLoading(false)
        }, 800)
    }, [])

    const handleEventClick = (event: any) => {
        showToast("info", event.title, `Fecha: ${event.date}`)
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        if (tab === "add") {
            showToast("info", "Próximamente", "Función de agregar contenido")
            return
        }
    }

    if (isLoading) {
        return (
            <SpaceLayout>
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium animate-pulse">Cargando...</p>
                </div>
            </SpaceLayout>
        )
    }

    return (
        <SpaceLayout>
            <SpaceHero title={spaceData?.title || "Espacio"} />

            {/* Scrollable Content Area */}
            <div className="flex-1 px-4 pt-2 pb-28 overflow-y-auto no-scrollbar">

                {/* Dashboard View (Memories Tab) */}
                {activeTab === "memories" && (
                    <div className="space-y-6 animate-fade-in-up">
                        {/* 1. Main Stats Card */}
                        <FlameCounter startDate={spaceData?.startDate || new Date().toISOString()} />

                        {/* 2. Masonry Grid Placeholder */}
                        <div className="grid grid-cols-2 gap-4">
                            <GlassCard className="aspect-square flex flex-col items-center justify-center p-4 hover:scale-[1.02] transition-transform cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                                    <Camera className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="font-semibold text-slate-700">Galería</span>
                                <span className="text-xs text-slate-400 mt-1">0 Fotos</span>
                            </GlassCard>

                            <GlassCard className="aspect-square flex flex-col items-center justify-center p-4 hover:scale-[1.02] transition-transform cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-3 group-hover:bg-pink-200 transition-colors">
                                    <Clock className="w-6 h-6 text-pink-600" />
                                </div>
                                <span className="font-semibold text-slate-700">Historia</span>
                                <span className="text-xs text-slate-400 mt-1">Ver Timeline</span>
                            </GlassCard>
                        </div>

                        {/* 3. Upcoming Events Preview */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="font-bold text-[#1E1B4B]">Próximos Eventos</h3>
                                <button className="text-xs text-indigo-600 font-medium">Ver todos</button>
                            </div>
                            <EventsHeader
                                events={spaceData?.events || []}
                                onEventClick={handleEventClick}
                            />
                        </div>
                    </div>
                )}

                {/* Ideas Tab */}
                {activeTab === "ideas" && (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6 animate-fade-in">
                        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <span className="text-4xl">💡</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1E1B4B] mb-2">Ideas para Citas</h3>
                        <p className="text-slate-500">
                            Descubre actividades emocionantes para hacer juntos. <br />
                            <span className="text-indigo-500 font-medium mt-2 block">¡Próximamente!</span>
                        </p>
                    </div>
                )}

                {/* Calendar Tab */}
                {activeTab === "calendar" && (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6 animate-fade-in">
                        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                            <CalendarIcon className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1E1B4B] mb-2">Calendario</h3>
                        <p className="text-slate-500">Planifica sus momentos especiales.</p>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center px-6 animate-fade-in">
                        <GlassCard className="p-8 w-full">
                            <h3 className="text-xl font-bold text-[#1E1B4B] mb-4">Configuración</h3>
                            <p className="text-slate-500 text-sm">Ajustes del espacio.</p>
                        </GlassCard>
                    </div>
                )}

            </div>

            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </SpaceLayout>
    )
}

export default function SpaceContent() {
    return (
        <ToastProvider>
            <SpaceContentInner />
        </ToastProvider>
    )
}
