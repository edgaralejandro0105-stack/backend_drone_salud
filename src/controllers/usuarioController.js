const usuarioService = require('../services/usuario.service');
const catchAsync = require('../utils/catchAsync');

const getAll = catchAsync(async (req, res) => {
  const { tipo, search, page, limit } = req.query;
  const result = await usuarioService.getAll({
    tipo,
    search,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  });
  res.json(result);
});

const getById = catchAsync(async (req, res) => {
  const usuario = await usuarioService.getById(req.params.id);
  res.json(usuario);
});

const update = catchAsync(async (req, res) => {
  const usuario = await usuarioService.update(req.params.id, req.body);
  res.json(usuario);
});

const updateEstado = catchAsync(async (req, res) => {
  const { estado, motivo_suspension } = req.body;
  const usuario = await usuarioService.updateEstado(req.params.id, estado, req.user?.id_usuario, motivo_suspension);
  res.json(usuario);
});

const remove = catchAsync(async (req, res) => {
  const result = await usuarioService.remove(req.params.id);
  res.json(result);
});

module.exports = { getAll, getById, update, updateEstado, remove };
