# PairPay MVP Specification

## 📋 Product Definition

**PairPay** es un gestor de gastos compartidos diseñado específicamente para parejas. Similar a Splitwise, pero simplificado para dos personas que comparten gastos regularmente.

### Propuesta de Valor
- **Simplicidad**: Registro rápido de gastos sin complicaciones
- **Transparencia**: Ambos miembros ven todos los gastos en tiempo real
- **Balance automático**: Cálculo 50/50 automático, sin configuraciones complejas
- **Historial completo**: Seguimiento de todos los gastos compartidos

## 🎯 Funcionalidades Core del MVP

### 1. Autenticación y Emparejamiento
- **Registro/Login** con email y contraseña (Supabase Auth)
- **Crear pareja**: Generar código de invitación único
- **Unirse a pareja**: Introducir código de invitación
- Un usuario solo puede pertenecer a una pareja a la vez

### 2. Gestión de Gastos
- **Crear gasto**:
  - Descripción del gasto
  - Monto
  - Categoría (predefinida)
  - Quién pagó
  - Fecha (por defecto: hoy)
  - Notas opcionales
- **Listar gastos**: Vista cronológica de todos los gastos
- **Ver detalle**: Información completa de cada gasto
- **Editar gasto**: Solo quien creó el gasto puede editarlo
- **Eliminar gasto**: Solo quien creó el gasto puede eliminarlo

### 3. Balance y Liquidación
- **Balance actual**: Cuánto debe cada uno
- **Historial de liquidaciones**: Registro de pagos de balance
- **Liquidar balance**: Registrar que se ha pagado la deuda

### 4. Categorías Predefinidas
- 🍔 Comida y Restaurantes
- 🏠 Casa y Hogar
- 🚗 Transporte
- 🎉 Ocio y Entretenimiento
- 💡 Servicios (luz, agua, internet, etc.)
- 🛒 Compras
- 🏥 Salud
- 📱 Otros

## 🏗️ Screaming Architecture

La estructura del proyecto refleja el dominio del negocio, no detalles técnicos:

```
app/
├── (auth)/                    # Grupo de rutas de autenticación
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── (app)/                     # Grupo de rutas protegidas
│   ├── expenses/              # Dominio: Gastos
│   │   ├── page.tsx           # Lista de gastos
│   │   ├── [id]/              # Detalle de gasto
│   │   └── new/               # Crear gasto
│   ├── balance/               # Dominio: Balance
│   │   └── page.tsx
│   ├── couple/                # Dominio: Pareja
│   │   ├── create/            # Crear pareja
│   │   └── join/              # Unirse a pareja
│   └── layout.tsx             # Layout con navegación
├── api/                       # API Routes si es necesario
└── layout.tsx                 # Root layout

features/
├── expenses/                  # Feature: Gestión de gastos
│   ├── components/            # Componentes UI del feature
│   ├── actions.ts             # Server Actions
│   ├── queries.ts             # Database queries
│   └── types.ts               # Types del dominio
├── balance/                   # Feature: Balance y liquidaciones
│   ├── components/
│   ├── actions.ts
│   ├── queries.ts
│   └── types.ts
├── couple/                    # Feature: Gestión de pareja
│   ├── components/
│   ├── actions.ts
│   ├── queries.ts
│   └── types.ts
└── auth/                      # Feature: Autenticación
    ├── components/
    ├── actions.ts
    └── types.ts

lib/
├── supabase/
│   ├── client.ts              # Cliente Supabase (browser)
│   ├── server.ts              # Cliente Supabase (server)
│   └── middleware.ts          # Middleware para auth
├── prisma/
│   └── client.ts              # Singleton de Prisma Client
├── utils/                     # Utilidades generales
└── constants/                 # Constantes (categorías, etc.)

prisma/
├── schema.prisma              # Schema de Prisma
└── migrations/                # Migraciones (generadas)

components/
└── ui/                        # Componentes UI reutilizables
```

## 🗄️ Modelo de Datos (Prisma + Supabase)

El esquema de la base de datos se define en `prisma/schema.prisma` con las siguientes entidades:

