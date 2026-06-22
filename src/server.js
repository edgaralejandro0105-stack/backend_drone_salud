const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const farmaciaRoutes = require('./routes/farmacias.routes');
const productoRoutes = require('./routes/productos.routes');
const pedidoRoutes = require('./routes/pedidos.routes');
const pagoRoutes = require('./routes/pagos.routes');
const dronRoutes = require('./routes/drones.routes');
const operadorRoutes = require('./routes/operadores.routes');
const uploadRoutes = require('./routes/upload.routes');
const usuarioRoutes = require('./routes/usuarios.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/farmacias', farmaciaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/drones', dronRoutes);
app.use('/api/operadores', operadorRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.sync();
    console.log('📦 Modelos sincronizados con la base de datos');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('💥 Error al iniciar el servidor:', error);
  }
};

start();

module.exports = app;