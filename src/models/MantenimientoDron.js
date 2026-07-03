const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MantenimientoDron = sequelize.define('MantenimientoDron', {
  id_mantenimiento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_dron: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER
  },
  tipo_servicio: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['Preventivo', 'Correctivo', 'Inspeccion', 'Reparacion']]
    }
  },
  descripcion_falla: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_completado: {
    type: DataTypes.DATE
  },
  estado: {
    type: DataTypes.STRING(15),
    defaultValue: 'Pendiente',
    validate: {
      isIn: [['Pendiente', 'En progreso', 'Completado']]
    }
  }
}, {
  tableName: 'mantenimiento_drones',
  timestamps: false
});

module.exports = MantenimientoDron;
