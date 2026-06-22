const { Producto } = require('../models');
const AppError = require('../utils/AppError');

const create = async (data) => {
  return Producto.create(data);
};

const getAll = async (filtros = {}) => {
  const where = { activo: true };
  if (filtros.id_farmacia) where.id_farmacia = filtros.id_farmacia;
  if (filtros.categoria) where.categoria = filtros.categoria;

  return Producto.findAll({ where, order: [['nombre', 'ASC']] });
};

const getById = async (id) => {
  const producto = await Producto.findByPk(id);
  if (!producto) throw new AppError('Producto no encontrado', 404);
  return producto;
};

const update = async (id, data) => {
  const producto = await Producto.findByPk(id);
  if (!producto) throw new AppError('Producto no encontrado', 404);
  await producto.update(data);
  return producto;
};

const remove = async (id) => {
  const producto = await Producto.findByPk(id);
  if (!producto) throw new AppError('Producto no encontrado', 404);
  await producto.update({ activo: false });
  return { message: 'Producto desactivado' };
};

module.exports = { create, getAll, getById, update, remove };