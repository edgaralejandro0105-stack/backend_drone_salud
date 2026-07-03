const pedidoService = require('../services/pedido.service');
const catchAsync = require('../utils/catchAsync');

const create = catchAsync(async (req, res) => {
  const pedido = await pedidoService.create(req.user.id_usuario, req.validatedBody);
  res.status(201).json(pedido);
});

const getAll = catchAsync(async (req, res) => {
  const { id_farmacia, estado_pedido, desde, hasta } = req.query;
  const filtros = {};
  if (req.user.tipo_usuario === 'cliente') filtros.id_cliente = req.user.id_usuario;
  if (req.user.tipo_usuario === 'farmacia') filtros.id_farmacia = req.user.id_farmacia;
  if (id_farmacia) filtros.id_farmacia = id_farmacia;
  if (estado_pedido) filtros.estado_pedido = estado_pedido;
  if (desde) filtros.desde = desde;
  if (hasta) filtros.hasta = hasta;

  const pedidos = await pedidoService.getAll(filtros);
  res.json(pedidos);
});

const getById = catchAsync(async (req, res) => {
  const pedido = await pedidoService.getById(req.params.id);
  res.json(pedido);
});

const updateEstado = catchAsync(async (req, res) => {
  const pedido = await pedidoService.updateEstado(req.params.id, req.body.estado_pedido);
  res.json(pedido);
});

const asignarDronOperador = catchAsync(async (req, res) => {
  const { id_dron, id_operador } = req.body;
  const id_usuario_despacho = req.user.id_usuario;
  const pedido = await pedidoService.asignarDronOperador(req.params.id, id_dron, id_operador, id_usuario_despacho);
  res.json(pedido);
});

const liberarPedido = catchAsync(async (req, res) => {
  const pedido = await pedidoService.liberarPedido(req.params.id);
  res.json(pedido);
});

module.exports = { create, getAll, getById, updateEstado, asignarDronOperador, liberarPedido };
