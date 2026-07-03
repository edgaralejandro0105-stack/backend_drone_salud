const mantenimientoService = require('../services/mantenimiento.service');
const catchAsync = require('../utils/catchAsync');

const create = catchAsync(async (req, res) => {
  const registro = await mantenimientoService.create(req.body);
  res.status(201).json(registro);
});

const getAll = catchAsync(async (req, res) => {
  const registros = await mantenimientoService.getAll();
  res.json(registros);
});

const getByDron = catchAsync(async (req, res) => {
  const registros = await mantenimientoService.getByDron(req.params.id_dron);
  res.json(registros);
});

const getById = catchAsync(async (req, res) => {
  const registro = await mantenimientoService.getById(req.params.id);
  res.json(registro);
});

const update = catchAsync(async (req, res) => {
  const registro = await mantenimientoService.update(req.params.id, req.body);
  res.json(registro);
});

const completar = catchAsync(async (req, res) => {
  const registro = await mantenimientoService.completar(req.params.id);
  res.json(registro);
});

const remove = catchAsync(async (req, res) => {
  const result = await mantenimientoService.remove(req.params.id);
  res.json(result);
});

module.exports = { create, getAll, getByDron, getById, update, completar, remove };
