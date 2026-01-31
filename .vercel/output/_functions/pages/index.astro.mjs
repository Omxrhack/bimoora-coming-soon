import { e as createComponent, m as maybeRenderHead, r as renderTemplate, g as addAttribute, p as defineScriptVars, k as renderComponent, q as renderTransition, l as renderHead, u as unescapeHTML, h as createAstro } from '../chunks/astro/server_3KTu2lbS.mjs';
import 'piccolore';
/* empty css                                            */
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { User, X, Menu } from 'lucide-react';
import { s as supabase } from '../chunks/supabase_D7K0YZcd.mjs';
import 'clsx';
import { L as LogoSinFondo } from '../chunks/bimooralogo-sinfondo_BEx_simo.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

function AuthNavbar({ className = "" }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at
          });
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 md:gap-3 ${className}`, children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-9 bg-[#E8D4F8]/30 rounded-lg animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "w-24 h-10 bg-[#E8D4F8]/30 rounded-xl animate-pulse" })
    ] });
  }
  if (user) {
    return /* @__PURE__ */ jsx("div", { className: `flex items-center gap-3 ${className}`, children: /* @__PURE__ */ jsxs(
      "a",
      {
        href: "/perfil",
        className: "flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base font-medium text-white bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-105 transition-all",
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-white/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-white" }) }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: user.full_name?.split(" ")[0] || "Mi Perfil" }),
          /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Perfil" })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 md:gap-3 ${className}`, children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "/auth/acceder",
        className: "px-3 py-2 md:px-4 md:py-2 text-sm md:text-base font-medium text-[#1E1B4B] hover:text-[#A89CFF] transition-colors",
        children: "Iniciar sesión"
      }
    ),
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "/auth/crear-cuenta",
        className: "px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium text-white bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-105 transition-all",
        children: "Registrarse"
      }
    )
  ] });
}

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#concepto", label: "Concepto" },
  { href: "#funciones", label: "Funciones" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#seguridad", label: "Seguridad" },
  { href: "#faq", label: "FAQ" }
];
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLinkClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#FDFBFF]/95 backdrop-blur-md border-b border-[#E8D4F8]/50 shadow-sm" : "bg-transparent"}`,
      children: [
        /* @__PURE__ */ jsx("nav", { className: "container mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16 lg:h-20", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/",
              className: "flex items-center gap-2 text-[#1E1B4B] font-semibold text-xl tracking-tight",
              children: /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-[#1E1B4B] to-[#A89CFF] bg-clip-text text-transparent", children: "Bimoora" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "hidden lg:flex items-center gap-1", children: navLinks.map((link) => /* @__PURE__ */ jsx(
            "a",
            {
              href: link.href,
              onClick: (e) => handleLinkClick(e, link.href),
              className: "px-3 py-2 text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors rounded-lg hover:bg-[#E8D4F8]/20",
              children: link.label
            },
            link.href
          )) }),
          /* @__PURE__ */ jsx("div", { className: "hidden lg:flex items-center gap-3", children: /* @__PURE__ */ jsx(AuthNavbar, {}) }),
          /* @__PURE__ */ jsx("div", { className: "flex lg:hidden items-center gap-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsOpen(!isOpen),
              className: "p-2 text-[#1E1B4B] hover:bg-[#E8D4F8]/20 rounded-lg transition-colors",
              "aria-label": isOpen ? "Cerrar menú" : "Abrir menú",
              children: isOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
            }
          ) })
        ] }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `lg:hidden absolute top-full left-0 right-0 bg-[#FDFBFF]/98 backdrop-blur-md border-b border-[#E8D4F8]/50 shadow-lg transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-4", children: [
              /* @__PURE__ */ jsx("nav", { className: "flex flex-col gap-1 mb-4", children: navLinks.map((link) => /* @__PURE__ */ jsx(
                "a",
                {
                  href: link.href,
                  onClick: (e) => handleLinkClick(e, link.href),
                  className: "px-4 py-3 text-[#6B7280] hover:text-[#A89CFF] hover:bg-[#E8D4F8]/20 rounded-xl transition-colors",
                  children: link.label
                },
                link.href
              )) }),
              /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-[#E8D4F8]/50 space-y-2", children: /* @__PURE__ */ jsx(AuthNavbar, {}) })
            ] })
          }
        )
      ]
    }
  );
}

const $$Concept = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="concepto" class="py-20 lg:py-32 bg-white relative overflow-hidden transition-colors duration-300"> <!-- Background decorations --> <div class="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl"></div> <div class="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-[#A89CFF]/10 rounded-full blur-3xl"></div> <div class="container mx-auto px-4 lg:px-8 relative z-10"> <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"> <!-- Visual --> <div class="relative order-2 lg:order-1"> <!-- Main card --> <div class="relative bg-gradient-to-br from-[#A89CFF]/5 to-[#E8D4F8]/10 rounded-3xl p-8 lg:p-12"> <!-- Floating cards --> <div class="space-y-4"> <!-- Card 1 --> <div class="bg-white rounded-2xl p-5 shadow-lg shadow-[#A89CFF]/10 border border-[#E8D4F8]/30 transform hover:scale-105 transition-transform animate-float" style="animation-delay: 0s;"> <div class="flex items-center gap-4"> <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFC8DD] to-[#FF8FAB] flex items-center justify-center"> <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path> </svg> </div> <div> <p class="text-sm text-[#6B7280]">Nota de amor</p> <p class="font-medium text-[#1E1B4B]">
"Eres mi persona favorita"
</p> </div> </div> </div> <!-- Card 2 --> <div class="bg-white rounded-2xl p-5 shadow-lg shadow-[#A89CFF]/10 border border-[#E8D4F8]/30 ml-8 transform hover:scale-105 transition-transform animate-float" style="animation-delay: 0.5s;"> <div class="flex items-center gap-4"> <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#A89CFF] to-[#8EC5FC] flex items-center justify-center"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div> <div> <p class="text-sm text-[#6B7280]">Próximo aniversario</p> <p class="font-medium text-[#1E1B4B]">En 12 días</p> </div> </div> </div> <!-- Card 3 --> <div class="bg-white rounded-2xl p-5 shadow-lg shadow-[#A89CFF]/10 border border-[#E8D4F8]/30 transform hover:scale-105 transition-transform animate-float" style="animation-delay: 1s;"> <div class="flex items-center gap-4"> <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8D4F8] to-[#A89CFF] flex items-center justify-center"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div> <div> <p class="text-sm text-[#6B7280]">Recuerdos compartidos</p> <p class="font-medium text-[#1E1B4B]">147 momentos juntos</p> </div> </div> </div> </div> <!-- Decorative elements --> <div class="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#FFC8DD]/20 blur-xl"></div> <div class="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-[#A89CFF]/15 blur-xl"></div> </div> </div> <!-- Content --> <div class="order-1 lg:order-2"> <span class="inline-block px-4 py-1.5 rounded-full bg-[#FFC8DD]/20 text-[#FF8FAB] font-medium text-sm tracking-wide uppercase mb-4">
El concepto
</span> <h2 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1E1B4B] leading-tight mb-6">
Un espacio solo para ustedes dos
</h2> <p class="text-lg text-[#6B7280] mb-6 leading-relaxed">
En un mundo lleno de ruido y redes sociales públicas, Bimoora ofrece
          algo diferente: <strong class="text-[#1E1B4B]">un refugio digital privado</strong> donde tu relación puede florecer sin distracciones.
</p> <p class="text-lg text-[#6B7280] mb-8 leading-relaxed">
Aquí pueden guardar sus momentos más preciados, escribir notas de
          amor, recordar fechas especiales y construir juntos la historia de su
          relación.
</p> <!-- Stats --> <div class="grid grid-cols-3 gap-6"> <div class="text-center"> <p class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] bg-clip-text text-transparent">
100%
</p> <p class="text-sm text-[#6B7280] mt-1">Privado</p> </div> <div class="text-center"> <p class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#FFC8DD] to-[#FF8FAB] bg-clip-text text-transparent">
2
</p> <p class="text-sm text-[#6B7280] mt-1">Personas</p> </div> <div class="text-center"> <p class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#8EC5FC] to-[#A89CFF] bg-clip-text text-transparent">
∞
</p> <p class="text-sm text-[#6B7280] mt-1">Recuerdos</p> </div> </div> </div> </div> </div> </section>`;
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/landing/Concept.astro", void 0);

