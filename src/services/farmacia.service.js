const { Farmacia, HorarioFarmacia, Usuario, Producto, Pedido, DetallePedido, sequelize } = require('../models');
const { Op } = require('sequelize');
const AppError = require('../utils/AppError');

const create = async (data) => {
  const existing = await Farmacia.findOne({ where: { rif: data.rif } });
  if (existing) throw new AppError('El RIF ya existe', 400);
  return Farmacia.create(data);
};

const getAll = async ({ search, page = 1, limit = 10 } = {}) => {
  const where = {};
  if (search) {
    where[Op.or] = [
      { nombre_comercial: { [Op.iLike]: `%${search}%` } },
      { rif: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { telefono: { [Op.iLike]: `%${search}%` } },
      { ciudad: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const offset = (page - 1) * limit;
  const { count, rows } = await Farmacia.findAndCountAll({
    where,
    order: [['nombre_comercial', 'ASC']],
    limit,
    offset,
  });
  return { data: rows, total: count, page, totalPages: Math.ceil(count / limit) };
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
  const allowedFields = ['nombre_comercial', 'telefono', 'telefono_responsable', 'email', 'rif', 'logo_url', 'foto_fachada_url', 'pago_movil_banco', 'pago_movil_telefono', 'pago_movil_ci', 'pago_movil_titular', 'estado_operativo'];
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

const getStats = async (id_farmacia, filtros = {}) => {
  const where = { id_farmacia };
  if (filtros.desde || filtros.hasta) {
    where.fecha_creacion = {};
    if (filtros.desde) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(filtros.desde)) throw new AppError('Formato de fecha "desde" inválido', 400);
      where.fecha_creacion[Op.gte] = sequelize.literal(`'${filtros.desde}'::timestamp`);
    }
    if (filtros.hasta) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(filtros.hasta)) throw new AppError('Formato de fecha "hasta" inválido', 400);
      where.fecha_creacion[Op.lte] = sequelize.literal(`'${filtros.hasta} 23:59:59'::timestamp`);
    }
  }

  const pedidos = await Pedido.findAll({ where, order: [['fecha_creacion', 'DESC']] });
  const entregados = pedidos.filter(p => p.estado_pedido === 'Entregado');
  const ingresosEnvio = entregados.reduce((s, p) => s + Number(p.cargo_dron || 0), 0);
  const ingresosMedicamentos = pedidos.reduce((s, p) => s + Number(p.subtotal || 0) + Number(p.iva || 0), 0);

  const dailyRevenue = {};
  entregados.forEach(p => {
    const dia = p.fecha_creacion instanceof Date ? p.fecha_creacion.toISOString().substring(0, 10) : String(p.fecha_creacion).substring(0, 10);
    dailyRevenue[dia] = (dailyRevenue[dia] || 0) + Number(p.cargo_dron || 0);
  });

  const pedidoIds = pedidos.map(p => p.id_pedido);
  let topProductos = [];
  if (pedidoIds.length > 0) {
    const detalles = await DetallePedido.findAll({
      where: { id_pedido: { [Op.in]: pedidoIds } },
      attributes: ['nombre_producto', 'id_producto', [sequelize.fn('SUM', sequelize.col('DetallePedido.cantidad')), 'total_vendido']],
      include: [{ association: 'producto', attributes: ['foto_url'] }],
      group: ['DetallePedido.id_producto', 'DetallePedido.nombre_producto', 'producto.id_producto', 'producto.foto_url'],
      order: [[sequelize.literal('total_vendido'), 'DESC']],
      limit: 5
    });
    topProductos = detalles.map(d => ({ nombre: d.nombre_producto, cantidad: Number(d.get('total_vendido')), foto_url: d.producto?.foto_url || '' }));
  }

  return { totalPedidos: pedidos.length, totalEntregados: entregados.length, ingresosEnvio, ingresosMedicamentos, dailyRevenue, topProductos };
};

module.exports = { create, getAll, getById, update, updateOwn, getStats, remove };