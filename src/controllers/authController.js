const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios.' });
    }

    const [rows] = await db.execute(
      'SELECT id, nombre, email, password_hash, rol, activo FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );
    const usuario = rows[0];

    if (!usuario || !usuario.activo || !(await bcrypt.compare(password, usuario.password_hash))) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      mensaje: 'Inicio de sesión correcto.',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) { next(error); }
}

async function crearUsuario(req, res, next) {
  try {
    const { nombre, email, password, rol = 'VENDEDOR' } = req.body;
    if (!nombre || !email || !password || password.length < 8) {
      return res.status(400).json({ mensaje: 'Completa nombre, email y contraseña de al menos 8 caracteres.' });
    }
    if (!['ADMIN', 'VENDEDOR'].includes(rol)) {
      return res.status(400).json({ mensaje: 'Rol no válido.' });
    }
    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, rol]
    );
    res.status(201).json({ mensaje: 'Usuario creado.', id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'El email ya está registrado.' });
    next(error);
  }
}

module.exports = { login, crearUsuario };
