"use client"

import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun } from "lucide-react"
import AuthNavbar from "@/components/auth/AuthNavbar"

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#concepto", label: "Concepto" },
  { href: "#funciones", label: "Funciones" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#seguridad", label: "Seguridad" },
  { href: "#faq", label: "FAQ" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      setIsOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FDFBFF]/95 dark:bg-[#0F0D1A]/95 backdrop-blur-md border-b border-[#E8D4F8]/50 dark:border-[#A89CFF]/20 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a 
            href="/" 
            className="flex items-center gap-2 text-[#1E1B4B] dark:text-white font-semibold text-xl tracking-tight"
          >
            <span className="bg-gradient-to-r from-[#1E1B4B] dark:from-white to-[#A89CFF] bg-clip-text text-transparent">
              Bimoora
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-3 py-2 text-sm text-[#6B7280] dark:text-[#A8A3B8] hover:text-[#A89CFF] transition-colors rounded-lg hover:bg-[#E8D4F8]/20 dark:hover:bg-[#A89CFF]/10"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth & Dark Mode Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-[#6B7280] dark:text-[#A8A3B8] hover:text-[#A89CFF] hover:bg-[#E8D4F8]/20 dark:hover:bg-[#A89CFF]/10 transition-colors"
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <AuthNavbar />
          </div>

          {/* Mobile Menu Button & Dark Mode */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-[#1E1B4B] dark:text-white hover:bg-[#E8D4F8]/20 dark:hover:bg-[#A89CFF]/10 rounded-lg transition-colors"
              aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#1E1B4B] dark:text-white hover:bg-[#E8D4F8]/20 dark:hover:bg-[#A89CFF]/10 rounded-lg transition-colors"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-[#FDFBFF]/98 dark:bg-[#0F0D1A]/98 backdrop-blur-md border-b border-[#E8D4F8]/50 dark:border-[#A89CFF]/20 shadow-lg transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col gap-1 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-4 py-3 text-[#6B7280] dark:text-[#A8A3B8] hover:text-[#A89CFF] hover:bg-[#E8D4F8]/20 dark:hover:bg-[#A89CFF]/10 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-[#E8D4F8]/50 dark:border-[#A89CFF]/20">
            <AuthNavbar />
          </div>
        </div>
      </div>
    </header>
  )
}