const $$Features = createComponent(($$result, $$props, $$slots) => {
  const features = [
    {
      icon: "book-heart",
      title: "Diario compartido",
      description: "Escriban juntos. A\xF1adan emociones, reflexiones y notas que solo ustedes ver\xE1n.",
      gradient: "from-[#FFC8DD] to-[#FF8FAB]"
    },
    {
      icon: "clock",
      title: "L\xEDnea del tiempo",
      description: "Visualicen su historia en orden cronol\xF3gico. Cada momento, exactamente donde debe estar.",
      gradient: "from-[#A89CFF] to-[#8EC5FC]"
    },
    {
      icon: "calendar",
      title: "Fechas importantes",
      description: "Nunca olviden un aniversario. Recordatorios sutiles para lo que importa.",
      gradient: "from-[#E8D4F8] to-[#A89CFF]"
    },
    {
      icon: "image",
      title: "\xC1lbum privado",
      description: "Fotos y notas en un solo lugar. Su galer\xEDa personal, lejos de miradas ajenas.",
      gradient: "from-[#8EC5FC] to-[#E0C3FC]"
    },
    {
      icon: "key",
      title: "Invitaciones seguras",
      description: "C\xF3digos \xFAnicos para conectar. Solo la persona correcta accede a su espacio.",
      gradient: "from-[#FF8FAB] to-[#FFC8DD]"
    },
    {
      icon: "eye",
      title: "Control de privacidad",
      description: "Decidan qu\xE9 se comparte y qu\xE9 permanece solo para uno. Ustedes tienen el control.",
      gradient: "from-[#A89CFF] to-[#E8D4F8]"
    },
    {
      icon: "cloud",
      title: "Respaldo autom\xE1tico",
      description: "Sus recuerdos est\xE1n seguros. Sincronizaci\xF3n y respaldo sin que tengan que pensar en ello.",
      gradient: "from-[#FFC8DD] to-[#E8D4F8]"
    }
  ];
  const iconPaths = {
    "book-heart": "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
    clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    image: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    key: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
    eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    cloud: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
  };
  return renderTemplate`${maybeRenderHead()}<section id="funciones" class="py-20 lg:py-32 bg-[#FDFBFF] relative overflow-hidden transition-colors duration-300"> <!-- Background decorations --> <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8D4F8]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div> <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#A89CFF]/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div> <div class="container mx-auto px-4 lg:px-8 relative z-10"> <!-- Header --> <div class="text-center max-w-2xl mx-auto mb-16"> <span class="inline-block px-4 py-1.5 rounded-full bg-[#A89CFF]/10 text-[#A89CFF] font-medium text-sm tracking-wide uppercase mb-4">
Funciones
</span> <h2 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1E1B4B] leading-tight mb-6">
Todo lo que necesitan, nada que sobre
</h2> <p class="text-lg text-[#6B7280]">
Herramientas pensadas para guardar, organizar y revivir lo que hace
        especial su relación.
</p> </div> <!-- Features grid --> <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"> ${features.map((feature, index) => renderTemplate`<div class="group bg-white rounded-2xl p-6 border border-[#E8D4F8]/30 hover:border-[#A89CFF]/50 hover:shadow-xl hover:shadow-[#A89CFF]/10 transition-all duration-300 animate-fade-in-up"${addAttribute(`animation-delay: ${index * 0.1}s`, "style")}> <div${addAttribute(`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`, "class")}> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path${addAttribute(iconPaths[feature.icon], "d")}></path> </svg> </div> <h3 class="text-lg font-semibold text-[#1E1B4B] mb-2"> ${feature.title} </h3> <p class="text-sm text-[#6B7280] leading-relaxed"> ${feature.description} </p> </div>`)} </div> </div> </section>`;
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/landing/Features.astro", void 0);

const $$HowItWorks = createComponent(($$result, $$props, $$slots) => {
  const steps = [
    {
      number: "01",
      title: "Crea tu cuenta",
      description: "Reg\xEDstrate en segundos y personaliza tu perfil. Sin complicaciones.",
      icon: "user-plus",
      gradient: "from-[#A89CFF] to-[#8EC5FC]"
    },
    {
      number: "02",
      title: "Invita a tu pareja",
      description: "Genera un c\xF3digo \xFAnico y comp\xE1rtelo. Solo ustedes dos tendr\xE1n acceso.",
      icon: "heart-handshake",
      gradient: "from-[#FFC8DD] to-[#FF8FAB]"
    },
    {
      number: "03",
      title: "Empiecen a crear recuerdos",
      description: "Escriban, suban fotos y marquen fechas especiales juntos.",
      icon: "sparkles",
      gradient: "from-[#E8D4F8] to-[#A89CFF]"
    }
  ];
  const iconPaths = {
    "user-plus": "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z M20 8v6 M23 11h-6",
    "heart-handshake": "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z M12 5L9.04 7.96a2.17 2.17 0 000 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 013.79 0l2.96 2.66 M18 15l-2-2 M15 18l-2-2",
    "sparkles": "M9.937 15.5A2 2 0 008.5 14.063l-6.135-1.582a.5.5 0 010-.962L8.5 9.936A2 2 0 009.937 8.5l1.582-6.135a.5.5 0 01.963 0L14.063 8.5A2 2 0 0015.5 9.937l6.135 1.581a.5.5 0 010 .964L15.5 14.063a2 2 0 00-1.437 1.437l-1.582 6.135a.5.5 0 01-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3"
  };
  return renderTemplate`${maybeRenderHead()}<section id="como-funciona" class="py-20 lg:py-32 bg-white relative overflow-hidden transition-colors duration-300"> <!-- Background decorations --> <div class="absolute top-0 left-1/2 w-[600px] h-[600px] bg-[#E8D4F8]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div> <div class="container mx-auto px-4 lg:px-8 relative z-10"> <!-- Header --> <div class="text-center max-w-2xl mx-auto mb-16"> <span class="inline-block px-4 py-1.5 rounded-full bg-[#FFC8DD]/20 text-[#FF8FAB] font-medium text-sm tracking-wide uppercase mb-4">
Cómo funciona
</span> <h2 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1E1B4B] leading-tight mb-6">
Tres pasos para empezar
</h2> <p class="text-lg text-[#6B7280]">
Conectar con tu pareja nunca fue tan fácil. En minutos estarán creando recuerdos juntos.
</p> </div> <!-- Steps --> <div class="max-w-4xl mx-auto"> <div class="grid md:grid-cols-3 gap-8 relative"> <!-- Connection line (desktop only) --> <div class="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#A89CFF]/30 via-[#FFC8DD]/30 to-[#E8D4F8]/30"></div> ${steps.map((step, index) => renderTemplate`<div class="relative flex flex-col items-center text-center animate-fade-in-up"${addAttribute(`animation-delay: ${index * 0.2}s`, "style")}> <!-- Step number bubble --> <div${addAttribute(`relative w-32 h-32 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-xl group`, "class")}> <!-- Decorative ring --> <div class="absolute inset-0 rounded-full border-4 border-white/30 group-hover:border-white/50 transition-colors"></div> <!-- Icon --> <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <path${addAttribute(iconPaths[step.icon], "d")}></path> </svg> <!-- Step number badge --> <span class="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-sm font-bold text-[#1E1B4B]"> ${step.number} </span> </div> <h3 class="text-xl font-semibold text-[#1E1B4B] mb-3"> ${step.title} </h3> <p class="text-[#6B7280] leading-relaxed"> ${step.description} </p> </div>`)} </div> </div> <!-- CTA --> <div class="text-center mt-16"> <a href="/auth/crear-cuenta" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-semibold rounded-2xl shadow-xl shadow-[#A89CFF]/30 hover:opacity-90 hover:scale-105 transition-all text-lg"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path> </svg>
Comenzar ahora
</a> </div> </div> </section>`;
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/landing/HowItWorks.astro", void 0);

const $$Security = createComponent(($$result, $$props, $$slots) => {
  const securityFeatures = [
    {
      icon: "shield-check",
      title: "Cifrado de datos",
      description: "Toda tu informaci\xF3n viaja cifrada. Ni siquiera nosotros podemos leer tus recuerdos."
    },
    {
      icon: "lock",
      title: "Privacidad total",
      description: "Tu contenido es tuyo. No lo compartimos, vendemos ni usamos para publicidad."
    },
    {
      icon: "fingerprint",
      title: "Autenticaci\xF3n segura",
      description: "Verificaci\xF3n en dos pasos y opciones biom\xE9tricas para proteger tu cuenta."
    },
    {
      icon: "server",
      title: "Servidores seguros",
      description: "Infraestructura con los m\xE1s altos est\xE1ndares de seguridad y respaldos autom\xE1ticos."
    }
  ];
  const iconPaths = {
    "shield-check": "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    fingerprint: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4",
    server: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
  };
  return renderTemplate`${maybeRenderHead()}<section id="seguridad" class="py-20 lg:py-32 bg-gradient-to-b from-[#FDFBFF] to-white relative overflow-hidden transition-colors duration-300"> <!-- Background decorations --> <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#A89CFF]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div> <div class="absolute top-1/4 left-0 w-[300px] h-[300px] bg-[#E8D4F8]/15 rounded-full blur-3xl -translate-x-1/2"></div> <div class="container mx-auto px-4 lg:px-8 relative z-10"> <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"> <!-- Content --> <div> <span class="inline-block px-4 py-1.5 rounded-full bg-[#A89CFF]/10 text-[#A89CFF] font-medium text-sm tracking-wide uppercase mb-4">
Seguridad
</span> <h2 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1E1B4B] leading-tight mb-6">
Tu privacidad es nuestra prioridad
</h2> <p class="text-lg text-[#6B7280] mb-8">
Entendemos que tus recuerdos son íntimos. Por eso hemos construido
          Bimoora con la seguridad como pilar fundamental.
</p> <div class="grid sm:grid-cols-2 gap-6"> ${securityFeatures.map((feature, index) => renderTemplate`<div class="flex gap-4 animate-fade-in-up"${addAttribute(`animation-delay: ${index * 0.1}s`, "style")}> <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-[#A89CFF]/10 flex items-center justify-center"> <svg class="w-6 h-6 text-[#A89CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path${addAttribute(iconPaths[feature.icon], "d")}></path> </svg> </div> <div> <h3 class="font-semibold text-[#1E1B4B] mb-1"> ${feature.title} </h3> <p class="text-sm text-[#6B7280]">${feature.description}</p> </div> </div>`)} </div> </div> <!-- Visual --> <div class="relative"> <!-- Main card --> <div class="relative bg-white rounded-3xl shadow-2xl shadow-[#A89CFF]/20 p-8 border border-[#E8D4F8]/30"> <!-- Shield icon --> <div class="absolute -top-6 -right-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#A89CFF] to-[#E8D4F8] flex items-center justify-center shadow-xl rotate-12"> <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> </div> <!-- Content --> <div class="flex items-center gap-4 mb-6"> <div class="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFC8DD] to-[#FF8FAB] flex items-center justify-center p-0.5 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#FF8FAB]/30 cursor-pointer"> <div class="w-full h-full bg-white rounded-full flex items-center justify-center p-2 transition-transform duration-300 hover:rotate-12"> <img class="w-full h-full object-contain transition-transform duration-300"${addAttribute(LogoSinFondo.src, "src")} alt="Bimoora" loading="lazy"> </div> </div> <div> <h4 class="font-semibold text-[#1E1B4B]">Tu espacio privado</h4> <p class="text-sm text-[#6B7280]">Solo para ti y tu pareja</p> </div> </div> <!-- Security indicators --> <div class="space-y-3"> <div class="flex items-center gap-3 p-3 bg-[#FDFBFF] rounded-xl"> <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"> <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> </div> <span class="text-sm text-[#1E1B4B]">Cifrado de extremo a extremo</span> </div> <div class="flex items-center gap-3 p-3 bg-[#FDFBFF] rounded-xl"> <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"> <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> </div> <span class="text-sm text-[#1E1B4B]">Verificación en dos pasos</span> </div> <div class="flex items-center gap-3 p-3 bg-[#FDFBFF] rounded-xl"> <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"> <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> </div> <span class="text-sm text-[#1E1B4B]">Respaldos automáticos</span> </div> </div> </div> <!-- Floating decorations --> <div class="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-[#8EC5FC] to-[#E0C3FC] opacity-30 blur-xl"></div> <div class="absolute top-1/2 -right-8 w-16 h-16 rounded-full bg-[#FFC8DD]/40 blur-lg"></div> </div> </div> </div> </section>`;
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/landing/Security.astro", void 0);

const $$FAQ = createComponent(($$result, $$props, $$slots) => {
  const faqs = [
    {
      question: "\xBFBimoora es solo para parejas?",
      answer: "S\xED, Bimoora est\xE1 dise\xF1ado espec\xEDficamente para parejas que quieren un espacio privado para guardar sus recuerdos. Cada espacio compartido conecta exactamente a dos personas."
    },
    {
      question: "\xBFMis recuerdos son realmente privados?",
      answer: "Absolutamente. Tus recuerdos solo son visibles para ti y tu pareja. No compartimos, vendemos ni analizamos tu contenido. Utilizamos cifrado en tr\xE1nsito y seguimos las mejores pr\xE1cticas de seguridad."
    },
    {
      question: "\xBFPuedo invitar a una persona diferente o cambiar de espacio?",
      answer: "S\xED. Puedes crear nuevos espacios o desvincular espacios existentes desde la configuraci\xF3n de tu cuenta. El proceso es sencillo y respeta la privacidad de ambas partes."
    },
    {
      question: "\xBFQu\xE9 pasa si pierdo acceso a mi cuenta?",
      answer: "Ofrecemos recuperaci\xF3n de cuenta mediante correo electr\xF3nico verificado. Tambi\xE9n recomendamos activar la verificaci\xF3n en dos pasos para mayor seguridad."
    },
    {
      question: "\xBFC\xF3mo elimino mi cuenta y todos mis datos?",
      answer: "Puedes solicitar la eliminaci\xF3n completa de tu cuenta y datos desde la configuraci\xF3n. El proceso es irreversible y elimina toda tu informaci\xF3n de nuestros servidores en un plazo m\xE1ximo de 30 d\xEDas."
    },
    {
      question: "\xBFPuedo exportar mis recuerdos?",
      answer: "Los usuarios de los planes Plus y Pareja pueden exportar sus recuerdos en formatos comunes. Estamos trabajando para ampliar esta funci\xF3n a todos los planes."
    },
    {
      question: "\xBFD\xF3nde puedo leer los T\xE9rminos y la Pol\xEDtica de Privacidad?",
      answer: "Puedes acceder a nuestros T\xE9rminos y Condiciones y Pol\xEDtica de Privacidad desde el pie de p\xE1gina de esta p\xE1gina o directamente en /terms y /privacy."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="faq" class="py-20 lg:py-32 bg-white relative overflow-hidden transition-colors duration-300"> <!-- Background decorations --> <div class="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[#FFC8DD]/10 rounded-full blur-3xl -translate-x-1/2"></div> <div class="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#E8D4F8]/15 rounded-full blur-3xl translate-x-1/2"></div> <div class="container mx-auto px-4 lg:px-8 relative z-10"> <!-- Header --> <div class="text-center max-w-2xl mx-auto mb-16"> <span class="inline-block px-4 py-1.5 rounded-full bg-[#A89CFF]/10 text-[#A89CFF] font-medium text-sm tracking-wide uppercase mb-4">
Preguntas frecuentes
</span> <h2 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1E1B4B] leading-tight mb-6">
Resolvemos tus dudas
</h2> <p class="text-lg text-[#6B7280]">
Si no encuentras lo que buscas, escríbenos y te ayudaremos.
</p> </div> <!-- FAQ Accordion --> <div class="max-w-3xl mx-auto space-y-4"> ${faqs.map((faq, index) => renderTemplate`<details class="group bg-[#FDFBFF] border border-[#E8D4F8]/50 rounded-2xl overflow-hidden hover:border-[#A89CFF]/30 hover:shadow-md hover:shadow-[#A89CFF]/10 transition-all duration-300 animate-fade-in-up"${addAttribute(`animation-delay: ${index * 0.1}s`, "style")}> <summary class="flex items-center justify-between cursor-pointer px-6 py-5 text-left text-[#1E1B4B] font-medium hover:text-[#A89CFF] hover:bg-[#E8D4F8]/10 transition-all duration-300"> <span class="pr-4">${faq.question}</span> <span class="flex-shrink-0 w-6 h-6 rounded-full bg-[#E8D4F8]/30 flex items-center justify-center group-open:bg-[#A89CFF] group-open:scale-110 transition-all duration-300"> <svg class="w-4 h-4 text-[#A89CFF] group-open:text-white group-open:rotate-180 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </span> </summary> <div class="px-6 pb-5 animate-slide-down"> <p class="text-[#6B7280] leading-relaxed">${faq.answer}</p> </div> </details>`)} </div> <!-- Contact CTA --> <div class="text-center mt-12"> <p class="text-[#6B7280] mb-4">¿Tienes más preguntas?</p> <a href="mailto:soporte@bimoora.com" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-medium rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-105 transition-all"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg>
Contáctanos
</a> </div> </div> </section>`;
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/landing/FAQ.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const footerLinks = {
    producto: [
      { label: "Funciones", href: "#funciones" },
      { label: "Seguridad", href: "#seguridad" },
      { label: "FAQ", href: "#faq" }
    ],
    legal: [
      { label: "T\xE9rminos y Condiciones", href: "/terms" },
      { label: "Pol\xEDtica de Privacidad", href: "/privacy" }
    ],
    soporte: [
      { label: "Centro de ayuda", href: "#faq" },
      { label: "Contacto", href: "mailto:hola@bimoora.app" }
    ]
  };
  const socialLinks = [
    {
      label: "Instagram",
      href: "https://instagram.com/bimoorapp",
      icon: "instagram"
    },
    { label: "X (Twitter)", href: "https://x.com/bimoora", icon: "twitter" }
  ];
  const socialIcons = {
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
  };
  return renderTemplate`${maybeRenderHead()}<footer class="relative bg-[#FDFBFF] transition-colors duration-300"> <!-- Gradient overlay instead of border --> <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8D4F8]/50 to-transparent"></div> <div class="container mx-auto px-4 lg:px-8 py-12 lg:py-16"> <div class="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"> <!-- Brand --> <div class="col-span-2 md:col-span-1"> <a href="/" class="flex items-center gap-2 text-[#1E1B4B] font-semibold text-xl group"> <span class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A89CFF] to-[#E8D4F8] flex items-center justify-center text-white text-sm font-bold shadow-md overflow-hidden p-1 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#A89CFF]/30"> <span class="w-full h-full bg-white rounded-md flex items-center justify-center p-1 transition-transform duration-300 group-hover:rotate-6"> <img class="w-full h-full object-contain transition-transform duration-300"${addAttribute(LogoSinFondo.src, "src")} alt="Bimoora Logo" loading="lazy"> </span> </span> <span class="bg-gradient-to-r from-[#1E1B4B] to-[#A89CFF] bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
Bimoora
</span> </a> <p class="mt-4 text-sm text-[#6B7280] leading-relaxed">
Donde el amor deja memoria. Un espacio íntimo para parejas.
</p> <!-- Social --> <div class="mt-6 flex items-center gap-4"> ${socialLinks.map((social) => renderTemplate`<a${addAttribute(social.href, "href")} target="_blank" rel="noopener noreferrer" class="w-10 h-10 rounded-full bg-[#E8D4F8]/20 flex items-center justify-center text-[#6B7280] hover:text-[#A89CFF] hover:bg-[#E8D4F8]/40 transition-colors"${addAttribute(social.label, "aria-label")}> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path${addAttribute(socialIcons[social.icon], "d")}></path> </svg> </a>`)} </div> </div> <!-- Producto --> <div> <h4 class="font-semibold text-[#1E1B4B] mb-4">Producto</h4> <ul class="space-y-3"> ${footerLinks.producto.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors"> ${link.label} </a> </li>`)} </ul> </div> <!-- Legal --> <div> <h4 class="font-semibold text-[#1E1B4B] mb-4">Legal</h4> <ul class="space-y-3"> ${footerLinks.legal.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors"> ${link.label} </a> </li>`)} </ul> </div> <!-- Soporte --> <div> <h4 class="font-semibold text-[#1E1B4B] mb-4">Soporte</h4> <ul class="space-y-3"> ${footerLinks.soporte.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors"> ${link.label} </a> </li>`)} </ul> </div> </div> <!-- Bottom --> <div class="mt-12 pt-8 border-t border-[#E8D4F8]/50 flex flex-col md:flex-row items-center justify-between gap-4"> <p class="text-sm text-[#6B7280]">
© 2026 Bimoora. Todos los derechos reservados.
</p> </div> </div> </footer>`;
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/landing/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const TARGET_DATE = /* @__PURE__ */ new Date();
  TARGET_DATE.setMonth(TARGET_DATE.getMonth() + 5);
  const TARGET_DATE_ISO = TARGET_DATE.toISOString();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bimoora",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android",
    description: "Un espacio privado para dos: notas, recuerdos y un diario inteligente que cuida su conexi\xF3n cada d\xEDa.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "10000"
    }
  };
  return renderTemplate(_a || (_a = __template(['<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', '><!-- Primary Meta Tags --><title>Bimoora \u2014 Donde el amor deja memoria | App para Parejas</title><meta name="title" content="Bimoora \u2014 Donde el amor deja memoria | App para Parejas"><meta name="description" content="Bimoora: un espacio privado para dos. App para parejas con notas, recuerdos y diario inteligente que cuida tu conexi\xF3n cada d\xEDa. Descubre donde el amor deja memoria."><meta name="keywords" content="app para parejas, diario de pareja, notas de amor, recuerdos de pareja, app de relaci\xF3n, diario inteligente, espacio privado parejas, Bimoora"><meta name="author" content="Bimoora"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="language" content="Spanish"><meta name="revisit-after" content="7 days"><meta name="theme-color" content="#A89CFF"><!-- Canonical URL --><link rel="canonical" href="https://bimoora.com"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url" content="https://bimoora.com"><meta property="og:title" content="Bimoora \u2014 Donde el amor deja memoria | App para Parejas"><meta property="og:description" content="Un espacio privado para dos: notas, recuerdos y un diario inteligente que cuida su conexi\xF3n cada d\xEDa."><meta property="og:image"', '><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Bimoora - Donde el amor deja memoria"><meta property="og:site_name" content="Bimoora"><meta property="og:locale" content="es_ES"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url" content="https://bimoora.com"><meta name="twitter:title" content="Bimoora \u2014 Donde el amor deja memoria | App para Parejas"><meta name="twitter:description" content="Un espacio privado para dos: notas, recuerdos y un diario inteligente que cuida su conexi\xF3n cada d\xEDa."><meta name="twitter:image"', '><meta name="twitter:image:alt" content="Bimoora - Donde el amor deja memoria"><!-- Favicon --><link rel="icon" type="image/png"', '><link rel="apple-touch-icon"', '><!-- Preconnect for performance --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"><!-- Structured Data (JSON-LD) --><script type="application/ld+json">', "<\/script>", '</head> <body class="transition-colors duration-300"> <!-- Navbar --> ', ' <!-- Hero Section --> <section id="inicio" class="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 relative overflow-hidden"> <!-- Background gradient orbs --> <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse-slow"></div> <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse-slow" style="animation-delay: 1s;"></div> <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div> <!-- Decorative particles --> <div class="absolute top-20 right-20 w-2 h-2 bg-[#A89CFF]/40 rounded-full animate-twinkle" style="animation-delay: 0s;"></div> <div class="absolute top-40 left-20 w-1.5 h-1.5 bg-[#FF8FAB]/40 rounded-full animate-twinkle" style="animation-delay: 1.5s;"></div> <div class="absolute bottom-40 right-32 w-2 h-2 bg-[#E8D4F8]/50 rounded-full animate-twinkle" style="animation-delay: 3s;"></div> <div class="absolute bottom-20 left-32 w-1.5 h-1.5 bg-[#8EC5FC]/40 rounded-full animate-twinkle" style="animation-delay: 2s;"></div> <!-- Bottom gradient fade for smooth transition --> <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#FDFBFF] pointer-events-none z-20"></div> <!-- Floating Cards Container - Hidden on mobile --> <div id="floating-cards-container" class="hidden md:block"></div> <div class="relative z-30 flex flex-col items-center text-center max-w-2xl"', '> <!-- Badge --> <span class="font-bold flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-sm text-[#6B7280] mb-6 animate-fade-in-up">\nPr\xF3ximamente\n</span> <!-- Brand name --> <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1E1B4B] mb-4 animate-fade-in-up drop-shadow-sm" style="animation-delay: 0.1s;"', '> <span class="bg-gradient-to-r from-[#1E1B4B] via-[#A89CFF] to-[#1E1B4B] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Bimoora</span> </h1> <!-- Tagline --> <p class="text-xl md:text-2xl lg:text-3xl font-medium text-[#A89CFF] mb-6 animate-fade-in-up" style="animation-delay: 0.2s;">\nDonde el amor deja memoria\n</p> <p class="text-[#6B7280] text-lg md:text-xl mb-10 max-w-lg leading-relaxed animate-fade-in-up" style="animation-delay: 0.3s;">\nUn espacio privado para dos. Guarden sus recuerdos, escriban\n					su historia, celebren su amor.\n</p> <!-- Countdown --> <div class="flex gap-4 md:gap-6 mb-10 animate-fade-in-up" id="countdown" style="animation-delay: 0.4s;"> <div class="flex flex-col items-center countdown-item"> <div class="w-18 h-18 md:w-24 md:h-24 rounded-2xl bg-white shadow-xl shadow-[#A89CFF]/15 border border-[#E8D4F8]/50 flex items-center justify-center mb-2 hover:scale-110 hover:shadow-2xl hover:shadow-[#A89CFF]/25 transition-all duration-300"> <span class="text-3xl md:text-4xl font-bold text-[#1E1B4B]" id="days">--</span> </div> <span class="text-xs md:text-sm text-[#6B7280] font-medium">D\xEDas</span> </div> <div class="flex flex-col items-center countdown-item"> <div class="w-18 h-18 md:w-24 md:h-24 rounded-2xl bg-white shadow-xl shadow-[#A89CFF]/15 border border-[#E8D4F8]/50 flex items-center justify-center mb-2 hover:scale-110 hover:shadow-2xl hover:shadow-[#A89CFF]/25 transition-all duration-300"> <span class="text-3xl md:text-4xl font-bold text-[#1E1B4B]" id="hours">--</span> </div> <span class="text-xs md:text-sm text-[#6B7280] font-medium">Horas</span> </div> <div class="flex flex-col items-center countdown-item"> <div class="w-18 h-18 md:w-24 md:h-24 rounded-2xl bg-white shadow-xl shadow-[#A89CFF]/15 border border-[#E8D4F8]/50 flex items-center justify-center mb-2 hover:scale-110 hover:shadow-2xl hover:shadow-[#A89CFF]/25 transition-all duration-300"> <span class="text-3xl md:text-4xl font-bold text-[#1E1B4B]" id="minutes">--</span> </div> <span class="text-xs md:text-sm text-[#6B7280] font-medium">Minutos</span> </div> <div class="flex flex-col items-center countdown-item"> <div class="w-18 h-18 md:w-24 md:h-24 rounded-2xl bg-white shadow-xl shadow-[#A89CFF]/15 border border-[#E8D4F8]/50 flex items-center justify-center mb-2 hover:scale-110 hover:shadow-2xl hover:shadow-[#A89CFF]/25 transition-all duration-300"> <span class="text-3xl md:text-4xl font-bold text-[#1E1B4B]" id="seconds">--</span> </div> <span class="text-xs md:text-sm text-[#6B7280] font-medium">Segundos</span> </div> </div> <!-- Notify me section --> <div class="w-full max-w-md animate-fade-in-up" style="animation-delay: 0.5s;"> <p class="text-sm md:text-base text-[#6B7280] mb-4 font-medium">\nS\xE9 el primero en saber cuando lancemos\n</p> <form class="flex flex-col sm:flex-row gap-3" id="notify-form"> <input type="email" placeholder="tu@email.com" required id="email-input" class="flex-1 px-5 py-3.5 rounded-xl border border-[#E8D4F8] bg-white text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all hover:border-[#A89CFF]/70 hover:shadow-md shadow-sm"> <button type="submit" id="submit-button" class="button-hover w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-semibold rounded-xl active:opacity-75 transition-all duration-300 shadow-lg shadow-[#A89CFF]/25 flex items-center justify-center gap-2 min-w-[160px] text-sm md:text-base relative overflow-hidden group"> <span id="button-text">Notificarme</span> <span id="button-spinner" class="hidden"> <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </span> </button> </form> </div> </div> <!-- Toast Notification --> <div id="toast" class="fixed top-20 md:top-24 left-1/2 transform -translate-x-1/2 z-50 hidden w-[calc(100%-2rem)] max-w-sm md:max-w-md"> <div class="bg-white rounded-xl shadow-2xl border border-[#E8D4F8] px-4 py-3 md:px-6 md:py-4 flex items-center gap-3 animate-slide-down"> <div id="toast-icon" class="flex-shrink-0"></div> <p id="toast-message" class="text-sm font-medium text-[#1E1B4B] flex-1"></p> </div> </div> <!-- Loading Overlay --> <div id="loading-overlay" class="fixed inset-0 bg-[#FDFBFF]/80 backdrop-blur-sm z-40 hidden items-center justify-center p-4"> <div class="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 w-full max-w-sm border border-transparent"> <div class="relative"> <div class="w-16 h-16 border-4 border-[#E8D4F8] border-t-[#A89CFF] rounded-full animate-spin"></div> <div class="absolute inset-0 flex items-center justify-center"> <svg class="w-8 h-8 text-[#A89CFF]" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path> </svg> </div> </div> <p class="text-base text-[#1E1B4B] font-medium text-center">\nEnviando tu solicitud...\n</p> <p class="text-sm text-[#6B7280] text-center">\nUn momento, por favor\n</p> </div> </div> </section> <!-- Concept Section --> ', " <!-- Features Section --> ", " <!-- How It Works Section --> ", " <!-- Security Section --> ", " <!-- FAQ Section --> ", " <!-- Footer --> ", " <script>(function(){", '\n			// Target date\n			const targetDateObj = new Date(targetDateISO);\n\n			function calculateTimeLeft() {\n				const difference =\n					targetDateObj.getTime() - new Date().getTime();\n\n				if (difference <= 0) {\n					return { days: 0, hours: 0, minutes: 0, seconds: 0 };\n				}\n\n				return {\n					days: Math.floor(difference / (1000 * 60 * 60 * 24)),\n					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),\n					minutes: Math.floor((difference / 1000 / 60) % 60),\n					seconds: Math.floor((difference / 1000) % 60),\n				};\n			}\n\n			function updateCountdown() {\n				const timeLeft = calculateTimeLeft();\n				const daysEl = document.getElementById("days");\n				const hoursEl = document.getElementById("hours");\n				const minutesEl = document.getElementById("minutes");\n				const secondsEl = document.getElementById("seconds");\n\n				if (daysEl)\n					daysEl.textContent = String(timeLeft.days).padStart(2, "0");\n				if (hoursEl)\n					hoursEl.textContent = String(timeLeft.hours).padStart(\n						2,\n						"0",\n					);\n				if (minutesEl)\n					minutesEl.textContent = String(timeLeft.minutes).padStart(\n						2,\n						"0",\n					);\n				if (secondsEl)\n					secondsEl.textContent = String(timeLeft.seconds).padStart(\n						2,\n						"0",\n					);\n			}\n\n			// Update immediately\n			updateCountdown();\n\n			// Update every second\n			setInterval(updateCountdown, 1000);\n\n			// Floating cards\n			const allCards = [\n				{\n					title: "Aniversario",\n					subtitle: "En 5 d\xEDas",\n					icon: "calendar",\n					gradientFrom: "from-[#FFC8DD]",\n					gradientTo: "to-[#FF8FAB]",\n					desktopPosition: { left: "calc(50% - 480px)", top: "8rem" },\n					mobilePosition: { left: "0.5rem", top: "5.5rem" },\n				},\n				{\n					title: "Racha activa",\n					subtitle: "12 d\xEDas juntos",\n					icon: "heart",\n					gradientFrom: "from-[#A89CFF]",\n					gradientTo: "to-[#8EC5FC]",\n					desktopPosition: {\n						right: "calc(50% - 480px)",\n						bottom: "12rem",\n					},\n					mobilePosition: { right: "0.5rem", bottom: "6rem" },\n				},\n				{\n					title: "Nueva nota",\n					subtitle: "Hace 2 horas",\n					icon: "message",\n					gradientFrom: "from-[#FF8FAB]",\n					gradientTo: "to-[#FFC8DD]",\n					desktopPosition: {\n						left: "calc(50% - 520px)",\n						top: "20rem",\n					},\n					mobilePosition: { left: "0.5rem", bottom: "4rem" },\n				},\n				{\n					title: "Recuerdo compartido",\n					subtitle: "3 fotos nuevas",\n					icon: "photo",\n					gradientFrom: "from-[#8EC5FC]",\n					gradientTo: "to-[#E0C3FC]",\n					desktopPosition: {\n						right: "calc(50% - 520px)",\n						top: "16rem",\n					},\n					mobilePosition: { right: "0.5rem", top: "5.5rem" },\n				},\n			];\n\n			const icons = {\n				calendar: `<svg class="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,\n				heart: `<svg class="h-4 w-4 md:h-5 md:w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>`,\n				message: `<svg class="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>`,\n				photo: `<svg class="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,\n			};\n\n			function renderCards() {\n				const container = document.getElementById(\n					"floating-cards-container",\n				);\n				if (!container) return;\n\n				container.innerHTML = "";\n				const isMobile = window.innerWidth < 768;\n\n				const mobilePositions = [\n					{ left: "1rem", top: "6rem" },\n					{ right: "1rem", top: "6rem" },\n					{ left: "1rem", bottom: "5rem" },\n					{ right: "1rem", bottom: "5rem" },\n				];\n\n				const cardsToRender = isMobile\n					? allCards.slice(0, 4)\n					: allCards;\n\n				cardsToRender.forEach((card, index) => {\n					const cardElement = document.createElement("div");\n					cardElement.className =\n						"absolute z-10 md:z-20 animate-float rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-sm p-2.5 md:p-4 shadow-xl shadow-[#A89CFF]/10 border border-[#E8D4F8]/30 floating-card group hover:scale-105 transition-transform";\n					cardElement.style.animationDelay = `${(index + 1) * 0.5}s`;\n\n					const position = isMobile\n						? mobilePositions[index % mobilePositions.length]\n						: card.desktopPosition;\n\n					if (position.left) cardElement.style.left = position.left;\n					if (position.right)\n						cardElement.style.right = position.right;\n					if (position.top) cardElement.style.top = position.top;\n					if (position.bottom)\n						cardElement.style.bottom = position.bottom;\n\n					cardElement.innerHTML = `\n						<div class="flex items-center gap-2 md:gap-3">\n							<div class="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} shadow-md">\n								${icons[card.icon] || icons.heart}\n							</div>\n							<div>\n								<p class="text-[10px] md:text-xs text-[#6B7280] font-medium leading-tight">${card.title}</p>\n								<p class="text-xs md:text-sm font-semibold text-[#1E1B4B] leading-tight">${card.subtitle}</p>\n							</div>\n						</div>\n					`;\n\n					container.appendChild(cardElement);\n				});\n			}\n\n			renderCards();\n\n			let resizeTimeout;\n			window.addEventListener("resize", () => {\n				clearTimeout(resizeTimeout);\n				resizeTimeout = setTimeout(renderCards, 250);\n			});\n\n			// Form handling\n			const form = document.getElementById("notify-form");\n			const submitButton = document.getElementById("submit-button");\n			const buttonText = document.getElementById("button-text");\n			const buttonSpinner = document.getElementById("button-spinner");\n			const emailInput = document.getElementById("email-input");\n			const loadingOverlay = document.getElementById("loading-overlay");\n			const toast = document.getElementById("toast");\n			const toastIcon = document.getElementById("toast-icon");\n			const toastMessage = document.getElementById("toast-message");\n\n			function showToast(message, type = "success") {\n				if (!toast || !toastIcon || !toastMessage) return;\n\n				const toastContainer = toast.querySelector("div");\n				if (!toastContainer) return;\n\n				toastIcon.innerHTML = "";\n\n				if (type === "success") {\n					toastIcon.innerHTML = `\n						<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />\n						</svg>\n					`;\n					toastContainer.classList.remove("border-red-200");\n					toastContainer.classList.add("border-green-200");\n				} else {\n					toastIcon.innerHTML = `\n						<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />\n						</svg>\n					`;\n					toastContainer.classList.remove("border-green-200");\n					toastContainer.classList.add("border-red-200");\n				}\n\n				toastMessage.textContent = message;\n				toast.classList.remove("hidden");\n\n				setTimeout(() => {\n					toast.classList.add("hidden");\n				}, 4000);\n			}\n\n			if (\n				form &&\n				submitButton &&\n				emailInput &&\n				buttonText &&\n				buttonSpinner &&\n				loadingOverlay\n			) {\n				form.addEventListener("submit", async (e) => {\n					e.preventDefault();\n					const email = emailInput.value?.trim();\n\n					if (!email) {\n						showToast(\n							"Por favor, ingresa un email v\xE1lido.",\n							"error",\n						);\n						emailInput.focus();\n						return;\n					}\n\n					submitButton.disabled = true;\n					buttonText.textContent = "Enviando...";\n					buttonSpinner.classList.remove("hidden");\n					submitButton.classList.add(\n						"opacity-75",\n						"cursor-not-allowed",\n					);\n					loadingOverlay.classList.remove("hidden");\n					loadingOverlay.classList.add("flex");\n\n					try {\n						const response = await fetch("/api/subscribe", {\n							method: "POST",\n							headers: { "Content-Type": "application/json" },\n							body: JSON.stringify({ email }),\n						});\n\n						const data = await response.json();\n\n						if (response.ok) {\n							showToast(\n								data.message ||\n									"\xA1Gracias! Te notificaremos cuando lancemos.",\n								"success",\n							);\n							form.reset();\n						} else {\n							showToast(\n								data.error ||\n									"Hubo un error. Por favor, intenta de nuevo.",\n								"error",\n							);\n						}\n					} catch (error) {\n						console.error("Error:", error);\n						showToast(\n							"Hubo un error al enviar tu solicitud. Por favor, intenta de nuevo.",\n							"error",\n						);\n					} finally {\n						setTimeout(() => {\n							submitButton.disabled = false;\n							buttonText.textContent = "Notificarme";\n							buttonSpinner.classList.add("hidden");\n							submitButton.classList.remove(\n								"opacity-75",\n								"cursor-not-allowed",\n							);\n							loadingOverlay.classList.add("hidden");\n							loadingOverlay.classList.remove("flex");\n						}, 500);\n					}\n				});\n			}\n\n			// Smooth scroll for anchor links\n			document.querySelectorAll(\'a[href^="#"]\').forEach((anchor) => {\n				anchor.addEventListener("click", function (e) {\n					e.preventDefault();\n					const target = document.querySelector(\n						this.getAttribute("href"),\n					);\n					if (target) {\n						target.scrollIntoView({ behavior: "smooth" });\n					}\n				});\n			});\n		})();<\/script> </body> </html>'], ['<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', '><!-- Primary Meta Tags --><title>Bimoora \u2014 Donde el amor deja memoria | App para Parejas</title><meta name="title" content="Bimoora \u2014 Donde el amor deja memoria | App para Parejas"><meta name="description" content="Bimoora: un espacio privado para dos. App para parejas con notas, recuerdos y diario inteligente que cuida tu conexi\xF3n cada d\xEDa. Descubre donde el amor deja memoria."><meta name="keywords" content="app para parejas, diario de pareja, notas de amor, recuerdos de pareja, app de relaci\xF3n, diario inteligente, espacio privado parejas, Bimoora"><meta name="author" content="Bimoora"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="language" content="Spanish"><meta name="revisit-after" content="7 days"><meta name="theme-color" content="#A89CFF"><!-- Canonical URL --><link rel="canonical" href="https://bimoora.com"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url" content="https://bimoora.com"><meta property="og:title" content="Bimoora \u2014 Donde el amor deja memoria | App para Parejas"><meta property="og:description" content="Un espacio privado para dos: notas, recuerdos y un diario inteligente que cuida su conexi\xF3n cada d\xEDa."><meta property="og:image"', '><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Bimoora - Donde el amor deja memoria"><meta property="og:site_name" content="Bimoora"><meta property="og:locale" content="es_ES"><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:url" content="https://bimoora.com"><meta name="twitter:title" content="Bimoora \u2014 Donde el amor deja memoria | App para Parejas"><meta name="twitter:description" content="Un espacio privado para dos: notas, recuerdos y un diario inteligente que cuida su conexi\xF3n cada d\xEDa."><meta name="twitter:image"', '><meta name="twitter:image:alt" content="Bimoora - Donde el amor deja memoria"><!-- Favicon --><link rel="icon" type="image/png"', '><link rel="apple-touch-icon"', '><!-- Preconnect for performance --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"><!-- Structured Data (JSON-LD) --><script type="application/ld+json">', "<\/script>", '</head> <body class="transition-colors duration-300"> <!-- Navbar --> ', ' <!-- Hero Section --> <section id="inicio" class="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 relative overflow-hidden"> <!-- Background gradient orbs --> <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse-slow"></div> <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse-slow" style="animation-delay: 1s;"></div> <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div> <!-- Decorative particles --> <div class="absolute top-20 right-20 w-2 h-2 bg-[#A89CFF]/40 rounded-full animate-twinkle" style="animation-delay: 0s;"></div> <div class="absolute top-40 left-20 w-1.5 h-1.5 bg-[#FF8FAB]/40 rounded-full animate-twinkle" style="animation-delay: 1.5s;"></div> <div class="absolute bottom-40 right-32 w-2 h-2 bg-[#E8D4F8]/50 rounded-full animate-twinkle" style="animation-delay: 3s;"></div> <div class="absolute bottom-20 left-32 w-1.5 h-1.5 bg-[#8EC5FC]/40 rounded-full animate-twinkle" style="animation-delay: 2s;"></div> <!-- Bottom gradient fade for smooth transition --> <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#FDFBFF] pointer-events-none z-20"></div> <!-- Floating Cards Container - Hidden on mobile --> <div id="floating-cards-container" class="hidden md:block"></div> <div class="relative z-30 flex flex-col items-center text-center max-w-2xl"', '> <!-- Badge --> <span class="font-bold flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-sm text-[#6B7280] mb-6 animate-fade-in-up">\nPr\xF3ximamente\n</span> <!-- Brand name --> <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1E1B4B] mb-4 animate-fade-in-up drop-shadow-sm" style="animation-delay: 0.1s;"', '> <span class="bg-gradient-to-r from-[#1E1B4B] via-[#A89CFF] to-[#1E1B4B] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Bimoora</span> </h1> <!-- Tagline --> <p class="text-xl md:text-2xl lg:text-3xl font-medium text-[#A89CFF] mb-6 animate-fade-in-up" style="animation-delay: 0.2s;">\nDonde el amor deja memoria\n</p> <p class="text-[#6B7280] text-lg md:text-xl mb-10 max-w-lg leading-relaxed animate-fade-in-up" style="animation-delay: 0.3s;">\nUn espacio privado para dos. Guarden sus recuerdos, escriban\n					su historia, celebren su amor.\n</p> <!-- Countdown --> <div class="flex gap-4 md:gap-6 mb-10 animate-fade-in-up" id="countdown" style="animation-delay: 0.4s;"> <div class="flex flex-col items-center countdown-item"> <div class="w-18 h-18 md:w-24 md:h-24 rounded-2xl bg-white shadow-xl shadow-[#A89CFF]/15 border border-[#E8D4F8]/50 flex items-center justify-center mb-2 hover:scale-110 hover:shadow-2xl hover:shadow-[#A89CFF]/25 transition-all duration-300"> <span class="text-3xl md:text-4xl font-bold text-[#1E1B4B]" id="days">--</span> </div> <span class="text-xs md:text-sm text-[#6B7280] font-medium">D\xEDas</span> </div> <div class="flex flex-col items-center countdown-item"> <div class="w-18 h-18 md:w-24 md:h-24 rounded-2xl bg-white shadow-xl shadow-[#A89CFF]/15 border border-[#E8D4F8]/50 flex items-center justify-center mb-2 hover:scale-110 hover:shadow-2xl hover:shadow-[#A89CFF]/25 transition-all duration-300"> <span class="text-3xl md:text-4xl font-bold text-[#1E1B4B]" id="hours">--</span> </div> <span class="text-xs md:text-sm text-[#6B7280] font-medium">Horas</span> </div> <div class="flex flex-col items-center countdown-item"> <div class="w-18 h-18 md:w-24 md:h-24 rounded-2xl bg-white shadow-xl shadow-[#A89CFF]/15 border border-[#E8D4F8]/50 flex items-center justify-center mb-2 hover:scale-110 hover:shadow-2xl hover:shadow-[#A89CFF]/25 transition-all duration-300"> <span class="text-3xl md:text-4xl font-bold text-[#1E1B4B]" id="minutes">--</span> </div> <span class="text-xs md:text-sm text-[#6B7280] font-medium">Minutos</span> </div> <div class="flex flex-col items-center countdown-item"> <div class="w-18 h-18 md:w-24 md:h-24 rounded-2xl bg-white shadow-xl shadow-[#A89CFF]/15 border border-[#E8D4F8]/50 flex items-center justify-center mb-2 hover:scale-110 hover:shadow-2xl hover:shadow-[#A89CFF]/25 transition-all duration-300"> <span class="text-3xl md:text-4xl font-bold text-[#1E1B4B]" id="seconds">--</span> </div> <span class="text-xs md:text-sm text-[#6B7280] font-medium">Segundos</span> </div> </div> <!-- Notify me section --> <div class="w-full max-w-md animate-fade-in-up" style="animation-delay: 0.5s;"> <p class="text-sm md:text-base text-[#6B7280] mb-4 font-medium">\nS\xE9 el primero en saber cuando lancemos\n</p> <form class="flex flex-col sm:flex-row gap-3" id="notify-form"> <input type="email" placeholder="tu@email.com" required id="email-input" class="flex-1 px-5 py-3.5 rounded-xl border border-[#E8D4F8] bg-white text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all hover:border-[#A89CFF]/70 hover:shadow-md shadow-sm"> <button type="submit" id="submit-button" class="button-hover w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-semibold rounded-xl active:opacity-75 transition-all duration-300 shadow-lg shadow-[#A89CFF]/25 flex items-center justify-center gap-2 min-w-[160px] text-sm md:text-base relative overflow-hidden group"> <span id="button-text">Notificarme</span> <span id="button-spinner" class="hidden"> <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </span> </button> </form> </div> </div> <!-- Toast Notification --> <div id="toast" class="fixed top-20 md:top-24 left-1/2 transform -translate-x-1/2 z-50 hidden w-[calc(100%-2rem)] max-w-sm md:max-w-md"> <div class="bg-white rounded-xl shadow-2xl border border-[#E8D4F8] px-4 py-3 md:px-6 md:py-4 flex items-center gap-3 animate-slide-down"> <div id="toast-icon" class="flex-shrink-0"></div> <p id="toast-message" class="text-sm font-medium text-[#1E1B4B] flex-1"></p> </div> </div> <!-- Loading Overlay --> <div id="loading-overlay" class="fixed inset-0 bg-[#FDFBFF]/80 backdrop-blur-sm z-40 hidden items-center justify-center p-4"> <div class="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 w-full max-w-sm border border-transparent"> <div class="relative"> <div class="w-16 h-16 border-4 border-[#E8D4F8] border-t-[#A89CFF] rounded-full animate-spin"></div> <div class="absolute inset-0 flex items-center justify-center"> <svg class="w-8 h-8 text-[#A89CFF]" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path> </svg> </div> </div> <p class="text-base text-[#1E1B4B] font-medium text-center">\nEnviando tu solicitud...\n</p> <p class="text-sm text-[#6B7280] text-center">\nUn momento, por favor\n</p> </div> </div> </section> <!-- Concept Section --> ', " <!-- Features Section --> ", " <!-- How It Works Section --> ", " <!-- Security Section --> ", " <!-- FAQ Section --> ", " <!-- Footer --> ", " <script>(function(){", '\n			// Target date\n			const targetDateObj = new Date(targetDateISO);\n\n			function calculateTimeLeft() {\n				const difference =\n					targetDateObj.getTime() - new Date().getTime();\n\n				if (difference <= 0) {\n					return { days: 0, hours: 0, minutes: 0, seconds: 0 };\n				}\n\n				return {\n					days: Math.floor(difference / (1000 * 60 * 60 * 24)),\n					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),\n					minutes: Math.floor((difference / 1000 / 60) % 60),\n					seconds: Math.floor((difference / 1000) % 60),\n				};\n			}\n\n			function updateCountdown() {\n				const timeLeft = calculateTimeLeft();\n				const daysEl = document.getElementById("days");\n				const hoursEl = document.getElementById("hours");\n				const minutesEl = document.getElementById("minutes");\n				const secondsEl = document.getElementById("seconds");\n\n				if (daysEl)\n					daysEl.textContent = String(timeLeft.days).padStart(2, "0");\n				if (hoursEl)\n					hoursEl.textContent = String(timeLeft.hours).padStart(\n						2,\n						"0",\n					);\n				if (minutesEl)\n					minutesEl.textContent = String(timeLeft.minutes).padStart(\n						2,\n						"0",\n					);\n				if (secondsEl)\n					secondsEl.textContent = String(timeLeft.seconds).padStart(\n						2,\n						"0",\n					);\n			}\n\n			// Update immediately\n			updateCountdown();\n\n			// Update every second\n			setInterval(updateCountdown, 1000);\n\n			// Floating cards\n			const allCards = [\n				{\n					title: "Aniversario",\n					subtitle: "En 5 d\xEDas",\n					icon: "calendar",\n					gradientFrom: "from-[#FFC8DD]",\n					gradientTo: "to-[#FF8FAB]",\n					desktopPosition: { left: "calc(50% - 480px)", top: "8rem" },\n					mobilePosition: { left: "0.5rem", top: "5.5rem" },\n				},\n				{\n					title: "Racha activa",\n					subtitle: "12 d\xEDas juntos",\n					icon: "heart",\n					gradientFrom: "from-[#A89CFF]",\n					gradientTo: "to-[#8EC5FC]",\n					desktopPosition: {\n						right: "calc(50% - 480px)",\n						bottom: "12rem",\n					},\n					mobilePosition: { right: "0.5rem", bottom: "6rem" },\n				},\n				{\n					title: "Nueva nota",\n					subtitle: "Hace 2 horas",\n					icon: "message",\n					gradientFrom: "from-[#FF8FAB]",\n					gradientTo: "to-[#FFC8DD]",\n					desktopPosition: {\n						left: "calc(50% - 520px)",\n						top: "20rem",\n					},\n					mobilePosition: { left: "0.5rem", bottom: "4rem" },\n				},\n				{\n					title: "Recuerdo compartido",\n					subtitle: "3 fotos nuevas",\n					icon: "photo",\n					gradientFrom: "from-[#8EC5FC]",\n					gradientTo: "to-[#E0C3FC]",\n					desktopPosition: {\n						right: "calc(50% - 520px)",\n						top: "16rem",\n					},\n					mobilePosition: { right: "0.5rem", top: "5.5rem" },\n				},\n			];\n\n			const icons = {\n				calendar: \\`<svg class="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>\\`,\n				heart: \\`<svg class="h-4 w-4 md:h-5 md:w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>\\`,\n				message: \\`<svg class="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>\\`,\n				photo: \\`<svg class="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>\\`,\n			};\n\n			function renderCards() {\n				const container = document.getElementById(\n					"floating-cards-container",\n				);\n				if (!container) return;\n\n				container.innerHTML = "";\n				const isMobile = window.innerWidth < 768;\n\n				const mobilePositions = [\n					{ left: "1rem", top: "6rem" },\n					{ right: "1rem", top: "6rem" },\n					{ left: "1rem", bottom: "5rem" },\n					{ right: "1rem", bottom: "5rem" },\n				];\n\n				const cardsToRender = isMobile\n					? allCards.slice(0, 4)\n					: allCards;\n\n				cardsToRender.forEach((card, index) => {\n					const cardElement = document.createElement("div");\n					cardElement.className =\n						"absolute z-10 md:z-20 animate-float rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-sm p-2.5 md:p-4 shadow-xl shadow-[#A89CFF]/10 border border-[#E8D4F8]/30 floating-card group hover:scale-105 transition-transform";\n					cardElement.style.animationDelay = \\`\\${(index + 1) * 0.5}s\\`;\n\n					const position = isMobile\n						? mobilePositions[index % mobilePositions.length]\n						: card.desktopPosition;\n\n					if (position.left) cardElement.style.left = position.left;\n					if (position.right)\n						cardElement.style.right = position.right;\n					if (position.top) cardElement.style.top = position.top;\n					if (position.bottom)\n						cardElement.style.bottom = position.bottom;\n\n					cardElement.innerHTML = \\`\n						<div class="flex items-center gap-2 md:gap-3">\n							<div class="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br \\${card.gradientFrom} \\${card.gradientTo} shadow-md">\n								\\${icons[card.icon] || icons.heart}\n							</div>\n							<div>\n								<p class="text-[10px] md:text-xs text-[#6B7280] font-medium leading-tight">\\${card.title}</p>\n								<p class="text-xs md:text-sm font-semibold text-[#1E1B4B] leading-tight">\\${card.subtitle}</p>\n							</div>\n						</div>\n					\\`;\n\n					container.appendChild(cardElement);\n				});\n			}\n\n			renderCards();\n\n			let resizeTimeout;\n			window.addEventListener("resize", () => {\n				clearTimeout(resizeTimeout);\n				resizeTimeout = setTimeout(renderCards, 250);\n			});\n\n			// Form handling\n			const form = document.getElementById("notify-form");\n			const submitButton = document.getElementById("submit-button");\n			const buttonText = document.getElementById("button-text");\n			const buttonSpinner = document.getElementById("button-spinner");\n			const emailInput = document.getElementById("email-input");\n			const loadingOverlay = document.getElementById("loading-overlay");\n			const toast = document.getElementById("toast");\n			const toastIcon = document.getElementById("toast-icon");\n			const toastMessage = document.getElementById("toast-message");\n\n			function showToast(message, type = "success") {\n				if (!toast || !toastIcon || !toastMessage) return;\n\n				const toastContainer = toast.querySelector("div");\n				if (!toastContainer) return;\n\n				toastIcon.innerHTML = "";\n\n				if (type === "success") {\n					toastIcon.innerHTML = \\`\n						<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />\n						</svg>\n					\\`;\n					toastContainer.classList.remove("border-red-200");\n					toastContainer.classList.add("border-green-200");\n				} else {\n					toastIcon.innerHTML = \\`\n						<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />\n						</svg>\n					\\`;\n					toastContainer.classList.remove("border-green-200");\n					toastContainer.classList.add("border-red-200");\n				}\n\n				toastMessage.textContent = message;\n				toast.classList.remove("hidden");\n\n				setTimeout(() => {\n					toast.classList.add("hidden");\n				}, 4000);\n			}\n\n			if (\n				form &&\n				submitButton &&\n				emailInput &&\n				buttonText &&\n				buttonSpinner &&\n				loadingOverlay\n			) {\n				form.addEventListener("submit", async (e) => {\n					e.preventDefault();\n					const email = emailInput.value?.trim();\n\n					if (!email) {\n						showToast(\n							"Por favor, ingresa un email v\xE1lido.",\n							"error",\n						);\n						emailInput.focus();\n						return;\n					}\n\n					submitButton.disabled = true;\n					buttonText.textContent = "Enviando...";\n					buttonSpinner.classList.remove("hidden");\n					submitButton.classList.add(\n						"opacity-75",\n						"cursor-not-allowed",\n					);\n					loadingOverlay.classList.remove("hidden");\n					loadingOverlay.classList.add("flex");\n\n					try {\n						const response = await fetch("/api/subscribe", {\n							method: "POST",\n							headers: { "Content-Type": "application/json" },\n							body: JSON.stringify({ email }),\n						});\n\n						const data = await response.json();\n\n						if (response.ok) {\n							showToast(\n								data.message ||\n									"\xA1Gracias! Te notificaremos cuando lancemos.",\n								"success",\n							);\n							form.reset();\n						} else {\n							showToast(\n								data.error ||\n									"Hubo un error. Por favor, intenta de nuevo.",\n								"error",\n							);\n						}\n					} catch (error) {\n						console.error("Error:", error);\n						showToast(\n							"Hubo un error al enviar tu solicitud. Por favor, intenta de nuevo.",\n							"error",\n						);\n					} finally {\n						setTimeout(() => {\n							submitButton.disabled = false;\n							buttonText.textContent = "Notificarme";\n							buttonSpinner.classList.add("hidden");\n							submitButton.classList.remove(\n								"opacity-75",\n								"cursor-not-allowed",\n							);\n							loadingOverlay.classList.add("hidden");\n							loadingOverlay.classList.remove("flex");\n						}, 500);\n					}\n				});\n			}\n\n			// Smooth scroll for anchor links\n			document.querySelectorAll(\'a[href^="#"]\').forEach((anchor) => {\n				anchor.addEventListener("click", function (e) {\n					e.preventDefault();\n					const target = document.querySelector(\n						this.getAttribute("href"),\n					);\n					if (target) {\n						target.scrollIntoView({ behavior: "smooth" });\n					}\n				});\n			});\n		})();<\/script> </body> </html>'])), addAttribute(Astro2.generator, "content"), addAttribute(LogoSinFondo.src, "content"), addAttribute(LogoSinFondo.src, "content"), addAttribute(LogoSinFondo.src, "href"), addAttribute(LogoSinFondo.src, "href"), unescapeHTML(JSON.stringify(structuredData)), renderHead(), renderComponent($$result, "Navbar", Navbar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/landing/Navbar", "client:component-export": "default" }), addAttribute(renderTransition($$result, "r4jmnomw", "slide", ""), "data-astro-transition-scope"), addAttribute(renderTransition($$result, "sppdk6fr", "", "hero-title"), "data-astro-transition-scope"), renderComponent($$result, "Concept", $$Concept, {}), renderComponent($$result, "Features", $$Features, {}), renderComponent($$result, "HowItWorks", $$HowItWorks, {}), renderComponent($$result, "Security", $$Security, {}), renderComponent($$result, "FAQ", $$FAQ, {}), renderComponent($$result, "Footer", $$Footer, {}), defineScriptVars({ targetDateISO: TARGET_DATE_ISO }));
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/index.astro", "self");

const $$file = "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
