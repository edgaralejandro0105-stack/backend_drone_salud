const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Configuracion = sequelize.define('Configuracion', {
  id_config: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clave: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  valor: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: ''
  },
  descripcion: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'configuraciones',
  timestamps: false
});

module.exports = Configuracion;
