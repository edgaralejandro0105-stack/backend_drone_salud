const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OperadorVuelo = sequelize.define('OperadorVuelo', {
  id_operador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  cedula: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  nombre_operador: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(60),
    defaultValue: ''
  },
  telefono: {
    type: DataTypes.STRING(15),
    defaultValue: ''
  },
  email: {
    type: DataTypes.STRING(60),
    defaultValue: ''
  },
  nro_licencia: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  tipo_licencia: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  horas_vuelo: {
    type: DataTypes.DECIMAL(8,2),
    defaultValue: 0,
    validate: { min: 0 }
  },
  foto_url: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  estado_disponibilidad: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fecha_ingreso: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'operadores_vuelo',
  timestamps: false
});

module.exports = OperadorVuelo;