CREATE DATABASE IF NOT EXISTS botica_nova
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE botica_nova;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('ADMIN','VENDEDOR') NOT NULL DEFAULT 'VENDEDOR',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS proveedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  telefono VARCHAR(30),
  email VARCHAR(160),
  direccion VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(60) NOT NULL UNIQUE,
  nombre VARCHAR(180) NOT NULL,
  descripcion TEXT,
  categoria_id INT NULL,
  precio_venta DECIMAL(10,2) NOT NULL,
  costo_unitario DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  stock_minimo INT NOT NULL DEFAULT 5,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  CONSTRAINT chk_producto_precio CHECK (precio_venta >= 0),
  CONSTRAINT chk_producto_stock CHECK (stock >= 0)
);

CREATE TABLE IF NOT EXISTS compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proveedor_id INT NULL,
  usuario_id INT NOT NULL,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  observacion VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS compra_detalles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  compra_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  costo_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (compra_id) REFERENCES compras(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  metodo_pago VARCHAR(40) NOT NULL DEFAULT 'EFECTIVO',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS venta_detalles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (venta_id) REFERENCES ventas(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  tipo ENUM('ENTRADA','SALIDA','AJUSTE') NOT NULL,
  cantidad INT NOT NULL,
  referencia VARCHAR(100),
  observacion VARCHAR(255),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_movimientos_producto_fecha ON movimientos_inventario(producto_id, creado_en);
CREATE INDEX idx_ventas_fecha ON ventas(creado_en);
