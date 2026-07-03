const { Pedido } = require('../models');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');

const getNotifications = catchAsync(async (req, res) => {
  const { tipo_usuario, id_farmacia } = req.user;

  let where = {};
  let navigateTo = '';

  switch (tipo_usuario) {
    case 'farmacia':
      where.id_farmacia = id_farmacia;
      where.estado_pedido = { [Op.in]: ['Pendiente', 'Pagado'] };
      navigateTo = 'orders-received';
      break;
    case 'operador':
    case 'admin':
      where.estado_pedido = 'Preparado';
      navigateTo = 'dispatch';
      break;
    default:
      return res.json({ count: 0, navigateTo: '', pedidos: [] });
  }

  const pedidos = await Pedido.findAll({
    where,
    order: [['fecha_creacion', 'DESC']],
    limit: 20,
    attributes: ['id_pedido', 'estado_pedido', 'fecha_creacion', 'total', 'destino_nombre'],
    include: [
      { association: 'farmacia', attributes: ['nombre_comercial'] },
      { association: 'cliente', attributes: ['nombre', 'apellido'] }
    ]
  });

  res.json({ count: pedidos.length, navigateTo, pedidos });
});

module.exports = { getNotifications };
