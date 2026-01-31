import { e as createComponent, l as renderHead, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_3KTu2lbS.mjs';
import 'piccolore';
/* empty css                                               */
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Shield, Mail, RefreshCw } from 'lucide-react';
import { v as verifyOtp, r as resendOtp } from '../../chunks/authOtp_9o-8vdWt.mjs';
export { renderers } from '../../renderers.mjs';

function VerifyCode({
  email: emailProp,
  redirectTo = "/perfil"
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState(emailProp || "");
  const [otpType, setOtpType] = useState("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);
  const isVerifyingRef = useRef(false);
  const isResendingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (hasInitializedRef.current) {
      console.log("[VerifyCode] Init blocked: already initialized");
      return;
    }
    hasInitializedRef.current = true;
    console.log("[VerifyCode] Initializing component");
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (!emailProp) {
        const urlEmail = params.get("email");
        if (urlEmail) {
          const decodedEmail = decodeURIComponent(urlEmail).trim().toLowerCase();
          setEmail(decodedEmail);
          console.log("[VerifyCode] Email from URL:", decodedEmail);
        }
      }
      setOtpType("email");
      console.log("[VerifyCode] OTP type forced to: email");
    }
    setIsMounted(true);
  }, [emailProp]);
  useEffect(() => {
    const savedCooldown = sessionStorage.getItem("otp_cooldown");
    const savedTime = sessionStorage.getItem("otp_cooldown_timestamp");
    if (savedCooldown && savedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1e3);
      const remaining = parseInt(savedCooldown) - elapsed;
      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        sessionStorage.removeItem("otp_cooldown");
        sessionStorage.removeItem("otp_cooldown_timestamp");
      }
    }
  }, []);
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sessionStorage.removeItem("otp_cooldown");
          sessionStorage.removeItem("otp_cooldown_timestamp");
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, [cooldown]);
  const startCooldown = (seconds) => {
    setCooldown(seconds);
    sessionStorage.setItem("otp_cooldown", seconds.toString());
    sessionStorage.setItem("otp_cooldown_timestamp", Date.now().toString());
  };
  useEffect(() => {
    if (isMounted && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isMounted]);
  const handleCodeChange = useCallback((index, value) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    setCode((prev) => {
      const newCode = [...prev];
      newCode[index] = digit;
      return newCode;
    });
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);
  const handleKeyDown = useCallback((index, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return;
    }
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [code]);
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  }, []);
  const handleVerify = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const fullCode2 = code.join("");
    if (isVerifyingRef.current || isVerifying) return;
    if (fullCode2.length !== 6) {
      setError("Ingresa el código completo de 6 dígitos");
      return;
    }
    isVerifyingRef.current = true;
    setIsVerifying(true);
    setError(null);
    setSuccess(null);
    const result = await verifyOtp(email, fullCode2, otpType);
    setIsVerifying(false);
    if (result.error) {
      isVerifyingRef.current = false;
      setError(result.message || "Error al verificar");
      if (result.isInvalid || result.isExpired) {
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } else {
      setSuccess("¡Verificado! Redirigiendo...");
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1e3);
    }
  }, [code, email, otpType, isVerifying, redirectTo]);
  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isResendingRef.current || isResending) return;
    isResendingRef.current = true;
    setIsResending(true);
    setError(null);
    setSuccess(null);
    const result = await resendOtp(email);
    setIsResending(false);
    isResendingRef.current = false;
    if (result.error) {
      const msg = result.error.message || "";
      if (result.isRateLimited || msg.includes("rate") || msg.includes("limit")) {
        const waitTime = result.retryAfterSeconds || 60;
        setError(`Demasiados intentos. Espera ${waitTime} segundos.`);
        startCooldown(waitTime);
      } else {
        setError("No se pudo reenviar el código. Intenta más tarde.");
        startCooldown(30);
      }
    } else {
      setSuccess("¡Nuevo código enviado! Revisa tu correo.");
      startCooldown(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setOtpType("email");
    }
  }, [cooldown, email, isResending]);
  const fullCode = code.join("");
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse", style: { animationDuration: "4s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse", style: { animationDuration: "4s", animationDelay: "1s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse", style: { animationDuration: "4s", animationDelay: "2s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-20 right-20 w-2 h-2 bg-[#A89CFF]/40 rounded-full animate-pulse", style: { animationDuration: "2s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-40 left-20 w-1.5 h-1.5 bg-[#FF8FAB]/40 rounded-full animate-pulse", style: { animationDuration: "2s", animationDelay: "0.5s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-40 right-32 w-2 h-2 bg-[#E8D4F8]/50 rounded-full animate-pulse", style: { animationDuration: "2s", animationDelay: "1s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 left-32 w-1.5 h-1.5 bg-[#8EC5FC]/40 rounded-full animate-pulse", style: { animationDuration: "2s", animationDelay: "1.5s" } }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-[#FDFBFF]/80 backdrop-blur-sm relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/auth/crear-cuenta",
          className: "inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors mb-8",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Volver al registro"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A89CFF]/20 to-[#E8D4F8]/20 mb-4", children: /* @__PURE__ */ jsx(Shield, { className: "w-8 h-8 text-[#A89CFF]" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#1E1B4B] mb-2", children: "Verificar código" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: "Ingresa el código de 6 dígitos enviado a" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-[#A89CFF]" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-[#1E1B4B]", children: isMounted ? email : /* @__PURE__ */ jsx("span", { className: "inline-block w-40 h-5 bg-[#E8D4F8]/30 rounded animate-pulse" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-[#A89CFF]/10 p-8 border border-[#E8D4F8]/30", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: handleVerify, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#1E1B4B] text-center", children: "Código de verificación" }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-3", onPaste: handlePaste, children: code.map((digit, index) => /* @__PURE__ */ jsx(
              "input",
              {
                ref: (el) => {
                  inputRefs.current[index] = el;
                },
                type: "text",
                inputMode: "numeric",
                maxLength: 1,
                value: digit,
                onChange: (e) => handleCodeChange(index, e.target.value),
                onKeyDown: (e) => handleKeyDown(index, e),
                disabled: isVerifying,
                className: "w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-[#E8D4F8] bg-white text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all hover:border-[#A89CFF]/50 disabled:opacity-50 disabled:cursor-not-allowed",
                "aria-label": `Dígito ${index + 1}`
              },
              index
            )) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-[#9CA3AF]", children: "El código expira en 60 minutos" })
          ] }),
          success && /* @__PURE__ */ jsx("div", { className: "p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-green-700 text-center font-medium", children: success }) }),
          error && /* @__PURE__ */ jsx("div", { className: "p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 text-center font-medium", children: error }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: isVerifying || fullCode.length !== 6,
              className: "w-full px-6 py-3.5 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-semibold rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#A89CFF]/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none",
              children: isVerifying ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-5 w-5", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }),
                  /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                ] }),
                "Verificando..."
              ] }) : "Verificar código"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-[#E8D4F8]/50" }) }),
          /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-sm", children: /* @__PURE__ */ jsx("span", { className: "px-4 bg-white text-[#9CA3AF]", children: "¿No recibiste el código?" }) })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handleResend,
            disabled: isResending || cooldown > 0,
            className: "w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#E8D4F8] text-[#A89CFF] font-medium rounded-xl hover:bg-[#A89CFF]/5 hover:border-[#A89CFF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
            children: [
              /* @__PURE__ */ jsx(RefreshCw, { className: `w-4 h-4 ${isResending ? "animate-spin" : ""}` }),
              isResending ? "Enviando..." : cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar código"
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => window.location.href = "/auth/crear-cuenta",
            className: "text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors",
            children: "← Usar otro correo electrónico"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-8 text-center text-xs text-[#9CA3AF]", children: "Si no encuentras el correo, revisa tu carpeta de spam" })
    ] }) })
  ] });
}

const $$VerificarCodigo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#A89CFF"><title>Verificar código - Bimoora</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">${renderHead()}</head> <body class="bg-gradient-to-br from-[#E8D4F8]/20 via-white to-[#FFC8DD]/10 transition-colors duration-300"> ${renderComponent($$result, "VerifyCode", VerifyCode, { "client:load": true, "redirectTo": "/perfil", "client:component-hydration": "load", "client:component-path": "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/auth/VerifyCode", "client:component-export": "default" })} </body></html>`;
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/verificar-codigo.astro", void 0);

const $$file = "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/verificar-codigo.astro";
const $$url = "/auth/verificar-codigo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$VerificarCodigo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
