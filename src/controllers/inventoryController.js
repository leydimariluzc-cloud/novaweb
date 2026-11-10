const db = require('../config/db');
const { registrarMovimiento } = require('../services/inventory');

async function listar(req, res, next) {
  try {
    const [rows] = await db.execute(
      `SELECT id, codigo, nombre, stock, stock_minimo,
       CASE WHEN stock <= stock_minimo THEN 'BAJO' ELSE 'NORMAL' END AS estado
       FROM productos WHERE activo=1 ORDER BY nombre`
    );
    res.json(rows);
  } catch (error) { next(error); }
}

async function alertas(req, res, next) {
  try {
    const [rows] = await db.execute(
      `SELECT id, codigo, nombre, stock, stock_minimo
       FROM productos WHERE activo=1 AND stock <= stock_minimo ORDER BY stock ASC`
    );
    res.json({ cantidad: rows.length, alertas: rows });
  } catch (error) { next(error); }
}

async function ajustar(req, res, next) {
  const conn = await db.getConnection();
  try {
    const productoId = Number(req.params.id);
    const nuevaCantidad = Number(req.body.stock);
    const observacion = req.body.observacion;
    if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 0 || !observacion) {
      return res.status(400).json({ mensaje: 'Indica un stock entero no negativo y el motivo del ajuste.' });
    }
    await conn.beginTransaction();
    const [rows] = await conn.execute('SELECT stock FROM productos WHERE id=? AND activo=1 FOR UPDATE', [productoId]);
    if (!rows[0]) { await conn.rollback(); return res.status(404).json({ mensaje: 'Producto no encontrado.' }); }
    const diferencia = nuevaCantidad - rows[0].stock;
    await conn.execute('UPDATE productos SET stock=? WHERE id=?', [nuevaCantidad, productoId]);
    if (diferencia !== 0) {
      await registrarMovimiento(conn, {
        productoId, usuarioId: req.usuario.id, tipo: 'AJUSTE',
        cantidad: Math.abs(diferencia), observacion
      });
    }
    await conn.commit();
    res.json({ mensaje: 'Inventario actualizado.', stock: nuevaCantidad });
  } catch (error) {
    await conn.rollback();
    next(error);
  } finally { conn.release(); }
}

async function movimientos(req, res, next) {
  try {
    const [rows] = await db.execute(
      `SELECT m.*, p.nombre AS producto, u.nombre AS usuario
       FROM movimientos_inventario m
       JOIN productos p ON p.id=m.producto_id
       JOIN usuarios u ON u.id=m.usuario_id
       ORDER BY m.creado_en DESC LIMIT 200`
    );
    res.json(rows);
  } catch (error) { next(error); }
}

module.exports = { listar, alertas, ajustar, movimientos };
