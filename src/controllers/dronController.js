const dronService = require('../services/dron.service');
const catchAsync = require('../utils/catchAsync');

const create = catchAsync(async (req, res) => {
  const dron = await dronService.create(req.body);
  res.status(201).json(dron);
});

const getAll = catchAsync(async (req, res) => {
  const drones = await dronService.getAll();
  res.json(drones);
});

const getById = catchAsync(async (req, res) => {
  const dron = await dronService.getById(req.params.id);
  res.json(dron);
});

const update = catchAsync(async (req, res) => {
  const dron = await dronService.update(req.params.id, req.body);
  res.json(dron);
});

const remove = catchAsync(async (req, res) => {
  const result = await dronService.remove(req.params.id);
  res.json(result);
});

const getDisponibles = catchAsync(async (req, res) => {
  const drones = await dronService.getDisponibles();
  res.json(drones);
});

module.exports = { create, getAll, getById, update, remove, getDisponibles };