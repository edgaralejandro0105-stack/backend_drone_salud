const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DireccionCliente = sequelize.define('DireccionCliente', {
  id_direccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre_direccion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  latitud: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  longitud: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  }
}, {
  tableName: 'direcciones_cliente',
  timestamps: false
});

module.exports = DireccionCliente;