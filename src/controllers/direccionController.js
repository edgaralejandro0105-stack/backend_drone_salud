const direccionService = require('../services/direccion.service');
const catchAsync = require('../utils/catchAsync');

exports.getAll = catchAsync(async (req, res) => {
  const direcciones = await direccionService.getAll(req.user.id_usuario);
  res.json(direcciones);
});

exports.create = catchAsync(async (req, res) => {
  const direccion = await direccionService.create(req.user.id_usuario, req.body);
  res.status(201).json(direccion);
});

exports.remove = catchAsync(async (req, res) => {
  const result = await direccionService.remove(req.user.id_usuario, req.params.id);
  res.json(result);
});
