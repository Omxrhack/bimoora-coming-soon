import { e as createComponent, r as renderTemplate, k as renderComponent, l as renderHead, u as unescapeHTML, g as addAttribute, h as createAstro } from '../chunks/astro/server_3KTu2lbS.mjs';
import 'piccolore';
/* empty css                                            */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { a as useToast, B as Button, I as Input, T as ToastProvider, u as useAuth } from '../chunks/CustomToast_BrcIXjfe.mjs';
import { Heart, Plus, UserPlus, Users, LogOut, Check, Copy, ArrowLeft, User, Edit2, Mail, Calendar, Settings } from 'lucide-react';
import { L as LogoSinFondo } from '../chunks/bimooralogo-sinfondo_BEx_simo.mjs';
export { renderers } from '../renderers.mjs';

function CoupleSpaces() {
  const { showToast } = useToast();
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);
  useEffect(() => {
    loadSpaces();
  }, []);
  const loadSpaces = async () => {
    setIsLoading(true);
    try {
      const { getUserCoupleSpaces } = await import('../chunks/coupleSpaceService_DPxrP9If.mjs');
      const response = await getUserCoupleSpaces();
      if (response.success && response.spaces) {
        setSpaces(response.spaces);
      } else {
        showToast("error", "Error", response.error || "No se pudieron cargar los espacios");
      }
    } catch (error) {
      showToast("error", "Error", "Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };
  const handleJoinSpace = async () => {
    const trimmedCode = joinCode.trim();
    if (!trimmedCode) {
      showToast("error", "Error", "Ingresa un código de invitación");
      return;
    }
    if (trimmedCode.length < 8) return;
    setIsJoining(true);
    console.log(" [CoupleSpaces] Attempting to join with code:", trimmedCode);
    try {
      const { joinCoupleSpace } = await import('../chunks/coupleSpaceService_DPxrP9If.mjs');
      const response = await joinCoupleSpace(trimmedCode);
      console.log("[CoupleSpaces] Join response:", response);
      if (response.success && response.space) {
        console.log("[CoupleSpaces] Join Success! Space:", response.space);
        showToast("success", "¡Unido!", "Te has unido al espacio. Redirigiendo...");
        window.location.href = `/onboarding/create-space?spaceId=${response.space.id}&joined=true`;
      } else {
        console.error("[CoupleSpaces] Join Failed:", response.error);
        showToast("error", "Error", response.error || "No se pudo unir al espacio");
        setIsJoining(false);
      }
    } catch (error) {
      console.error("[CoupleSpaces] Exception:", error);
      showToast("error", "Error", "Ocurrió un error inesperado");
      setIsJoining(false);
    }
  };
  const handleCopyInviteCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      showToast("success", "Copiado", "Código copiado al portapapeles");
      setTimeout(() => setCopiedCode(null), 2e3);
    } catch (error) {
      showToast("error", "Error", "No se pudo copiar el código");
    }
  };
  const handleLeaveSpace = async (spaceId) => {
    if (!confirm("¿Estás seguro de que quieres abandonar este espacio?")) {
      return;
    }
    try {
      const { leaveCoupleSpace } = await import('../chunks/coupleSpaceService_DPxrP9If.mjs');
      const response = await leaveCoupleSpace(spaceId);
      if (response.success) {
        showToast("success", "Espacio abandonado", "Has salido del espacio");
        await loadSpaces();
      } else {
        showToast("error", "Error", response.error || "No se pudo abandonar el espacio");
      }
    } catch (error) {
      showToast("error", "Error", "Ocurrió un error inesperado");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-[#FFC8DD] to-[#FF8FAB] flex items-center justify-center", children: /* @__PURE__ */ jsx(Heart, { className: "w-6 h-6 text-white" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-[#1E1B4B]", children: "Espacios de Pareja" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-[#6B7280]", children: "Crea o únete a un espacio compartido" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E8D4F8]/50 p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-[#1E1B4B] flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5 text-[#A89CFF]" }),
        "Crear Nuevo Espacio"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-[#6B7280]", children: "Inicia un espacio compartido, invita a tu pareja y comiencen a guardar recuerdos." }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => window.location.href = "/onboarding/create-space",
          className: "w-full bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] hover:opacity-90 text-[#1E1B4B]",
          children: "Comenzar Creación"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E8D4F8]/50 p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-[#1E1B4B] flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(UserPlus, { className: "w-5 h-5 text-[#A89CFF]" }),
        "Unirse a un Espacio"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            placeholder: "Código de invitación",
            value: joinCode,
            onChange: (e) => setJoinCode(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleJoinSpace(),
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: handleJoinSpace,
            disabled: isJoining || !joinCode.trim(),
            className: "bg-gradient-to-r from-[#FF8FAB] to-[#FFC8DD] hover:opacity-90",
            children: isJoining ? "Uniéndose..." : "Unirse"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-[#1E1B4B] flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Users, { className: "w-5 h-5 text-[#A89CFF]" }),
        "Mis Espacios (",
        spaces.length,
        ")"
      ] }),
      spaces.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[#E8D4F8]/50 p-12 text-center", children: [
        /* @__PURE__ */ jsx(Heart, { className: "w-16 h-16 text-[#E8D4F8] mx-auto mb-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] mb-2", children: "Aún no tienes espacios" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-[#9CA3AF]", children: "Crea uno nuevo o únete con un código" })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: spaces.map((space) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-2xl border border-[#E8D4F8]/50 p-6 hover:border-[#A89CFF]/30 hover:shadow-md transition-all",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-[#1E1B4B] text-lg mb-1", children: space.title }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${space.status === "active" ? "bg-green-100 text-green-800" : space.status === "paused" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`,
                      children: space.status === "active" ? "Activo" : space.status === "paused" ? "Pausado" : "Cerrado"
                    }
                  ),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#9CA3AF]", children: [
                    space.members.length,
                    " de 2 miembros"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                space.status === "active" && space.members.length === 2 && /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: `/espacio/${space.id}`,
                    className: "px-4 py-2 bg-gradient-to-r from-[#FF4D6D] to-[#FF1744] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity",
                    children: "Entrar"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: () => handleLeaveSpace(space.id),
                    variant: "ghost",
                    size: "sm",
                    className: "text-red-500 hover:text-red-600 hover:bg-red-50",
                    children: /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            space.partner ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-[#FDFBFF] rounded-xl", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-[#A89CFF] to-[#E8D4F8] flex items-center justify-center text-white font-semibold", children: space.partner.username?.[0]?.toUpperCase() || "U" }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-[#1E1B4B] text-sm", children: space.partner.username || "Usuario" }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#6B7280]", children: [
                  "ID: ",
                  space.partner.id.slice(0, 8),
                  "..."
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-[#6B7280]", children: "Esperando a tu pareja. Comparte este código:" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("code", { className: "flex-1 px-4 py-2 bg-[#FDFBFF] border border-[#E8D4F8]/50 rounded-lg text-sm font-mono text-[#A89CFF]", children: space.id }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: () => handleCopyInviteCode(space.id),
                    variant: "outline",
                    size: "sm",
                    className: "border-[#E8D4F8]/50",
                    children: copiedCode === space.id ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-green-600" }) : /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] })
          ]
        },
        space.id
      )) })
    ] })
  ] });
}

