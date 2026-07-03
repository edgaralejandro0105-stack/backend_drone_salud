const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FlotaDron = sequelize.define('FlotaDron', {
  id_dron: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  modelo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  fabricante: {
    type: DataTypes.STRING(30),
    defaultValue: ''
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  numero_serie: {
    type: DataTypes.STRING(50),
    unique: true
  },
  peso_maximo_despegue_kg: {
    type: DataTypes.DECIMAL(6,2)
  },
  fecha_adquisicion: {
    type: DataTypes.DATEONLY
  },
  estado_operativo: {
    type: DataTypes.STRING(20),
    defaultValue: 'Activo',
    validate: {
      isIn: [['Activo', 'Transito', 'Mantenimiento', 'Cancelado']]
    }
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
  motivo_mantenimiento: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  tableName: 'flota_drones',
  timestamps: false
});

module.exports = FlotaDron;