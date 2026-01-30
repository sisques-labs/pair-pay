# 💑 PairPay

**La forma más sencilla de gestionar gastos compartidos en pareja**

PairPay es una aplicación web diseñada específicamente para parejas que comparten gastos. División automática 50/50, seguimiento de balance en tiempo real, y liquidaciones sin complicaciones.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

---

## ✨ Características

### 🎯 Core Features
- **Registro de Gastos Rápido**: Añade gastos en segundos con categorías inteligentes
- **Balance Automático 50/50**: División equitativa sin calculadora
- **Liquidaciones Simples**: Salda cuentas con un clic y mantén historial
- **8 Categorías Predefinidas**: Organiza tus gastos (comida, hogar, transporte, etc.)
- **Vista de Balance Visual**: Emojis y colores para entender quién debe a quién
- **Estadísticas Completas**: Total liquidado, número de liquidaciones, última liquidación

### 🔐 Autenticación
- **Email/Password**: Registro tradicional con Supabase Auth
- **Google OAuth**: Sign in with Google para acceso rápido
- **Seguridad**: Row Level Security (RLS) policies en Supabase

### 🎨 UI/UX Premium
- **Diseño Distintivo**: Space Grotesk typography + paleta coral/teal
- **Mobile-First**: Navegación inferior en zona del pulgar
- **Touch Targets**: 44px+ cumpliendo WCAG 2.1
- **Dark Mode**: Soporte completo de modo oscuro
- **Loading States**: Skeletons profesionales
- **Toast Notifications**: Feedback visual con celebración al liquidar
- **Error Pages**: Páginas 404 y error personalizadas

