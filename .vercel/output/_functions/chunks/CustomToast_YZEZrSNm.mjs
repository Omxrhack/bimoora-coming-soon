import { jsx, jsxs } from 'react/jsx-runtime';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { s as supabase } from './supabase_D7K0YZcd.mjs';
import { X, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#A89CFF]/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white shadow-lg shadow-[#A89CFF]/25 hover:opacity-90",
        destructive: "bg-red-500 text-white shadow-sm hover:bg-red-500/90",
        outline: "border border-[#E8D4F8] bg-transparent hover:bg-[#E8D4F8]/10 text-[#1E1B4B]",
        secondary: "bg-[#E8D4F8] text-[#1E1B4B] shadow-sm hover:bg-[#E8D4F8]/80",
        ghost: "hover:bg-[#E8D4F8]/20 text-[#1E1B4B]",
        link: "text-[#A89CFF] underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

const authService = {
  /**
   * Registrar un nuevo usuario
   * NOTA: No envía email de confirmación automático. El OTP se envía manualmente después.
   */
  async register(data) {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: {
            full_name: data.full_name || ""
          }
          // No incluir emailRedirectTo para evitar que Supabase envíe email de confirmación
          // con magic link. El template de OTP se manejará con signInWithOtp.
        }
      });
      if (error) {
        return {
          success: false,
          message: "Error al registrar usuario",
          error: error.message
        };
      }
      if (authData.user && !authData.session) {
        return {
          success: true,
          message: "Por favor, revisa tu correo para confirmar tu cuenta.",
          user: {
            id: authData.user.id,
            email: authData.user.email,
            full_name: authData.user.user_metadata?.full_name,
            created_at: authData.user.created_at
          }
        };
      }
      return {
        success: true,
        message: "¡Registro exitoso!",
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
          full_name: authData.user.user_metadata?.full_name,
          created_at: authData.user.created_at
        } : null
      };
    } catch (error) {
      return {
        success: false,
        message: "Error inesperado al registrar",
        error: String(error)
      };
    }
  },
  /**
   * Iniciar sesión con email y contraseña
   */
  async login(data) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      if (error) {
        let friendlyMessage = "Error al iniciar sesión";
        if (error.message.includes("Invalid login credentials")) {
          friendlyMessage = "Email o contraseña incorrectos";
        } else if (error.message.includes("Email not confirmed")) {
          friendlyMessage = "Por favor, confirma tu email antes de iniciar sesión";
        }
        return {
          success: false,
          message: friendlyMessage,
          error: error.message
        };
      }
      return {
        success: true,
        message: "¡Bienvenido de nuevo!",
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
          full_name: authData.user.user_metadata?.full_name,
          created_at: authData.user.created_at
        } : null
      };
    } catch (error) {
      return {
        success: false,
        message: "Error inesperado al iniciar sesión",
        error: String(error)
      };
    }
  },
  /**
   * Iniciar sesión con proveedor OAuth (Google, GitHub, Apple)
   */
  async loginWithOAuth(provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        return {
          success: false,
          message: `Error al conectar con ${provider}`,
          error: error.message
        };
      }
      return {
        success: true,
        message: `Redirigiendo a ${provider}...`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error inesperado con ${provider}`,
        error: String(error)
      };
    }
  },
  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return {
          success: false,
          message: "Error al cerrar sesión",
          error: error.message
        };
      }
      return {
        success: true,
        message: "Sesión cerrada correctamente"
      };
    } catch (error) {
      return {
        success: false,
        message: "Error inesperado al cerrar sesión",
        error: String(error)
      };
    }
  },
  /**
   * Obtener usuario actual
   */
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at
      };
    } catch {
      return null;
    }
  },
  /**
   * Recuperar contraseña
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) {
        return {
          success: false,
          message: "Error al enviar email de recuperación",
          error: error.message
        };
      }
      return {
        success: true,
        message: "Te hemos enviado un enlace para restablecer tu contraseña"
      };
    } catch (error) {
      return {
        success: false,
        message: "Error inesperado",
        error: String(error)
      };
    }
  },
  /**
   * Actualizar contraseña
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) {
        return {
          success: false,
          message: "Error al actualizar contraseña",
          error: error.message
        };
      }
      return {
        success: true,
        message: "Contraseña actualizada correctamente"
      };
    } catch (error) {
      return {
        success: false,
        message: "Error inesperado",
        error: String(error)
      };
    }
  },
  /**
   * Escuchar cambios en la sesión
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at
        });
      } else {
        callback(null);
      }
    });
  }
};

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
    const { data: { subscription } } = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
      setIsLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const register = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authService.register(data);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  const login = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authService.login(data);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  const loginWithOAuth = useCallback(async (provider) => {
    setIsSubmitting(true);
    try {
      const response = await authService.loginWithOAuth(provider);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  const logout = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await authService.logout();
      if (response.success) {
        setUser(null);
      }
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  const resetPassword = useCallback(async (email) => {
    setIsSubmitting(true);
    try {
      const response = await authService.resetPassword(email);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  const updatePassword = useCallback(async (newPassword) => {
    setIsSubmitting(true);
    try {
      const response = await authService.updatePassword(newPassword);
      return response;
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  return {
    // Estado
    user,
    isLoading,
    isSubmitting,
    isAuthenticated: !!user,
    // Acciones
    register,
    login,
    loginWithOAuth,
    logout,
    resetPassword,
    updatePassword
  };
};

const ToastContext = createContext(void 0);
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
const toastStyles = {
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "text-emerald-600",
    iconBg: "bg-emerald-100"
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    iconBg: "bg-red-100"
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-600",
    iconBg: "bg-amber-100"
  },
  info: {
    bg: "bg-[#A89CFF]/10",
    border: "border-[#A89CFF]/30",
    icon: "text-[#A89CFF]",
    iconBg: "bg-[#A89CFF]/20"
  }
};
const ToastIcon = ({ type, className }) => {
  const iconProps = { className: `w-5 h-5 ${className}`, strokeWidth: 2 };
  switch (type) {
    case "success":
      return /* @__PURE__ */ jsx(CheckCircle, { ...iconProps });
    case "error":
      return /* @__PURE__ */ jsx(AlertCircle, { ...iconProps });
    case "warning":
      return /* @__PURE__ */ jsx(AlertTriangle, { ...iconProps });
    case "info":
      return /* @__PURE__ */ jsx(Info, { ...iconProps });
  }
};
const ToastItem = ({ toast: toast2, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const styles = toastStyles[toast2.type];
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const duration = toast2.duration || 4e3;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast2.duration]);
  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast2.id);
    }, 300);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${styles.bg} ${styles.border}
        border rounded-xl shadow-lg shadow-black/5 p-4 min-w-[320px] max-w-[420px]
        flex items-start gap-3
      `,
      children: [
        /* @__PURE__ */ jsx("div", { className: `${styles.iconBg} p-2 rounded-lg flex-shrink-0`, children: /* @__PURE__ */ jsx(ToastIcon, { type: toast2.type, className: styles.icon }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-[#1E1B4B] text-sm", children: toast2.title }),
          toast2.message && /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm mt-0.5 leading-relaxed", children: toast2.message })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleClose,
            className: "flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors",
            "aria-label": "Cerrar",
            children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4 text-[#6B7280]" })
          }
        )
      ]
    }
  );
};
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((type, title, message, duration) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, type, title, message, duration };
    setToasts((prev) => [...prev, newToast]);
  }, []);
  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast2) => toast2.id !== id));
  }, []);
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value: { toasts, showToast, hideToast }, children: [
    children,
    /* @__PURE__ */ jsx("div", { className: "fixed top-4 right-4 z-[9999] flex flex-col gap-3", children: toasts.map((toast2) => /* @__PURE__ */ jsx(ToastItem, { toast: toast2, onClose: hideToast }, toast2.id)) })
  ] });
};

export { Button as B, ToastProvider as T, useToast as a, cn as c, useAuth as u };
