const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Farmacia = sequelize.define('Farmacia', {
  id_farmacia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rif: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  nombre_comercial: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(15),
    defaultValue: ''
  },
  telefono_responsable: {
    type: DataTypes.STRING(15),
    defaultValue: ''
  },
  email: {
    type: DataTypes.STRING(60),
    defaultValue: ''
  },
  ciudad: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  direccion: {
    type: DataTypes.STRING(150),
    defaultValue: ''
  },
  lat: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  lng: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  logo_url: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  foto_fachada_url: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  pago_movil_banco: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  pago_movil_telefono: {
    type: DataTypes.STRING(15),
    defaultValue: ''
  },
  pago_movil_ci: {
    type: DataTypes.STRING(15),
    defaultValue: ''
  },
  pago_movil_titular: {
    type: DataTypes.STRING(60),
    defaultValue: ''
  },
  estado_operativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  verificada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fecha_verificacion: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'farmacias_asociadas',
  timestamps: false
});

module.exports = Farmacia;