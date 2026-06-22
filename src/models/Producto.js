const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_farmacia: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  concentracion: {
    type: DataTypes.STRING(30),
    defaultValue: ''
  },
  categoria: {
    type: DataTypes.STRING(30),
    defaultValue: ''
  },
  unidad_medida: {
    type: DataTypes.STRING(20),
    defaultValue: 'Unidades'
  },
  precio: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false,
    validate: { min: 0 }
  },
  stock_actual: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: { min: 0 }
  },
  especificaciones: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  foto_url: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'productos',
  timestamps: false
});

module.exports = Producto;