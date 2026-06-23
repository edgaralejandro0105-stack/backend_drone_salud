const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const AppError = require('../utils/AppError');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const generarToken = (id_usuario) => {
  return jwt.sign({ id_usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const register = async (userData) => {
  const { password, ...rest } = userData;
  const existing = await Usuario.findOne({ where: { email: rest.email } });
  if (existing) {
    throw new AppError('El email ya esta registrado', 400);
  }
  const usuario = await Usuario.create({
    ...rest,
    password_hash: hashPassword(password),
    estado_cuenta: 'Activo',
    fecha_registro: new Date()
  });
  const token = generarToken(usuario.id_usuario);
  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      telefono: usuario.telefono,
      cedula: usuario.cedula
    }
  };
};

const login = async (email, password) => {
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario || usuario.password_hash !== hashPassword(password)) {
    throw new AppError('Credenciales invalidas', 401);
  }
  if (usuario.estado_cuenta !== 'Activo') {
    throw new AppError('Cuenta suspendida', 401);
  }
  await usuario.update({ ultimo_acceso: new Date() });
  const token = generarToken(usuario.id_usuario);
  return {
    token,
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      telefono: usuario.telefono,
      cedula: usuario.cedula,
      foto_url: usuario.foto_url,
      id_farmacia: usuario.id_farmacia
    }
  };
};

const getProfile = async (id_usuario) => {
  const usuario = await Usuario.findByPk(id_usuario, {
    attributes: { exclude: ['password_hash'] }
  });
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  return usuario;
};

const changePassword = async (id_usuario, currentPassword, newPassword) => {
  const usuario = await Usuario.findByPk(id_usuario);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  if (usuario.password_hash !== hashPassword(currentPassword)) {
    throw new AppError('La contraseña actual no es correcta', 400);
  }
  await usuario.update({ password_hash: hashPassword(newPassword) });
  return { message: 'Contraseña actualizada correctamente' };
};

const updateProfile = async (id_usuario, data) => {
  const usuario = await Usuario.findByPk(id_usuario);
  if (!usuario) throw new AppError('Usuario no encontrado', 404);
  const allowedFields = ['nombre', 'apellido', 'email', 'telefono', 'direccion', 'foto_url'];
  const payload = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) payload[field] = data[field];
  }
  await usuario.update(payload);
  const updated = await Usuario.findByPk(id_usuario, {
    attributes: { exclude: ['password_hash'] }
  });
  return updated;
};

module.exports = { register, login, getProfile, changePassword, updateProfile };