const { Configuracion } = require('../models');
const AppError = require('../utils/AppError');

const getAll = async () => {
  return Configuracion.findAll({ order: [['clave', 'ASC']] });
};

const getByClave = async (clave) => {
  const config = await Configuracion.findOne({ where: { clave } });
  if (!config) return null;
  return config;
};

const upsert = async (clave, valor, descripcion) => {
  const existente = await Configuracion.findOne({ where: { clave } });
  if (existente) {
    await existente.update({
      valor: String(valor),
      descripcion: descripcion || '',
      fecha_actualizacion: new Date()
    });
    return existente;
  }
  return Configuracion.create({
    clave,
    valor: String(valor),
    descripcion: descripcion || '',
    fecha_actualizacion: new Date()
  });
};

module.exports = { getAll, getByClave, upsert };
