const { Pedido, DetallePedido, Producto, Pago, FlotaDron, Configuracion, sequelize } = require('../models');
const { Op } = require('sequelize');
const AppError = require('../utils/AppError');

const create = async (id_cliente, data) => {
  const { productos, ...pedidoData } = data;

  const t = await sequelize.transaction();

  try {
    for (const p of productos) {
      const producto = await Producto.findByPk(p.id_producto, { transaction: t });
      if (!producto) {
        throw new AppError(`Producto "${p.nombre_producto}" no encontrado`, 404);
      }
      if (Number(producto.stock_actual) < p.cantidad) {
        throw new AppError(
          `Stock insuficiente para "${p.nombre_producto}". Disponible: ${producto.stock_actual}, solicitado: ${p.cantidad}`,
          400
        );
      }
    }

    const pedido = await Pedido.create({
      ...pedidoData,
      id_cliente,
      estado_pedido: 'Pendiente'
    }, { transaction: t });

    const detalles = productos.map((p) => ({
      id_pedido: pedido.id_pedido,
      id_producto: p.id_producto,
      nombre_producto: p.nombre_producto,
      cantidad: p.cantidad,
      precio_unitario: p.precio_unitario
    }));

    await DetallePedido.bulkCreate(detalles, { transaction: t });

    for (const p of productos) {
      const [_, metadata] = await sequelize.query(
        'UPDATE productos SET stock_actual = stock_actual - :cantidad WHERE id_producto = :id AND stock_actual >= :cantidad',
        {
          replacements: { id: p.id_producto, cantidad: p.cantidad },
          transaction: t
        }
      );
      if (metadata.rowCount === 0) {
        throw new AppError(`Stock insuficiente para "${p.nombre_producto}" al confirmar el pedido`, 400);
      }
    }

    await t.commit();

    return Pedido.findByPk(pedido.id_pedido, {
      include: [{ association: 'detalles' }]
    });
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const getAll = async (filtros = {}) => {
  const where = {};
  if (filtros.id_cliente) where.id_cliente = filtros.id_cliente;
  if (filtros.id_farmacia) where.id_farmacia = filtros.id_farmacia;
  if (filtros.estado_pedido) where.estado_pedido = filtros.estado_pedido;

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

  return Pedido.findAll({
    where,
    include: [
      { association: 'detalles', include: [{ association: 'producto', attributes: ['foto_url'] }] },
      { association: 'pago' },
      { association: 'farmacia' },
      { association: 'dron' },
      { association: 'operador' },
      { association: 'cliente', attributes: { exclude: ['password_hash'] } },
      { association: 'despachador', attributes: ['id_usuario', 'nombre', 'apellido', 'tipo_usuario', 'email'] }
    ],
    order: [['fecha_creacion', 'DESC']]
  });
};

const getById = async (id) => {
  const pedido = await Pedido.findByPk(id, {
    include: [
      { association: 'detalles' },
      { association: 'pago' },
      { association: 'cliente', attributes: { exclude: ['password_hash'] } },
      { association: 'farmacia' },
      { association: 'dron' },
      { association: 'operador' }
    ]
  });
  if (!pedido) throw new AppError('Pedido no encontrado', 404);
  return pedido;
};

const updateEstado = async (id, estado_pedido) => {
  const pedido = await Pedido.findByPk(id);
  if (!pedido) throw new AppError('Pedido no encontrado', 404);

  const transiciones = {
    'Pendiente': ['Pagado', 'Cancelado'],
    'Pagado': ['Preparado', 'Cancelado'],
    'Preparado': ['En transito', 'Cancelado'],
    'En transito': ['Entregado'],
    'Entregado': [],
    'Cancelado': [],
    'Reembolsado': []
  };

  const permitidos = transiciones[pedido.estado_pedido] || [];
  if (!permitidos.includes(estado_pedido)) {
    throw new AppError(
      `No se puede cambiar de ${pedido.estado_pedido} a ${estado_pedido}`,
      400
    );
  }

  const updateData = { estado_pedido };
  if (estado_pedido === 'En transito') updateData.timestamp_inicio = new Date();
  if (estado_pedido === 'Entregado') {
    updateData.timestamp_fin = new Date();
    if (pedido.id_dron) {
      await FlotaDron.update({ estado_operativo: 'Activo' }, { where: { id_dron: pedido.id_dron } });
    }
  }

  await pedido.update(updateData);
  return pedido;
};

const asignarDronOperador = async (id, id_dron, id_operador) => {
  const pedido = await Pedido.findByPk(id);
  if (!pedido) throw new AppError('Pedido no encontrado', 404);
  if (pedido.estado_pedido !== 'Preparado') {
    throw new AppError('El pedido debe estar en estado Preparado', 400);
  }
  await pedido.update({ id_dron, id_operador, estado_pedido: 'En transito', timestamp_inicio: new Date() });
  await FlotaDron.update({ estado_operativo: 'Transito' }, { where: { id_dron } });
  return pedido;
};

const liberarPedido = async (id) => {
  const pedido = await Pedido.findByPk(id);
  if (!pedido) throw new AppError('Pedido no encontrado', 404);
  if (pedido.estado_pedido !== 'En transito') throw new AppError('El pedido debe estar en En tránsito', 400);
  if (pedido.id_dron) await FlotaDron.update({ estado_operativo: 'Activo' }, { where: { id_dron: pedido.id_dron } });
  await pedido.update({ id_dron: null, id_operador: null, estado_pedido: 'Preparado', timestamp_inicio: null });
  return pedido;
};

module.exports = { create, getAll, getById, updateEstado, asignarDronOperador, liberarPedido };