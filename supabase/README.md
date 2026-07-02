# Guía de configuración de Supabase — Avenida 21

Sigue estos pasos **una sola vez** para conectar tu web a la base de datos.

## 1. Crear la cuenta y el proyecto

1. Entra a **https://supabase.com** → **Start your project** → inicia sesión con GitHub o correo (es gratis).
2. **New project**:
   - **Name:** `avenida21`
   - **Database Password:** genera una y **guárdala** (la necesitarás si administras la BD directamente).
   - **Region:** elige la más cercana (ej. _East US_ o _South America_).
3. Espera ~2 minutos a que se aprovisione el proyecto.

## 2. Crear las tablas (esquema)

1. En el menú lateral abre **SQL Editor** → **New query**.
2. Copia y pega TODO el contenido de `supabase/migrations/0001_schema.sql` y pulsa **Run**.
3. Debe decir _Success_. Esto crea todas las tablas, roles y seguridad.

## 3. Cargar tus datos actuales

1. Nueva query en el **SQL Editor**.
2. Pega TODO el contenido de `supabase/migrations/0002_seed.sql` y pulsa **Run**.
3. Ve a **Table Editor → productos**: deberías ver todos tus productos cargados.

## 4. Obtener las claves de conexión

1. **Project Settings** (engranaje) → **API**.
2. Copia:
   - **Project URL** → va en `VITE_SUPABASE_URL`
   - **anon public** key → va en `VITE_SUPABASE_ANON_KEY`

## 5. Configurar el proyecto local

1. En la raíz del proyecto, copia `.env.example` como `.env`.
2. Pega las dos claves del paso anterior.
3. Reinicia el servidor: `npm run dev`.
4. La web ahora carga el menú **desde la base de datos**.

## 6. Configurar Vercel (producción)

En tu proyecto de Vercel → **Settings → Environment Variables**, agrega:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Luego haz **Redeploy**.

---

> La **contraseña de administrador** (login del panel) se creará en la Fase 2.
> El primer usuario que se registre será **Administrador** automáticamente.
