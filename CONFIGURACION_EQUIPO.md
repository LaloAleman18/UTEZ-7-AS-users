# 👥 Configuración para Trabajo en Equipo

## 📝 Tu archivo .env actual

Veo que tienes:
```env
PORT=3001
MONGODB_URI=mongodb+srv://20233tn226:<db_password>@cluster0.685hg.mongodb.net/?appName=Cluster0
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
```

## ⚠️ Lo que necesitas corregir:

### 1. Reemplazar `<db_password>` con tu password real
```env
MONGODB_URI=mongodb+srv://20233tn226:TU_PASSWORD_REAL@cluster0.685hg.mongodb.net/users_db?retryWrites=true&w=majority
```

**Nota importante:** Agregué `/users_db` al final para especificar la base de datos.

### 2. Cambiar el JWT_SECRET por uno seguro
```env
JWT_SECRET=mi-secreto-super-seguro-para-equipo-2024
```

---

## 🗄️ ¿Cómo se crea la base de datos `users_db`?

**¡Se crea AUTOMÁTICAMENTE!** 

MongoDB crea la base de datos cuando:
1. Te conectas por primera vez
2. Guardas el primer documento (usuario)

**No necesitas crearla manualmente.** Solo asegúrate de que:
- La URI tenga `/users_db` al final (o el nombre que quieras)
- El servicio se conecte correctamente
- Cuando crees el primer usuario, la base de datos aparecerá

### Verificar que funciona:
1. Inicia el servicio: `npm run dev`
2. Deberías ver: `MongoDB Connected: cluster0.685hg.mongodb.net`
3. Crea un usuario desde Postman
4. Ve a MongoDB Atlas → Browse Collections
5. Verás la base de datos `users_db` y la colección `users`

---

## 👥 ¿Cómo compartir con otros compañeros?

### Opción 1: MongoDB Atlas Compartido (RECOMENDADO)

**Ventajas:**
- Todos usan la misma base de datos
- Datos compartidos entre el equipo
- Fácil de configurar

**Pasos:**
1. En MongoDB Atlas, ve a "Database Access"
2. Crea un usuario de base de datos (si no lo tienes)
3. Comparte las credenciales con tu equipo de forma segura
4. Cada uno configura su `.env` con:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster0.685hg.mongodb.net/users_db?retryWrites=true&w=majority
   ```

**⚠️ IMPORTANTE:** 
- El archivo `.env` NO se sube a Git (está en .gitignore)
- Comparte las credenciales por un canal seguro (Slack privado, 1Password, etc.)
- Usa el mismo `JWT_SECRET` para todo el equipo

### Opción 2: Cada uno con su propia base de datos

**Ventajas:**
- Cada uno trabaja independientemente
- No hay conflictos de datos

**Desventajas:**
- Datos no compartidos
- Cada uno necesita su propio cluster

---

## 📋 Checklist para tu equipo

### Para cada desarrollador:

1. **Clonar el repositorio:**
   ```bash
   git clone <tu-repo>
   cd microservice-users
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Crear archivo .env:**
   ```bash
   copy env.template .env
   # En Linux/Mac: cp env.template .env
   ```

4. **Configurar .env con credenciales compartidas:**
   ```env
   PORT=3001
   MONGODB_URI=mongodb+srv://usuario:password@cluster0.685hg.mongodb.net/users_db?retryWrites=true&w=majority
   JWT_SECRET=secreto-compartido-por-equipo
   JWT_EXPIRE=7d
   ```

5. **Iniciar el servicio:**
   ```bash
   npm run dev
   ```

---

## 🔒 Seguridad - Buenas Prácticas

### ✅ HACER:
- ✅ Compartir credenciales por canal seguro (Slack privado, 1Password)
- ✅ Usar el mismo `JWT_SECRET` para todo el equipo
- ✅ Mantener el archivo `.env` local (no subirlo a Git)
- ✅ Usar variables de entorno en producción

### ❌ NO HACER:
- ❌ Subir el archivo `.env` a Git
- ❌ Compartir credenciales por email público
- ❌ Usar credenciales de producción en desarrollo
- ❌ Hardcodear credenciales en el código

---

## 🧪 Probar en Postman

### 1. Verificar que el servicio está corriendo:
```
GET http://localhost:3001/health
```

### 2. Ver documentación:
```
Abre en navegador: http://localhost:3001/api/docs
```

### 3. Crear un usuario (requiere ADMIN):
```
POST http://localhost:3001/api/users
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "CLIENT"
}
```

---

## 📝 Tu .env debería verse así:

```env
# Puerto del servicio
PORT=3001

# MongoDB Atlas (con password real y nombre de base de datos)
MONGODB_URI=mongodb+srv://20233tn226:TU_PASSWORD_REAL@cluster0.685hg.mongodb.net/users_db?retryWrites=true&w=majority

# JWT Secret (mismo para todo el equipo)
JWT_SECRET=secreto-compartido-equipo-2024

# Tiempo de expiración del token
JWT_EXPIRE=7d
```

---

## ✅ Resumen

1. **Base de datos:** Se crea automáticamente al guardar el primer usuario
2. **Compartir:** Usa el mismo MongoDB URI y JWT_SECRET con tu equipo
3. **Seguridad:** Nunca subas `.env` a Git
4. **Postman:** Funciona igual para todos si usan las mismas credenciales

¡Listo para trabajar en equipo! 🚀