function ProfileContentInner() {
  const { user, isLoading, logout } = useAuth();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/auth/acceder";
    }
  }, [isLoading, user]);
  const handleLogout = async () => {
    setIsLoggingOut(true);
    const response = await logout();
    if (response.success) {
      window.location.href = "/";
    } else {
      showToast("error", "Error", response.error || "No se pudo cerrar sesión");
      setIsLoggingOut(false);
    }
  };
  const handleEditName = () => {
    setEditedName(user?.full_name || "");
    setIsEditingName(true);
  };
  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName("");
  };
  const handleSaveName = async () => {
    const trimmedName = editedName.trim();
    if (!trimmedName) {
      showToast("error", "Error", "El nombre no puede estar vacío");
      return;
    }
    if (trimmedName.length < 2) {
      showToast("error", "Error", "El nombre debe tener al menos 2 caracteres");
      return;
    }
    if (trimmedName.length > 100) {
      showToast("error", "Error", "El nombre es demasiado largo");
      return;
    }
    setIsSavingName(true);
    try {
      const { updateUserProfile } = await import('../chunks/CustomToast_BrcIXjfe.mjs').then(n => n.b);
      const response = await updateUserProfile({ full_name: trimmedName });
      if (response.success) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        window.location.reload();
      } else {
        showToast("error", "Error", response.error || "No se pudo actualizar el nombre");
        setIsSavingName(false);
      }
    } catch (error) {
      showToast("error", "Error", "Ocurrió un error inesperado");
      setIsSavingName(false);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#FDFBFF]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: "Cargando..." })
    ] }) });
  }
  if (isSavingName) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#FDFBFF]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#1E1B4B] font-semibold text-lg", children: "Actualizando perfil..." }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm", children: "Un momento por favor" })
    ] }) });
  }
  if (isLoggingOut) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#FDFBFF]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 border-4 border-[#A89CFF] border-t-transparent rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#1E1B4B] font-semibold text-lg", children: "Cerrando sesión..." }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm", children: "Hasta pronto" })
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
          /* @__PURE__ */ jsx("div", { className: "mb-6", children: !isEditingName ? /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#1E1B4B] mb-1 transition-colors", children: user.full_name || "Usuario de Bimoora" }),
              /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm transition-colors", children: "Miembro de Bimoora" })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleEditName,
                className: "border-[#E8D4F8] text-[#A89CFF] hover:bg-[#E8D4F8]/20",
                children: [
                  /* @__PURE__ */ jsx(Edit2, { className: "w-4 h-4 mr-2" }),
                  "Editar"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-[#1E1B4B] mb-2", children: "Nombre completo" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: editedName,
                  onChange: (e) => setEditedName(e.target.value),
                  placeholder: "Tu nombre completo",
                  className: "w-full px-4 py-3 rounded-xl border-2 border-[#E8D4F8] bg-white text-[#1E1B4B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50 focus:border-[#A89CFF] transition-all",
                  autoFocus: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: handleSaveName,
                  disabled: isSavingName,
                  className: "flex-1 bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white hover:opacity-90",
                  children: isSavingName ? "Guardando..." : "Guardar"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  onClick: handleCancelEdit,
                  disabled: isSavingName,
                  className: "flex-1 border-[#E8D4F8] text-[#6B7280] hover:bg-[#E8D4F8]/20",
                  children: "Cancelar"
                }
              )
            ] })
          ] }) }),
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
      /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(CoupleSpaces, {}) })
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
