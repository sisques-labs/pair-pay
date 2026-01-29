# Estructura del Proyecto PairPay

## 📁 Estructura Creada

```
pair-pay/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Grupo de rutas de autenticación
│   │   ├── login/                 # Página de login
│   │   └── register/              # Página de registro
│   ├── (app)/                     # Grupo de rutas protegidas
│   │   ├── expenses/              # Gestión de gastos
│   │   │   ├── [id]/              # Detalle de gasto
│   │   │   ├── new/               # Crear gasto
│   │   │   └── page.tsx           # Lista de gastos
│   │   ├── balance/               # Balance y liquidaciones
│   │   │   └── page.tsx
│   │   └── couple/                # Gestión de pareja
│   │       ├── create/            # Crear pareja
│   │       └── join/              # Unirse a pareja
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Estilos globales
│
├── features/                      # Screaming Architecture - Features por dominio
│   ├── auth/                      # Feature: Autenticación
│   │   ├── actions.ts             # Server Actions (login, register, logout)
│   │   ├── types.ts               # Types del dominio
│   │   └── components/            # Componentes UI del feature
│   ├── couple/                    # Feature: Gestión de pareja
│   │   ├── actions.ts             # Server Actions (create, join)
│   │   ├── types.ts               # Types del dominio
│   │   └── components/            # Componentes UI
│   ├── expenses/                  # Feature: Gastos
│   │   ├── actions.ts             # Server Actions (create, update, delete)
│   │   ├── queries.ts             # Database queries (get expenses)
│   │   ├── types.ts               # Types del dominio
│   │   └── components/            # Componentes UI
│   └── balance/                   # Feature: Balance y liquidaciones
│       ├── actions.ts             # Server Actions (create settlement)
│       ├── queries.ts             # Database queries (get balance)
│       ├── types.ts               # Types del dominio
│       └── components/            # Componentes UI
│
├── lib/                           # Utilidades y configuración
│   ├── prisma/
│   │   └── client.ts              # Singleton de Prisma Client
│   ├── supabase/
│   │   ├── client.ts              # Cliente Supabase (browser)
│   │   ├── server.ts              # Cliente Supabase (server)
│   │   └── middleware.ts          # Auth middleware
│   ├── constants/
│   │   └── categories.ts          # Categorías de gastos
│   └── utils/
│       ├── cn.ts                  # Utilidad para clases CSS
│       └── format.ts              # Formateo de moneda, fechas, etc.
│
├── components/
│   └── ui/                        # Componentes UI reutilizables
│
├── prisma/
│   └── schema.prisma              # Schema de base de datos
│
├── middleware.ts                  # Next.js middleware (auth)
├── .env.example                   # Template de variables de entorno
├── CLAUDE.md                      # Guía para Claude Code
├── MVP.md                         # Especificación del MVP
├── SETUP.md                       # Guía de setup
└── package.json                   # Dependencias y scripts

```

## ✅ Archivos Core Creados

### 1. **Base de Datos (Prisma)**
- ✅ `prisma/schema.prisma` - Schema con 4 modelos (Profile, Couple, Expense, Settlement)
- ✅ `lib/prisma/client.ts` - Singleton de Prisma Client

### 2. **Autenticación (Supabase)**
- ✅ `lib/supabase/client.ts` - Cliente browser
- ✅ `lib/supabase/server.ts` - Cliente server (Next.js 15+ compatible)
- ✅ `lib/supabase/middleware.ts` - Lógica de auth
- ✅ `middleware.ts` - Next.js middleware

### 3. **Features (Lógica de negocio)**

#### Auth Feature
- ✅ `features/auth/types.ts`
- ✅ `features/auth/actions.ts` (login, register, logout, getCurrentUser)

#### Couple Feature
- ✅ `features/couple/types.ts`
- ✅ `features/couple/actions.ts` (createCouple, joinCouple, getCurrentCouple)

#### Expenses Feature
- ✅ `features/expenses/types.ts`
- ✅ `features/expenses/actions.ts` (createExpense, updateExpense, deleteExpense)
- ✅ `features/expenses/queries.ts` (getExpenses, getExpenseById)

#### Balance Feature
- ✅ `features/balance/types.ts`
- ✅ `features/balance/actions.ts` (createSettlement)
- ✅ `features/balance/queries.ts` (getCoupleBalance, getSettlements)

### 4. **Utilidades**
- ✅ `lib/utils/format.ts` (formatCurrency, formatDate, generateInvitationCode)
- ✅ `lib/utils/cn.ts` (class names utility)
- ✅ `lib/constants/categories.ts` (8 categorías predefinidas)

### 5. **Configuración**
- ✅ `.env.example` - Template de variables
- ✅ `.gitignore` - Actualizado con .env.local
- ✅ `package.json` - Scripts de Prisma añadidos

### 6. **Documentación**
- ✅ `CLAUDE.md` - Info para Claude Code
- ✅ `MVP.md` - Especificación completa del producto
- ✅ `SETUP.md` - Guía paso a paso de setup

## 🚀 Siguientes Pasos

### 1. Instalar Dependencias
```bash
pnpm add @prisma/client @supabase/supabase-js @supabase/ssr clsx tailwind-merge
pnpm add -D prisma
```

### 2. Configurar Supabase
1. Crear proyecto en https://app.supabase.com
2. Copiar `.env.example` a `.env.local`
3. Completar con las credenciales de Supabase

### 3. Configurar Base de Datos
```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Crear Componentes UI
Ahora necesitas crear los componentes UI en:
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/(app)/expenses/page.tsx`
- `app/(app)/expenses/new/page.tsx`
- `app/(app)/expenses/[id]/page.tsx`
- `app/(app)/balance/page.tsx`
- `app/(app)/couple/create/page.tsx`
- `app/(app)/couple/join/page.tsx`

Y los componentes reutilizables en cada feature:
- `features/auth/components/` (LoginForm, RegisterForm)
- `features/expenses/components/` (ExpenseForm, ExpenseList, ExpenseCard)
- `features/balance/components/` (BalanceCard, SettlementHistory)
- `features/couple/components/` (CreateCoupleForm, JoinCoupleForm)

## 📊 Arquitectura

### Screaming Architecture
La estructura del proyecto "grita" su dominio de negocio:
- **auth** - Todo relacionado con autenticación
- **couple** - Gestión de parejas
- **expenses** - Gestión de gastos
- **balance** - Balance y liquidaciones

Cada feature tiene:
- `types.ts` - Tipos TypeScript del dominio
- `actions.ts` - Server Actions (mutaciones)
- `queries.ts` - Database queries (lecturas) *opcional*
- `components/` - Componentes UI específicos del feature

### Flujo de Datos
1. **UI Component** → llama a → **Server Action**
2. **Server Action** → usa → **Prisma Client** → **Supabase DB**
3. **Server Action** → retorna → **Result** → **UI actualiza**

### Autenticación
- **Supabase Auth** maneja usuarios
- **Middleware** protege rutas
- **Server Actions** validan permisos
- **RLS (Row Level Security)** en DB

## 🎯 Estado Actual

✅ Estructura completa creada
✅ Toda la lógica de backend implementada
✅ Types y validaciones definidas
⏳ Falta: Componentes UI (páginas y formularios)
⏳ Falta: Configurar Supabase proyecto
⏳ Falta: Aplicar schema a la base de datos
