import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Tipos de toast
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

// Contexto para los toasts
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook para usar los toasts
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Colores según el tipo
const toastStyles: Record<ToastType, { bg: string; border: string; icon: string; iconBg: string }> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    iconBg: 'bg-red-100',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
  info: {
    bg: 'bg-[#A89CFF]/10',
    border: 'border-[#A89CFF]/30',
    icon: 'text-[#A89CFF]',
    iconBg: 'bg-[#A89CFF]/20',
  },
};

// Iconos según el tipo
const ToastIcon: React.FC<{ type: ToastType; className?: string }> = ({ type, className }) => {
  const iconProps = { className: `w-5 h-5 ${className}`, strokeWidth: 2 };
  
  switch (type) {
    case 'success':
      return <CheckCircle {...iconProps} />;
    case 'error':
      return <AlertCircle {...iconProps} />;
    case 'warning':
      return <AlertTriangle {...iconProps} />;
    case 'info':
      return <Info {...iconProps} />;
  }
};

// Componente individual de Toast
const ToastItem: React.FC<{ toast: Toast; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const styles = toastStyles[toast.type];

  useEffect(() => {
    // Animación de entrada
    requestAnimationFrame(() => setIsVisible(true));

    // Auto-cerrar después del tiempo especificado
    const duration = toast.duration || 4000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${styles.bg} ${styles.border}
        border rounded-xl shadow-lg shadow-black/5 p-4 min-w-[320px] max-w-[420px]
        flex items-start gap-3
      `}
    >
      {/* Icono */}
      <div className={`${styles.iconBg} p-2 rounded-lg flex-shrink-0`}>
        <ToastIcon type={toast.type} className={styles.icon} />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[#1E1B4B] text-sm">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-[#6B7280] text-sm mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>

      {/* Botón cerrar */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4 text-[#6B7280]" />
      </button>
    </div>
  );
};

// Provider de Toasts
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message?: string, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { id, type, title, message, duration };
    
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      
      {/* Container de toasts */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={hideToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Helper functions para usar sin el hook (para casos simples)
let globalShowToast: ToastContextType['showToast'] | null = null;

export const setGlobalToast = (showToast: ToastContextType['showToast']) => {
  globalShowToast = showToast;
};

export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    globalShowToast?.('success', title, message, duration);
  },
  error: (title: string, message?: string, duration?: number) => {
    globalShowToast?.('error', title, message, duration);
  },
  warning: (title: string, message?: string, duration?: number) => {
    globalShowToast?.('warning', title, message, duration);
  },
  info: (title: string, message?: string, duration?: number) => {
    globalShowToast?.('info', title, message, duration);
  },
};
