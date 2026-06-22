const pagoService = require('../services/pago.service');
const catchAsync = require('../utils/catchAsync');

const getAll = catchAsync(async (req, res) => {
  const filtros = {};
  if (req.user.tipo_usuario === 'cliente') filtros.id_cliente = req.user.id_usuario;
  if (req.user.tipo_usuario === 'farmacia') filtros.id_farmacia = req.user.id_farmacia;

  const pagos = await pagoService.getAll(filtros);
  res.json(pagos);
});

const create = catchAsync(async (req, res) => {
  const pago = await pagoService.create({ ...req.body, id_cliente: req.user.id_usuario });
  res.status(201).json(pago);
});

const confirmarPago = catchAsync(async (req, res) => {
  const pago = await pagoService.confirmarPago(req.params.id);
  res.json(pago);
});

module.exports = { getAll, create, confirmarPago };