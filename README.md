# Backend - Botica Nova Salud

API REST inicial desarrollada con Node.js, Express y MySQL.

## Requisitos
- Node.js 22 o compatible.
- MySQL 8.
- npm.

## 1. Preparar la base de datos
Ejecuta `database/schema.sql` en MySQL para crear la base de datos y las tablas.

## 2. Configurar variables
Copia `.env.example` como `.env` y completa los valores reales:
- `DB_HOST`: en desarrollo local puede ser `localhost`; dentro de Docker Compose normalmente será el nombre del servicio, por ejemplo `database`.
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- `JWT_SECRET`: reemplázalo por una clave larga y aleatoria.
- `CORS_ORIGIN`: dirección autorizada del frontend.

No subas `.env` a GitHub.

## 3. Instalar y ejecutar localmente
```bash
npm install
npm run dev
```
La API estará en `http://localhost:3000`.
Comprueba `GET /api/health`.

## 4. Crear el primer administrador
Por seguridad, el registro público de administradores está deshabilitado. Crea un usuario administrador mediante un script seguro de inicialización o una herramienta interna que genere el hash con `bcryptjs` e inserte el usuario en `usuarios`. No uses contraseñas de ejemplo en producción.

## 5. Endpoints principales
- `POST /api/auth/login`
- `POST /api/auth/usuarios` (solo ADMIN)
- `GET, POST /api/productos`
- `GET, PUT, DELETE /api/productos/:id`
- `GET /api/inventario`
- `GET /api/inventario/alertas`
- `GET /api/inventario/movimientos`
- `PATCH /api/inventario/:id/ajuste` (solo ADMIN)
- `GET, POST /api/ventas`
- `GET, POST /api/compras` (solo ADMIN)

Excepto login y health, las rutas requieren:
`Authorization: Bearer TU_TOKEN`

## 6. Ejemplo de venta
```json
{
  "metodo_pago": "EFECTIVO",
  "items": [
    { "producto_id": 1, "cantidad": 2 },
    { "producto_id": 3, "cantidad": 1 }
  ]
}
```

## 7. Docker
Construye la imagen desde esta carpeta:
```bash
docker build -t botica-backend .
docker run --env-file .env -p 3000:3000 botica-backend
```
Para la entrega se recomienda usar Docker Compose junto con el servicio MySQL. Dentro de Compose, configura `DB_HOST` con el nombre del servicio de MySQL y no con `localhost`.

## Consideraciones importantes
- Las ventas y compras usan transacciones para registrar detalles y actualizar stock de forma conjunta.
- El stock no puede quedar negativo mediante el proceso de venta.
- Las alertas se consultan en `GET /api/inventario/alertas`.
- Antes de producción, agrega pruebas automatizadas, validación más completa, auditoría, HTTPS, política CORS exacta, respaldos y revisión de permisos.
- Este backend gestiona inventario y ventas; no ofrece diagnóstico ni recomendaciones médicas.
