"use client"

import React from "react"
import { Heart, Lightbulb, Plus, Calendar, User } from "lucide-react"

interface BottomNavProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const tabs = [
        { id: "memories", label: "Recuerdos", icon: Heart },
        { id: "ideas", label: "Ideas", icon: Lightbulb },
        { id: "add", label: "", icon: Plus, special: true },
        { id: "calendar", label: "Fechas", icon: Calendar },
        { id: "profile", label: "Perfil", icon: User },
    ]

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50">
            <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl px-2 py-3 flex items-center justify-around">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    if (tab.special) {
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className="relative -top-6 group"
                            >
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1E1B4B] to-[#4F46E5] flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-200 border-4 border-[#FDFBFF]">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </button>
                        )
                    }

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center justify-center gap-1 w-14 transition-all duration-300 relative ${isActive ? "text-[#4F46E5]" : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            <span className={`absolute -top-8 w-1 h-1 rounded-full bg-[#4F46E5] transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />

                            <Icon className={`w-6 h-6 ${isActive ? "scale-110 drop-shadow-sm" : ""} transition-transform`} />
                            {/* <span className={`text-[10px] font-medium transition-all ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 hidden'}`}>
                                {tab.label}
                            </span> */}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
