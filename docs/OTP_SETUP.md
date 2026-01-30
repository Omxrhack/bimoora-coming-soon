# Configuración OTP Email Verification - Bimoora

## Resumen del flujo

1. Usuario ingresa email en `/auth/solicitar-codigo`
2. Supabase envía código OTP de 6 dígitos vía Resend SMTP
3. Usuario ingresa código en `/auth/verificar-codigo`
4. Si es válido, se crea sesión y redirige a `/perfil`

## Archivos creados

```
src/
├── services/
│   └── authOtp.ts          # Funciones: requestOtp, verifyOtp, getSession, signOut
├── components/auth/
│   ├── RequestCode.tsx     # Formulario de email para solicitar código
│   ├── VerifyCode.tsx      # Input de 6 dígitos para verificar
│   └── PrivateRoute.tsx    # Wrapper para rutas protegidas
├── pages/auth/
│   ├── solicitar-codigo.astro   # Página de solicitud de código
│   └── verificar-codigo.astro   # Página de verificación
└── layouts/
    └── Layout.astro        # Layout base con dark mode
```

---

## 1. Configuración de Supabase

### 1.1 Variables de entorno en Supabase Dashboard

Ve a **Settings → API** y copia:
- `Project URL` → `PUBLIC_SUPABASE_URL`
- `anon/public key` → `PUBLIC_SUPABASE_ANON_KEY`

### 1.2 Configurar SMTP con Resend

1. Crea cuenta en [resend.com](https://resend.com)
2. Verifica tu dominio en Resend
3. Genera una API Key
4. En **Supabase Dashboard → Settings → Auth → SMTP Settings**:

| Campo | Valor |
|-------|-------|
| Host | `smtp.resend.com` |
| Port | `587` |
| Username | `resend` |
| Password | `re_tu_api_key_de_resend` |
| Sender Email | `noreply@tudominio.com` |
| Sender Name | `Bimoora` |

### 1.3 Configurar Email Template para OTP

En **Supabase Dashboard → Auth → Email Templates → Magic Link**:

**Subject:**
```
Tu código de verificación Bimoora
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f6fc; margin: 0; padding: 40px 20px; }
    .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(168, 156, 255, 0.15); }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo img { height: 48px; }
    h1 { color: #1E1B4B; font-size: 24px; text-align: center; margin: 0 0 8px; }
    .subtitle { color: #6B7280; text-align: center; margin: 0 0 32px; }
    .code-box { background: linear-gradient(135deg, #E8D4F8 0%, #FFC8DD 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .code { font-size: 36px; font-weight: 700; color: #1E1B4B; letter-spacing: 8px; font-family: monospace; }
    .note { color: #9CA3AF; font-size: 14px; text-align: center; margin-top: 24px; }
    .footer { color: #9CA3AF; font-size: 12px; text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #E8D4F8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://tudominio.com/logo.png" alt="Bimoora" />
    </div>
    <h1>Tu código de verificación</h1>
    <p class="subtitle">Ingresa este código en la app para continuar</p>
    
    <div class="code-box">
      <span class="code">{{ .Token }}</span>
    </div>
    
    <p class="note">
      Este código expira en 10 minutos.<br>
      Si no solicitaste este código, ignora este correo.
    </p>
    
    <div class="footer">
      © 2024 Bimoora. Donde el amor deja memoria 💜
    </div>
  </div>
</body>
</html>
```

> ⚠️ **IMPORTANTE:** Usa `{{ .Token }}` para el código OTP, **NO** `{{ .ConfirmationURL }}`

### 1.4 Configurar Auth Settings

En **Supabase Dashboard → Auth → Settings**:

- ✅ Enable Email Signup
- ✅ Confirm Email (obligatorio para OTP)
- OTP Expiry: `600` segundos (10 minutos)
- Rate Limit Email Sent: `4` por hora

---

## 2. Variables de entorno en Vercel

En **Vercel Dashboard → Tu proyecto → Settings → Environment Variables**:

| Variable | Valor | Entornos |
|----------|-------|----------|
| `PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJI...` | Production, Preview, Development |

> El prefijo `PUBLIC_` hace que estas variables estén disponibles en el cliente (Astro las expone automáticamente).

---

## 3. Uso en la aplicación

### Flujo de autenticación

```tsx
// Solicitar código OTP
import { requestOtp } from '@/services/authOtp';

const { error } = await requestOtp('user@email.com', true); // true = crear cuenta
// El usuario recibe email con código de 6 dígitos

// Verificar código OTP
import { verifyOtp } from '@/services/authOtp';

const { data, error } = await verifyOtp('user@email.com', '123456');
// Si es válido, data.session contiene la sesión del usuario

// Obtener sesión actual
import { getSession } from '@/services/authOtp';

const { session } = await getSession();
if (session) {
  console.log('Usuario autenticado:', session.user.email);
}

// Cerrar sesión
import { signOut } from '@/services/authOtp';

await signOut();
```

### Proteger rutas

```astro
---
// src/pages/perfil.astro
import Layout from '../layouts/Layout.astro';
import PrivateRoute from '../components/auth/PrivateRoute';
import ProfileContent from '../components/profile/ProfileContent';
---

<Layout title="Mi Perfil - Bimoora">
  <PrivateRoute client:load>
    <ProfileContent client:load />
  </PrivateRoute>
</Layout>
```

---

## 4. Testing end-to-end

### Paso 1: Solicitar código
1. Ve a `/auth/solicitar-codigo`
2. Ingresa tu email
3. Marca "Crear cuenta nueva" si es primera vez
4. Click "Enviar código"

### Paso 2: Verificar código
1. Revisa tu bandeja de entrada (o spam)
2. Copia el código de 6 dígitos
3. Ingresa el código en `/auth/verificar-codigo`
4. Click "Verificar código"

### Paso 3: Verificar sesión
1. Deberías ser redirigido a `/perfil`
2. Abre DevTools → Application → Local Storage
3. Busca `sb-xxxxx-auth-token` (contiene la sesión)

### Paso 4: Probar cierre de sesión
1. En el perfil, click "Cerrar sesión"
2. Deberías ser redirigido a `/auth/solicitar-codigo`
3. La sesión en Local Storage debe eliminarse

---

## 5. Troubleshooting

### "Invalid OTP"
- El código expiró (>10 min)
- El código ya fue usado
- Typo en el código

### "Rate limit exceeded"
- Espera unos minutos
- Máximo 4 emails por hora por defecto

### No llega el email
- Revisa carpeta de spam
- Verifica configuración SMTP en Supabase
- Verifica dominio en Resend
- Revisa logs en Supabase → Logs → Auth

### Sesión no persiste
- Verifica que `persistSession: true` en supabase client
- Verifica que las cookies no estén bloqueadas
- Prueba en modo incógnito

---

## 6. Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/auth/solicitar-codigo` | Formulario para ingresar email y solicitar OTP |
| `/auth/verificar-codigo` | Input de 6 dígitos para verificar OTP |
| `/perfil` | Página protegida (requiere autenticación) |

---

## 7. Próximos pasos opcionales

- [ ] Agregar rate limiting visual (X intentos restantes)
- [ ] Implementar "recordar dispositivo" (trusted devices)
- [ ] Agregar autenticación con Google/Apple
- [ ] Implementar verificación de teléfono (SMS OTP)
- [ ] Agregar 2FA para usuarios existentes
