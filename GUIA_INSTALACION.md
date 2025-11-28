# 🚀 Guía de Instalación y Configuración - Servicio de Usuarios

## 📋 Requisitos Previos

1. **Node.js** instalado (versión 18.x o 20.x recomendada, mínimo 14.0.0)
   - Versión recomendada: **Node.js 18.20.0** o superior
   - Descarga: https://nodejs.org/
2. **MongoDB** instalado y corriendo
3. **npm** (viene con Node.js)

---

## 📦 Paso 1: Verificar Instalaciones

### Verificar Node.js
Abre PowerShell o CMD y ejecuta:
```bash
node --version
npm --version
```

**Versión requerida:** Node.js 14.0.0 o superior  
**Versión recomendada:** Node.js 18.20.0 o 20.x

Si no tienes Node.js o tienes una versión antigua:
- Descarga Node.js 18 LTS de: https://nodejs.org/
- O Node.js 20 LTS (versión más reciente)

### Verificar MongoDB
```bash
mongod --version
```

Si no tienes MongoDB:
- **Windows**: Descarga de https://www.mongodb.com/try/download/community
- O usa MongoDB Atlas (gratis en la nube): https://www.mongodb.com/cloud/atlas

---

## 🗄️ Paso 2: Configurar MongoDB

### Opción A: MongoDB Local (en tu computadora)

1. **Iniciar MongoDB:**
   - Si instalaste MongoDB como servicio, ya debería estar corriendo
   - Si no, abre una terminal y ejecuta:
   ```bash
   mongod
   ```
   - Deja esta terminal abierta (MongoDB debe estar corriendo)

2. **Verificar que MongoDB está corriendo:**
   - Abre otra terminal y ejecuta:
   ```bash
   mongo
   ```
   - O si tienes MongoDB 6+:
   ```bash
   mongosh
   ```
   - Deberías ver algo como: `>`

3. **Crear la base de datos (opcional, se crea automáticamente):**
   ```javascript
   use users_db
   ```
   - Esto crea/selecciona la base de datos `users_db`
   - Escribe `exit` para salir

### Opción B: MongoDB Atlas (en la nube - RECOMENDADO para principiantes)

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un cluster gratuito (Free tier)
4. Crea un usuario de base de datos (Database Access)
5. Configura el acceso de red (Network Access) - permite desde cualquier IP: `0.0.0.0/0`
6. Obtén tu connection string:
   - Click en "Connect" → "Connect your application"
   - Copia el string que se ve así:
   ```
   mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## ⚙️ Paso 3: Configurar el Servicio

### 3.1. Navegar a la carpeta del proyecto
```bash
cd microservice-users
```

### 3.2. Instalar dependencias
```bash
npm install
```

Esto instalará todas las librerías necesarias (express, mongoose, etc.)

### 3.3. Crear archivo .env

Crea un archivo llamado `.env` en la carpeta `microservice-users` con el siguiente contenido:

**Para MongoDB Local:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/users_db
JWT_SECRET=mi-secreto-super-seguro-cambiar-en-produccion
JWT_EXPIRE=7d
```

**Para MongoDB Atlas:**
```env
PORT=3001
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/users_db?retryWrites=true&w=majority
JWT_SECRET=mi-secreto-super-seguro-cambiar-en-produccion
JWT_EXPIRE=7d
```

**⚠️ IMPORTANTE:**
- Reemplaza `usuario` y `password` con tus credenciales de MongoDB Atlas
- Reemplaza `cluster0.xxxxx` con tu cluster real
- El `JWT_SECRET` puede ser cualquier string largo y seguro (cámbialo en producción)

---

## 🚀 Paso 4: Iniciar el Servicio

### Modo Desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo Producción:
```bash
npm start
```

**Deberías ver:**
```
MongoDB Connected: localhost:27017
Users microservice running on port 3001
```

Si ves errores, revisa:
- ¿MongoDB está corriendo?
- ¿La URI de MongoDB es correcta?
- ¿El puerto 3001 está libre?

---

## 🧪 Paso 5: Probar el Servicio

### 5.1. Probar Health Check

**En Postman o navegador:**
- Método: `GET`
- URL: `http://localhost:3001/health`

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Users microservice is running"
}
```

### 5.2. Ver Documentación Swagger

Abre en tu navegador:
```
http://localhost:3001/api/docs
```

Aquí verás toda la documentación interactiva de la API.

### 5.3. Probar Crear Usuario (requiere ADMIN)

**En Postman:**
- Método: `POST`
- URL: `http://localhost:3001/api/users`
- Headers:
  ```
  Content-Type: application/json
  Authorization: Bearer <tu-token-jwt>
  ```
  O si usas API Gateway:
  ```
  X-User-Id: <user-id>
  X-User-Roles: ADMIN
  ```
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "CLIENT"
}
```

### 5.4. Probar Obtener Perfil

**En Postman:**
- Método: `GET`
- URL: `http://localhost:3001/api/users/profile`
- Headers:
  ```
  Authorization: Bearer <tu-token-jwt>
  ```

---

## 🔍 Verificar que los Datos se Guardaron

### Con MongoDB Local:
```bash
mongosh
use users_db
db.users.find().pretty()
```

### Con MongoDB Atlas:
- Ve a tu cluster → "Browse Collections"
- Deberías ver la base de datos `users_db` y la colección `users`

---

## ❌ Solución de Problemas Comunes

### Error: "Cannot connect to MongoDB"
- ✅ Verifica que MongoDB esté corriendo
- ✅ Verifica la URI en el archivo `.env`
- ✅ Si usas Atlas, verifica que tu IP esté permitida

### Error: "Port 3001 already in use"
- ✅ Cambia el puerto en `.env`: `PORT=3002`
- ✅ O cierra la aplicación que usa el puerto 3001

### Error: "Module not found"
- ✅ Ejecuta `npm install` de nuevo
- ✅ Verifica que estés en la carpeta correcta

### Error: "JWT_SECRET is required"
- ✅ Verifica que el archivo `.env` exista
- ✅ Verifica que tenga la variable `JWT_SECRET`

---

## 📝 Notas Importantes

1. **El archivo `.env` NO se sube a Git** (está en .gitignore)
2. **Para producción**, cambia el `JWT_SECRET` por algo más seguro
3. **Los endpoints protegidos** requieren autenticación (JWT token o headers)
4. **El rol ADMIN** es necesario para crear/listar usuarios

---

## ✅ Checklist Final

- [ ] Node.js instalado
- [ ] MongoDB corriendo (local o Atlas)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado y configurado
- [ ] Servicio corriendo (`npm run dev`)
- [ ] Health check funciona (`GET /health`)
- [ ] Swagger accesible (`http://localhost:3001/api/docs`)

---

¡Listo! Ya puedes probar tu servicio de usuarios. 🎉

