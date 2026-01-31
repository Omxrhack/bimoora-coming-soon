"use client"
import React from 'react'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
}

export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
    return (
        <div
            className={`bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
