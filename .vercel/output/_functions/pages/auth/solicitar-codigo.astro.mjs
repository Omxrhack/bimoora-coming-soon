import { e as createComponent, g as addAttribute, l as renderHead, n as renderSlot, r as renderTemplate, h as createAstro, k as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_D13BJ9Xf.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                               */
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { r as requestOtp } from '../../chunks/authOtp_Colyiny7.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"${addAttribute(Astro2.generator, "content")}><meta name="theme-color" content="#A89CFF"><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">${renderHead()}</head> <body class="bg-gradient-to-br from-[#E8D4F8]/20 via-white to-[#FFC8DD]/10 transition-colors duration-300"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/omarbermejo/dev/bimoora-comming-soon/src/layouts/Layout.astro", void 0);

function RequestCode({
  isSignupMode = false,
  redirectTo = "/auth/verificar-codigo"
}) {
  const [email, setEmail] = useState("");
  const [isSignup, setIsSignup] = useState(isSignupMode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const trimmedEmail = email.trim().toLowerCase();
    const { error: otpError } = await requestOtp(trimmedEmail, isSignup);
    setLoading(false);
    if (otpError) {
      const msg = otpError?.message || "No se pudo enviar el código.";
      if (msg.toLowerCase().includes("rate") || msg.toLowerCase().includes("limit")) {
        setError("Demasiados intentos. Por favor espera unos minutos e intenta de nuevo.");
      } else if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("no user")) {
        setError("No existe una cuenta con este email. ¿Quieres registrarte?");
      } else {
        setError(msg);
      }
    } else {
      setMessage("¡Código enviado! Revisa tu correo electrónico.");
      setTimeout(() => {
        window.location.href = `${redirectTo}?email=${encodeURIComponent(trimmedEmail)}`;
      }, 1500);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-md mx-auto p-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl p-8 border border-[#E8D4F8]/30", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#1E1B4B] mb-2 text-center", children: isSignup ? "Crear cuenta" : "Iniciar sesión" }),
    /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-center mb-6", children: "Te enviaremos un código de 6 dígitos a tu correo" }),
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
            placeholder: "tu@email.com",
            className: "w-full px-4 py-3 rounded-xl border border-[#E8D4F8] bg-white text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all"
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
            className: "w-4 h-4 rounded border-[#E8D4F8] text-[#A89CFF] focus:ring-[#A89CFF]/50"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#6B7280]", children: "Crear cuenta nueva (registro)" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading || !email.trim(),
          className: "w-full px-6 py-3 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white font-semibold rounded-xl shadow-lg shadow-[#A89CFF]/25 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          children: loading ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-5 w-5", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }),
              /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
            ] }),
            "Enviando..."
          ] }) : "Enviar código"
        }
      )
    ] }),
    message && /* @__PURE__ */ jsx("div", { className: "mt-4 p-3 bg-green-100 border border-green-200 rounded-xl", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-green-700 text-center", children: message }) }),
    error && /* @__PURE__ */ jsx("div", { className: "mt-4 p-3 bg-red-100 border border-red-200 rounded-xl", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700 text-center", children: error }) }),
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
    ] }) })
  ] }) });
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
