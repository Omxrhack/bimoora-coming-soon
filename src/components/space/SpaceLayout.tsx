"use client"
import React from 'react'

export default function SpaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FDFBFF] relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-24">
            {/* Background Orbs */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] animate-pulse" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="fixed top-[40%] right-[20%] w-[300px] h-[300px] bg-indigo-200/30 rounded-full blur-[80px]" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    )
}
