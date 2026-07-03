const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SuspensionHistorial = sequelize.define('SuspensionHistorial', {
  id_suspension: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  suspendido_por: {
    type: DataTypes.INTEGER
  },
  motivo: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  fecha_suspension: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_activacion: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'historial_suspensiones',
  timestamps: false
});

module.exports = SuspensionHistorial;
