# Configuración de Google OAuth en PairPay

Esta guía explica cómo configurar la autenticación con Google en tu aplicación PairPay.

## 📋 Pre-requisitos

- Proyecto de Supabase configurado
- Cuenta de Google Cloud Platform
- PairPay instalado localmente

## 🔧 Configuración en Google Cloud Platform

### 1. Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID**

### 2. Habilitar Google+ API

1. En el menú lateral, ve a **APIs & Services** → **Library**
2. Busca "Google+ API"
3. Haz clic en **Enable**

### 3. Configurar Pantalla de Consentimiento OAuth

1. Ve a **APIs & Services** → **OAuth consent screen**
2. Selecciona **External** y haz clic en **Create**
3. Completa la información:
   - **App name**: PairPay
   - **User support email**: tu-email@example.com
   - **Developer contact information**: tu-email@example.com
4. En **Scopes**, añade estos scopes:
   - `openid`
   - `email`
   - `profile`
5. Guarda y continúa

### 4. Crear Credenciales OAuth

1. Ve a **APIs & Services** → **Credentials**
2. Haz clic en **Create Credentials** → **OAuth client ID**
3. Selecciona **Web application**
4. Completa:
   - **Name**: PairPay Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **Authorized redirect URIs**:
     - `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
     
   ⚠️ **Importante**: Reemplaza `[YOUR-PROJECT-REF]` con tu Project Ref de Supabase
   
5. Haz clic en **Create**
6. Copia el **Client ID** y **Client Secret**

## 🔐 Configuración en Supabase

### 1. Habilitar Google Provider

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Authentication** → **Providers**
3. Encuentra **Google** en la lista
4. Haz clic para expandir y **habilítalo**
5. Pega el **Client ID** y **Client Secret** de Google Cloud
6. Guarda los cambios

### 2. Configurar Redirect URLs

1. En Supabase Dashboard, ve a **Authentication** → **URL Configuration**
2. Añade tus URLs:
   - **Site URL**: `http://localhost:3000` (desarrollo) o `https://tu-dominio.com` (producción)
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - `https://tu-dominio.com/auth/callback`

## 🌐 Configuración en tu Aplicación

### 1. Variables de Entorno

Asegúrate de que tu `.env.local` tenga:

```bash
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 2. Verificar Rutas

El proyecto ya tiene estas rutas configuradas:
- ✅ `/auth/callback/route.ts` - Maneja el callback de OAuth
- ✅ Login form con botón de Google
- ✅ Register form con botón de Google

## ✅ Probar la Autenticación

### En Desarrollo:

1. Inicia tu aplicación:
```bash
pnpm dev
```

2. Ve a `http://localhost:3000/login`
3. Haz clic en "Continuar con Google"
4. Autoriza la aplicación
5. Deberías ser redirigido a `/expenses` o `/couple/create`

### Verificar en Supabase:

1. Ve a **Authentication** → **Users** en Supabase Dashboard
2. Deberías ver tu usuario con el provider "google"

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
**Causa**: La URL de callback no está autorizada en Google Cloud
**Solución**: 
1. Verifica que la URL en Google Cloud incluya el dominio de Supabase
2. Formato correcto: `https://[PROJECT-REF].supabase.co/auth/v1/callback`

### Error: "Invalid redirect URI"
**Causa**: URL de redirect no configurada en Supabase
**Solución**: Añade la URL en Authentication → URL Configuration

### Usuario creado pero sin perfil
**Causa**: El trigger de auto-creación de perfil no está configurado
**Solución**: Ejecuta el SQL del trigger en `SUPABASE_RLS.md`

### Error: "OAuth provider not enabled"
**Causa**: Google provider no habilitado en Supabase
**Solución**: Habilita Google en Authentication → Providers

## 📝 Notas Importantes

1. **En producción**, actualiza:
   - `NEXT_PUBLIC_SITE_URL` a tu dominio real
   - Authorized redirect URIs en Google Cloud
   - Redirect URLs en Supabase

2. **Seguridad**:
   - Nunca expongas el Client Secret
   - Rota las credenciales si se comprometen
   - Revisa los usuarios regularmente

3. **Usuario existente**:
   - Si un usuario ya existe con el mismo email (email/password), Google OAuth creará un usuario separado
   - Considera implementar "account linking" si esto es un problema

## 🎉 ¡Listo!

Tus usuarios ahora pueden iniciar sesión con Google además de email/password.

## 🔄 Próximos Pasos Opcionales

- [ ] Añadir más providers (GitHub, Facebook, etc.)
- [ ] Implementar account linking
- [ ] Añadir foto de perfil de Google
- [ ] Personalizar la pantalla de consentimiento de Google
