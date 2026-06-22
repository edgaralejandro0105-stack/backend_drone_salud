const { Usuario } = require('../models');
const AppError = require('../utils/AppError');

const getAll = async (tipo) => {
  const where = tipo ? { tipo_usuario: tipo } : {};
  return Usuario.findAll({ where, order: [['fecha_registro', 'DESC']] });
};

const getById = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  return usuario;
};

const update = async (id, data) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  const allowedFields = ['nombre', 'apellido', 'cedula', 'email', 'telefono', 'direccion', 'foto_url'];
  const payload = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) payload[field] = data[field];
  }
  await usuario.update(payload);
  return usuario;
};

const updateEstado = async (id, estado) => {
  if (!['Activo', 'Suspendido', 'Inactivo'].includes(estado)) {
    throw new AppError('Estado invalido', 400);
  }
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  await usuario.update({ estado_cuenta: estado });
  return usuario;
};

const remove = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  await usuario.destroy();
  return { message: 'Usuario eliminado correctamente' };
};

module.exports = { getAll, getById, update, updateEstado, remove };
