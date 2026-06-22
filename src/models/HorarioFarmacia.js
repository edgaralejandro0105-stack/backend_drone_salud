const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HorarioFarmacia = sequelize.define('HorarioFarmacia', {
  id_horario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_farmacia: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dia_semana: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 7 }
  },
  hora_apertura: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_cierre: {
    type: DataTypes.TIME,
    allowNull: false
  },
  abierto: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'horarios_farmacia',
  timestamps: false
});

module.exports = HorarioFarmacia;