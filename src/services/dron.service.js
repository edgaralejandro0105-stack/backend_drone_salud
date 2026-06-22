const { FlotaDron, MantenimientoDron } = require('../models');
const AppError = require('../utils/AppError');

const create = async (data) => {
  return FlotaDron.create(data);
};

const getAll = async () => {
  return FlotaDron.findAll({ order: [['id_dron', 'ASC']] });
};

const getById = async (id) => {
  const dron = await FlotaDron.findByPk(id);
  if (!dron) throw new AppError('Dron no encontrado', 404);
  return dron;
};

const update = async (id, data) => {
  const dron = await FlotaDron.findByPk(id);
  if (!dron) throw new AppError('Dron no encontrado', 404);
  await dron.update(data);
  return dron;
};

const remove = async (id) => {
  const dron = await FlotaDron.findByPk(id);
  if (!dron) throw new AppError('Dron no encontrado', 404);
  await dron.destroy();
  return { message: 'Dron eliminado correctamente' };
};

const getDisponibles = async () => {
  return FlotaDron.findAll({
    where: { estado_operativo: 'Disponible' },
    order: [['id_dron', 'ASC']]
  });
};

module.exports = { create, getAll, getById, update, remove, getDisponibles };