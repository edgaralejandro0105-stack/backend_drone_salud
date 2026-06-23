const { Farmacia, HorarioFarmacia, Usuario, Producto } = require('../models');
const AppError = require('../utils/AppError');

const create = async (data) => {
  const existing = await Farmacia.findOne({ where: { rif: data.rif } });
  if (existing) throw new AppError('El RIF ya existe', 400);
  return Farmacia.create(data);
};

const getAll = async () => {
  return Farmacia.findAll({ order: [['nombre_comercial', 'ASC']] });
};

const getById = async (id) => {
  const farmacia = await Farmacia.findByPk(id, {
    include: [{ association: 'horarios' }]
  });
  if (!farmacia) throw new AppError('Farmacia no encontrada', 404);
  return farmacia;
};

const update = async (id, data) => {
  const farmacia = await Farmacia.findByPk(id);
  if (!farmacia) throw new AppError('Farmacia no encontrada', 404);
  await farmacia.update(data);
  return farmacia;
};

const updateOwn = async (id, data) => {
  const farmacia = await Farmacia.findByPk(id);
  if (!farmacia) throw new AppError('Farmacia no encontrada', 404);
  const allowedFields = ['nombre_comercial', 'telefono', 'telefono_responsable', 'email', 'rif', 'logo_url', 'foto_fachada_url', 'pago_movil_banco', 'pago_movil_telefono', 'pago_movil_ci', 'pago_movil_titular'];
  const payload = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) payload[field] = data[field];
  }
  await farmacia.update(payload);
  if (data.logo_url !== undefined) {
    await Usuario.update({ foto_url: data.logo_url }, { where: { id_farmacia: id, tipo_usuario: 'farmacia' } });
  }
  return farmacia;
};

const remove = async (id) => {
  const farmacia = await Farmacia.findByPk(id);
  if (!farmacia) throw new AppError('Farmacia no encontrada', 404);
  await Usuario.destroy({ where: { id_farmacia: id, tipo_usuario: 'farmacia' } });
  await HorarioFarmacia.destroy({ where: { id_farmacia: id } });
  await Producto.destroy({ where: { id_farmacia: id } });
  await farmacia.destroy();
  return { message: 'Farmacia eliminada correctamente' };
};

module.exports = { create, getAll, getById, update, updateOwn, remove };