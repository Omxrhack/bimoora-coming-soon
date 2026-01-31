import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_3KTu2lbS.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_BtqFKKLW.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useCallback } from 'react';
import { s as sendOtp } from '../../chunks/authOtp_9o-8vdWt.mjs';
import { ArrowLeft, Mail } from 'lucide-react';
export { renderers } from '../../renderers.mjs';

function RequestCode({
  isSignupMode = false,
  redirectTo = "/auth/verificar-codigo"
}) {
  const [email, setEmail] = useState("");
  const [isSignup, setIsSignup] = useState(isSignupMode);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const isSubmittingRef = useRef(false);
  useEffect(() => {
    const savedCooldown = sessionStorage.getItem("req_otp_cooldown");
    const savedTime = sessionStorage.getItem("req_otp_cooldown_timestamp");
    if (savedCooldown && savedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTime)) / 1e3);
      const remaining = parseInt(savedCooldown) - elapsed;
      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        sessionStorage.removeItem("req_otp_cooldown");
        sessionStorage.removeItem("req_otp_cooldown_timestamp");
      }
    }
  }, []);
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sessionStorage.removeItem("req_otp_cooldown");
          sessionStorage.removeItem("req_otp_cooldown_timestamp");
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(timer);
  }, [cooldown]);
  const startCooldown = (seconds) => {
    setCooldown(seconds);
    sessionStorage.setItem("req_otp_cooldown", seconds.toString());
    sessionStorage.setItem("req_otp_cooldown_timestamp", Date.now().toString());
  };
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSubmittingRef.current || isLoading || cooldown > 0) {
      console.log("[RequestCode] Submit blocked: already submitting, loading, or cooldown active");
      return;
    }
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Ingresa un email válido");
      return;
    }
    isSubmittingRef.current = true;
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    console.log("[RequestCode] Calling sendOtp for:", trimmedEmail, "isSignup:", isSignup);
    const result = await sendOtp(trimmedEmail, isSignup);
    setIsLoading(false);
    isSubmittingRef.current = false;
    if (result.error) {
      const msg = result.error.message || "";
      if (result.isRateLimited || msg.includes("rate") || msg.includes("limit")) {
        const waitTime = result.retryAfterSeconds || 60;
        setError(`Demasiados intentos. Espera ${waitTime} segundos.`);
        startCooldown(waitTime);
      } else {
        if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("no user")) {
          setError("No existe una cuenta con este email. ¿Quieres registrarte?");
        } else {
          setError(msg || "No se pudo enviar el código.");
        }
      }
    } else {
      setSuccess("¡Código enviado! Revisa tu correo electrónico.");
      setTimeout(() => {
        const type = isSignup ? "signup" : "email";
        window.location.href = `${redirectTo}?email=${encodeURIComponent(trimmedEmail)}&type=${type}`;
      }, 1500);
    }
  }, [email, isSignup, isLoading, cooldown, redirectTo]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#E8D4F8]/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse", style: { animationDuration: "4s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#A89CFF]/20 rounded-full blur-3xl translate-y-1/2 animate-pulse", style: { animationDuration: "4s", animationDelay: "1s" } }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFC8DD]/15 rounded-full blur-3xl animate-pulse", style: { animationDuration: "4s", animationDelay: "2s" } }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-[#FDFBFF]/80 backdrop-blur-sm relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mx-auto", children: [
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/",
          className: "inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors mb-8",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Volver al inicio"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "bg-white/80 backdrop-blur-md rounded-2xl shadow-xl shadow-[#A89CFF]/10 p-8 border border-[#E8D4F8]/30", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A89CFF]/20 to-[#E8D4F8]/20 mb-4", children: /* @__PURE__ */ jsx(Mail, { className: "w-7 h-7 text-[#A89CFF]" }) }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#1E1B4B] mb-2", children: isSignup ? "Crear cuenta" : "Iniciar sesión" }),
          /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: "Te enviaremos un código de 6 dígitos a tu correo" })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "email",
                className: "block text-sm font-medium text-[#1E1B4B] mb-2",
                children: "Correo electrónico"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "email",
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                required: true,
                disabled: isLoading,
                placeholder: "tu@email.com",
                className: "w-full px-4 py-3 rounded-xl border border-[#E8D4F8] bg-white text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: isSignup,
                onChange: (e) => setIsSignup(e.target.checked),
                disabled: isLoading,
                className: "w-4 h-4 rounded border-[#E8D4F8] text-[#A89CFF] focus:ring-[#A89CFF]/50"
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-[#6B7280]", children: "Crear cuenta nueva (registro)" })
          ] }),
          success && /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-green-700 text-center font-medium", children: success }) }),
          error && /* @__PURE__ */ jsx("div", { className: "p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 text-center font-medium", children: error }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: isLoading || !email.trim() || cooldown > 0,
              className: "w-full px-6 py-3.5 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-semibold rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              children: isLoading ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-5 w-5", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }),
                  /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                ] }),
                "Enviando..."
              ] }) : cooldown > 0 ? `Espera ${cooldown}s` : "Enviar código"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-center text-sm text-[#6B7280]", children: isSignup ? /* @__PURE__ */ jsxs(Fragment, { children: [
          "¿Ya tienes cuenta?",
          " ",
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsSignup(false),
              className: "text-[#A89CFF] hover:underline font-medium",
              children: "Iniciar sesión"
            }
          )
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          "¿No tienes cuenta?",
          " ",
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsSignup(true),
              className: "text-[#A89CFF] hover:underline font-medium",
              children: "Registrarse"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsx(
          "a",
          {
            href: "/auth/acceder",
            className: "text-sm text-[#6B7280] hover:text-[#A89CFF] transition-colors",
            children: "O inicia sesión con contraseña"
          }
        ) })
      ] })
    ] }) })
  ] });
}

const $$SolicitarCodigo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Iniciar sesi\xF3n - Bimoora" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center py-12 px-4"> ${renderComponent($$result2, "RequestCode", RequestCode, { "client:load": true, "redirectTo": "/auth/verificar-codigo", "client:component-hydration": "load", "client:component-path": "/Users/omarbermejo/dev/bimoora-comming-soon/src/components/auth/RequestCode", "client:component-export": "default" })} </div> ` })}`;
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/solicitar-codigo.astro", void 0);

const $$file = "/Users/omarbermejo/dev/bimoora-comming-soon/src/pages/auth/solicitar-codigo.astro";
const $$url = "/auth/solicitar-codigo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$SolicitarCodigo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
