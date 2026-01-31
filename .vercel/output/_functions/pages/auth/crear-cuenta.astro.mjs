import { e as createComponent, r as renderTemplate, k as renderComponent, l as renderHead, u as unescapeHTML, g as addAttribute, h as createAstro } from '../../chunks/astro/server_3KTu2lbS.mjs';
import 'piccolore';
/* empty css                                               */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef } from 'react';
import { T as ToastProvider, u as useAuth, a as useToast, I as Input, B as Button } from '../../chunks/CustomToast_BrcIXjfe.mjs';
import { L as Label, C as Checkbox } from '../../chunks/checkbox_w2PuhHK5.mjs';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react';
import { L as LogoSinFondo } from '../../chunks/bimooralogo-sinfondo_BEx_simo.mjs';
export { renderers } from '../../renderers.mjs';

function CrearCuentaFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { register, loginWithOAuth, isSubmitting } = useAuth();
  const { showToast } = useToast();
  const isSubmittingRef = useRef(false);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting) return;
    if (!acceptTerms) {
      showToast("warning", "Términos requeridos", "Debes aceptar los términos y condiciones");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast("error", "Las contraseñas no coinciden", "Por favor, verifica que ambas contraseñas sean iguales");
      return;
    }
    if (formData.password.length < 8) {
      showToast("error", "Contraseña muy corta", "La contraseña debe tener al menos 8 caracteres");
      return;
    }
    isSubmittingRef.current = true;
    const normalizedEmail = formData.email.trim().toLowerCase();
    console.log("[CrearCuenta] Registering user:", normalizedEmail);
    const response = await register({
      email: normalizedEmail,
      password: formData.password,
      full_name: formData.name || void 0
    });
    isSubmittingRef.current = false;
    if (response.success) {
      console.log("[CrearCuenta] Registration successful, redirecting to verify");
      window.location.href = `/auth/verificar-codigo?email=${encodeURIComponent(normalizedEmail)}&type=signup`;
    } else {
      showToast("error", "Error al registrar", response.error || response.message);
    }
  };
  const handleOAuthLogin = async (provider) => {
    const response = await loginWithOAuth(provider);
    if (!response.success) {
      showToast("error", `Error con ${provider}`, response.error || response.message);
    }
  };
  if (isSubmitting) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#FDFBFF]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#1E1B4B] font-semibold text-lg", children: "Creando tu cuenta..." }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm", children: "Un momento por favor" })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex relative overflow-hidden transition-colors duration-300", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse", style: { animationDuration: "4s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse", style: { animationDuration: "4s", animationDelay: "1s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse", style: { animationDuration: "4s", animationDelay: "2s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-20 w-2 h-2 bg-[#A89CFF]/40 rounded-full animate-pulse", style: { animationDuration: "2s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-40 left-20 w-1.5 h-1.5 bg-[#FF8FAB]/40 rounded-full animate-pulse", style: { animationDuration: "2s", animationDelay: "0.5s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-32 w-2 h-2 bg-[#E8D4F8]/50 rounded-full animate-pulse", style: { animationDuration: "2s", animationDelay: "1s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 left-32 w-1.5 h-1.5 bg-[#8EC5FC]/40 rounded-full animate-pulse", style: { animationDuration: "2s", animationDelay: "1.5s" } }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-[#FDFBFF] transition-colors duration-300", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/",
          className: "inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1E1B4B] transition-colors mb-8",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Volver al inicio"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl lg:text-3xl font-bold text-[#1E1B4B] mb-2", children: "Crea tu cuenta" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: "Un espacio íntimo para guardar lo que importa." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "name", className: "text-[#1E1B4B]", children: [
            "Nombre ",
            /* @__PURE__ */ jsx("span", { className: "text-[#6B7280] text-sm", children: "(opcional)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                type: "text",
                placeholder: "Tu nombre",
                value: formData.name,
                onChange: handleChange,
                className: "pl-10 h-12 bg-white border-[#E8D4F8] text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:border-[#A89CFF] focus:ring-[#A89CFF]/20 rounded-xl"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-[#1E1B4B]", children: "Correo electrónico" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                placeholder: "tu@email.com",
                required: true,
                value: formData.email,
                onChange: handleChange,
                className: "pl-10 h-12 bg-white border-[#E8D4F8] text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:border-[#A89CFF] focus:ring-[#A89CFF]/20 rounded-xl"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-[#1E1B4B]", children: "Contraseña" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "password",
                type: showPassword ? "text" : "password",
                placeholder: "Mínimo 8 caracteres",
                required: true,
                minLength: 8,
                value: formData.password,
                onChange: handleChange,
                className: "pl-10 pr-10 h-12 bg-white border-[#E8D4F8] text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:border-[#A89CFF] focus:ring-[#A89CFF]/20 rounded-xl"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1E1B4B] transition-colors",
                "aria-label": showPassword ? "Mostrar contraseña" : "Ocultar contraseña",
                children: showPassword ? /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPassword", className: "text-[#1E1B4B]", children: "Confirmar contraseña" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "confirmPassword",
                type: showConfirmPassword ? "text" : "password",
                placeholder: "Repite tu contraseña",
                required: true,
                minLength: 8,
                value: formData.confirmPassword,
                onChange: handleChange,
                className: "pl-10 pr-10 h-12 bg-white border-[#E8D4F8] text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:border-[#A89CFF] focus:ring-[#A89CFF]/20 rounded-xl"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowConfirmPassword(!showConfirmPassword),
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1E1B4B] transition-colors",
                "aria-label": showConfirmPassword ? "Mostrar contraseña" : "Ocultar contraseña",
                children: showConfirmPassword ? /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 pt-2", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: "terms",
              checked: acceptTerms,
              onCheckedChange: (checked) => setAcceptTerms(checked),
              className: "mt-0.5 border-[#E8D4F8] data-[state=checked]:bg-[#A89CFF] data-[state=checked]:border-[#A89CFF]"
            }
          ),
          /* @__PURE__ */ jsxs(Label, { htmlFor: "terms", className: "text-sm text-[#6B7280] cursor-pointer leading-relaxed font-normal", children: [
            "Acepto los",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/terms", className: "text-[#A89CFF] hover:text-[#A89CFF]/80 underline underline-offset-2", children: "Términos y condiciones" }),
            " ",
            "y la",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/privacy", className: "text-[#A89CFF] hover:text-[#A89CFF]/80 underline underline-offset-2", children: "Política de privacidad" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitting || !acceptTerms,
            className: "w-full h-12 mt-2 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] hover:opacity-90 text-white font-medium rounded-xl shadow-lg shadow-[#A89CFF]/25 transition-all duration-300 disabled:opacity-50",
            size: "lg",
            children: isSubmitting ? "Creando cuenta..." : "Crear cuenta"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t border-[#E8D4F8]" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "bg-[#FDFBFF] px-3 text-[#6B7280]", children: "o regístrate con" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            className: "h-12 border-[#E8D4F8] bg-white hover:bg-[#E8D4F8]/10 text-[#1E1B4B]",
            type: "button",
            onClick: () => handleOAuthLogin("google"),
            disabled: isSubmitting,
            children: [
              /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5 mr-2", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    fill: "currentColor",
                    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    fill: "currentColor",
                    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    fill: "currentColor",
                    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    fill: "currentColor",
                    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  }
                )
              ] }),
              "Google"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            className: "h-12 border-[#E8D4F8] bg-white hover:bg-[#E8D4F8]/10 text-[#1E1B4B]",
            type: "button",
            onClick: () => handleOAuthLogin("apple"),
            disabled: isSubmitting,
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 mr-2", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" }) }),
              "Apple"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-8 text-center text-sm text-[#6B7280]", children: [
        "¿Ya tienes una cuenta?",
        " ",
        /* @__PURE__ */ jsx("a", { href: "/auth/acceder", className: "text-[#A89CFF] hover:text-[#A89CFF]/80 font-medium", children: "Acceder" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-1 relative overflow-hidden transition-colors duration-300", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#E8D4F8] via-[#A89CFF]/5 to-[#FDFBFF]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 right-1/4 w-96 h-96 bg-[#A89CFF]/15 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#FFC8DD]/20 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "relative flex items-center justify-center w-full p-12", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md", children: [
        /* @__PURE__ */ jsx("div", { className: "relative w-72 h-[440px] mx-auto mb-8", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl shadow-[#A89CFF]/20 border border-[#E8D4F8] overflow-hidden transition-colors", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-2 bg-gradient-to-b from-[#E8D4F8]/30 to-[#FDFBFF] rounded-[2rem] overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-5 pt-10 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-[#A89CFF]/20 mx-auto mb-4 flex items-center justify-center", children: /* @__PURE__ */ jsx(Heart, { className: "w-8 h-8 text-[#A89CFF]" }) }),
          /* @__PURE__ */ jsx("div", { className: "h-4 w-32 bg-[#A89CFF]/20 rounded-full mx-auto mb-2" }),
          /* @__PURE__ */ jsx("div", { className: "h-2 w-24 bg-[#E8D4F8] rounded-full mx-auto mb-8" }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white/80 backdrop-blur rounded-2xl p-4 border border-[#E8D4F8]/50 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-[#6B7280] mb-2", children: "Código de invitación" }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2 justify-center", children: ["B", "I", "M", "O"].map((letter, i) => /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-[#E8D4F8]/50 flex items-center justify-center text-[#1E1B4B] font-semibold", children: letter }, i)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 mt-6", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-[#A89CFF]/20" }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 h-0.5 bg-gradient-to-r from-[#A89CFF]/20 via-[#A89CFF] to-[#A89CFF]/20 rounded-full" }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-[#FFC8DD]/30" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-[#6B7280] mt-3", children: "Conecta con tu pareja" })
        ] }) }) }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-[#1E1B4B] mb-3", children: "Comienza su historia" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: "Crea tu cuenta y después invita a tu pareja para comenzar a guardar recuerdos juntos." })
      ] }) })
    ] })
  ] });
}
function CrearCuentaForm() {
  return /* @__PURE__ */ jsx(ToastProvider, { children: /* @__PURE__ */ jsx(CrearCuentaFormContent, {}) });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$CrearCuenta = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CrearCuenta;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Crear cuenta - Bimoora",
    description: "Crea tu cuenta en Bimoora y comienza a guardar recuerdos con tu pareja."
  };
  return renderTemplate(_a || (_a = __template(['<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', '><!-- Primary Meta Tags --><title>Crear cuenta \u2014 Bimoora</title><meta name="title" content="Crear cuenta \u2014 Bimoora"><meta name="description" content="Crea tu cuenta en Bimoora y comienza a guardar recuerdos con tu pareja. Un espacio \xEDntimo para dos."><meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#A89CFF"><!-- Canonical URL --><link rel="canonical" href="https://bimoora.com/auth/crear-cuenta"><!-- Favicon --><link rel="icon" type="image/png"', '><link rel="apple-touch-icon"', '><!-- Preconnect for performance --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"><!-- Structured Data (JSON-LD) --><script type="application/ld+json">', "<\/script>", '</head> <body class="bg-gradient-to-br from-[#E8D4F8]/20 via-white to-[#FFC8DD]/10 transition-colors duration-300"> ', " </body></html>"])), addAttribute(Astro2.generator, "content"), addAttribute(LogoSinFondo.src, "href"), addAttribute(LogoSinFondo.src, "href"), unescapeHTML(JSON.stringify(structuredData)), renderHead(), renderComponent($$result, "CrearCuentaForm", CrearCuentaForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/auth/CrearCuentaForm", "client:component-export": "default" }));
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/crear-cuenta.astro", void 0);

const $$file = "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/crear-cuenta.astro";
const $$url = "/auth/crear-cuenta";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CrearCuenta,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
