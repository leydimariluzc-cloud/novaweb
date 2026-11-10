require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./config/db');
const { noEncontrado, manejarError } = require('./middleware/errors');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true
}));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/api/health', async (req, res, next) => {
  try {
    await db.query('SELECT 1');
    res.json({ estado: 'ok', aplicacion: 'Botica Nova Salud API', base_datos: 'conectada' });
  } catch (error) { next(error); }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/productos', require('./routes/productRoutes'));
app.use('/api/inventario', require('./routes/inventoryRoutes'));
app.use('/api/ventas', require('./routes/salesRoutes'));
app.use('/api/compras', require('./routes/purchaseRoutes'));

app.use(noEncontrado);
app.use(manejarError);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Botica Nova Salud API escuchando en el puerto ${PORT}`);
});
