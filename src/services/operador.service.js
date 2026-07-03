const { OperadorVuelo, Usuario } = require('../models');
const AppError = require('../utils/AppError');

const create = async (data) => {
  const existing = await OperadorVuelo.findOne({ where: { nro_licencia: data.nro_licencia } });
  if (existing) throw new AppError('El numero de licencia ya existe', 400);
  return OperadorVuelo.create(data);
};

const getAll = async () => {
  return OperadorVuelo.findAll({
    include: [{ model: Usuario, as: 'usuario', attributes: ['foto_url', 'estado_cuenta'] }],
    order: [['nombre_operador', 'ASC']]
  });
};

const getById = async (id) => {
  const operador = await OperadorVuelo.findByPk(id);
  if (!operador) throw new AppError('Operador no encontrado', 404);
  return operador;
};

const update = async (id, data) => {
  const operador = await OperadorVuelo.findByPk(id);
  if (!operador) throw new AppError('Operador no encontrado', 404);
  await operador.update(data);
  return operador;
};

const remove = async (id) => {
  const operador = await OperadorVuelo.findByPk(id);
  if (!operador) throw new AppError('Operador no encontrado', 404);
  const id_usuario = operador.id_usuario;
  await operador.destroy();
  await Usuario.destroy({ where: { id_usuario } });
  return { message: 'Operador eliminado correctamente' };
};

module.exports = { create, getAll, getById, update, remove };