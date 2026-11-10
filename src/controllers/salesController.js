const db = require('../config/db');
const { registrarMovimiento } = require('../services/inventory');

async function crear(req, res, next) {
  const conn = await db.getConnection();
  try {
    const { items, metodo_pago = 'EFECTIVO' } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: 'La venta debe contener al menos un producto.' });
    }
    await conn.beginTransaction();

    let total = 0;
    const detalle = [];
    for (const item of items) {
      const productoId = Number(item.producto_id);
      const cantidad = Number(item.cantidad);
      if (!Number.isInteger(productoId) || !Number.isInteger(cantidad) || cantidad <= 0) {
        throw Object.assign(new Error('Producto o cantidad inválidos.'), { status: 400 });
      }
      const [rows] = await conn.execute(
        'SELECT id, nombre, precio_venta, stock FROM productos WHERE id=? AND activo=1 FOR UPDATE',
        [productoId]
      );
      const producto = rows[0];
      if (!producto) throw Object.assign(new Error(`Producto ${productoId} no encontrado.`), { status: 404 });
      if (producto.stock < cantidad) {
        throw Object.assign(new Error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}.`), { status: 409 });
      }
      const precio = Number(producto.precio_venta);
      const subtotal = precio * cantidad;
      total += subtotal;
      detalle.push({ productoId, cantidad, precio, subtotal });
    }

    const [venta] = await conn.execute(
      'INSERT INTO ventas (usuario_id, total, metodo_pago) VALUES (?, ?, ?)',
      [req.usuario.id, total, metodo_pago]
    );

    for (const item of detalle) {
      await conn.execute(
        'INSERT INTO venta_detalles (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [venta.insertId, item.productoId, item.cantidad, item.precio, item.subtotal]
      );
      await conn.execute('UPDATE productos SET stock=stock-? WHERE id=?', [item.cantidad, item.productoId]);
      await registrarMovimiento(conn, {
        productoId: item.productoId, usuarioId: req.usuario.id,
        tipo: 'SALIDA', cantidad: item.cantidad, referencia: `VENTA-${venta.insertId}`
      });
    }

    await conn.commit();
    res.status(201).json({ mensaje: 'Venta registrada correctamente.', venta_id: venta.insertId, total });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally { conn.release(); }
}

async function listar(req, res, next) {
  try {
    const [rows] = await db.execute(
      `SELECT v.*, u.nombre AS vendedor FROM ventas v
       JOIN usuarios u ON u.id=v.usuario_id ORDER BY v.creado_en DESC LIMIT 200`
    );
    res.json(rows);
  } catch (error) { next(error); }
}

module.exports = { crear, listar };
