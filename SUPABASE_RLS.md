# Políticas de Seguridad Row Level Security (RLS) para PairPay

Este documento contiene todas las políticas RLS que deben configurarse en Supabase para asegurar que los datos estén protegidos.

## ⚠️ IMPORTANTE: Activar RLS

Primero, asegúrate de que RLS esté activado en todas las tablas:

```sql
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Couple" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Settlement" ENABLE ROW LEVEL SECURITY;
```

## 1. Políticas para la tabla Profile

### Ver perfiles (solo miembros de la misma pareja)
```sql
CREATE POLICY "Users can view profiles in their couple"
ON "Profile"
FOR SELECT
USING (
  "coupleId" IN (
    SELECT "coupleId" 
    FROM "Profile" 
    WHERE id = auth.uid()
  )
);
```

### Ver su propio perfil
```sql
CREATE POLICY "Users can view own profile"
ON "Profile"
FOR SELECT
USING (id = auth.uid());
```

### Actualizar su propio perfil
```sql
CREATE POLICY "Users can update own profile"
ON "Profile"
FOR UPDATE
USING (id = auth.uid());
```

## 2. Políticas para la tabla Couple

### Ver su pareja
```sql
CREATE POLICY "Users can view their couple"
ON "Couple"
FOR SELECT
USING (
  id IN (
    SELECT "coupleId" 
    FROM "Profile" 
    WHERE id = auth.uid()
  )
);
```

### Crear pareja (cualquier usuario autenticado)
```sql
CREATE POLICY "Authenticated users can create couple"
ON "Couple"
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
```

### Actualizar pareja (solo creador)
```sql
CREATE POLICY "Creator can update couple"
ON "Couple"
FOR UPDATE
USING ("createdBy" = auth.uid());
```

## 3. Políticas para la tabla Expense

### Ver gastos de su pareja
```sql
CREATE POLICY "Users can view their couple expenses"
ON "Expense"
FOR SELECT
USING (
  "coupleId" IN (
    SELECT "coupleId" 
    FROM "Profile" 
    WHERE id = auth.uid()
  )
);
```

### Crear gastos en su pareja
```sql
CREATE POLICY "Users can create expenses in their couple"
ON "Expense"
FOR INSERT
WITH CHECK (
  "coupleId" IN (
    SELECT "coupleId" 
    FROM "Profile" 
    WHERE id = auth.uid()
  )
  AND "createdBy" = auth.uid()
);
```

### Actualizar solo sus propios gastos
```sql
CREATE POLICY "Users can update own expenses"
ON "Expense"
FOR UPDATE
USING ("createdBy" = auth.uid());
```

### Eliminar solo sus propios gastos
```sql
CREATE POLICY "Users can delete own expenses"
ON "Expense"
FOR DELETE
USING ("createdBy" = auth.uid());
```

## 4. Políticas para la tabla Settlement

### Ver liquidaciones de su pareja
```sql
CREATE POLICY "Users can view their couple settlements"
ON "Settlement"
FOR SELECT
USING (
  "coupleId" IN (
    SELECT "coupleId" 
    FROM "Profile" 
    WHERE id = auth.uid()
  )
);
```

### Crear liquidaciones en su pareja
```sql
CREATE POLICY "Users can create settlements in their couple"
ON "Settlement"
FOR INSERT
WITH CHECK (
  "coupleId" IN (
    SELECT "coupleId" 
    FROM "Profile" 
    WHERE id = auth.uid()
  )
);
```

## 5. Función y Trigger para Auto-crear Perfiles

Este trigger crea automáticamente un perfil cuando un usuario se registra:

```sql
-- Función que crea el perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public."Profile" (id, email, "fullName", "createdAt", "updatedAt")
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Trigger que ejecuta la función
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## 6. Verificar que las Políticas Funcionan

Puedes probar las políticas ejecutando queries como diferentes usuarios:

```sql
-- Ver todas las políticas de una tabla
SELECT * FROM pg_policies WHERE tablename = 'Expense';

-- Probar acceso como usuario (reemplaza 'user-uuid')
SET request.jwt.claim.sub = 'user-uuid';
SELECT * FROM "Expense";
```

## 7. Script Completo de Configuración

Ejecuta este script completo en el SQL Editor de Supabase:

```sql
-- 1. Activar RLS en todas las tablas
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Couple" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Settlement" ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para Profile
CREATE POLICY "Users can view profiles in their couple" ON "Profile" FOR SELECT USING ("coupleId" IN (SELECT "coupleId" FROM "Profile" WHERE id = auth.uid()));
CREATE POLICY "Users can view own profile" ON "Profile" FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON "Profile" FOR UPDATE USING (id = auth.uid());

-- 3. Políticas para Couple
CREATE POLICY "Users can view their couple" ON "Couple" FOR SELECT USING (id IN (SELECT "coupleId" FROM "Profile" WHERE id = auth.uid()));
CREATE POLICY "Authenticated users can create couple" ON "Couple" FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Creator can update couple" ON "Couple" FOR UPDATE USING ("createdBy" = auth.uid());

-- 4. Políticas para Expense
CREATE POLICY "Users can view their couple expenses" ON "Expense" FOR SELECT USING ("coupleId" IN (SELECT "coupleId" FROM "Profile" WHERE id = auth.uid()));
CREATE POLICY "Users can create expenses in their couple" ON "Expense" FOR INSERT WITH CHECK ("coupleId" IN (SELECT "coupleId" FROM "Profile" WHERE id = auth.uid()) AND "createdBy" = auth.uid());
CREATE POLICY "Users can update own expenses" ON "Expense" FOR UPDATE USING ("createdBy" = auth.uid());
CREATE POLICY "Users can delete own expenses" ON "Expense" FOR DELETE USING ("createdBy" = auth.uid());

-- 5. Políticas para Settlement
CREATE POLICY "Users can view their couple settlements" ON "Settlement" FOR SELECT USING ("coupleId" IN (SELECT "coupleId" FROM "Profile" WHERE id = auth.uid()));
CREATE POLICY "Users can create settlements in their couple" ON "Settlement" FOR INSERT WITH CHECK ("coupleId" IN (SELECT "coupleId" FROM "Profile" WHERE id = auth.uid()));

-- 6. Función y Trigger para auto-crear perfiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public."Profile" (id, email, "fullName", "createdAt", "updatedAt")
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NOW(), NOW());
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## ✅ Checklist de Seguridad

- [ ] RLS activado en todas las tablas
- [ ] Políticas de Profile configuradas
- [ ] Políticas de Couple configuradas
- [ ] Políticas de Expense configuradas
- [ ] Políticas de Settlement configuradas
- [ ] Trigger de auto-creación de perfiles configurado
- [ ] Políticas probadas con diferentes usuarios
- [ ] Variables de entorno configuradas en Vercel/producción

## 🔒 Notas de Seguridad

1. **Nunca deshabilites RLS** en producción
2. **Prueba las políticas** con diferentes usuarios antes de lanzar
3. **Revisa los logs** de Supabase regularmente para detectar intentos de acceso no autorizado
4. **Rota las claves API** periódicamente
5. **No expongas SUPABASE_SERVICE_ROLE_KEY** en el frontend (solo en server-side)
