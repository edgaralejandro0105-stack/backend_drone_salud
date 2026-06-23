const { DireccionCliente } = require('../models');
const AppError = require('../utils/AppError');

const getAll = async (id_usuario) => {
  return DireccionCliente.findAll({
    where: { id_usuario },
    order: [['id_direccion', 'DESC']]
  });
};

const create = async (id_usuario, data) => {
  const direccion = await DireccionCliente.create({
    id_usuario,
    nombre_direccion: data.nombre_direccion,
    direccion: data.direccion,
    ciudad: data.ciudad || '',
    latitud: data.latitud || '',
    longitud: data.longitud || ''
  });
  return direccion;
};

const remove = async (id_usuario, id_direccion) => {
  const direccion = await DireccionCliente.findOne({
    where: { id_direccion, id_usuario }
  });
  if (!direccion) throw new AppError('Dirección no encontrada', 404);
  await direccion.destroy();
  return { message: 'Dirección eliminada correctamente' };
};

module.exports = { getAll, create, remove };
