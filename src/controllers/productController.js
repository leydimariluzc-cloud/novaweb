const db = require('../config/db');

async function listar(req, res, next) {
  try {
    const { buscar = '', categoria } = req.query;
    let sql = `SELECT p.*, c.nombre AS categoria
               FROM productos p LEFT JOIN categorias c ON c.id = p.categoria_id
               WHERE p.activo = 1 AND p.nombre LIKE ?`;
    const params = [`%${buscar}%`];
    if (categoria) { sql += ' AND p.categoria_id = ?'; params.push(categoria); }
    sql += ' ORDER BY p.nombre';
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (error) { next(error); }
}

async function obtener(req, res, next) {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM productos WHERE id = ? AND activo = 1',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    res.json(rows[0]);
  } catch (error) { next(error); }
}

async function crear(req, res, next) {
  try {
    const { codigo, nombre, descripcion = null, categoria_id = null, precio_venta, costo_unitario = 0, stock = 0, stock_minimo = 5 } = req.body;
    if (!codigo || !nombre || !Number.isFinite(Number(precio_venta)) ||
        Number(precio_venta) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0 ||
        !Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0) {
      return res.status(400).json({ mensaje: 'Datos del producto inválidos.' });
    }
    const [result] = await db.execute(
      `INSERT INTO productos
       (codigo, nombre, descripcion, categoria_id, precio_venta, costo_unitario, stock, stock_minimo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo, nombre, descripcion, categoria_id, precio_venta, costo_unitario, stock, stock_minimo]
    );
    res.status(201).json({ mensaje: 'Producto registrado.', id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'El código del producto ya existe.' });
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const { codigo, nombre, descripcion = null, categoria_id = null, precio_venta, costo_unitario = 0, stock_minimo = 5 } = req.body;
    if (!codigo || !nombre || !Number.isFinite(Number(precio_venta)) || Number(precio_venta) < 0 ||
        !Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0) {
      return res.status(400).json({ mensaje: 'Datos inválidos.' });
    }
    const [result] = await db.execute(
      `UPDATE productos SET codigo=?, nombre=?, descripcion=?, categoria_id=?,
       precio_venta=?, costo_unitario=?, stock_minimo=? WHERE id=? AND activo=1`,
      [codigo, nombre, descripcion, categoria_id, precio_venta, costo_unitario, stock_minimo, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    res.json({ mensaje: 'Producto actualizado.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'El código ya está asignado a otro producto.' });
    next(error);
  }
}

async function desactivar(req, res, next) {
  try {
    const [result] = await db.execute('UPDATE productos SET activo=0 WHERE id=? AND activo=1', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    res.json({ mensaje: 'Producto desactivado.' });
  } catch (error) { next(error); }
}

module.exports = { listar, obtener, crear, actualizar, desactivar };
