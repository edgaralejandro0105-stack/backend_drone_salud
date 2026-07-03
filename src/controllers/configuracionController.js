const configuracionService = require('../services/configuracion.service');
const catchAsync = require('../utils/catchAsync');

const getAll = catchAsync(async (req, res) => {
  const configs = await configuracionService.getAll();
  res.json(configs);
});

const getByClave = catchAsync(async (req, res) => {
  const config = await configuracionService.getByClave(req.params.clave);
  if (!config) return res.status(404).json({ error: 'Configuracion no encontrada' });
  res.json(config);
});

const update = catchAsync(async (req, res) => {
  const { clave, valor, descripcion } = req.body;
  if (!clave || valor === undefined) {
    return res.status(400).json({ error: 'clave y valor son requeridos' });
  }
  const config = await configuracionService.upsert(clave, valor, descripcion);
  res.json(config);
});

module.exports = { getAll, getByClave, update };
