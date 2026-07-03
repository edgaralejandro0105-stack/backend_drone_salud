const { SuspensionHistorial, Usuario, Farmacia } = require('../models');
const AppError = require('../utils/AppError');

const getAll = async () => {
  return SuspensionHistorial.findAll({
    include: [
      { association: 'usuario', attributes: ['nombre', 'apellido', 'email', 'tipo_usuario'] },
      { association: 'suspendidoPor', attributes: ['nombre', 'apellido'] }
    ],
    order: [['fecha_suspension', 'DESC']]
  });
};

const getByUsuario = async (id_usuario) => {
  return SuspensionHistorial.findAll({
    where: { id_usuario },
    include: [
      { association: 'suspendidoPor', attributes: ['nombre', 'apellido'] }
    ],
    order: [['fecha_suspension', 'DESC']]
  });
};

const getActiva = async (id_usuario) => {
  return SuspensionHistorial.findOne({
    where: { id_usuario, fecha_activacion: null }
  });
};

const suspender = async (id_usuario, suspendido_por, motivo = '') => {
  const usuario = await Usuario.findByPk(id_usuario);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);

  const activa = await SuspensionHistorial.findOne({
    where: { id_usuario, fecha_activacion: null }
  });
  if (activa) throw new AppError('El usuario ya esta suspendido', 400);

  const registro = await SuspensionHistorial.create({
    id_usuario,
    suspendido_por,
    motivo,
    fecha_suspension: new Date()
  });

  await usuario.update({ estado_cuenta: 'Suspendido' });

  if (usuario.tipo_usuario === 'farmacia' && usuario.id_farmacia) {
    await Farmacia.update({ estado_operativo: false }, { where: { id_farmacia: usuario.id_farmacia } });
  }

  return SuspensionHistorial.findByPk(registro.id_suspension, {
    include: [
      { association: 'suspendidoPor', attributes: ['nombre', 'apellido'] }
    ]
  });
};

const activar = async (id_usuario) => {
  const usuario = await Usuario.findByPk(id_usuario);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);

  await SuspensionHistorial.update(
    { fecha_activacion: new Date() },
    { where: { id_usuario, fecha_activacion: null } }
  );

  await usuario.update({ estado_cuenta: 'Activo' });

  return { message: 'Usuario activado correctamente' };
};

module.exports = { getAll, getByUsuario, getActiva, suspender, activar };
