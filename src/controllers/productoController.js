const productService = require('../services/producto.service');
const catchAsync = require('../utils/catchAsync');

const create = catchAsync(async (req, res) => {
  const producto = await productService.create(req.validatedBody);
  res.status(201).json(producto);
});

const getAll = catchAsync(async (req, res) => {
  const { id_farmacia, categoria } = req.query;
  const productos = await productService.getAll({ id_farmacia, categoria });
  res.json(productos);
});

const getById = catchAsync(async (req, res) => {
  const producto = await productService.getById(req.params.id);
  res.json(producto);
});

const update = catchAsync(async (req, res) => {
  const producto = await productService.update(req.params.id, req.body);
  res.json(producto);
});

const remove = catchAsync(async (req, res) => {
  const result = await productService.remove(req.params.id);
  res.json(result);
});

module.exports = { create, getAll, getById, update, remove };