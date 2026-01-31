"use client"

import React, { useEffect, useState } from "react"
import { GlassCard } from "@/components/ui/GlassCard"

interface FlameCounterProps {
    startDate: string // ISO date string
}

export default function FlameCounter({ startDate }: FlameCounterProps) {
    const [timeElapsed, setTimeElapsed] = useState({ years: 0, months: 0, days: 0, totalDays: 0 })

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(startDate)
            const now = new Date()
            const diffTime = Math.abs(now.getTime() - start.getTime());
            const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let years = now.getFullYear() - start.getFullYear()
            let months = now.getMonth() - start.getMonth()
            let days = now.getDate() - start.getDate()

            if (days < 0) {
                months--
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
                days += prevMonth.getDate()
            }

            if (months < 0) {
                years--
                months += 12
            }

            setTimeElapsed({ years, months, days, totalDays })
        }

        calculateTime()
        const interval = setInterval(calculateTime, 1000 * 60 * 60) // Update every hour

        return () => clearInterval(interval)
    }, [startDate])

    return (
        <GlassCard className="p-6 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl group-hover:bg-pink-300/30 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-xs font-bold tracking-widest text-[#FF4D6D] uppercase mb-2">Días Juntos</span>

                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-[#1E1B4B] tracking-tight">
                        {timeElapsed.totalDays}
                    </span>
                    <span className="text-lg text-slate-400 font-medium">días</span>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4" />

                <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-[#1E1B4B] text-lg">{timeElapsed.years}</span>
                        <span className="text-[10px] uppercase tracking-wide opacity-60">Años</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-[#1E1B4B] text-lg">{timeElapsed.months}</span>
                        <span className="text-[10px] uppercase tracking-wide opacity-60">Meses</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-[#1E1B4B] text-lg">{timeElapsed.days}</span>
                        <span className="text-[10px] uppercase tracking-wide opacity-60">Días</span>
                    </div>
                </div>
            </div>
        </GlassCard>
    )
}
