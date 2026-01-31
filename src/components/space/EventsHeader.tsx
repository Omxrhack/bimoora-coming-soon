"use client"

import React from "react"
import { Heart, Gift, Calendar, Sparkles, Camera, Music } from "lucide-react"

interface Event {
    id: string
    title: string
    date: string
    icon: string
    partner?: string
}

interface EventsHeaderProps {
    events: Event[]
    onEventClick?: (event: Event) => void
}

const iconMap: Record<string, React.ReactNode> = {
    heart: <Heart className="w-5 h-5" />,
    gift: <Gift className="w-5 h-5" />,
    calendar: <Calendar className="w-5 h-5" />,
    sparkles: <Sparkles className="w-5 h-5" />,
    camera: <Camera className="w-5 h-5" />,
    music: <Music className="w-5 h-5" />,
}

export default function EventsHeader({ events, onEventClick }: EventsHeaderProps) {
    const topEvents = events.slice(0, 6)

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6">
                <h2 className="text-2xl font-bold text-[#1E1B4B]">Eventos</h2>
            </div>

            {/* Event Icons */}
            <div className="flex items-center gap-3 px-6 overflow-x-auto pb-2 scrollbar-hide">
                {topEvents.map((event, index) => (
                    <button
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${index === 0
                            ? "bg-gradient-to-br from-[#FF4D6D] to-[#FF1744] text-white shadow-lg shadow-[#FF4D6D]/30 scale-110"
                            : "bg-white border-2 border-[#E8D4F8] text-[#6B7280] hover:border-[#A89CFF] hover:text-[#A89CFF]"
                            }`}
                    >
                        {iconMap[event.icon] || <Heart className="w-5 h-5" />}
                    </button>
                ))}

                {/* Add more button */}
                <button className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white border-2 border-dashed border-[#E8D4F8] text-[#A89CFF] hover:border-[#A89CFF] hover:bg-[#FDFBFF] transition-all duration-300 flex items-center justify-center">
                    <span className="text-2xl">+</span>
                </button>
            </div>

            {/* Featured Event Card */}
            {events.length > 0 && (
                <div className="px-6">
                    <div className="bg-white rounded-3xl p-6 border border-[#E8D4F8]/50 shadow-lg shadow-[#A89CFF]/5">
                        <h3 className="text-xl font-bold text-[#1E1B4B] mb-2 text-center">
                            {events[0].title}
                        </h3>
                        <p className="text-sm text-[#6B7280] text-center mb-1">
                            {new Date(events[0].date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                            {events[0].partner && `, partner ${events[0].partner}`}
                        </p>
                        <button className="text-sm text-[#FF4D6D] font-medium hover:text-[#FF1744] transition-colors mx-auto block">
                            Edit event
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
