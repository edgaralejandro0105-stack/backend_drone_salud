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
const direccionRoutes = require('./routes/direcciones.routes');

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
app.use('/api/direcciones', direccionRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.sync();

    try {
      await sequelize.query(`ALTER TABLE flota_drones DROP CONSTRAINT IF EXISTS "flota_drones_estado_operativo_check"`);
      await sequelize.query(`ALTER TABLE flota_drones ADD CONSTRAINT "flota_drones_estado_operativo_check" CHECK (estado_operativo IN ('Activo', 'Transito', 'Mantenimiento', 'Cancelado'))`);
      await sequelize.query(`UPDATE flota_drones SET estado_operativo = 'Activo' WHERE estado_operativo NOT IN ('Activo', 'Mantenimiento', 'Cancelado')`);
      console.log('✅ Restriccion de estado de drones actualizada');
    } catch (err) {
      console.log('⚠️  No se pudo actualizar la restriccion (probablemente ya esta actualizada):', err.message);
    }

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