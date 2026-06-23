const { FlotaDron, MantenimientoDron, Pedido } = require('../models');
const { Op } = require('sequelize');
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
  const activos = await FlotaDron.findAll({
    where: { estado_operativo: 'Activo' },
    order: [['id_dron', 'ASC']]
  });

  const enUso = await Pedido.findAll({
    attributes: ['id_dron'],
    where: {
      id_dron: { [Op.ne]: null },
      estado_pedido: { [Op.in]: ['Pendiente', 'Pagado', 'Preparado', 'En transito'] }
    }
  });

  const idsEnUso = new Set(enUso.map(p => p.id_dron));
  return activos.filter(d => !idsEnUso.has(d.id_dron));
};

const liberarDron = async (id_dron) => {
  const dron = await FlotaDron.findByPk(id_dron);
  if (!dron) throw new AppError('Dron no encontrado', 404);
  await dron.update({ estado_operativo: 'Activo' });
  return dron;
};

module.exports = { create, getAll, getById, update, remove, getDisponibles, liberarDron };