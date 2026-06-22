const { Pago, Pedido } = require('../models');
const AppError = require('../utils/AppError');

const create = async (data) => {
  const pedido = await Pedido.findByPk(data.id_pedido);
  if (!pedido) throw new AppError('Pedido no encontrado', 404);
  if (pedido.estado_pedido !== 'Pendiente') {
    throw new AppError('El pedido no esta pendiente de pago', 400);
  }

  const pagoExistente = await Pago.findOne({ where: { id_pedido: data.id_pedido } });
  if (pagoExistente) throw new AppError('Este pedido ya tiene un pago registrado', 400);

  return Pago.create({
    ...data,
    estado_pago: 'Pendiente',
    fecha_pago: new Date()
  });
};

const confirmarPago = async (id_pago) => {
  const pago = await Pago.findByPk(id_pago);
  if (!pago) throw new AppError('Pago no encontrado', 404);
  if (pago.estado_pago !== 'Pendiente') {
    throw new AppError('El pago ya fue procesado', 400);
  }

  await pago.update({ estado_pago: 'Confirmado', fecha_confirmacion: new Date() });
  await Pedido.update({ estado_pedido: 'Pagado' }, { where: { id_pedido: pago.id_pedido } });

  return pago;
};

const getAll = async (filtros = {}) => {
  const where = {};
  if (filtros.id_cliente) where.id_cliente = filtros.id_cliente;
  if (filtros.id_farmacia) where.id_farmacia = filtros.id_farmacia;

  return Pago.findAll({
    where,
    include: [
      { association: 'pedido' },
      { association: 'cliente', attributes: { exclude: ['password_hash'] } },
      { association: 'farmacia' }
    ],
    order: [['fecha_pago', 'DESC']]
  });
};

module.exports = { getAll, create, confirmarPago };