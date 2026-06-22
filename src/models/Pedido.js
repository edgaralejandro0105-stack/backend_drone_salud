const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pedido = sequelize.define('Pedido', {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_farmacia: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_dron: {
    type: DataTypes.INTEGER
  },
  id_operador: {
    type: DataTypes.INTEGER
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado_pedido: {
    type: DataTypes.STRING(20),
    defaultValue: 'Pendiente',
    validate: {
      isIn: [['Pendiente', 'Pagado', 'Preparado', 'En transito', 'Entregado', 'Cancelado', 'Reembolsado']]
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
    validate: { min: 0 }
  },
  cargo_dron: {
    type: DataTypes.DECIMAL(12,2),
    defaultValue: 5000,
    validate: { min: 0 }
  },
  iva: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
    validate: { min: 0 }
  },
  total: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
    validate: { min: 0 }
  },
  destino_nombre: {
    type: DataTypes.STRING(80),
    defaultValue: ''
  },
  destino_direccion: {
    type: DataTypes.STRING(150),
    defaultValue: ''
  },
  latitud_entrega: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  longitud_entrega: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  clima_verificado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  timestamp_inicio: {
    type: DataTypes.DATE
  },
  timestamp_fin: {
    type: DataTypes.DATE
  },
  consumo_energetico_mah: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'pedidos',
  timestamps: false
});

module.exports = Pedido;