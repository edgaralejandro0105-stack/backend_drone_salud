const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pago = sequelize.define('Pago', {
  id_pago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_farmacia: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metodo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['PagoMovil', 'Transferencia', 'Efectivo', 'Zelle', 'PuntoDeVenta']]
    }
  },
  monto: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
    validate: { min: 0 }
  },
  referencia: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  estado_pago: {
    type: DataTypes.STRING(15),
    defaultValue: 'Pendiente',
    validate: {
      isIn: [['Pendiente', 'Confirmado', 'Rechazado', 'Reembolsado']]
    }
  },
  datos_adicionales: {
    type: DataTypes.JSONB
  },
  fecha_pago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_confirmacion: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'pagos',
  timestamps: false
});

module.exports = Pago;