# Requerimientos del sistema NovaWeb - Botica Nova Salud

## 1. Propósito

Este documento reúne los requerimientos funcionales y no funcionales del software web de la botica **Nova Salud**. Se elaboró tomando como base el caso práctico y el informe técnico de revisión del 11 de noviembre de 2026.

El sistema busca centralizar la gestión de productos, inventario, compras, ventas y pedidos web, además de facilitar la atención al cliente y reducir errores de stock.

## 2. Alcance y actores

El informe técnico identifica cuatro roles del sistema:

- **ADMINISTRADOR:** administra usuarios, roles, productos, categorías, sucursales, almacenes, proveedores y consulta las operaciones generales.
- **ALMACENERO:** gestiona productos, compras recibidas, lotes, existencias, ajustes y movimientos de inventario de su sucursal.
- **VENDEDOR:** registra ventas de mostrador, gestiona clientes y consulta su propio historial de ventas.
- **CLIENTE:** consulta la tienda web, administra su cuenta y registra pedidos propios.

La aplicación documentada utiliza un frontend React/Vite, un backend Express/Node.js y una base de datos MariaDB/MySQL denominada `nova_salud`.

## 3. Requerimientos funcionales (RF)

Los requerimientos funcionales describen las acciones que el sistema debe permitir realizar.

| Código | Requerimiento | Descripción |
|---|---|---|
| RF01 | Registro e inicio de sesión | El sistema debe permitir que los clientes creen una cuenta y que los usuarios ingresen mediante correo y contraseña. |
| RF02 | Autenticación con Google | El sistema puede ofrecer inicio de sesión de clientes con Google cuando estén configuradas las credenciales correspondientes. |
| RF03 | Control de roles y permisos | El sistema debe reconocer los roles ADMINISTRADOR, ALMACENERO, VENDEDOR y CLIENTE, y permitir las operaciones autorizadas para cada uno. |
| RF04 | Administración de usuarios | El administrador debe poder consultar y gestionar cuentas, asignar roles y asociar al personal con una sucursal. |
| RF05 | Gestión de productos y categorías | El personal autorizado debe poder registrar, consultar y gestionar productos y sus categorías. |
| RF06 | Catálogo web | El sistema debe mostrar a los clientes los productos activos habilitados para venta web, con su información, imágenes y disponibilidad vendible. |
| RF07 | Búsqueda y filtrado | El cliente debe poder buscar productos y filtrar el catálogo por categorías. |
| RF08 | Carrito de compras | El cliente debe poder agregar productos al carrito y modificar las cantidades antes de realizar un pedido. |
| RF09 | Gestión de clientes | El administrador o vendedor debe poder buscar, consultar y registrar clientes para las operaciones de atención y venta. |
| RF10 | Gestión de sucursales y almacenes | El administrador debe poder administrar sucursales y almacenes para organizar las operaciones y existencias por ubicación. |
| RF11 | Control de inventario por lotes | El sistema debe gestionar existencias por producto, almacén y lote, considerando cantidades disponibles, reservadas y fechas de vencimiento. |
| RF12 | Consulta de movimientos de inventario | El sistema debe permitir consultar los movimientos de entrada, salida, reserva y ajuste que afectan las existencias. |
| RF13 | Alertas de bajo stock | El sistema debe identificar productos con existencias bajas y mostrar alertas para facilitar su reposición. |
| RF14 | Registro y recepción de compras | El almacenero o administrador debe poder registrar compras indicando proveedor, almacén, documento, producto, cantidad, costo y datos del lote recibido. |
| RF15 | Actualización de inventario por compra | Al confirmar una recepción de compra, el sistema debe incrementar las existencias del lote correspondiente y registrar el movimiento de entrada. |
| RF16 | Venta de mostrador | El vendedor debe poder registrar una venta seleccionando productos, cantidades, cliente opcional y medio de pago. |
| RF17 | Validación de stock para ventas | Antes de confirmar una venta, el sistema debe comprobar la disponibilidad y utilizar lotes no vencidos, priorizando la fecha de vencimiento más próxima (FEFO). |
| RF18 | Actualización de inventario por venta | Al confirmar una venta, el sistema debe descontar las cantidades correspondientes y registrar los movimientos de salida. |
| RF19 | Historial de ventas | El vendedor debe consultar sus propias ventas y el administrador debe poder consultar las ventas generales. |
| RF20 | Ajustes de inventario | El administrador o almacenero autorizado debe poder ajustar la cantidad disponible de un lote indicando el motivo del ajuste. |
| RF21 | Registro de pedidos web | El cliente autenticado debe poder enviar su carrito como pedido, indicando la modalidad de entrega disponible. |
| RF22 | Reserva de productos para pedidos | Al registrar un pedido web, el sistema debe validar productos publicados y lotes disponibles y no vencidos, y reservar las existencias correspondientes. |
| RF23 | Consulta administrativa de operaciones | El administrador debe poder consultar pedidos, ventas y compras desde su panel. |
| RF24 | Restricción por sucursal | Las operaciones del vendedor y del almacenero deben limitarse a la sucursal que tengan asignada. El sistema debe rechazar operaciones cuando falte una asignación requerida. |
| RF25 | Estado de la API y conexión a base de datos | El sistema debe disponer de una comprobación de salud que informe si la API y la conexión con la base de datos funcionan. |

## 4. Requerimientos no funcionales (RNF)

Los requerimientos no funcionales establecen las condiciones de seguridad, calidad, operación y mantenimiento del sistema.

