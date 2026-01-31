"use client"

import React from "react"
import { ToastProvider } from "@/components/ui/CustomToast"
import CreateSpaceWizard from "./CreateSpaceWizard"

export default function OnboardingContainer() {
    return (
        <ToastProvider>
            <CreateSpaceWizard onBack={() => window.location.href = '/perfil'} />
        </ToastProvider>
    )
}
