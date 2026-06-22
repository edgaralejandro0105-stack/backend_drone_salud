const sequelize = require('../config/db');

const Usuario = require('./Usuario');
const Farmacia = require('./Farmacia');
const HorarioFarmacia = require('./HorarioFarmacia');
const Producto = require('./Producto');
const Pedido = require('./Pedido');
const DetallePedido = require('./DetallePedido');
const Pago = require('./Pago');
const FlotaDron = require('./FlotaDron');
const MantenimientoDron = require('./MantenimientoDron');
const OperadorVuelo = require('./OperadorVuelo');
const BitacoraTelemetria = require('./BitacoraTelemetria');
const DireccionCliente = require('./DireccionCliente');
const Calificacion = require('./Calificacion');

// ========== USUARIOS ==========
Usuario.belongsTo(Farmacia, { foreignKey: 'id_farmacia', as: 'farmacia' });
Farmacia.hasMany(Usuario, { foreignKey: 'id_farmacia', as: 'usuarios' });

// ========== FARMACIAS ==========
Farmacia.hasMany(HorarioFarmacia, { foreignKey: 'id_farmacia', as: 'horarios' });
HorarioFarmacia.belongsTo(Farmacia, { foreignKey: 'id_farmacia', as: 'farmacia' });

Farmacia.hasMany(Producto, { foreignKey: 'id_farmacia', as: 'productos' });
Producto.belongsTo(Farmacia, { foreignKey: 'id_farmacia', as: 'farmacia' });

// ========== OPERADORES ==========
OperadorVuelo.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Usuario.hasOne(OperadorVuelo, { foreignKey: 'id_usuario', as: 'operador' });

// ========== PEDIDOS ==========
Pedido.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'cliente' });
Usuario.hasMany(Pedido, { foreignKey: 'id_cliente', as: 'pedidos' });

Pedido.belongsTo(Farmacia, { foreignKey: 'id_farmacia', as: 'farmacia' });
Farmacia.hasMany(Pedido, { foreignKey: 'id_farmacia', as: 'pedidos' });

Pedido.belongsTo(FlotaDron, { foreignKey: 'id_dron', as: 'dron' });
FlotaDron.hasMany(Pedido, { foreignKey: 'id_dron', as: 'pedidos' });

Pedido.belongsTo(OperadorVuelo, { foreignKey: 'id_operador', as: 'operador' });
OperadorVuelo.hasMany(Pedido, { foreignKey: 'id_operador', as: 'pedidos' });

// ========== DETALLE PEDIDO ==========
DetallePedido.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedido' });
Pedido.hasMany(DetallePedido, { foreignKey: 'id_pedido', as: 'detalles' });

DetallePedido.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });
Producto.hasMany(DetallePedido, { foreignKey: 'id_producto', as: 'detalles' });

// ========== PAGOS ==========
Pago.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedido' });
Pedido.hasOne(Pago, { foreignKey: 'id_pedido', as: 'pago' });

Pago.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'cliente' });
Pago.belongsTo(Farmacia, { foreignKey: 'id_farmacia', as: 'farmacia' });

// ========== MANTENIMIENTO ==========
MantenimientoDron.belongsTo(FlotaDron, { foreignKey: 'id_dron', as: 'dron' });
FlotaDron.hasMany(MantenimientoDron, { foreignKey: 'id_dron', as: 'mantenimientos' });

MantenimientoDron.belongsTo(OperadorVuelo, { foreignKey: 'id_operador', as: 'operador' });

// ========== TELEMETRIA ==========
BitacoraTelemetria.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedido' });
Pedido.hasMany(BitacoraTelemetria, { foreignKey: 'id_pedido', as: 'telemetria' });

// ========== DIRECCIONES ==========
DireccionCliente.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Usuario.hasMany(DireccionCliente, { foreignKey: 'id_usuario', as: 'direcciones' });

// ========== CALIFICACIONES ==========
Calificacion.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedido' });
Pedido.hasOne(Calificacion, { foreignKey: 'id_pedido', as: 'calificacion' });

Calificacion.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'cliente' });
Calificacion.belongsTo(Farmacia, { foreignKey: 'id_farmacia', as: 'farmacia' });
Calificacion.belongsTo(OperadorVuelo, { foreignKey: 'id_operador', as: 'operador' });

module.exports = {
  sequelize,
  Usuario,
  Farmacia,
  HorarioFarmacia,
  Producto,
  Pedido,
  DetallePedido,
  Pago,
  FlotaDron,
  MantenimientoDron,
  OperadorVuelo,
  BitacoraTelemetria,
  DireccionCliente,
  Calificacion
};