| Código | Requerimiento | Descripción |
|---|---|---|
| RNF01 | Accesibilidad web | El sistema debe poder utilizarse desde un navegador web en los dispositivos conectados a la red autorizada. |
| RNF02 | Usabilidad | La interfaz debe ser clara e intuitiva, con opciones y operaciones acordes con el rol del usuario, para agilizar la atención. |
| RNF03 | Seguridad de autenticación | Las sesiones deben validarse mediante tokens JWT y las contraseñas deben almacenarse mediante un mecanismo de hash seguro, como bcrypt. |
| RNF04 | Autorización | Las rutas y operaciones protegidas deben verificar la autenticación y el rol del usuario antes de permitir el acceso. |
| RNF05 | Protección de la API | El backend debe aplicar medidas como Helmet, límites de solicitudes y una lista controlada de orígenes CORS permitidos. |
| RNF06 | Protección de credenciales | Las contraseñas de base de datos, secretos JWT y otras credenciales deben mantenerse en variables de entorno y no publicarse en el repositorio. |
| RNF07 | Protección de la base de datos | MariaDB/MySQL no debe exponerse directamente a la red Wi-Fi ni a Internet. El acceso debe realizarse desde el backend. |
| RNF08 | Integridad de datos | Las operaciones de registro de cuentas, compras, ventas y pedidos deben utilizar transacciones para evitar registros incompletos. |
| RNF09 | Consistencia del inventario | Las operaciones concurrentes deben validar y proteger las existencias y los lotes para evitar vender o reservar cantidades no disponibles. |
| RNF10 | Trazabilidad | Los movimientos y ajustes de inventario deben conservar información suficiente para identificar el usuario, lote, almacén, tipo de movimiento y motivo cuando corresponda. |
| RNF11 | Rendimiento operativo | Las consultas y operaciones frecuentes deben ejecutarse eficientemente para contribuir a reducir los tiempos de atención al cliente. El caso práctico no establece un tiempo máximo medible. |
| RNF12 | Mantenibilidad | El sistema debe conservar la separación entre frontend, backend y base de datos para facilitar las tareas de mantenimiento y evolución. |
| RNF13 | Gestión de errores | Los errores de conexión y consulta a la base de datos deben producir respuestas controladas, sin exponer credenciales ni detalles sensibles. |
| RNF14 | Supervisión del servicio | Los servicios deben disponer de comprobaciones de salud para detectar fallos del backend, frontend o conexión con la base de datos. |
| RNF15 | Despliegue controlado | El entorno documentado debe poder iniciarse y administrarse mediante Docker Compose, manteniendo el backend y la base de datos sin exposición innecesaria a la red local. |

## 5. Reglas de negocio identificadas

1. Solo los productos activos y habilitados para venta web deben aparecer en el catálogo público.
2. El stock publicado debe considerar existencias vendibles de almacenes habilitados; los lotes o almacenes en cuarentena no deben ofrecerse para la venta.
3. Las ventas y pedidos deben validar las existencias antes de confirmarse.
4. La selección de lotes para ventas debe aplicar FEFO: primero se utiliza el lote no vencido cuya fecha de vencimiento sea más próxima.
5. Las compras recibidas incrementan las existencias y registran el movimiento de entrada correspondiente.
6. Los ajustes no deben modificar la cantidad reservada del lote.
7. Un cliente solo puede crear pedidos para su propia cuenta; una cuenta registrada mediante Google recibe el rol CLIENTE.
8. El personal debe operar dentro de la sucursal asignada.
9. Cuando una operación transaccional falla, los cambios asociados deben revertirse.

## 6. Tecnologías y arquitectura documentadas

- **Frontend:** React 19 y Vite 8.
- **Backend:** Node.js 22 y Express 4.
- **Acceso a datos:** `mysql2/promise`.
- **Base de datos:** MariaDB/MySQL de XAMPP, base `nova_salud`.
- **Contenedores:** Docker y Docker Compose para frontend y backend.
- **Comunicación:** rutas API bajo `/api`; el frontend utiliza el proxy de Vite para comunicarse con el backend.

## 7. Observaciones y aspectos pendientes de especificar

- El informe técnico de revisión del **11 de noviembre de 2026** indicó que los contenedores frontend y backend estaban detenidos y que no se encontraban escuchando los puertos 8080, 3000 y 3306 en ese momento. Este dato es una observación de aquella revisión, no una afirmación sobre el estado actual.
- El frontend descrito se ejecuta con Vite en modo desarrollo. El informe advierte que este modo es adecuado para desarrollo en una red local de confianza y no equivale a un despliegue de producción endurecido.
- El caso práctico solicita alertas automáticas de bajo stock, mientras que el informe identifica una ruta de inventario que incluye alertas. El umbral exacto que define “stock bajo” no está especificado en las fuentes y debe acordarse.
- Las fuentes no establecen tiempos máximos de respuesta, disponibilidad porcentual, política de copias de seguridad, retención de datos ni una matriz de navegadores compatibles. Esos criterios deberán definirse antes de una validación formal.
- No se consideran requisitos confirmados los pagos en línea con tarjeta, facturación electrónica u otras funciones que no aparecen en el caso práctico ni en el informe técnico.

## 8. Resumen

| Tipo | Cantidad |
|---|---:|
| Requerimientos funcionales | 25 |
| Requerimientos no funcionales | 15 |
| Reglas de negocio | 9 |

**Proyecto:** NovaWeb - Botica Nova Salud  
**Documento:** Requerimientos del sistema
