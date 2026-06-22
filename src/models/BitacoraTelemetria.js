const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BitacoraTelemetria = sequelize.define('BitacoraTelemetria', {
  id_log: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fase_vuelo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['Despegue', 'Ruta', 'Aproximacion', 'Aterrizaje']]
    }
  },
  latitud_actual: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  longitud_actual: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  altitud: {
    type: DataTypes.DECIMAL(8,2)
  },
  velocidad_nudos: {
    type: DataTypes.DECIMAL(6,2)
  },
  bateria_restante: {
    type: DataTypes.INTEGER
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'bitacora_telemetria',
  timestamps: false
});

module.exports = BitacoraTelemetria;