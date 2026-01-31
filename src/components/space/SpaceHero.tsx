"use client"
import React from 'react'
import { ArrowLeft, Bell, Heart } from 'lucide-react'

interface SpaceHeroProps {
    title: string
}

export default function SpaceHero({ title }: SpaceHeroProps) {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches'

    // Fallback title if empty
    const displayTitle = title || "Nuestro Espacio"

    return (
        <header className="px-6 pt-10 pb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <a href="/perfil" className="w-10 h-10 rounded-2xl bg-white/50 hover:bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all border border-white/60 text-slate-600">
                    <ArrowLeft className="w-5 h-5" />
                </a>
                <div className="flex flex-col">
                    <span suppressHydrationWarning className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">{greeting}</span>
                    <h1 className="text-xl font-bold text-[#1E1B4B] leading-tight line-clamp-1">
                        {displayTitle}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF4D6D] to-[#FF1744] shadow-lg shadow-pink-500/20 flex items-center justify-center animate-pulse">
                    <Heart className="w-5 h-5 text-white fill-white" />
                </div>
            </div>
        </header>
    )
}
