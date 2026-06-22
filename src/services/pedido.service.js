const { Pedido, DetallePedido, Producto, Pago } = require('../models');
const AppError = require('../utils/AppError');

const create = async (id_cliente, data) => {
  const { productos, ...pedidoData } = data;

  const pedido = await Pedido.create({
    ...pedidoData,
    id_cliente,
    estado_pedido: 'Pendiente'
  });

  const detalles = productos.map((p) => ({
    id_pedido: pedido.id_pedido,
    id_producto: p.id_producto,
    nombre_producto: p.nombre_producto,
    cantidad: p.cantidad,
    precio_unitario: p.precio_unitario
  }));

  await DetallePedido.bulkCreate(detalles);

  return Pedido.findByPk(pedido.id_pedido, {
    include: [{ association: 'detalles' }]
  });
};

const getAll = async (filtros = {}) => {
  const where = {};
  if (filtros.id_cliente) where.id_cliente = filtros.id_cliente;
  if (filtros.id_farmacia) where.id_farmacia = filtros.id_farmacia;
  if (filtros.estado_pedido) where.estado_pedido = filtros.estado_pedido;

  return Pedido.findAll({
    where,
    include: [
      { association: 'detalles' },
      { association: 'pago' },
      { association: 'farmacia' }
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
  if (estado_pedido === 'Entregado') updateData.timestamp_fin = new Date();

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
  return pedido;
};

module.exports = { create, getAll, getById, updateEstado, asignarDronOperador };