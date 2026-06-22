const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(60),
    defaultValue: ''
  },
  cedula: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(15),
    defaultValue: ''
  },
  tipo_usuario: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      isIn: [['admin', 'cliente', 'farmacia', 'operador']]
    }
  },
  direccion: {
    type: DataTypes.STRING(150),
    defaultValue: ''
  },
  foto_url: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  id_farmacia: {
    type: DataTypes.INTEGER
  },
  estado_cuenta: {
    type: DataTypes.STRING(15),
    defaultValue: 'Activo',
    validate: {
      isIn: [['Activo', 'Suspendido', 'Inactivo']]
    }
  },
  ultimo_acceso: {
    type: DataTypes.DATE
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;