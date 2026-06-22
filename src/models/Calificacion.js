const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Calificacion = sequelize.define('Calificacion', {
  id_calificacion: {
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
  id_operador: {
    type: DataTypes.INTEGER
  },
  puntuacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comentario: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'calificaciones',
  timestamps: false
});

module.exports = Calificacion;