### Profile (Perfil de Usuario)
Extiende `auth.users` de Supabase:
- `id`: UUID (PK, referencia a auth.users)
- `email`: String
- `fullName`: String (opcional)
- `coupleId`: UUID (FK a Couple, nullable)
- `createdAt`, `updatedAt`: Timestamps

**Relaciones**:
- Pertenece a un `Couple` (opcional)
- Tiene muchos `Expense` (como pagador y como creador)
- Tiene muchos `Settlement` (desde y hacia)

### Couple (Pareja)
- `id`: UUID (PK, auto-generado)
- `invitationCode`: String (único)
- `createdBy`: UUID (FK a Profile)
- `createdAt`, `updatedAt`: Timestamps

**Relaciones**:
- Tiene muchos `Profile` (máximo 2 en lógica de negocio)
- Tiene muchos `Expense`
- Tiene muchos `Settlement`

### Expense (Gasto)
- `id`: UUID (PK, auto-generado)
- `coupleId`: UUID (FK a Couple, cascade delete)
- `description`: String
- `amount`: Decimal(10,2)
- `category`: String
- `paidBy`: UUID (FK a Profile)
- `createdBy`: UUID (FK a Profile)
- `expenseDate`: Date (default: hoy)
- `notes`: String (opcional)
- `createdAt`, `updatedAt`: Timestamps

**Relaciones**:
- Pertenece a un `Couple`
- Pertenece a un `Profile` (pagador)
- Pertenece a un `Profile` (creador)

### Settlement (Liquidación)
- `id`: UUID (PK, auto-generado)
- `coupleId`: UUID (FK a Couple, cascade delete)
- `fromUser`: UUID (FK a Profile - quien paga)
- `toUser`: UUID (FK a Profile - quien recibe)
- `amount`: Decimal(10,2)
- `settledAt`: Timestamp (default: ahora)
- `notes`: String (opcional)

**Relaciones**:
- Pertenece a un `Couple`
- Pertenece a dos `Profile` (from y to)

### Índices
Prisma crea automáticamente índices para:
- `Profile.coupleId`
- `Expense.coupleId`, `Expense.createdAt` (DESC), `Expense.expenseDate` (DESC)
- `Settlement.coupleId`, `Settlement.settledAt` (DESC)

### Row Level Security (RLS)
Las políticas de seguridad se configurarán en Supabase para:
- Usuarios solo pueden ver/editar datos de su propia pareja
- Los gastos solo pueden ser editados por quien los creó
- Las liquidaciones solo pueden ser vistas por miembros de la pareja

## 👤 User Stories

### Historia 1: Registro y creación de pareja
```
Como nuevo usuario
Quiero registrarme y crear una pareja
Para empezar a trackear gastos con mi pareja

Criterios de aceptación:
- Puedo registrarme con email y contraseña
- Después de registrarme, puedo crear una nueva pareja
- Se genera un código de invitación único
- Puedo compartir el código con mi pareja
```

### Historia 2: Unirse a una pareja existente
```
Como nuevo usuario
Quiero unirme a la pareja de mi partner
Para ver y gestionar nuestros gastos compartidos

Criterios de aceptación:
- Puedo introducir el código de invitación
- Me uno automáticamente a la pareja
- Veo todos los gastos existentes
```

### Historia 3: Registrar un gasto
```
Como usuario
Quiero registrar un gasto que he pagado
Para que quede reflejado en nuestro balance

Criterios de aceptación:
- Puedo introducir descripción, monto y categoría
- Puedo especificar quién pagó (yo o mi pareja)
- El gasto aparece inmediatamente en la lista
- El balance se actualiza automáticamente
```

### Historia 4: Ver balance actual
```
Como usuario
Quiero ver cuánto me debe mi pareja o cuánto le debo
Para saber si necesitamos liquidar

Criterios de aceptación:
- Veo claramente quién debe a quién
- Veo el monto exacto de la deuda
- Veo un resumen de gastos por categoría
```

