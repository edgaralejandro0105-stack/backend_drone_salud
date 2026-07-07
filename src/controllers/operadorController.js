const operadorService = require('../services/operador.service');
const catchAsync = require('../utils/catchAsync');

const create = catchAsync(async (req, res) => {
  const operador = await operadorService.create(req.body);
  res.status(201).json(operador);
});

const getAll = catchAsync(async (req, res) => {
  const { search, page, limit } = req.query;
  const result = await operadorService.getAll({
    search,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  });
  res.json(result);
});

const getById = catchAsync(async (req, res) => {
  const operador = await operadorService.getById(req.params.id);
  res.json(operador);
});

const update = catchAsync(async (req, res) => {
  const operador = await operadorService.update(req.params.id, req.body);
  res.json(operador);
});

const remove = catchAsync(async (req, res) => {
  const result = await operadorService.remove(req.params.id);
  res.json(result);
});

module.exports = { create, getAll, getById, update, remove };