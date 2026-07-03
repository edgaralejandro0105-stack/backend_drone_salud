const farmaciaService = require('../services/farmacia.service');
const catchAsync = require('../utils/catchAsync');

const create = catchAsync(async (req, res) => {
  const farmacia = await farmaciaService.create(req.validatedBody);
  res.status(201).json(farmacia);
});

const getAll = catchAsync(async (req, res) => {
  const farmacias = await farmaciaService.getAll();
  res.json(farmacias);
});

const getById = catchAsync(async (req, res) => {
  const farmacia = await farmaciaService.getById(req.params.id);
  res.json(farmacia);
});

const update = catchAsync(async (req, res) => {
  const farmacia = await farmaciaService.update(req.params.id, req.body);
  res.json(farmacia);
});

const remove = catchAsync(async (req, res) => {
  const result = await farmaciaService.remove(req.params.id);
  res.json(result);
});

const updateOwn = catchAsync(async (req, res) => {
  const farmacia = await farmaciaService.updateOwn(req.user.id_farmacia, req.body);
  res.json(farmacia);
});

const getOwnStats = catchAsync(async (req, res) => {
  const { desde, hasta } = req.query;
  const stats = await farmaciaService.getStats(req.user.id_farmacia, { desde, hasta });
  res.json(stats);
});

module.exports = { create, getAll, getById, update, updateOwn, getOwnStats, remove };