### Historia 5: Liquidar balance
```
Como usuario
Quiero marcar que hemos liquidado el balance
Para resetear las cuentas

Criterios de aceptación:
- Puedo registrar que se pagó el balance
- El balance vuelve a 0
- Queda registrado en el historial de liquidaciones
```

## 🎨 Wireframes Básicos

### Dashboard (Lista de Gastos)
```
┌─────────────────────────────────┐
│  PairPay          [+] Nuevo     │
├─────────────────────────────────┤
│  Balance Actual                  │
│  María debe a Juan: €45.50      │
│  [Liquidar Balance]             │
├─────────────────────────────────┤
│  Gastos Recientes               │
│                                  │
│  🍔 Cena en restaurante         │
│     €50.00 · Pagó: Juan         │
│     Te debe: €25.00             │
│                                  │
│  🏠 Luz y agua                   │
│     €80.00 · Pagó: María        │
│     Debes: €40.00               │
│                                  │
│  🚗 Gasolina                     │
│     €45.00 · Pagó: Juan         │
│     Te debe: €22.50             │
└─────────────────────────────────┘
```

### Nuevo Gasto
```
┌─────────────────────────────────┐
│  ← Nuevo Gasto                   │
├─────────────────────────────────┤
│  Descripción                     │
│  [________________]              │
│                                  │
│  Monto                           │
│  [€ __________]                  │
│                                  │
│  Categoría                       │
│  [🍔 Comida ▼]                   │
│                                  │
│  Pagado por                      │
│  ⚪ María    ⚫ Juan              │
│                                  │
│  Fecha                           │
│  [29/01/2026]                    │
│                                  │
│  Notas (opcional)                │
│  [________________]              │
│                                  │
│        [Crear Gasto]             │
└─────────────────────────────────┘
```

## 🚀 Fases de Implementación

### Fase 0: Setup Inicial
```bash
# Instalar dependencias de Prisma y Supabase
pnpm add @prisma/client @supabase/supabase-js @supabase/ssr
pnpm add -D prisma

# Inicializar Prisma (ya hecho)
pnpm prisma init

# Configurar variables de entorno (.env.local)
# Copiar .env.example a .env.local y completar con datos de Supabase

# Generar cliente de Prisma
pnpm prisma generate

# Aplicar esquema a la base de datos
pnpm prisma db push

# (Opcional) Abrir Prisma Studio para ver la DB
pnpm prisma studio
```

### Fase 1: Setup y Autenticación (Sprint 1)
- [ ] Configurar Supabase proyecto en dashboard
- [ ] Configurar variables de entorno
- [ ] Instalar y configurar Prisma + Supabase
- [ ] Aplicar esquema de base de datos
- [ ] Configurar RLS en Supabase
- [ ] Implementar registro/login con Supabase Auth
- [ ] Crear layouts base y navegación

### Fase 2: Gestión de Parejas (Sprint 1)
- [ ] Crear pareja con código de invitación
- [ ] Unirse a pareja con código
- [ ] Validaciones y manejo de errores

### Fase 3: Gestión de Gastos (Sprint 2)
- [ ] CRUD de gastos
- [ ] Listado con filtros básicos
- [ ] Categorías predefinidas
- [ ] Validaciones

### Fase 4: Balance y Liquidaciones (Sprint 2)
- [ ] Cálculo de balance
- [ ] Vista de balance
- [ ] Registrar liquidaciones
- [ ] Historial

### Fase 5: Mejoras UX (Sprint 3)
- [ ] Loading states
- [ ] Error handling completo
- [ ] Optimistic updates
- [ ] Mobile responsive

## 📊 Métricas de Éxito del MVP

- Usuarios pueden registrarse y crear/unirse a pareja en < 2 minutos
- Crear un gasto toma < 30 segundos
- Balance se calcula correctamente con 100% precisión
- La app funciona offline (lectura) con caché de datos
- 0 bugs críticos en producción

## 🔒 Consideraciones de Seguridad

- Row Level Security en todas las tablas
- Validación de pertenencia a pareja en todas las operaciones
- Server Actions para todas las mutaciones
- Sanitización de inputs
- Rate limiting en operaciones sensibles