### 📱 Progressive Web App
- **Responsive**: Diseño adaptado a móvil, tablet y desktop
- **Fast Loading**: Optimizado con Next.js 16 + Turbopack
- **Offline-Ready**: (próximamente)

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) via [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Backend & Database
- **BaaS**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Server Actions**: Next.js Server Actions
- **Authentication**: Supabase Auth (Email + Google OAuth)

### Development
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linting**: ESLint + TypeScript
- **Architecture**: Screaming Architecture (domain-driven)

---

## 📦 Instalación

### Pre-requisitos
- Node.js 20+
- pnpm 10+
- Cuenta de Supabase

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/pair-pay.git
cd pair-pay
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
```bash
# Copiar el template
cp .env.example .env.local

# Editar .env.local con tus credenciales de Supabase
```

Necesitas estas variables:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Configurar base de datos

**Opción A: Prisma Migrate (Recomendado)**
```bash
pnpm prisma migrate dev --name init
```

**Opción B: Push directo (Desarrollo)**
```bash
pnpm prisma db push
```

### 5. Configurar Supabase RLS
Ejecuta el SQL completo de `SUPABASE_RLS.md` en el SQL Editor de Supabase.

### 6. Ejecutar en desarrollo
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ⚙️ Configuración

### Google OAuth (Opcional)
Para habilitar "Sign in with Google", sigue la guía en [`GOOGLE_AUTH_SETUP.md`](GOOGLE_AUTH_SETUP.md).

### Supabase RLS Policies
**Crítico para producción**: Las políticas RLS protegen tus datos. Ver [`SUPABASE_RLS.md`](SUPABASE_RLS.md).

### Deployment
Guía completa de deployment en [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo (http://localhost:3000)

# Build
pnpm build        # Compila para producción
pnpm start        # Inicia servidor de producción

# Linting
pnpm lint         # Ejecuta ESLint

# Base de datos
pnpm prisma generate       # Genera Prisma Client
pnpm prisma migrate dev    # Crea y aplica migración
pnpm prisma migrate deploy # Aplica migraciones en producción
pnpm prisma studio         # Abre GUI de base de datos
pnpm prisma db push        # Push schema (solo desarrollo)
```

---

## 📁 Estructura del Proyecto

```
pair-pay/
├── app/                      # Next.js App Router
│   ├── (app)/               # Rutas protegidas con layout
│   │   ├── balance/         # Página de balance
│   │   ├── couple/          # Gestión de pareja
│   │   ├── expenses/        # CRUD de gastos
│   │   └── layout.tsx       # Layout con header y navegación
│   ├── (auth)/              # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── auth/callback/       # OAuth callback
│   ├── error.tsx            # Error boundary
│   ├── not-found.tsx        # Página 404
│   └── page.tsx             # Landing page
├── components/              # Componentes compartidos
│   ├── ui/                  # Componentes de UI (shadcn/ui)
│   └── app-header.tsx       # Header con navegación
├── features/                # Features organizadas por dominio
│   ├── auth/                # Autenticación
│   │   ├── actions.ts       # Server actions (login, register, OAuth)
│   │   ├── components/      # LoginForm, RegisterForm
│   │   └── types.ts
│   ├── balance/             # Balance y liquidaciones
│   │   ├── actions.ts       # createSettlement
│   │   ├── queries.ts       # getCoupleBalance, getSettlements
│   │   ├── components/      # BalanceCard, SettlementHistory
│   │   └── types.ts
│   ├── couple/              # Gestión de parejas
│   │   ├── actions.ts       # createCouple, joinCouple
│   │   ├── queries.ts       # getCurrentCouple
│   │   ├── components/      # CreateCoupleForm, JoinCoupleForm
│   │   └── types.ts
│   └── expenses/            # Gastos
│       ├── actions.ts       # CRUD operations
│       ├── queries.ts       # getExpenses, getExpenseById
│       ├── components/      # ExpenseForm, ExpenseList, ExpenseCard
│       └── types.ts
├── lib/                     # Utilidades y configuración
│   ├── constants/           # Categorías, etc.
│   ├── prisma/              # Cliente de Prisma
│   ├── supabase/            # Clientes de Supabase
│   └── utils/               # Helpers (format, etc.)
├── prisma/                  # Schema y migraciones
│   └── schema.prisma
├── public/                  # Archivos estáticos
├── .env.example             # Template de variables de entorno
├── CLAUDE.md                # Instrucciones para Claude Code
├── DEPLOYMENT.md            # Guía de deployment
├── GOOGLE_AUTH_SETUP.md     # Setup de Google OAuth
├── SUPABASE_RLS.md          # Políticas de seguridad RLS
└── vercel.json              # Configuración de Vercel
```

### Arquitectura: Screaming Architecture
El proyecto usa una arquitectura "domain-driven" donde cada feature tiene:
- `actions.ts` - Server Actions para mutaciones
- `queries.ts` - Funciones para leer datos
- `components/` - Componentes de UI específicos
- `types.ts` - Tipos de TypeScript

---

## 🗃️ Base de Datos

### Modelos Prisma

```prisma
Profile    // Usuario con referencia a Supabase Auth
Couple     // Pareja con código de invitación
Expense    // Gasto compartido (50/50)
Settlement // Liquidación de balance
```

### Relaciones
- Un `Profile` pertenece a un `Couple`
- Un `Couple` tiene muchos `Expenses` y `Settlements`
- Un `Expense` es creado por un `Profile` y pagado por un `Profile`
- Un `Settlement` registra pago de `Profile` a `Profile`

---

## 🔐 Seguridad

### Row Level Security (RLS)
Todas las tablas tienen RLS habilitado. Los usuarios solo pueden:
- Ver datos de su propia pareja
- Editar/eliminar sus propios gastos
- Crear liquidaciones en su pareja

Ver políticas completas en [`SUPABASE_RLS.md`](SUPABASE_RLS.md).

### Autenticación
- Contraseñas hasheadas por Supabase
- Tokens JWT para sesiones
- OAuth 2.0 para Google Sign In
- Middleware de Next.js valida todas las rutas

---

## 🚢 Deployment

### Deploy en Vercel (Recomendado)

1. **Push a GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Conectar en Vercel**
   - Importa el repo en [vercel.com](https://vercel.com)
   - Configura variables de entorno
   - Deploy automático

3. **Variables de Entorno en Vercel**
```
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL (tu dominio de producción)
```

Ver guía completa en [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 📱 Uso

### Flujo de Usuario

1. **Registro/Login**
   - Email/password o Google OAuth
   - Perfil creado automáticamente (trigger de Supabase)

2. **Crear o Unirse a Pareja**
   - Usuario 1 crea pareja → recibe código de invitación
   - Usuario 2 usa código para unirse

3. **Añadir Gastos**
   - Describe el gasto
   - Selecciona categoría
   - Elige quién pagó
   - Añade notas opcionales

4. **Ver Balance**
   - Balance calculado automáticamente
   - Desglose individual de cada persona
   - Visualización clara de quién debe a quién

5. **Liquidar**
   - Botón para marcar balance como pagado
   - Añadir notas del método de pago
   - Ver historial de liquidaciones

---

## 🎨 Personalización

### Colores
Los colores de marca están en `app/globals.css`:
```css
--primary: oklch(0.62 0.18 25);    /* Coral/rose */
--accent: oklch(0.55 0.12 180);    /* Teal */
```

### Categorías
Edita las categorías en `lib/constants/categories.ts`.

### Fuentes
Configuradas en `app/layout.tsx`:
- Space Grotesk (sans)
- JetBrains Mono (mono)

---

## 🧪 Testing (Próximamente)

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Documentación Adicional

- [`CLAUDE.md`](CLAUDE.md) - Instrucciones para Claude Code
- [`DEPLOYMENT.md`](DEPLOYMENT.md) - Guía de deployment
- [`GOOGLE_AUTH_SETUP.md`](GOOGLE_AUTH_SETUP.md) - Configuración de Google OAuth
- [`SUPABASE_RLS.md`](SUPABASE_RLS.md) - Políticas de seguridad
- [`MVP.md`](MVP.md) - Especificación del MVP
- [`ESTRUCTURA.md`](ESTRUCTURA.md) - Estructura del proyecto

---

## 🐛 Troubleshooting

### Error: "Cannot read properties of null"
**Solución**: Verifica que RLS policies estén configuradas.

### Error: "Invalid auth token"
**Solución**: Verifica variables de Supabase en `.env.local`.

### Build falla
**Solución**: Ejecuta `pnpm prisma generate` antes del build.

Ver más en [`DEPLOYMENT.md`](DEPLOYMENT.md#-troubleshooting).

---

## 🗺️ Roadmap

### v1.0 (MVP) ✅
- [x] Autenticación (Email + Google)
- [x] Gestión de parejas
- [x] CRUD de gastos
- [x] Balance automático 50/50
- [x] Liquidaciones
- [x] UI/UX premium
- [x] Mobile-first design

### v1.1 (Próximamente)
- [ ] Filtros y búsqueda de gastos
- [ ] Exportar a CSV/PDF
- [ ] Gráficos de gastos por categoría
- [ ] Notificaciones push
- [ ] Modo offline (PWA)

### v2.0 (Futuro)
- [ ] División personalizable (no solo 50/50)
- [ ] Múltiples parejas/grupos
- [ ] Categorías personalizadas
- [ ] Presupuestos mensuales
- [ ] Integración con bancos

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [GitHub](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [Supabase](https://supabase.com/) por el backend
- [shadcn/ui](https://ui.shadcn.com/) por los componentes
- [Vercel](https://vercel.com/) por el hosting
- Comunidad de desarrolladores

---

## 📞 Soporte

¿Problemas o preguntas?
- 🐛 [Reportar bug](https://github.com/tu-usuario/pair-pay/issues)
- 💡 [Solicitar feature](https://github.com/tu-usuario/pair-pay/issues)
- 📧 Email: tu-email@example.com

---

<div align="center">

**¡Hecho con ❤️ para parejas que comparten gastos!**

[⬆ Volver arriba](#-pairpay)

</div>
