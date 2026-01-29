# PairPay - Setup Guide

Guía paso a paso para configurar el proyecto desde cero.

## 📋 Prerequisitos

- Node.js 20+
- pnpm (package manager)
- Cuenta en Supabase (https://supabase.com)

## 🚀 Setup Inicial

### 1. Instalar Dependencias

```bash
pnpm install
```

### 2. Crear Proyecto en Supabase

1. Ve a https://app.supabase.com
2. Crea un nuevo proyecto
3. Espera a que el proyecto esté listo (2-3 minutos)
4. Guarda las credenciales que te proporciona

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Connection Pooler (para Prisma en producción)
DATABASE_URL=postgresql://postgres.tu-proyecto:[PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct Connection (para migraciones)
DIRECT_URL=postgresql://postgres.tu-proyecto:[PASSWORD]@db.tu-proyecto.supabase.co:5432/postgres
```

**Dónde encontrar estas URLs:**
- `NEXT_PUBLIC_SUPABASE_URL`: Project Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Settings → API → Project API keys → anon/public
- `DATABASE_URL`: Project Settings → Database → Connection string → Connection pooling
- `DIRECT_URL`: Project Settings → Database → Connection string → URI

### 4. Instalar Prisma y Supabase

```bash
# Instalar dependencias de Prisma
pnpm add @prisma/client
pnpm add -D prisma

# Instalar dependencias de Supabase
pnpm add @supabase/supabase-js @supabase/ssr
```

### 5. Configurar la Base de Datos

```bash
# Generar el cliente de Prisma
pnpm prisma generate

# Aplicar el esquema a Supabase (sin crear migraciones)
pnpm prisma db push
```

**Nota**: En el primer setup usamos `db push` en lugar de `migrate dev` porque es más simple. Una vez en producción, usaremos migraciones.

### 6. Configurar Row Level Security en Supabase

El esquema de Prisma crea las tablas, pero necesitamos configurar manualmente el RLS en Supabase:

1. Ve a Supabase Dashboard → Authentication → Policies
2. Habilita RLS en todas las tablas:
   - `profiles`
   - `couples`
   - `expenses`
   - `settlements`

3. Crea las políticas básicas (o ejecuta el SQL del archivo `supabase/policies.sql` si existe)

**Políticas básicas recomendadas:**

```sql
-- Profiles: usuarios ven perfiles de su pareja
CREATE POLICY "Users can view couple profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id OR
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

-- Expenses: usuarios ven gastos de su pareja
CREATE POLICY "Users can view couple expenses"
  ON expenses FOR SELECT
  USING (
    couple_id IN (SELECT couple_id FROM profiles WHERE id = auth.uid())
  );

-- (Añadir más políticas según MVP.md)
```

### 7. Crear Trigger para Profiles

Supabase Auth crea usuarios en `auth.users`, pero necesitamos crear automáticamente el perfil:

```sql
-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

Ejecuta esto en Supabase Dashboard → SQL Editor.

### 8. Verificar la Configuración

```bash
# Ver la base de datos en Prisma Studio
pnpm prisma studio
```

Deberías ver las 4 tablas vacías:
- profiles
- couples
- expenses
- settlements

### 9. Ejecutar el Servidor de Desarrollo

```bash
pnpm dev
```

Abre http://localhost:3000 en tu navegador.

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm dev                    # Iniciar servidor de desarrollo
pnpm build                  # Build para producción
pnpm start                  # Servidor de producción
pnpm lint                   # Ejecutar ESLint

# Prisma
pnpm prisma:generate        # Generar cliente de Prisma
pnpm prisma:studio          # Abrir Prisma Studio (DB GUI)
pnpm prisma:push            # Push schema a DB (sin migraciones)
pnpm prisma:migrate         # Crear y aplicar migración

# Prisma directo
pnpm prisma migrate dev --name "descripcion"  # Nueva migración
pnpm prisma migrate reset   # Reset DB (⚠️ borra datos)
pnpm prisma format          # Formatear schema.prisma
```

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- Verifica que las URLs de conexión en `.env.local` sean correctas
- Verifica que el proyecto de Supabase esté activo
- Prueba la conexión en Supabase Dashboard

### Error: "Prisma Client not generated"
```bash
pnpm prisma generate
```

### Las tablas no aparecen en Supabase
```bash
pnpm prisma db push
```

### Cambios en el schema no se reflejan
```bash
pnpm prisma generate
pnpm prisma db push
# Restart el dev server
```

## 📚 Siguiente Paso

Lee `MVP.md` para entender las funcionalidades a implementar y la arquitectura del proyecto.
