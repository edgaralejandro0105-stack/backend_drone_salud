const suspensionService = require('../services/suspension.service');
const catchAsync = require('../utils/catchAsync');

const getAll = catchAsync(async (req, res) => {
  const registros = await suspensionService.getAll();
  res.json(registros);
});

const getByUsuario = catchAsync(async (req, res) => {
  const registros = await suspensionService.getByUsuario(req.params.id_usuario);
  res.json(registros);
});

const getActiva = catchAsync(async (req, res) => {
  const registro = await suspensionService.getActiva(req.params.id_usuario);
  res.json(registro);
});

const suspender = catchAsync(async (req, res) => {
  const { motivo } = req.body;
  const registro = await suspensionService.suspender(req.params.id_usuario, req.user?.id_usuario, motivo);
  res.status(201).json(registro);
});

const activar = catchAsync(async (req, res) => {
  const result = await suspensionService.activar(req.params.id_usuario);
  res.json(result);
});

module.exports = { getAll, getByUsuario, getActiva, suspender, activar };
