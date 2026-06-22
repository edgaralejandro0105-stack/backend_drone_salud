const { Sequelize } = require('sequelize');
require('dotenv').config();

const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');

const dialectOptions = isLocal ? {} : {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  timezone: '+00:00',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida');
  } catch (error) {
    console.error('❌ Error de conexión a BD:', error);
  }
};

testConnection();

module.exports = sequelize;