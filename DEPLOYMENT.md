# Guía de Deployment de PairPay

Esta guía te ayudará a desplegar PairPay en producción.

## 📋 Pre-requisitos

- Cuenta de Supabase (https://supabase.com)
- Cuenta de Vercel (https://vercel.com) o similar
- pnpm instalado localmente

## 🚀 Pasos de Deployment

### 1. Configurar Supabase

#### A. Crear Proyecto en Supabase
1. Ve a https://supabase.com/dashboard
2. Crea un nuevo proyecto
3. Guarda las credenciales (Project URL y anon key)

#### B. Configurar Base de Datos

**Opción A: Usar Prisma Migrate (Recomendado)**
```bash
# 1. Crear migración inicial
pnpm prisma migrate dev --name init

# 2. Aplicar en producción
pnpm prisma migrate deploy
```

**Opción B: Push directo (Solo desarrollo)**
```bash
pnpm prisma db push
```

#### C. Configurar RLS Policies
1. Abre el SQL Editor en Supabase Dashboard
2. Ejecuta el script completo de `SUPABASE_RLS.md`
3. Verifica que todas las políticas se hayan creado

#### D. Verificar el Trigger
Asegúrate de que el trigger de auto-creación de perfiles esté activo:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### 2. Configurar Variables de Entorno

#### En desarrollo (local):
1. Copia `.env.example` a `.env.local`
2. Reemplaza los valores con tus credenciales de Supabase

#### En producción (Vercel):
Añade estas variables en Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Deploy en Vercel

#### Opción A: Desde GitHub (Recomendado)
1. Sube tu código a GitHub
2. Importa el repo en Vercel
3. Configura las variables de entorno
4. Deploy automático

#### Opción B: Desde CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### 4. Configuración Post-Deploy

#### A. Verificar Prisma en Producción
En el primer deploy, asegúrate de que Prisma se genere:
```bash
# Esto ya está en package.json como "postinstall"
pnpm prisma generate
```

#### B. Probar la Aplicación
1. Registra un usuario de prueba
2. Verifica que se cree el perfil automáticamente
3. Crea una pareja
4. Añade un gasto
5. Verifica el balance
6. Crea una liquidación

#### C. Monitorear Errores
- Revisa los logs en Vercel Dashboard
- Configura alertas de error (opcional: Sentry)

### 5. Configuración de Dominio (Opcional)

#### En Vercel:
1. Ve a Project Settings → Domains
2. Añade tu dominio personalizado
3. Configura DNS según las instrucciones

#### Actualizar URLs de Supabase:
1. En Supabase Dashboard → Authentication → URL Configuration
2. Añade tu dominio a "Site URL" y "Redirect URLs"

## 🔐 Seguridad

### Checklist de Seguridad Pre-Producción:
- [ ] RLS habilitado en todas las tablas
- [ ] Políticas RLS configuradas y probadas
- [ ] Trigger de perfil funcionando
- [ ] Variables de entorno configuradas en Vercel
- [ ] `.env` y `.env.local` en `.gitignore`
- [ ] No hay credenciales hardcodeadas en el código
- [ ] CORS configurado correctamente en Supabase
- [ ] Rate limiting configurado (opcional)

### Rotar Credenciales:
Si expusiste credenciales accidentalmente:
1. Genera nuevas claves en Supabase → Settings → API
2. Actualiza las variables en Vercel
3. Redeploy la aplicación

## 📊 Monitoreo

### Supabase Dashboard
- **Database**: Revisa queries lentas y uso
- **Auth**: Monitorea usuarios activos
- **Logs**: Revisa errores y accesos

### Vercel Dashboard
- **Analytics**: Tráfico y performance
- **Logs**: Errores de servidor y build
- **Deployments**: Historial de deploys

## 🐛 Troubleshooting

### Error: "Relation does not exist"
**Causa**: Base de datos no inicializada
**Solución**: Ejecuta `pnpm prisma db push` o `pnpm prisma migrate deploy`

### Error: "Cannot read properties of null"
**Causa**: RLS bloqueando queries o perfil no creado
**Solución**: 
1. Verifica que RLS policies estén configuradas
2. Verifica que el trigger de perfil funcione

### Error: "Invalid auth token"
**Causa**: Variables de Supabase incorrectas
**Solución**: Verifica `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Build falla en Vercel
**Causa**: Prisma no generado
**Solución**: Asegúrate de que `vercel.json` tenga el buildCommand correcto

### Usuarios no pueden ver gastos de la pareja
**Causa**: RLS policies incorrectas
**Solución**: Re-ejecuta el script de SUPABASE_RLS.md

## 📝 Comandos Útiles

```bash
# Ver estado de migraciones
pnpm prisma migrate status

# Ver schema actual
pnpm prisma db pull

# Resetear DB (desarrollo solo)
pnpm prisma migrate reset

# Ver logs de Vercel
vercel logs

# Pull variables de env desde Vercel
vercel env pull .env.local
```

## 🎉 ¡Listo!

Tu aplicación PairPay debería estar corriendo en producción. Comparte la URL con tus usuarios.

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs de Vercel
2. Revisa los logs de Supabase
3. Consulta la documentación de Next.js y Supabase
4. Abre un issue en el repositorio
