const db = require('../config/db');
const { registrarMovimiento } = require('../services/inventory');

async function crear(req, res, next) {
  const conn = await db.getConnection();
  try {
    const { proveedor_id = null, observacion = null, items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: 'La compra debe contener productos.' });
    }
    await conn.beginTransaction();
    let total = 0;
    const detalles = [];

    for (const item of items) {
      const productoId = Number(item.producto_id);
      const cantidad = Number(item.cantidad);
      const costo = Number(item.costo_unitario);
      if (!Number.isInteger(productoId) || !Number.isInteger(cantidad) || cantidad <= 0 || !Number.isFinite(costo) || costo < 0) {
        throw Object.assign(new Error('Detalle de compra inválido.'), { status: 400 });
      }
      const [p] = await conn.execute('SELECT id FROM productos WHERE id=? AND activo=1 FOR UPDATE', [productoId]);
      if (!p[0]) throw Object.assign(new Error(`Producto ${productoId} no encontrado.`), { status: 404 });
      const subtotal = cantidad * costo;
      total += subtotal;
      detalles.push({ productoId, cantidad, costo, subtotal });
    }

    const [compra] = await conn.execute(
      'INSERT INTO compras (proveedor_id, usuario_id, total, observacion) VALUES (?, ?, ?, ?)',
      [proveedor_id, req.usuario.id, total, observacion]
    );

    for (const item of detalles) {
      await conn.execute(
        'INSERT INTO compra_detalles (compra_id, producto_id, cantidad, costo_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [compra.insertId, item.productoId, item.cantidad, item.costo, item.subtotal]
      );
      await conn.execute(
        'UPDATE productos SET stock=stock+?, costo_unitario=? WHERE id=?',
        [item.cantidad, item.costo, item.productoId]
      );
      await registrarMovimiento(conn, {
        productoId: item.productoId, usuarioId: req.usuario.id,
        tipo: 'ENTRADA', cantidad: item.cantidad, referencia: `COMPRA-${compra.insertId}`
      });
    }

    await conn.commit();
    res.status(201).json({ mensaje: 'Compra registrada y stock actualizado.', compra_id: compra.insertId, total });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally { conn.release(); }
}

async function listar(req, res, next) {
  try {
    const [rows] = await db.execute(
      `SELECT c.*, p.nombre AS proveedor, u.nombre AS usuario
       FROM compras c LEFT JOIN proveedores p ON p.id=c.proveedor_id
       JOIN usuarios u ON u.id=c.usuario_id ORDER BY c.creado_en DESC LIMIT 200`
    );
    res.json(rows);
  } catch (error) { next(error); }
}

module.exports = { crear, listar };
