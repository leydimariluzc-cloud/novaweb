async function registrarMovimiento(conn, { productoId, usuarioId, tipo, cantidad, referencia, observacion }) {
  await conn.execute(
    `INSERT INTO movimientos_inventario
      (producto_id, usuario_id, tipo, cantidad, referencia, observacion)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [productoId, usuarioId, tipo, cantidad, referencia || null, observacion || null]
  );
}

module.exports = { registrarMovimiento };
