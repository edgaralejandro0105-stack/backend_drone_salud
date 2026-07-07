const pedidoService = require('../services/pedido.service');
const catchAsync = require('../utils/catchAsync');

const create = catchAsync(async (req, res) => {
  const pedido = await pedidoService.create(req.user.id_usuario, req.validatedBody);
  res.status(201).json(pedido);
});

const getAll = catchAsync(async (req, res) => {
  const { id_farmacia, id_operador, id_usuario_despacho, estado_pedido, desde, hasta, search, page, limit } = req.query;
  const filtros = {};
  if (req.user.tipo_usuario === 'cliente') filtros.id_cliente = req.user.id_usuario;
  if (req.user.tipo_usuario === 'farmacia') filtros.id_farmacia = req.user.id_farmacia;
  if (id_farmacia) filtros.id_farmacia = parseInt(id_farmacia);
  if (id_operador) filtros.id_operador = parseInt(id_operador);
  if (id_usuario_despacho) filtros.id_usuario_despacho = parseInt(id_usuario_despacho);
  if (estado_pedido) filtros.estado_pedido = estado_pedido;
  if (desde) filtros.desde = desde;
  if (hasta) filtros.hasta = hasta;
  if (search) filtros.search = search;
  filtros.page = parseInt(page) || 1;
  filtros.limit = parseInt(limit) || 10;

  const result = await pedidoService.getAll(filtros);
  res.json(result);
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
