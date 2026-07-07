const { Producto } = require('../models');
const { Op } = require('sequelize');
const AppError = require('../utils/AppError');

const create = async (data) => {
  return Producto.create(data);
};

const getAll = async (filtros = {}) => {
  const where = { activo: true };
  if (filtros.id_farmacia) where.id_farmacia = filtros.id_farmacia;
  if (filtros.categoria) where.categoria = filtros.categoria;
  if (filtros.search) {
    where[Op.or] = [
      { nombre: { [Op.iLike]: `%${filtros.search}%` } },
      { codigo: { [Op.iLike]: `%${filtros.search}%` } },
      { concentracion: { [Op.iLike]: `%${filtros.search}%` } },
    ];
  }

  const page = filtros.page || 1;
  const limit = filtros.limit || 10;
  const offset = (page - 1) * limit;

  const { count, rows } = await Producto.findAndCountAll({
    where,
    order: [['nombre', 'ASC']],
    limit,
    offset,
  });
  return { data: rows, total: count, page, totalPages: Math.ceil(count / limit) };
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