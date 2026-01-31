import { e as createComponent, r as renderTemplate, k as renderComponent, l as renderHead, u as unescapeHTML, g as addAttribute, h as createAstro } from '../chunks/astro/server_D13BJ9Xf.mjs';
import 'piccolore';
/* empty css                                            */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { T as ToastProvider, u as useAuth, a as useToast, B as Button } from '../chunks/CustomToast_YZEZrSNm.mjs';
import { ArrowLeft, Heart, User, Edit2, Mail, Calendar, Settings, LogOut } from 'lucide-react';
import { L as LogoSinFondo } from '../chunks/bimooralogo-sinfondo_BEx_simo.mjs';
export { renderers } from '../renderers.mjs';

function ProfileContentInner() {
  const { user, isLoading, logout } = useAuth();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/auth/acceder";
    }
  }, [isLoading, user]);
  const handleLogout = async () => {
    setIsLoggingOut(true);
    const response = await logout();
    if (response.success) {
      showToast("success", "¡Hasta pronto!", "Has cerrado sesión correctamente");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      showToast("error", "Error", response.error || "No se pudo cerrar sesión");
      setIsLoggingOut(false);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#FDFBFF]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: "Cargando..." })
    ] }) });
  }
  if (!user) {
    return null;
  }
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse", style: { animationDuration: "4s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse", style: { animationDuration: "4s", animationDelay: "1s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse", style: { animationDuration: "4s", animationDelay: "2s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-20 w-2 h-2 bg-[#A89CFF]/40 rounded-full animate-pulse", style: { animationDuration: "2s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-40 left-20 w-1.5 h-1.5 bg-[#FF8FAB]/40 rounded-full animate-pulse", style: { animationDuration: "2s", animationDelay: "0.5s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-32 w-2 h-2 bg-[#E8D4F8]/50 rounded-full animate-pulse", style: { animationDuration: "2s", animationDelay: "1s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 left-32 w-1.5 h-1.5 bg-[#8EC5FC]/40 rounded-full animate-pulse", style: { animationDuration: "2s", animationDelay: "1.5s" } }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col px-6 py-8 lg:px-8 bg-[#FDFBFF]/80 backdrop-blur-sm relative z-10 transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-8", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/",
          className: "inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Volver al inicio"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl shadow-xl shadow-[#A89CFF]/10 border border-[#E8D4F8]/30 overflow-hidden transition-colors duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "h-32 bg-gradient-to-r from-[#A89CFF] via-[#E8D4F8] to-[#FFC8DD] relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white/10 backdrop-blur-sm" }),
          /* @__PURE__ */ jsx(Heart, { className: "absolute top-4 right-4 w-6 h-6 text-white/40" }),
          /* @__PURE__ */ jsx(Heart, { className: "absolute bottom-4 left-8 w-4 h-4 text-white/30" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative px-8", children: /* @__PURE__ */ jsx("div", { className: "absolute -top-12 left-8", children: /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-br from-[#A89CFF] to-[#E8D4F8] p-1 shadow-lg", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full rounded-full bg-white flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsx(User, { className: "w-10 h-10 text-[#A89CFF]" }) }) }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "pt-16 pb-8 px-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#1E1B4B] mb-1 transition-colors", children: user.full_name || "Usuario de Bimoora" }),
              /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm transition-colors", children: "Miembro de Bimoora" })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "border-[#E8D4F8] text-[#A89CFF] hover:bg-[#E8D4F8]/20",
                children: [
                  /* @__PURE__ */ jsx(Edit2, { className: "w-4 h-4 mr-2" }),
                  "Editar"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 bg-[#FDFBFF] rounded-2xl border border-[#E8D4F8]/30 transition-colors", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[#A89CFF]/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-[#A89CFF]" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[#6B7280] mb-0.5", children: "Correo electrónico" }),
                /* @__PURE__ */ jsx("p", { className: "text-[#1E1B4B] font-medium break-all", children: user.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 bg-[#FDFBFF] rounded-2xl border border-[#E8D4F8]/30 transition-colors", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[#FFC8DD]/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5 text-[#FF8FAB]" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[#6B7280] mb-0.5", children: "Miembro desde" }),
                /* @__PURE__ */ jsx("p", { className: "text-[#1E1B4B] font-medium", children: formatDate(user.created_at) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "my-8 border-t border-[#E8D4F8]/30" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: "w-full justify-start border-[#E8D4F8] text-[#6B7280] hover:bg-[#E8D4F8]/20 hover:text-[#1E1B4B]",
                children: [
                  /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 mr-3" }),
                  "Configuración de la cuenta"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                onClick: handleLogout,
                disabled: isLoggingOut,
                className: "w-full justify-start border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "w-5 h-5 mr-3" }),
                  isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 p-6 bg-white/50 rounded-2xl border border-[#E8D4F8]/30 text-center transition-colors", children: [
        /* @__PURE__ */ jsx(Heart, { className: "w-8 h-8 text-[#A89CFF] mx-auto mb-3" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[#1E1B4B] mb-2", children: "¡Próximamente más funciones!" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm", children: "Estamos trabajando en nuevas características para tu perfil. Pronto podrás conectar con tu pareja y más." })
      ] })
    ] }) })
  ] });
}
function ProfileContent() {
  return /* @__PURE__ */ jsx(ToastProvider, { children: /* @__PURE__ */ jsx(ProfileContentInner, {}) });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Perfil = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Perfil;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Mi Perfil - Bimoora",
    description: "Tu perfil en Bimoora. Gestiona tu cuenta y personaliza tu experiencia."
  };
  return renderTemplate(_a || (_a = __template(['<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', '><!-- Primary Meta Tags --><title>Mi Perfil \u2014 Bimoora</title><meta name="title" content="Mi Perfil \u2014 Bimoora"><meta name="description" content="Tu perfil en Bimoora. Gestiona tu cuenta y personaliza tu experiencia."><meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#A89CFF"><!-- Canonical URL --><link rel="canonical" href="https://bimoora.com/perfil"><!-- Favicon --><link rel="icon" type="image/png"', '><link rel="apple-touch-icon"', '><!-- Preconnect for performance --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"><!-- Structured Data (JSON-LD) --><script type="application/ld+json">', "<\/script>", '</head> <body class="bg-gradient-to-br from-[#E8D4F8]/20 via-white to-[#FFC8DD]/10 transition-colors duration-300"> ', " </body></html>"])), addAttribute(Astro2.generator, "content"), addAttribute(LogoSinFondo.src, "href"), addAttribute(LogoSinFondo.src, "href"), unescapeHTML(JSON.stringify(structuredData)), renderHead(), renderComponent($$result, "ProfileContent", ProfileContent, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/profile/ProfileContent", "client:component-export": "default" }));
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/perfil.astro", void 0);

const $$file = "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/perfil.astro";
const $$url = "/perfil";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Perfil,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
